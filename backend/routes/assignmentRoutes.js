const express = require('express');
const router = express.Router();
const {
  assignRouteToBus,
  getAssignedRoutes,
  getUnassignedBuses,
  getUnassignedRoutes,
  removeAssignment
} = require('../controllers/assignmentController');

// POST: Assign route to bus
router.post('/assign', assignRouteToBus);

// GET: All assignments (with bus + route populated)
router.get('/assigned', getAssignedRoutes);

// GET: All unassigned buses
router.get('/unassigned-buses', getUnassignedBuses);

// GET: All unassigned routes
router.get('/unassigned-routes', getUnassignedRoutes);

// DELETE: Remove a specific assignment
router.delete('/:id', removeAssignment);

module.exports = router;
