import Registration from "../models/Registration.js";
import Event from "../models/Event.js";

// REGISTER FOR EVENT
export const registerForEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (event.status !== "published") {
      return res.status(400).json({
        message: "This event is not currently available for registration",
      });
    }

    if (new Date() >= new Date(event.date)) {
      return res.status(400).json({
        message: "You cannot register for an event that has started",
      });
    }

    if (
      event.registrationDeadline &&
      new Date() > new Date(event.registrationDeadline)
    ) {
      return res.status(400).json({
        message: "The registration deadline for this event has passed",
      });
    }

    const existingRegistration = await Registration.findOne({
      user: req.userId,
      event: eventId,
    });

    if (
      existingRegistration &&
      ["pending", "approved"].includes(existingRegistration.status)
    ) {
      return res.status(400).json({
        message: "You already have an active registration for this event",
      });
    }

    const updatedEvent = await Event.findOneAndUpdate(
      {
        _id: eventId,
        status: "published",
        $expr: {
          $lt: ["$registrationsCount", "$capacity"],
        },
      },
      {
        $inc: {
          registrationsCount: 1,
        },
      },
      {
        new: true,
      }
    );

    if (!updatedEvent) {
      return res.status(400).json({
        message: "This event is full or no longer available",
      });
    }

    let registration;

    const paymentStatus =
      Number(event.registrationFee || 0) > 0
        ? "unpaid"
        : "not_required";

    if (existingRegistration) {
      existingRegistration.status = "pending";
      existingRegistration.paymentStatus = paymentStatus;
      existingRegistration.paymentReference = null;
      existingRegistration.paymentSubmittedAt = null;
      existingRegistration.approvedAt = null;
      existingRegistration.rejectedAt = null;
      existingRegistration.cancelledAt = null;

      registration = await existingRegistration.save();
    } else {
      registration = await Registration.create({
        user: req.userId,
        event: eventId,
        status: "pending",
        paymentStatus,
      });
    }

    res.status(201).json({
      message:
        "Registration submitted successfully. Waiting for admin approval.",
      registration,
      remainingSeats:
        updatedEvent.capacity - updatedEvent.registrationsCount,
    });
  } catch (error) {
    next(error);
  }
};

// GET LOGGED-IN USER'S REGISTRATIONS
export const getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({
      user: req.userId,
      status: {
        $ne: "cancelled",
      },
    })
      .populate(
        "event",
        "title description category date location capacity registrationsCount registrationFee registrationDeadline status"
      )
      .sort({
        createdAt: -1,
      })
      .lean();

    res.status(200).json({
      count: registrations.length,
      registrations,
    });
  } catch (error) {
    next(error);
  }
};

// CANCEL REGISTRATION
export const cancelRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findOne({
      _id: req.params.id,
      user: req.userId,
      status: {
        $in: ["pending", "approved"],
      },
    });

    if (!registration) {
      return res.status(404).json({
        message: "Active registration not found",
      });
    }

    const event = await Event.findById(registration.event);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (new Date() >= new Date(event.date)) {
      return res.status(400).json({
        message:
          "You cannot cancel a registration after the event has started",
      });
    }

    registration.status = "cancelled";
    registration.cancelledAt = new Date();

    if (registration.paymentStatus === "paid") {
      registration.paymentStatus = "refunded";
    }

    await registration.save();

    await Event.findOneAndUpdate(
      {
        _id: registration.event,
        registrationsCount: {
          $gt: 0,
        },
      },
      {
        $inc: {
          registrationsCount: -1,
        },
      }
    );

    res.status(200).json({
      message: "Registration cancelled successfully",
      paymentStatus: registration.paymentStatus,
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
    } = req.query;

    const query = {};

    if (event) {
      query.event = event;
    }

    if (status && status !== "all") {
      query.status = status;
    }

    const currentPage = Math.max(
      parseInt(page, 10) || 1,
      1
    );

    const pageLimit = Math.min(
      Math.max(parseInt(limit, 10) || 10, 1),
      50
    );

    const skip = (currentPage - 1) * pageLimit;

    let registrations = await Registration.find(query)
      .populate("user", "name email")
      .populate(
        "event",
        "title category date location registrationFee"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageLimit)
      .lean();

    if (search?.trim()) {
      const normalizedSearch = search.trim().toLowerCase();

      registrations = registrations.filter((registration) => {
        const studentName =
          registration.user?.name?.toLowerCase() || "";

        const studentEmail =
          registration.user?.email?.toLowerCase() || "";

        return (
          studentName.includes(normalizedSearch) ||
          studentEmail.includes(normalizedSearch)
        );
      });
    }

    const totalRegistrations = await Registration.countDocuments(query);

    res.status(200).json({
      totalRegistrations,
      currentPage,
      totalPages: Math.ceil(
        totalRegistrations / pageLimit
      ),
      registrations,
    });
  } catch (error) {
    next(error);
  }
};

// SUBMIT PAYMENT
export const submitPayment = async (req, res, next) => {
  try {
    const { paymentReference } = req.body;

    const registration = await Registration.findOne({
      _id: req.params.id,
      user: req.userId,
      status: "pending",
    }).populate("event", "registrationFee");

    if (!registration) {
      return res.status(404).json({
        message: "Pending registration not found",
      });
    }

    if (!registration.event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (Number(registration.event.registrationFee || 0) <= 0) {
      return res.status(400).json({
        message: "This event does not require payment",
      });
    }

    if (!paymentReference?.trim()) {
      return res.status(400).json({
        message: "Payment reference is required",
      });
    }

    registration.paymentReference = paymentReference.trim();
    registration.paymentSubmittedAt = new Date();
    registration.paymentStatus = "paid";

    await registration.save();

    res.status(200).json({
      message: "Payment submitted successfully. Waiting for admin approval.",
      registration,
    });
  } catch (error) {
    next(error);
  }
};

// APPROVE REGISTRATION
export const approveRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(
      req.params.id
    ).populate("event", "registrationFee");

    if (!registration) {
      return res.status(404).json({
        message: "Registration not found",
      });
    }

    if (registration.status !== "pending") {
      return res.status(400).json({
        message: "Only pending registrations can be approved",
      });
    }

    const eventFee = Number(
      registration.event?.registrationFee || 0
    );

    if (
      eventFee > 0 &&
      registration.paymentStatus !== "paid"
    ) {
      return res.status(400).json({
        message: "Payment must be verified before approval",
      });
    }

    registration.status = "approved";
    registration.approvedAt = new Date();

    await registration.save();

    res.status(200).json({
      message: "Registration approved successfully",
      registration,
    });
  } catch (error) {
    next(error);
  }
};

// REJECT REGISTRATION
export const rejectRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(
      req.params.id
    );

    if (!registration) {
      return res.status(404).json({
        message: "Registration not found",
      });
    }

    if (registration.status !== "pending") {
      return res.status(400).json({
        message: "Only pending registrations can be rejected",
      });
    }

    registration.status = "rejected";
    registration.rejectedAt = new Date();

    await registration.save();

    await Event.findOneAndUpdate(
      {
        _id: registration.event,
        registrationsCount: { $gt: 0 },
      },
      {
        $inc: {
          registrationsCount: -1,
        },
      }
    );

    res.status(200).json({
      message: "Registration rejected successfully",
      registration,
    });
  } catch (error) {
    next(error);
  }
};