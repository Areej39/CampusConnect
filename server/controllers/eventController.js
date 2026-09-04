import Event from "../models/Event.js";

// CREATE EVENT
export const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      date,
      registrationDeadline,
      location,
      capacity,
      registrationFee = 0,
      status = "draft",
    } = req.body;

    const eventDate = new Date(date);
    const deadlineDate = new Date(
      registrationDeadline
    );

    // Validate dates
    if (
      Number.isNaN(eventDate.getTime()) ||
      Number.isNaN(deadlineDate.getTime())
    ) {
      return res.status(400).json({
        message:
          "Invalid event date or registration deadline",
      });
    }

    // Deadline must be before event date
    if (deadlineDate >= eventDate) {
      return res.status(400).json({
        message:
          "Registration deadline must be before the event date",
      });
    }

    // Validate fee
    if (Number(registrationFee) < 0) {
      return res.status(400).json({
        message:
          "Registration fee cannot be negative",
      });
    }

    // Validate capacity
    if (Number(capacity) < 1) {
      return res.status(400).json({
        message:
          "Event capacity must be at least 1",
      });
    }

    const event = await Event.create({
      title,
      titleNormalized: title.trim().toLowerCase(),
      description,
      category,
      date: eventDate,
      registrationDeadline: deadlineDate,
      location,
      capacity: Number(capacity),
      registrationFee: Number(registrationFee),
      status,
      createdBy: req.userId,
    });

    res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL EVENTS
export const getEvents = async (req, res, next) => {
  try {
    const {
      search,
      category,
      status,
      page = 1,
      limit = 6,
      sort = "date",
      order = "asc",
    } = req.query;

    const query = {};

    // Search by title or location using substring matching
    if (search?.trim()) {
      const normalizedSearch = search
        .trim()
        .toLowerCase()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      query.$or = [
        {
          titleNormalized: {
            $regex: normalizedSearch,
          },
        },
        {
          location: {
            $regex: normalizedSearch,
            $options: "i",
          },
        },
      ];
    }

    // Filter by category
    if (category && category !== "all") {
      query.category = category;
    }

    // Filter by status
    if (status && status !== "all") {
      query.status = status;
    }

    const currentPage = Math.max(
      parseInt(page, 10) || 1,
      1
    );

    const pageLimit = Math.min(
      Math.max(parseInt(limit, 10) || 6, 1),
      50
    );

    const skip = (currentPage - 1) * pageLimit;

    const allowedSortFields = [
      "date",
      "title",
      "createdAt",
      "capacity",
      "registrationFee",
    ];

    const sortField = allowedSortFields.includes(sort)
      ? sort
      : "date";

    const sortOrder = order === "desc" ? -1 : 1;

    const sortOption = {
      [sortField]: sortOrder,
      _id: 1,
    };

    const [events, totalEvents] = await Promise.all([
      Event.find(query)
        .populate("createdBy", "name email")
        .sort(sortOption)
        .skip(skip)
        .limit(pageLimit)
        .lean(),

      Event.countDocuments(query),
    ]);

    res.status(200).json({
      totalEvents,
      currentPage,
      totalPages: Math.ceil(totalEvents / pageLimit),
      limit: pageLimit,
      events,
    });
  } catch (error) {
    next(error);
  }
};

// GET SINGLE EVENT
export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "name email")
      .lean();

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.status(200).json({
      event,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE EVENT
export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    const {
      title,
      description,
      category,
      date,
      registrationDeadline,
      location,
      capacity,
      registrationFee,
      status,
    } = req.body;

    const nextDate =
      date !== undefined
        ? new Date(date)
        : event.date;

    const nextDeadline =
      registrationDeadline !== undefined
        ? new Date(registrationDeadline)
        : event.registrationDeadline;

    // Validate dates
    if (
      Number.isNaN(nextDate.getTime()) ||
      Number.isNaN(nextDeadline.getTime())
    ) {
      return res.status(400).json({
        message:
          "Invalid event date or registration deadline",
      });
    }

    // Deadline must be before event date
    if (nextDeadline >= nextDate) {
      return res.status(400).json({
        message:
          "Registration deadline must be before the event date",
      });
    }

    // Update title
    if (title !== undefined) {
      event.title = title;
      event.titleNormalized = title
        .trim()
        .toLowerCase();
    }

    // Update description
    if (description !== undefined) {
      event.description = description;
    }

    // Update category
    if (category !== undefined) {
      event.category = category;
    }

    // Update date
    if (date !== undefined) {
      event.date = nextDate;
    }

    // Update registration deadline
    if (registrationDeadline !== undefined) {
      event.registrationDeadline = nextDeadline;
    }

    // Update location
    if (location !== undefined) {
      event.location = location;
    }

    // Update capacity
    if (capacity !== undefined) {
      const nextCapacity = Number(capacity);

      if (nextCapacity < 1) {
        return res.status(400).json({
          message:
            "Event capacity must be at least 1",
        });
      }

      if (
        nextCapacity < event.registrationsCount
      ) {
        return res.status(400).json({
          message:
            "Capacity cannot be less than the current registrations",
        });
      }

      event.capacity = nextCapacity;
    }

    // Update registration fee
    if (registrationFee !== undefined) {
      const nextFee = Number(registrationFee);

      if (nextFee < 0) {
        return res.status(400).json({
          message:
            "Registration fee cannot be negative",
        });
      }

      event.registrationFee = nextFee;
    }

    // Update status
    if (status !== undefined) {
      const allowedStatuses = [
        "draft",
        "published",
        "cancelled",
        "completed",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid event status",
        });
      }

      if (
        event.status === "completed" &&
        status !== "completed"
      ) {
        return res.status(400).json({
          message:
            "Completed events cannot change status",
        });
      }

      event.status = status;
    }

    const updatedEvent = await event.save();

    res.status(200).json({
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

// CANCEL EVENT
export const cancelEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (
      ["cancelled", "completed"].includes(
        event.status
      )
    ) {
      return res.status(400).json({
        message:
          "Cancelled or completed events cannot be cancelled",
      });
    }

    event.status = "cancelled";

    await event.save();

    res.status(200).json({
      message: "Event cancelled successfully",
      event,
    });
  } catch (error) {
    next(error);
  }
};

// PUBLISH EVENT
export const publishEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (["cancelled", "completed"].includes(event.status)) {
      return res.status(400).json({
        message: "Cancelled or completed events cannot be published",
      });
    }

    if (!event.registrationDeadline) {
      return res.status(400).json({
        message:
          "This event has no registration deadline. Edit the event and add one before publishing.",
      });
    }

    if (event.registrationDeadline >= event.date) {
      return res.status(400).json({
        message: "Registration deadline must be before the event date.",
      });
    }

    event.status = "published";

    await event.save();

    res.status(200).json({
      message: "Event published successfully",
      event,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE EVENT
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (event.registrationsCount > 0) {
      return res.status(400).json({
        message:
          "Events with registrations cannot be deleted. Cancel the event instead.",
      });
    }

    await event.deleteOne();

    res.status(200).json({
      message: "Event deleted successfully",
      deletedEventId: event._id,
    });
  } catch (error) {
    next(error);
  }
};