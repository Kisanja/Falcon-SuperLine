const Bus = require('../models/Bus');
const Route = require('../models/Route');
const Assignment = require('../models/BusRouteAssignment');

// Create a new assignment
const assignRouteToBus = async (req, res) => {
  try {
    const {
      busId,
      routeId,
      scheduleType,
      date,
      forwardDepartureTime,
      forwardArrivalTime,
      returnDepartureTime,
      returnArrivalTime
    } = req.body;

    if (!busId || !routeId || !scheduleType || !forwardDepartureTime || !forwardArrivalTime || !returnDepartureTime || !returnArrivalTime) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    if (scheduleType === 'Specific Date' && !date) {
      return res.status(400).json({ message: 'Date is required for Specific Date assignments.' });
    }

    const existing = await Assignment.findOne({
      busId,
      routeId,
      scheduleType,
      ...(scheduleType === 'Specific Date' && { date })
    });

    if (existing) {
      return res.status(409).json({ message: 'This bus is already assigned to this route on the selected schedule.' });
    }

    const newAssignment = new Assignment({
      busId,
      routeId,
      scheduleType,
      date: scheduleType === 'Specific Date' ? date : undefined,
      forwardDepartureTime,
      forwardArrivalTime,
      returnDepartureTime,
      returnArrivalTime,
      active: true
    });

    await newAssignment.save();

    // Update the bus
    await Bus.findByIdAndUpdate(busId, { assignedRoute: routeId });

    res.status(201).json({ message: 'Bus successfully assigned to route.', assignment: newAssignment });
  } catch (err) {
    console.error('Assignment Error:', err);
    res.status(500).json({ message: 'Failed to assign route.', error: err.message });
  }
};

// Get all active assignments
const getAssignedRoutes = async (req, res) => {
  try {
    const assignments = await Assignment.find({ active: true })
      .populate('busId')
      .populate('routeId');
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all unassigned buses
const getUnassignedBuses = async (req, res) => {
  try {
    const buses = await Bus.find({ assignedRoute: null });
    res.json(buses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all unassigned routes
const getUnassignedRoutes = async (req, res) => {
  try {
    const routes = await Route.find({
      _id: { $nin: await Assignment.distinct('routeId', { active: true }) }
    });
    res.json(routes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove assignment
const removeAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findById(id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    assignment.active = false;
    await assignment.save();

    await Bus.findByIdAndUpdate(assignment.busId, { assignedRoute: null });

    res.json({ message: 'Assignment removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  assignRouteToBus,
  getAssignedRoutes,
  getUnassignedBuses,
  getUnassignedRoutes,
  removeAssignment
};
