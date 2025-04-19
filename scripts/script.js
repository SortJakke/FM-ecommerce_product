document.addEventListener("DOMContentLoaded", function () {
  // Nav
  const navToggle = document.querySelector(".nav-toggle")
  const overlay = document.querySelector(".overlay")
  const nav = document.querySelector(".nav")

  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("close")
    nav.classList.toggle("nav--visible")
    overlay.classList.toggle("nav--visible")
  })

  // Carousel
  const staticImageBox = document.querySelector(".static-image-box")
  const staticImage = document.querySelector("#static-image")
  const carousel = document.querySelector(".carousel")
  const thumbnails = document.querySelectorAll(".carousel .thumbnail")
  let images
  let currentIndex = 0

  const observer = new MutationObserver(() => {
    images = document.querySelectorAll(".cImage")
  })

  observer.observe(document.querySelector("#carousel-image"), {
    childList: true,
  })

  document.addEventListener("keydown", (event) => {
    if (event.key === "+") {
      updateActiveImage((currentIndex + 1) % images.length)
    }
    if (event.key === "-") {
      updateActiveImage((currentIndex - 1 + images.length) % images.length)
    }
  })

  staticImageBox.addEventListener("click", (event) => {
    if (event.target.tagName === "SPAN" || event.target.tagName === "IMG") {
      carousel.classList.remove("hidden")
    }
  })
  staticImage.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      carousel.classList.remove("hidden")
    }
  })

  carousel.querySelector(".close").addEventListener("click", () => {
    carousel.classList.add("hidden")
  })

  function updateActiveImage(index) {
    images[currentIndex].classList.remove("active")
    thumbnails[currentIndex].classList.remove("thumbnail-active")
    currentIndex = index
    images[currentIndex].classList.add("active")
    thumbnails[currentIndex].classList.add("thumbnail-active")
  }

  let nextImage = document.querySelector(".icon-right")
  let prevImage = document.querySelector(".icon-left")

  nextImage.addEventListener("click", () => {
    updateActiveImage((currentIndex + 1) % images.length)
  })
  prevImage.addEventListener("click", () => {
    updateActiveImage((currentIndex - 1 + images.length) % images.length)
  })
  nextImage.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      updateActiveImage((currentIndex + 1) % images.length)
    }
  })
  prevImage.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      updateActiveImage((currentIndex - 1 + images.length) % images.length)
    }
  })

  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener("click", () => {
      updateActiveImage(index)
    })
  })

  // cart
  const quantitySelector = document.querySelector(".quantity-selector")
  const quantityError = document.querySelector(".quantity-error")
  const submitButton = document.querySelector(".add-to-cart")
  const cartIcon = document.querySelector(".cart-icon")
  const cartSpan = document.querySelector(".cart-number")
  const cartBox = document.querySelector(".cartbox")
  const cartMain = document.querySelector(".cart-main")

  const cart = {
    itens: [],
  }
  let quantity = 0
  let orderData

  cartIcon.addEventListener("click", () => {
    cartBox.classList.toggle("hidden")
  })
  cartIcon.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      cartBox.classList.toggle("hidden")
    }
  })

  function reloadCart() {
    if (cart.itens.length === 0) {
      cartSpan.innerText = ""
      cartMain.innerHTML =
        '<span class="cart-main-message"> Your cart is empty. </span>'
    } else {
      cartSpan.innerText = quantity
      cartMain.innerHTML = ""
      cart.itens.forEach((item) => {
        let cartItem = document.createElement("div")
        cartItem.classList.add("cart__item")

        let cartThumbnail = document.createElement("span")
        cartThumbnail.classList.add("cart__thumbnail")
        cartThumbnail.innerHTML = `
        <img
         src="./images/product-thumbnails/${item.thumbnails[0]}"
         alt=""/>
        `
        let cartProductLink = document.createElement("a")
        cartProductLink.setAttribute("href", "#")
        cartProductLink.setAttribute("aria-label", "Product page redirect")
        cartProductLink.innerHTML = `
      <div class="cart__info">
         <span class="item-name"> ${item.name} </span>
           <span class="item-price">
           <span class="item-unid-price"> $${item.pricing.unitPrice.toFixed(
             2
           )}</span>
           <span class="item-quantity">x ${item.quantity}</span>
           <span class="item-total-price">$${item.pricing.totalPrice.toFixed(
             2
           )}</span>
         </span>
       </div>
      `
        let cartRemoveItem = document.createElement("span")
        cartRemoveItem.setAttribute("role", "button")
        cartRemoveItem.setAttribute("tabindex", "0")
        cartRemoveItem.setAttribute("aria-label", "remove item")
        cartRemoveItem.classList.add("cart__remove-item")

        cartItem.appendChild(cartThumbnail)
        cartItem.appendChild(cartProductLink)
        cartItem.appendChild(cartRemoveItem)

        cartMain.appendChild(cartItem)

        cartRemoveItem.addEventListener("click", () => {
          removeItem(item.id)
        })
        cartRemoveItem.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            removeItem(item.id)
          }
        })
      })

      let checkoutButton = document.createElement("button")
      checkoutButton.classList.add("cart__checkout")
      checkoutButton.innerText = "Checkout"

      cartMain.appendChild(checkoutButton)
    }
  }

  function removeItem(id) {
    let index = cart.itens.findIndex((item) => item.id === id)
    if (index !== -1) {
      cart.itens.splice(index, 1)
    }
    reloadCart()
  }

  quantitySelector.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
      if (event.target.className === "icon-plus") {
        ++quantity
      }
      if (event.target.className === "icon-minus") {
        if (quantity != 0) --quantity
      }
      quantitySelector.querySelector(".quantity").innerText = quantity
    }
  })

  submitButton.addEventListener("click", () => {
    quantitySelector.classList.remove("error")
    quantityError.classList.add("hidden")
    if (quantity === 0) {
      quantitySelector.classList.add("error")
      quantityError.classList.remove("hidden")
      return
    }

    if (!productData) {
      console.error("Product data has not been loaded yet!")
      return
    }

    orderData = {
      id: productData.productId,
      name: productData.name,
      brand: productData.brand,
      quantity: quantity,
      pricing: {
        unitPrice: productData.pricing.adjustedPrice,
        totalPrice: productData.pricing.adjustedPrice * quantity,
      },
      thumbnails: productData.thumbnails,
    }

    let itemExists = cart.itens.find((item) => item.id === orderData.id)

    if (itemExists) {
      itemExists.quantity = quantity
    } else {
      cart.itens.push(orderData)
    }

    reloadCart()
  })

  // Media Querie
  const mediaQuery = window.matchMedia("(min-width: 900px)")

  function handleMediaChange(event) {
    if (event.matches) {
      carousel.classList.add("hidden")
    } else {
      carousel.classList.remove("hidden")
    }
  }

  mediaQuery.addEventListener("change", handleMediaChange)

  handleMediaChange(mediaQuery)
})
