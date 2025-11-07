// Charger le panier au chargement de la page cart.html
window.addEventListener("DOMContentLoaded", () => {
  console.log("carjt.js bien chargé");
  loadCart();
});
// Appel du panier depuis le backend
// je log pas mal de chose pour m'assurer que cela fonctionne étape par étape
function loadCart() {
  console.log("appel api en cours");
  fetch("http://127.0.0.1:3000/cart", {
    method: "GET",
    credentials: "include",
  })
    // le return est l'input de .then donc data réponse en {}
    .then((response) => {
      console.log("réponse reçue", response.status);
      return response.json();
    })
    .then((data) => {
      console.log("Données du panier:", data);
      displayCart(data.cart);
    })
    .catch((err) => {
      console.error("Erreur chargement panier:", err);
    });
}

function displayCart(cart) {
  const tripsList = document.querySelector("#tripsList");
  const barPurchase = document.querySelector("#barPurchase");

  tripsList.innerHTML = "";

  if (cart.length === 0) {
    tripsList.innerHTML =
      '<p style="text-align:center; padding:20px;">Panier vide.</p>';
    barPurchase.style.display = "none";
    return;
  }

  let total = 0;
// Affiche chaque trip via forEach
  cart.forEach((trip, index) => {
    total += trip.price;

    const tripItem = document.createElement("div");
    tripItem.classList.add("trip-item");

    tripItem.innerHTML = `
      <p>${trip.departure} > ${trip.arrival}</p>
      <p>${new Date(trip.date).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })}</p>
      <p>${trip.price}€</p>
      <button class="delete-btn" data-index="${index}">✖</button>
    `;

    tripsList.appendChild(tripItem);
  });

  // Afficher le total
  document.querySelector("#priceTotal").textContent = total;
  barPurchase.style.display = "flex";
}

// Délégation d'événements pour les boutons delete
document.querySelector("#tripsList").addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const index = e.target.getAttribute("data-index");
    removeFromCart(index);
  }
});

function removeFromCart(index) {
  fetch(`http://127.0.0.1:3000/cart/${index}`, {
    method: "DELETE",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        loadCart();
      }
    })
    .catch((err) => {
      console.error("Erreur suppression:", err);
    });
}

// Gestion du bouton Purchase
document.querySelector('#purchase-btn')?.addEventListener('click', () => {
  console.log('Achat en cours...');
  
  // Je récupère le panier actuel
  fetch('http://127.0.0.1:3000/cart', {
    method: 'GET',
    credentials: 'include'
  })
    .then(response => response.json())
    .then(data => {
      if (!data.cart || data.cart.length === 0) {
        alert('Your cart is empty!');
        return;
      }

      // Envoi des trips au backend pour créer les bookings
      return fetch('http://127.0.0.1:3000/booking/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ trips: data.cart }) // Envoie les trips
      });
    })
    .then(response => {
      if (!response) return; 
      return response.json();
    })
    .then(data => {
      if (!data) return;
      
      if (data.success) {
        console.log('Achat réussi !');
        
        //Vide le panier côté session
        return fetch('http://127.0.0.1:3000/cart', {
          method: 'DELETE',
          credentials: 'include'
        });
      } else {
        alert('Error: ' + data.error);
      }
    })
    .then(() => {
      // 4. Redirection vers bookings
      alert('Enfiiiinnnnnnnn...!');
      window.location.href = 'bookings.html';
    })
    .catch(err => {
      console.error('Erreur achat:', err);
      alert('Purchase failed. Please try again...');
    });
});
