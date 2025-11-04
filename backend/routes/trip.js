var express = require('express');
var router = express.Router();
const Trip = require('../models/trips');
const moment = require('moment');

router.post('/search', async (req, res) => {
	// On récupère les données du front
	  const departure = req.body.departure;
    const arrival = req.body.arrival;
    const date = req.body.date;
    // gestion moment
    // Début de journée (00:00:00)
    const startOfDay = moment(date).startOf('day').toDate();
    // Fin de journée (= début du jour suivant)
    const endOfDay = moment(date).add(1, 'days').startOf('day').toDate();
    
    // On cherche dans la bd
  try {
  const foundtrips = await Trip.find({
  departure: { $regex: new RegExp(req.body.departure, 'i') }, //marche pas non plus...
  arrival: { $regex: new RegExp(req.body.arrival, 'i') },
  // Regex défaillant
  // variante ne marche pas
  // departure: { $regex: new RegExp(`^${departure}$`, 'i') },
  //arrival: { $regex: new RegExp(`^${arrival}$`, 'i') },
  date: {
    $gte: startOfDay,
    $lt: endOfDay,
  },
});
  res.json({foundtrips: foundtrips});
  } catch (error) {
    res.json({error: "Erreur serveur"});
  }
});



  module.exports = router;