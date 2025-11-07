console.log('bookings.js chargé !');

// Charge les bookings au chargement de la page
window.addEventListener('DOMContentLoaded', () => {
  console.log('Chargement des bookings...');
  loadBookings();
});

function loadBookings() {
  fetch('http://127.0.0.1:3000/booking/purchase', {
    method: 'GET',
    credentials: 'include'
  })
    .then(response => response.json())
    .then(data => {
      console.log(' Bookings reçus:', data);
      displayBookings(data.bookings);
    })
    .catch(err => {
      console.error('Erreur chargement bookings:', err);
    });
}

function displayBookings(bookings) {
  const tripsList = document.querySelector('#tripsList');
  
  tripsList.innerHTML = ''; // Vide le contenu 

  if (!bookings || bookings.length === 0) {
    tripsList.innerHTML = '<p style="text-align:center; padding:20px;">No bookings yet.</p>';
    return;
  }

  bookings.forEach((booking) => {
    const tripItem = document.createElement('div');
    // ajout de la classe CSS
    tripItem.classList.add('trip-item');
    // applique le style de la classe .trip-item
    // ajoute le contenu HTML
    tripItem.innerHTML = `
      <p>${booking.departure} > ${booking.arrival}</p>
      <p>${new Date(booking.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
      <p>${booking.price}€</p>
      <p style="color: #5DCCB4;">Departure ${booking.timeUntilDeparture}</p>
    `;
    // A noter :
    // Date native JS Pour formater l'heure de départ 
    // Moment Pour calculer le délai relatif 
    // voir alternative day.js

    tripsList.appendChild(tripItem);
  });
}