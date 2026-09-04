import User from "../models/User.js";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";

// Escape special regex characters
const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// ADMIN DASHBOARD STATS
export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalStudents,
      totalEvents,
      totalRegistrations,
      pendingApprovals,
      totalRevenue,
      upcomingEvents,
      registrationsByCategory,
    ] = await Promise.all([
      // Total students
      User.countDocuments({
        role: "student",
      }),

      // Total events
      Event.countDocuments(),

      // Active registrations
      Registration.countDocuments({
        status: {
          $in: ["pending", "approved"],
        },
      }),

      // Pending admin approvals
      Registration.countDocuments({
        status: "pending",
      }),

      // Total revenue from approved and paid registrations
      Registration.aggregate([
        {
          $match: {
            status: "approved",
            paymentStatus: "paid",
          },
        },
        {
          $lookup: {
            from: "events",
            localField: "event",
            foreignField: "_id",
            as: "event",
          },
        },
        {
          $unwind: "$event",
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$event.registrationFee",
            },
          },
        },
      ]),

      // Upcoming published events
      Event.find({
        status: "published",
        date: {
          $gte: new Date(),
        },
      })
        .sort({
          date: 1,
        })
        .limit(5)
        .select(
          "title category date location registrationsCount capacity registrationFee status"
        )
        .lean(),

      // Registrations grouped by event category
      Registration.aggregate([
        {
          $match: {
            status: {
              $in: ["pending", "approved"],
            },
          },
        },
        {
          $lookup: {
            from: "events",
            localField: "event",
            foreignField: "_id",
            as: "event",
          },
        },
        {
          $unwind: "$event",
        },
        {
          $group: {
            _id: "$event.category",
            totalRegistrations: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            totalRegistrations: -1,
          },
        },
      ]),
    ]);

    res.status(200).json({
      totalStudents,
      totalEvents,
      totalRegistrations,
      pendingApprovals,
      totalRevenue: totalRevenue[0]?.total || 0,
      upcomingEvents,
      registrationsByCategory,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL REGISTRATIONS FOR ADMIN
export const getAllRegistrations = async (req, res, next) => {
  try {
    const {
      search,
      event,
      status,
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    const currentPage = Math.max(
      parseInt(page, 10) || 1,
      1
    );

    const pageLimit = Math.min(
      Math.max(parseInt(limit, 10) || 10, 1),
      50
    );

    const skip = (currentPage - 1) * pageLimit;

    const matchStage = {};

    // Filter by event
    if (event && event !== "all") {
      matchStage.event = event;
    }

    // Filter by registration status
    if (status && status !== "all") {
      matchStage.status = status;
    }

    // Search by student name or email
    if (search?.trim()) {
      const normalizedSearch = escapeRegex(
        search.trim().toLowerCase()
      );

      const users = await User.find({
        $or: [
          {
            nameNormalized: {
              $regex: `^${normalizedSearch}`,
            },
          },
          {
            email: {
              $regex: `^${normalizedSearch}`,
              $options: "i",
            },
          },
        ],
      })
        .select("_id")
        .lean();

      const userIds = users.map((user) => user._id);

      matchStage.user = {
        $in: userIds,
      };
    }

    const allowedSortFields = [
      "createdAt",
      "status",
      "paymentStatus",
    ];

    const sortField = allowedSortFields.includes(sort)
      ? sort
      : "createdAt";

    const sortOrder = order === "asc" ? 1 : -1;

    const [registrations, totalRegistrations] =
      await Promise.all([
        Registration.find(matchStage)
          .populate("user", "name email")
          .populate(
            "event",
            "title category date location capacity registrationFee registrationDeadline status"
          )
          .sort({
            [sortField]: sortOrder,
            _id: -1,
          })
          .skip(skip)
          .limit(pageLimit)
          .lean(),

        Registration.countDocuments(matchStage),
      ]);

    res.status(200).json({
      totalRegistrations,
      currentPage,
      totalPages: Math.ceil(
        totalRegistrations / pageLimit
      ),
      limit: pageLimit,
      registrations,
    });
  } catch (error) {
    next(error);
  }
};