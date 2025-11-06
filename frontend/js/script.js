// Au clic sur le bouton #search
document.querySelector('#search').addEventListener('click', () => {
  // On récupère les valeurs depuis les inputs
  const departure = document.querySelector('#departure').value;
  const arrival = document.querySelector('#arrival').value;
  const date = document.querySelector('#travelDate').value;

  // On vérifie que tous les champs sont remplis
  if (departure && arrival && date) {
    // Requête POST vers /search
    fetch('http://localhost:3000/trips/search', {
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
              <div id="inresults">
                <p>${trip.departure} ➤ ${trip.arrival}</p>
                <p>${new Date(trip.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p>${trip.price}€</p>
                <button class="book-btn">Book</button>
              </div>
            `;

            resultsDiv.appendChild(card);
          });
        } else {
          resultsDiv.innerHTML = `<p>No trip found.</p>`;
        }
      })
      .catch(err => {
        console.error('Erreur fetch search:', err);
      });
  } else {
    alert('Please fill all fields.');
  }
});
