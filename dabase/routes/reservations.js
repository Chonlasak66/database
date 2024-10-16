const express = require('express');
const router = express.Router();
const db = require('../models/db'); // Adjust the path according to your folder structure

// GET all reservations
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Reservation');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET reservation by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM Reservation WHERE ReservationID = ?', [id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: 'Reservation not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new reservation
// POST create a new reservation
router.post('/', async (req, res) => {
  const { CheckinDate, CheckinTime, CheckoutDate, CheckoutTime, CustomerID, RoomID, RoomType } = req.body;

  // Set ReservationDate to current date and time
  const ReservationDate = new Date(); // Get current date and time

  try {
    const result = await db.query('INSERT INTO Reservation (ReservationDate, CheckinDate, CheckinTime, CheckoutDate, CheckoutTime, CustomerID, RoomID, RoomType) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
      [ReservationDate, CheckinDate, CheckinTime, CheckoutDate, CheckoutTime, CustomerID, RoomID, RoomType]);
    res.status(201).json({ ReservationID: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// PUT update a reservation
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { ReservationDate, CheckinDate, CheckinTime, CheckoutDate, CheckoutTime, CustomerID, RoomID, RoomType } = req.body;
  try {
    const result = await db.query('UPDATE Reservation SET ReservationDate = ?, CheckinDate = ?, CheckinTime = ?, CheckoutDate = ?, CheckoutTime = ?, CustomerID = ?, RoomID = ?, RoomType = ? WHERE ReservationID = ?', 
      [ReservationDate, CheckinDate, CheckinTime, CheckoutDate, CheckoutTime, CustomerID, RoomID, RoomType, id]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Reservation updated successfully' });
    } else {
      res.status(404).json({ error: 'Reservation not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a reservation
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM Reservation WHERE ReservationID = ?', [id]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Reservation deleted successfully' });
    } else {
      res.status(404).json({ error: 'Reservation not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
