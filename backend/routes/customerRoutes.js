const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadCustomerImage');
const {
  registerCustomer,
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
  loginCustomer,
  getCustomerProfile,
  uploadProfilePhoto,
  updateCustomerDetails,
  changeCustomerPassword
} = require('../controllers/customerController');

const authenticateToken = require('../middleware/authMiddleware');

// 🔸 Specific routes first
router.post('/register/upload', upload.single('profilePhoto'), registerCustomer);
router.post('/register/url', registerCustomer);
router.get('/', getAllCustomers);

router.put('/upload-photo', authenticateToken, upload.single('profilePhoto'), uploadProfilePhoto);
router.put('/update', authenticateToken, updateCustomerDetails); // ✅ moved above /:id
router.post('/login', loginCustomer);
router.get('/protected', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Access granted to protected route', user: req.user });
});
router.get('/me', authenticateToken, getCustomerProfile);
router.put('/change-password', authenticateToken, changeCustomerPassword);

// 🔸 Generic ID-based routes last
router.put('/:id', upload.single('profilePhoto'), updateCustomer);
router.delete('/:id', deleteCustomer);

module.exports = router;
