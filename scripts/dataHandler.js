let productData

async function loadData() {
  try {
    const response = await fetch("./scripts/data.json")
    if (!response.ok) {
      throw new Error("Error loading JSON file")
    }
    let externalData = await response.json()
    productData = externalData.product

    appendItem()
  } catch (error) {
    console.error("Erro:", error)
  }
}

function appendItem() {
  loadImages()
  loadTexts()
}

function loadImages() {
  const staticImage = document.querySelector("#static-image")
  staticImage.setAttribute(
    "src",
    `./images/product-images/${productData.images[0]}`
  )
  staticImage.setAttribute("alt", productData.imagesDescription[0])

  const thumbnails = document.querySelectorAll(".thumbnail")

  let thumbCounter = 0
  thumbnails.forEach((item) => {
    let image = document.createElement("img")
    image.setAttribute(
      "src",
      `./images/product-thumbnails/${productData.thumbnails[thumbCounter]}`
    )
    image.setAttribute("alt", "")
    item.appendChild(image)
    if (thumbCounter < 3) {
      ++thumbCounter
    } else {
      thumbCounter = 0
    }
  })

  const carouselImage = document.querySelector("#carousel-image")

  productData.images.forEach((image, index) => {
    let cImage = document.createElement("img")
    cImage.setAttribute("src", `./images/product-images/${image}`)
    cImage.setAttribute("alt", `${productData.imagesDescription[index]}`)
    cImage.setAttribute("aria-roledescription", "slide")
    cImage.setAttribute(
      "aria-label",
      `${index + 1} of ${productData.images.length}`
    )
    cImage.classList.add("cImage")

    if (index === 0) {
      cImage.classList.add("active")
    }

    carouselImage.appendChild(cImage)
  })
}

function loadTexts() {
  document.querySelector(".company-name").innerText = productData.brand
  document.querySelector(".product-title").innerText = productData.name
  document.querySelector(".description").innerText = productData.description
  document.querySelector(".new-price").innerText =
    "$" + productData.pricing.adjustedPrice.toFixed(2)
  document.querySelector(".discount").innerText =
    productData.pricing.discountPercentage + "%"
  document.querySelector(".old-price").innerText =
    "$" + productData.pricing.oldPrice.toFixed(2)
}

loadData()
