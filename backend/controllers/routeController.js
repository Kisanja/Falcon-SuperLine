const Route = require('../models/Route');
const BusRouteAssignment = require('../models/BusRouteAssignment');

// @desc    Create a new route
// @route   POST /api/routes
// @access  Public (JWT can be added later)
const createRoute = async (req, res) => {
  try {
    const { routeNumber, permitNumber, mainTown, secondaryTown, routeType, ticketPrice } = req.body;

    if (
      !routeNumber ||
      !permitNumber ||
      !mainTown ||
      !secondaryTown ||
      !routeType ||
      ticketPrice === undefined
    ) {
      return res.status(400).json({ message: 'All fields are required, including ticket price.' });
    }

    if (isNaN(ticketPrice) || ticketPrice < 0) {
      return res.status(400).json({ message: 'Ticket price must be a non-negative number.' });
    }

    const existing = await Route.findOne({ routeNumber });
    if (existing) {
      return res.status(409).json({ message: 'Route number already exists.' });
    }

    const newRoute = new Route({
      routeNumber,
      permitNumber,
      mainTown,
      secondaryTown,
      routeType,
      ticketPrice
    });

    await newRoute.save();
    res.status(201).json({ message: 'Route created successfully.', route: newRoute });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json(routes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      routeNumber,
      permitNumber,
      mainTown,
      secondaryTown,
      routeType,
      ticketPrice
    } = req.body;

    if (ticketPrice === undefined || isNaN(ticketPrice) || ticketPrice < 0) {
      return res.status(400).json({ message: 'Valid ticket price is required.' });
    }

    const updatedRoute = await Route.findByIdAndUpdate(
      id,
      {
        routeNumber,
        permitNumber,
        mainTown,
        secondaryTown,
        routeType,
        ticketPrice
      },
      { new: true, runValidators: true }
    );

    if (!updatedRoute) {
      return res.status(404).json({ message: 'Route not found' });
    }

    res.status(200).json({ message: 'Route updated successfully', route: updatedRoute });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Route.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Route not found' });
    }

    res.status(200).json({ message: 'Route deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const searchRoutes = async (req, res) => {
  try {
    const { search = '', type } = req.query;

    const query = {
      $or: [
        { routeNumber: { $regex: search, $options: 'i' } },
        { permitNumber: { $regex: search, $options: 'i' } },
        { mainTown: { $regex: search, $options: 'i' } },
        { secondaryTown: { $regex: search, $options: 'i' } }
      ]
    };

    if (type) {
      query.routeType = type; // Exact match for route type
    }

    const routes = await Route.find(query);
    res.status(200).json(routes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUnassignedRoutes = async (req, res) => {
  try {
    const assigned = await BusRouteAssignment.find().distinct('routeId');
    const unassignedRoutes = await Route.find({ _id: { $nin: assigned } });

    res.json(unassignedRoutes);
  } catch (error) {
    console.error('Error fetching unassigned routes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createRoute,
  getAllRoutes,
  updateRoute,
  deleteRoute,
  searchRoutes,
  getUnassignedRoutes
};
