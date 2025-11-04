var express = require("express");
var router = express.Router();
const Trip = require("../models/trips");
const moment = require("moment");
const Booking = require("../models/bookings");

// -------------------- POST Purchase :  Création des réservations --------------------
router.post("/purchase", async (req, res) => {
  const trips = req.body.trips;

  // 1. Vérif tableau ok
  if (!Array.isArray(trips) || trips.length === 0) {
    return res.status(400).json({ error: "No trips provided" });
  }

  try {
    // 2. On créer les bookings
    //variable pour stocker toutes les promesses en une fois
    const savedBookings = await Promise.all(
      // map pour "boucler"
      trips.map(async (trip, index) => {
        const newBooking = new Booking({
          departure: trip.departure,
          arrival: trip.arrival,
          date: new Date(trip.date),
          price: trip.price,
          purchaseDate: Date.now(), //et avec moment ?
        });
        // on attend que la promesse soit résolue
        return await newBooking.save();
      })
    );

    // 3. Réponse
    res.status(201).json({ success: true, bookings: savedBookings });
  } catch (err) {
    console.error("Erreur lors de l'achat :", err);
    res.status(500).json({ error: "Erreur serveur lors de la sauvegarde" });
  }
});
// -------------------- GET Purchase :  On récupère les réservations --------------------
router.get("/purchase", async (req, res) => {
  try {
    const bookings = await Booking.find();

    const now = moment();

    const bookingsWithDelay = bookings.map((booking) => {
      const departureTime = moment(booking.date);
      const timeUntilDeparture = departureTime.from(now);

      return {
        ...booking.toObject(), // conversion du document mongoose
        timeUntilDeparture, // champ ajouté
      };
    });

    res.status(200).json({ bookings: bookingsWithDelay });
  } catch (err) {
    console.error("Erreur dans GET /purchase :", err);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des bookings" });
  }
});


module.exports = router;
