const express = require('express');
const router = express.Router();

// GET /cart
router.get('/', (req, res) => {
  console.log('GET /cart appelé');
  console.log('Session ID:', req.sessionID);
  console.log('Session cart:', req.session.cart);
  
  if (!req.session.cart) {
    req.session.cart = [];
  }

  res.json({ cart: req.session.cart });
});

// POST /cart/add
router.post('/add', (req, res) => {
  console.log('Body reçu:', req.body);
  console.log('Session ID:', req.sessionID);
  console.log('Session cart AVANT:', req.session.cart);
  
  const trip = req.body.trip;

  if (!trip) {
    console.log('❌ Pas de trip trouvé');
    return res.status(400).json({ error: 'No trip provided' });
  }

  if (!req.session.cart) {
    req.session.cart = [];
  }

  req.session.cart.push(trip);
  console.log('Trip bien ajouté !');
  console.log('Session cart APRÈS:', req.session.cart);
  console.log('Nombre de trips:', req.session.cart.length);
  
  res.json({ success: true, cart: req.session.cart });
});

// DELETE /cart/:index
router.delete('/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);

  if (!req.session.cart || index < 0 || index >= req.session.cart.length) {
    return res.status(400).json({ error: 'Invalid index' });
  }

  req.session.cart.splice(index, 1);
  res.json({ success: true, cart: req.session.cart });
});

// DELETE /cart
router.delete('/', (req, res) => {
  req.session.cart = [];
  res.json({ success: true, cart: [] });
});

module.exports = router;