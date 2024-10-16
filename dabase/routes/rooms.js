const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET all rooms (across all room types)
router.get('/', async (req, res) => {
  try {
    const [singleRooms] = await db.query('SELECT * FROM RoomSingle');
    const [doubleRooms] = await db.query('SELECT * FROM RoomDouble');
    const [suiteRooms] = await db.query('SELECT * FROM RoomSuite');

    res.json({ singleRooms, doubleRooms, suiteRooms });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/si/:roomID', async (req, res) => {
    try {
      const [singleRooms] = await db.query('SELECT * FROM RoomSingle where RoomID = ?', [req.params.roomID]);
        console.log(req.params.roomID);
      res.json({ singleRooms});
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });



  
// PUT to update a room by RoomID
router.put('/usi/:roomID', async (req, res) => {
  const { roomID } = req.params;
  const { PricePerNight, Status, RoomType } = req.body;

  try {
    const result = await db.query(
      `UPDATE RoomSingle SET PricePerNight = ?, Status = ?, RoomType = ? WHERE RoomID = ?`,
      [PricePerNight, Status, RoomType, roomID]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Ensure `rows` exists and has elements before accessing it
    if (result.rows && result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.json({ message: 'Room updated successfully' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
});


router.put('/udu/:roomID', async (req, res) => {
  const { roomID } = req.params;
  const { PricePerNight, Status, RoomType } = req.body;

  try {
    const result = await db.query(
      `UPDATE roomdouble SET PricePerNight = ?, Status = ?, RoomType = ? WHERE RoomID = ?`,
      [PricePerNight, Status, RoomType, roomID]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Ensure `rows` exists and has elements before accessing it
    if (result.rows && result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.json({ message: 'Room updated successfully' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
});



router.put('/usu/:roomID', async (req, res) => {
  const { roomID } = req.params;
  const { PricePerNight, Status, RoomType } = req.body;

  try {
    const result = await db.query(
      `UPDATE roomsuite SET PricePerNight = ?, Status = ?, RoomType = ? WHERE RoomID = ?`,
      [PricePerNight, Status, RoomType, roomID]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Ensure `rows` exists and has elements before accessing it
    if (result.rows && result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.json({ message: 'Room updated successfully' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
});







  

module.exports = router;
