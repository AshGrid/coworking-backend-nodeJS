const express = require('express');
const router = express.Router();
const Table = require('../models/Table');
const Chair = require('../models/Chair');
const mongoose = require('mongoose');

// Get all tables
router.get('/', async (req, res) => {
  try {
    const tables = await Table.find().populate('chairs'); // Populate chairs instead of returning IDs
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tables: " + error.message });
  }
});

// Create a new table
router.post('/', async (req, res) => {
  const table = new Table({
    name: req.body.name,
    total_number_of_chairs: req.body.total_number_of_chairs,
    chairs: Array.from({ length: req.body.total_number_of_chairs }, (_, i) => ({
      number_associated: i + 1
    }))
  });

  try {
    const newTable = await table.save();
    res.status(201).json(newTable);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


//// create empty table
router.post('/tables', async (req, res) => {
  const { name } = req.body; // Table name

  try {
    const table = new Table({
      name: name,
      total_number_of_chairs: 0, // Initially, no chairs
      chairs: [], // No chairs associated yet
    });

    const newTable = await table.save();

    res.status(201).json({
      message: 'Table created successfully.',
      table: newTable,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//// associate chairs to table


router.put('/tables/:tableId/assign-chairs', async (req, res) => {
  const { tableId } = req.params;
  const { chairIds } = req.body; // Array of existing chair ObjectIds

  try {
    // Fetch the table by its ID
    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    // Fetch chairs by their ObjectIds
    const chairs = await Chair.find({ '_id': { $in: chairIds } });
    if (chairs.length !== chairIds.length) {
      return res.status(400).json({ message: 'Some chair IDs are invalid' });
    }

    // Update the chairs in the table
    table.chairs = chairs.map(chair => chair._id); // Only save ObjectIds of the chairs

    // Update the total number of chairs in the table
    table.total_number_of_chairs = chairs.length;
    await table.save();

    res.status(200).json({
      message: 'Chairs successfully associated with the table',
      table,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific table
router.get('/:id', async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (table) {
      res.json(table);
    } else {
      res.status(404).json({ message: 'Table not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put('/swap-chairs/:chairId1/:chairId2', async (req, res) => {
  try {
    const { chairId1, chairId2 } = req.params;

    // Find chairs
    const chair1 = await Chair.findById(chairId1);
    const chair2 = await Chair.findById(chairId2);

    if (!chair1 || !chair2) {
      return res.status(404).json({ message: 'One or both chairs not found' });
    }

    // Find tables where these chairs are located
    const table1 = await Table.findOne({ chairs: chairId1 });
    const table2 = await Table.findOne({ chairs: chairId2 });

    if (!table1 || !table2) {
      return res.status(404).json({ message: 'One or both tables not found' });
    }

    if (table1._id.toString() === table2._id.toString()) {
      // Case 1: Chairs are in the same table, reorder the list
      const index1 = table1.chairs.indexOf(chairId1);
      const index2 = table1.chairs.indexOf(chairId2);

      if (index1 === -1 || index2 === -1) {
        return res.status(400).json({ message: 'Chairs not found in the table' });
      }

      // Swap positions within the same table
      [table1.chairs[index1], table1.chairs[index2]] = [table1.chairs[index2], table1.chairs[index1]];

      // Save table and return response
      await table1.save();
      return res.json({ message: 'Chairs reordered within the same table', table: table1 });
    } else {
      // Case 2: Chairs are in different tables, swap and maintain order
      const index1 = table1.chairs.indexOf(chairId1);
      const index2 = table2.chairs.indexOf(chairId2);

      if (index1 === -1 || index2 === -1) {
        return res.status(400).json({ message: 'Chairs not found in their respective tables' });
      }

      // Remove chair1 from table1 and chair2 from table2
      table1.chairs.splice(index1, 1, chairId2);  // Replace chair1 with chair2 in table1
      table2.chairs.splice(index2, 1, chairId1);  // Replace chair2 with chair1 in table2

      // Save updated tables
      await table1.save();
      await table2.save();

      // Optionally update the chair models if needed (if there are any chair-specific properties you need to modify)
      // Example: You could update `chair1` and `chair2` status if necessary
      // await Chair.findByIdAndUpdate(chairId1, { ... });
      // await Chair.findByIdAndUpdate(chairId2, { ... });

      return res.json({ message: 'Chairs swapped and order preserved', table1, table2 });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;