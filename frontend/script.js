// debug...
console.log('Script ok !');
// Au clic sur le bouton #search
document.querySelector('#search-btn').addEventListener('click', () => {
  // On récupère les valeurs depuis les inputs
  const departure = document.querySelector('#departure').value;
  const arrival = document.querySelector('#arrival').value;
  const date = document.querySelector('#travelDate').value;

  // On vérifie que tous les champs sont remplis
  if (departure && arrival && date) {
    // Requête POST vers /search
    fetch('http://127.0.0.1:3000/trip/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ departure, arrival, date })
    })
      .then(response => response.json())
      .then(data => {
        const resultsDiv = document.querySelector('#resultContainer');
        resultsDiv.innerHTML = ''; // reset

        if (data.foundtrips.length > 0) {
          data.foundtrips.forEach(trip => {
            const card = document.createElement('div');
            card.classList.add('searchCard');

            card.innerHTML = `
              <div id="reserch-trip-item">
                <p>${trip.departure} ➤ ${trip.arrival}</p>
                <p>${new Date(trip.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                <p>${trip.price}€</p>
                <button class="book-btn" 
                  data-departure="${trip.departure}"
                  data-arrival="${trip.arrival}"
                  data-date="${trip.date}"
                  data-price="${trip.price}"
                  data-id="${trip._id || ''}">Book</button>
              </div>
            `;

            resultsDiv.appendChild(card);
          });
        } else {
          resultsDiv.innerHTML = `<div id="resultContainer">
            <div id="img-container">
            <img id="img-result" src="../images/notfound.png" />
          </div>
            <div id="separatorline"></div>
            <p id="resultText">Not trip found.</p>
          </div>`;
        }
      })
      .catch(err => {
        console.error('Erreur fetch search:', err);
      });
  } else {
    alert('Please fill all fields.');
  }
});
// EventListener :  un seul listener sur le parent
document.querySelector('#resultContainer').addEventListener('click', (e) => {
  // On vérifie si l'élément cliqué est un bouton Book
  if (e.target.classList.contains('book-btn')) {
    //nouvelle version en une ligne j'avais des erreurs
    const trip = {
          _id: e.target.dataset.id,
      departure: e.target.dataset.departure,
      arrival: e.target.dataset.arrival,
      date: e.target.dataset.date,
      price: parseFloat(e.target.dataset.price)
  };
      addToCart(trip);
  
}
});

// Fonction pour ajouter au panier
function addToCart(trip) {
  console.log('Trip à ajouter:', trip); 
  
  fetch('http://127.0.0.1:3000/cart/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ trip })
  })
    .then(response => {
      console.log('Réponse status:', response.status); 
      return response.json();
    })
    .then(data => {
      console.log('Data reçue:', data); 
      if (data.success) {
        alert(` ${trip.departure} ➤ ${trip.arrival} ajouté au panier !`);
      } else {
        alert(`Erreur: ${data.error}`);
      }
    })
    .catch(err => {
      console.error('Erreur ajout au panier:', err);
    });
}