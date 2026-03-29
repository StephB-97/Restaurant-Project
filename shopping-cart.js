/* ── Cart state — array of { name, price, qty } ──────────────── */
var cart = [];


/* =============================================
   TOGGLE CART SIDEBAR OPEN / CLOSED
============================================= */
function toggleCart() {
  var sidebar = document.getElementById("cart-sidebar");
  var overlay = document.getElementById("cart-overlay");
  var isOpen  = sidebar.classList.contains("open");

  if (isOpen) {
    // Close
    sidebar.classList.remove("open");
    overlay.classList.remove("active");
  } else {
    // Open — render latest cart state first
    renderCart();
    sidebar.classList.add("open");
    overlay.classList.add("active");
  }
}


/* =============================================
   ADD AN ITEM TO THE CART
   Called by the onclick on each menu card button.
   If the item already exists, increment its qty.
============================================= */
function addToCart(name, price) {
  var found = false;

  for (var i = 0; i < cart.length; i++) {
    if (cart[i].name === name) {
      cart[i].qty += 1;
      found = true;
      break;
    }
  }

  if (!found) {
    cart.push({ name: name, price: price, qty: 1 });
  }

  updateCartBadge();
  showAddedFeedback(name);

  // If sidebar is already open, refresh it live
  if (document.getElementById("cart-sidebar").classList.contains("open")) {
    renderCart();
  }
}


/* =============================================
   REMOVE AN ITEM COMPLETELY FROM THE CART
   index — position in the cart array
============================================= */
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartBadge();
  renderCart();
}


/* =============================================
   DECREASE ITEM QUANTITY BY 1
   If qty reaches 0, the item is removed entirely.
============================================= */
function decreaseQty(index) {
  cart[index].qty -= 1;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  updateCartBadge();
  renderCart();
}


/* =============================================
   INCREASE ITEM QUANTITY BY 1
============================================= */
function increaseQty(index) {
  cart[index].qty += 1;
  updateCartBadge();
  renderCart();
}


/* =============================================
   CLEAR THE ENTIRE CART
   Called by the "Clear Cart" button.
============================================= */
function clearCart() {
  cart = [];
  updateCartBadge();
  renderCart();
}


/* =============================================
   CALCULATE CART TOTAL PRICE
   Returns a number 
============================================= */
function calculateTotal() {
  var total = 0;

  for (var i = 0; i < cart.length; i++) {
    total += cart[i].price * cart[i].qty;
  }

  return total;
}


/* =============================================
   UPDATE THE BADGE COUNT ON THE CART ICON
   Shows total number of individual items (qty sum).
   Hides the badge when cart is empty.
============================================= */
function updateCartBadge() {
  var totalQty = 0;

  for (var i = 0; i < cart.length; i++) {
    totalQty += cart[i].qty;
  }

  var badge = document.getElementById("cart-badge");
  badge.textContent   = totalQty;
  badge.style.display = totalQty > 0 ? "flex" : "none";
}


/* =============================================
   RENDER / REFRESH THE CART SIDEBAR
   Rebuilds the item list and updates the total.
============================================= */
function renderCart() {
  var cartItemsEl = document.getElementById("cart-items");
  var cartTotalEl = document.getElementById("cart-total");
  var emptyMsgEl  = document.getElementById("cart-empty");
  var footerEl    = document.getElementById("cart-footer");

  // Clear existing list
  cartItemsEl.innerHTML = "";

  if (cart.length === 0) {
    // Show empty state
    emptyMsgEl.style.display = "block";
    footerEl.style.display   = "none";
    cartTotalEl.textContent  = "$0.00";
    return;
  }

  // Hide empty state, show footer
  emptyMsgEl.style.display = "none";
  footerEl.style.display   = "block";

  // Build one <li> per cart item
  for (var i = 0; i < cart.length; i++) {
    var item     = cart[i];
    var subtotal = (item.price * item.qty).toFixed(2);

    var li = document.createElement("li");
    li.className = "cart-item";

  
    li.innerHTML = (function(idx, sub) {
      return '<div class="cart-item-info">'
        + '<span class="cart-item-name">' + cart[idx].name + '</span>'
        + '<span class="cart-item-price">$' + sub + '</span>'
        + '</div>'
        + '<div class="cart-item-controls">'
        + '<button class="qty-btn" onclick="decreaseQty(' + idx + ')">&#8722;</button>'
        + '<span class="cart-item-qty">' + cart[idx].qty + '</span>'
        + '<button class="qty-btn" onclick="increaseQty(' + idx + ')">&#43;</button>'
        + '<button class="remove-btn" onclick="removeFromCart(' + idx + ')" title="Remove item">&#128465;</button>'
        + '</div>';
    })(i, subtotal);

    cartItemsEl.appendChild(li);
  }

  // Update the total display
  cartTotalEl.textContent = "$" + calculateTotal().toFixed(2);
}


/* =============================================
   "ADDED!" FLASH FEEDBACK ON BUTTON
   Briefly turns the clicked card's button green
   so the user knows their item was added.
============================================= */
function showAddedFeedback(name) {
  var cards = document.querySelectorAll(".menu-card");

  for (var i = 0; i < cards.length; i++) {
    var titleEl = cards[i].querySelector(".card-title");

    if (titleEl && titleEl.textContent.trim() === name) {
      var btn = cards[i].querySelector(".add-to-cart-btn");

      if (btn) {
        btn.textContent = "✓ Added!";
        btn.classList.add("added");

        
        (function(b) {
          setTimeout(function() {
            b.textContent = "+ Add to Cart";
            b.classList.remove("added");
          }, 900);
        })(btn);
      }

      break;
    }
  }
}
