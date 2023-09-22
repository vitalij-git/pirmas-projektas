    if (!window.localStorage.getItem('itemsInCart')) {
        var itemsInCart = [];
        window.localStorage.setItem('itemsInCart', JSON.stringify(itemsInCart));
    }

    window.onload = function() {
        var cartBasket = document.getElementsByClassName('cart-items')[0];
        if (cartBasket) {
            populateCart();
        }
        var totalCountElement = document.getElementById('totalCount');
        if (totalCountElement) {
            recalculateTotal();
        }
    }

    if (document.readyState == 'loading') {
        document.addEventListener('DOMContentLoaded', ready)
    } else { 
        ready()
    }

    function recalculateTotal() {
        var itemsInCart = JSON.parse(window.localStorage.getItem('itemsInCart'));
        var count = itemsInCart.length;
        console.log(count)
        var totalCountElement = document.getElementById('totalCount');
        totalCountElement.innerHTML = count;
    }

    function ready() {
        var removeCartItemButtons = document.getElementsByClassName('btn-danger')
        for (var i = 0; i < removeCartItemButtons.length; i++) {
            var button = removeCartItemButtons[i]
            button.addEventListener('click', removeCartItem)
        }

        var quantityInputs = document.getElementsByClassName('cart-quantity-input')
        for (var i = 0; i < quantityInputs.length; i++) {
            var input = quantityInputs[i]
            input.addEventListener('change', quantityChanged)
        }

        var purchaseButton = document.getElementsByClassName('btn-purchase')[0];
        if (purchaseButton) {
            purchaseButton.addEventListener('click', purchaseClicked)
        }
        
    }

    function purchaseClicked() {
        alert('Ačiū, kad pas mus pirkote')
        var cartItems = document.getElementsByClassName('cart-items')[0]
        while (cartItems.hasChildNodes()) {
            cartItems.removeChild(cartItems.firstChild)
        }
        localStorage.clear();
    }

    function removeCartItem(event) {
        var buttonClicked = event.target
        buttonClicked.parentElement.parentElement.remove()
        removeItemFromStorage(buttonClicked.getAttribute('data-title'))
        updateCartTotal()
    }

    function removeItemFromStorage(title)
    {
        var itemsInCart = JSON.parse(window.localStorage.getItem('itemsInCart'));
        itemsInCart = itemsInCart.filter(element => {
            return element.title != title;
        });

        window.localStorage.setItem('itemsInCart', JSON.stringify(itemsInCart));
        recalculateTotal();

    }

    function quantityChanged(event) {
        var input = event.target
        if (isNaN(input.value) || input.value <= 0) {
            input.value = 1
        }
        updateCartTotal()
    }

    function addToCart(title, price, imageSrc) {
        var cartItem = {
            'title': title,
            'price':price,
            'imageSrc':imageSrc
        }
        var itemsInCart = JSON.parse(window.localStorage.getItem('itemsInCart'));
        var isInCart = itemsInCart.some(element => {
            return title == element.title;
        });
        if (isInCart) {
            alert("already in cart!!!!")
            return;
        }
        itemsInCart.push(cartItem);
        window.localStorage.setItem('itemsInCart', JSON.stringify(itemsInCart));
        recalculateTotal();
    }

    function createCartItem(title, price, imageSrc) {
        var cartRow = document.createElement('div')
        cartRow.classList.add('cart-row')
        
        var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button" data-title="${title}">REMOVE</button>
        </div>`
        cartRow.innerHTML = cartRowContents
        
        cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
        cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)

        return cartRow;
    }

    function addItemToCart(cartRow) {
        var cartItems = document.getElementsByClassName('cart-items')[0]
        var cartItemNames = cartItems.getElementsByClassName('cart-item-title')

        cartItems.append(cartRow)
    }

    function populateCart() {
        var itemsInCart = JSON.parse(window.localStorage.getItem('itemsInCart'));
        console.log(itemsInCart);
        itemsInCart.forEach(cartRow => {
            var cartItem = createCartItem(cartRow.title, cartRow.price, cartRow.imageSrc);
            addItemToCart(cartItem);
            updateCartTotal()
        });
    }

    function updateCartTotal() {
        var cartItemContainer = document.getElementsByClassName('cart-items')[0]
        var cartRows = cartItemContainer.getElementsByClassName('cart-row')
        console.log(cartRows)
        var total = 0
        for (var i = 0; i < cartRows.length; i++) {
            var cartRow = cartRows[i]
            var priceElement = cartRow.getElementsByClassName('cart-price')[0]
            var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
            var price = parseFloat(priceElement.innerText.replace('Eur', ''))
            var quantity = quantityElement.value
            total = total + (price * quantity)
        }
        total = Math.round(total * 100) / 100
        document.getElementsByClassName('cart-total-price')[0].innerText = total + ' Eur.'
    }

var cartItems = document.getElementsByClassName("cart-items");

