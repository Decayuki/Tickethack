var express = require('express');
var router = express.Router();
const Trip = require('../models/trips');
const moment = require('moment');
const Booking = require('../models/bookings');


router.post('/purchase', async (req, res) => {
  const cartTrip = req.body.trips;
  // vérification du type de reception []
  if (!Array.isArray(trips) || trips.length === 0) {
  return res.status(400).json({ error: 'No trips provided' });
  
  try {
    

  }
}









module.exports = router;
