let myRequest = new XMLHttpRequest();
let allProducts = [];
let currentPage = 1;
let limit = 10;
let totalProducts = 0;
let isSearching = false;

fetchProducts();

document.getElementById("nextBtn").addEventListener("click", function () {
  if (isSearching) return;
  currentPage++;
  fetchProducts();
});

document.getElementById("prevBtn").addEventListener("click", function () {
  if (isSearching) return;
  currentPage--;
  fetchProducts();
});

function fetchProducts() {
  isSearching = false;
  let skip = (currentPage - 1) * limit;

  myRequest.open(
    "GET",
    `https://dummyjson.com/products?limit=${limit}&skip=${skip}`,
  );
  myRequest.send();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let jsDat = JSON.parse(this.responseText);
      allProducts = jsDat.products;
      totalProducts = jsDat.total;
      displayProducts(allProducts);
      updateButtons();
    }
  };
}

function searchProducts(query) {
  isSearching = true;

  myRequest.open(
    "GET",
    `https://dummyjson.com/products/search?q=${query}&limit=1`,
  );
  myRequest.send();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let jsDat = JSON.parse(this.responseText);
      let results = jsDat.products;

      if (results.length > 0) {
        displayProducts([results[0]]);
      } else {
        document.getElementById("products-container").innerHTML =
          "<h3 style='text-align:center;'>مفيش منتج بالاسم ده</h3>";
      }
      updateButtons();
    }
  };
}

function displayProducts(products) {
  let container = document.getElementById("products-container");
  container.innerHTML = "";

  for (let i = 0; i < products.length; i++) {
    let product = products[i];
    let card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${product.images[0]}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p class="price">${product.price} $</p>
      <p class="category">${product.category}</p>
    `;
    container.appendChild(card);
  }
}

function updateButtons() {
  document.getElementById("pageInfo").innerText = isSearching
    ? "نتيجة البحث"
    : `صفحة ${currentPage}`;
  document.getElementById("prevBtn").disabled =
    currentPage === 1 || isSearching;

  let totalPages = Math.ceil(totalProducts / limit);
  document.getElementById("nextBtn").disabled =
    currentPage === totalPages || isSearching;
}

document.getElementById("searchInput").addEventListener("input", function () {
  let searchValue = this.value.trim();

  if (searchValue === "") {
    currentPage = 1;
    fetchProducts();
  } else {
    searchProducts(searchValue);
  }
});
