const Finance = require('../models/Finance');

// Create a new finance entry
const createFinance = async (req, res) => {
  try {
    const { title, mainType, subType, description, date, amount } = req.body;

    // Validation
    if (!title || !mainType || !subType || !date || amount == null) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    const newFinance = new Finance({
      title,
      mainType,
      subType,
      description,
      date,
      amount
    });

    await newFinance.save();
    res.status(201).json({ message: 'Finance record created successfully.', data: newFinance });
  } catch (error) {
    console.error('Error creating finance record:', error);
    res.status(500).json({ message: 'Server error. Failed to create record.' });
  }
};

const getAllFinances = async (req, res) => {
  try {
    const finances = await Finance.find().sort({ date: -1 }); // newest first
    res.status(200).json(finances);
  } catch (error) {
    console.error('Error fetching finance records:', error);
    res.status(500).json({ message: 'Server error. Could not fetch records.' });
  }
};

// Update a finance record by ID
const updateFinance = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, mainType, subType, description, date, amount } = req.body;

    const updatedFinance = await Finance.findByIdAndUpdate(
      id,
      { title, mainType, subType, description, date, amount },
      { new: true, runValidators: true }
    );

    if (!updatedFinance) {
      return res.status(404).json({ message: 'Finance record not found.' });
    }

    res.status(200).json({ message: 'Finance record updated successfully.', data: updatedFinance });
  } catch (error) {
    console.error('Error updating finance record:', error);
    res.status(500).json({ message: 'Server error. Could not update record.' });
  }
};

// Delete a finance record by ID
const deleteFinance = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFinance = await Finance.findByIdAndDelete(id);

    if (!deletedFinance) {
      return res.status(404).json({ message: 'Finance record not found.' });
    }

    res.status(200).json({ message: 'Finance record deleted successfully.' });
  } catch (error) {
    console.error('Error deleting finance record:', error);
    res.status(500).json({ message: 'Server error. Could not delete record.' });
  }
};

const searchFinances = async (req, res) => {
  try {
    const { query, mainType } = req.query;

    let searchCriteria = {};

    // Apply mainType filter if provided
    if (mainType && (mainType === 'Income' || mainType === 'Expenses')) {
      searchCriteria.mainType = mainType;
    }

    // Apply text search if query provided
    if (query && query.trim() !== '') {
      const regex = new RegExp(query, 'i'); // case-insensitive
      searchCriteria.$or = [
        { title: regex },
        { subType: regex },
        { description: regex }
      ];
    }

    const results = await Finance.find(searchCriteria).sort({ date: -1 });
    res.status(200).json(results);
  } catch (error) {
    console.error('Error in searchFinances:', error);
    res.status(500).json({ message: 'Server error during search.' });
  }
};

const getFinanceSummary = async (req, res) => {
  try {
    const groupBy = req.query.groupBy === 'month' ? 'month' : 'year';

    const groupFormat = groupBy === 'month'
      ? { $dateToString: { format: '%Y-%m', date: '$date' } }
      : { $year: '$date' };

    const [incomeByGroup, expensesByGroup, totals] = await Promise.all([
      Finance.aggregate([
        { $match: { mainType: 'Income' } },
        { $group: { _id: groupFormat, amount: { $sum: '$amount' } } },
        { $sort: { _id: 1 } }
      ]),
      Finance.aggregate([
        { $match: { mainType: 'Expenses' } },
        { $group: { _id: groupFormat, amount: { $sum: '$amount' } } },
        { $sort: { _id: 1 } }
      ]),
      Finance.aggregate([
        {
          $group: {
            _id: '$mainType',
            total: { $sum: '$amount' },
          },
        },
      ])
    ]);

    const totalIncome = totals.find(t => t._id === 'Income')?.total || 0;
    const totalExpenses = totals.find(t => t._id === 'Expenses')?.total || 0;

    res.status(200).json({
      incomeByYear: incomeByGroup.map(item => ({
        year: item._id,
        amount: item.amount
      })),
      expensesByYear: expensesByGroup.map(item => ({
        year: item._id,
        amount: item.amount
      })),
      totalIncome,
      totalExpenses
    });
  } catch (error) {
    console.error('Error fetching finance summary:', error);
    res.status(500).json({ message: 'Server error. Could not fetch summary.' });
  }
};


module.exports = { 
    createFinance,
    getAllFinances,
    updateFinance,
    deleteFinance,
    searchFinances,
    getFinanceSummary
 };
