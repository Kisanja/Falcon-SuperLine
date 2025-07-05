const Customer = require('../models/Customer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register customer
const registerCustomer = async (req, res) => {
  try {
    const { name, username, email, mobileNumber, password } = req.body;

    // Check if username or email already exists
    const existingUser = await Customer.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle photo path (uploaded image or from URL)
    let photo = '';
    if (req.file) {
      photo = req.file.path; // Multer upload: photo from file upload
    } else if (req.body.photoUrl) {
      photo = req.body.photoUrl; // Direct URL if used instead
    }

    // Create new customer
    const newCustomer = new Customer({
      name,
      username,
      email,
      mobileNumber,
      photo,
      password: hashedPassword
    });

    await newCustomer.save();
    res.status(201).json({ message: 'Customer registered successfully' });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().select('-password'); // Exclude password
    res.status(200).json(customers);
  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;
    const { name, username, email, mobileNumber } = req.body;

    // Optional: Update profile photo if a new one is uploaded
    let updatedFields = {
      name,
      username,
      email,
      mobileNumber
    };

    if (req.file) {
      updatedFields.photo = req.file.path;
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      { $set: updatedFields },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({
      message: 'Customer updated successfully',
      customer: updatedCustomer
    });

  } catch (err) {
    console.error('Error updating customer:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;

    const deletedCustomer = await Customer.findByIdAndDelete(customerId);

    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ message: 'Customer deleted successfully' });

  } catch (err) {
    console.error('Error deleting customer:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login Customer
const loginCustomer = async (req, res) => {
  try {
    const { login, password } = req.body; // login = username or email

    // Find customer by username or email
    const customer = await Customer.findOne({
      $or: [{ username: login }, { email: login }]
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: customer._id, role: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Respond with token and customer data (excluding password)
    const { password: _, ...customerData } = customer._doc;
    res.status(200).json({
      message: 'Login successful',
      token,
      customer: customerData
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCustomerProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json(customer);
  } catch (err) {
    console.error('Error in getCustomerProfile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const uploadProfilePhoto = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    customer.photo = `/uploads/${req.file.filename}`;
    await customer.save();

    res.status(200).json({ message: 'Photo updated', photo: customer.photo });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateCustomerDetails = async (req, res) => {
  try {
    const updated = await Customer.findByIdAndUpdate(
      req.user.id,
      {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        mobileNumber: req.body.mobileNumber
      },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    console.error('Error updating customer:', err);
    res.status(500).json({ message: 'Update failed' });
  }
};

const changeCustomerPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const customer = await Customer.findById(req.user.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const isMatch = await bcrypt.compare(currentPassword, customer.password);
    if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' });

    const salt = await bcrypt.genSalt(10);
    customer.password = await bcrypt.hash(newPassword, salt);
    await customer.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error updating password:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerCustomer,
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
  loginCustomer,
  getCustomerProfile,
  uploadProfilePhoto,
  updateCustomerDetails,
  changeCustomerPassword
};
