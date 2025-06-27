const express = require('express');
const router = express.Router();
const { createRoute, getAllRoutes, updateRoute, deleteRoute, searchRoutes, getUnassignedRoutes} = require('../controllers/routeController');

// Add routes
router.post('/', createRoute);

// Read routes
router.get('/', getAllRoutes);

// Search Route
router.get('/search', searchRoutes);

router.get('/unassigned-routes', getUnassignedRoutes);

// Update routes
router.put('/:id', updateRoute);

// Delete Route
router.delete('/:id', deleteRoute);

module.exports = router;
