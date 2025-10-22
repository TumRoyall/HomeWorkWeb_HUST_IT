// Hàm bỏ dấu tiếng Việt
function removeVietnameseTones(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// ========== Tìm kiếm sản phẩm ==========
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", function () {
  const keyword = removeVietnameseTones(searchInput.value.toLowerCase().trim());
  const products = document.querySelectorAll(".product-item");

  products.forEach(item => {
    const name = removeVietnameseTones(
      item.querySelector(".product-name").textContent.toLowerCase()
    );
    if (name.includes(keyword)) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  });
});

// Cho phép Enter để tìm
searchInput.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

// ========== Ẩn/hiện form thêm sản phẩm ==========
const addProductBtn = document.getElementById("addProductBtn");
const addProductForm = document.getElementById("addProductForm");

addProductBtn.addEventListener("click", function () {
  addProductForm.classList.toggle("hidden");
});

// ========== Thêm sản phẩm mới ==========
addProductForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Lấy dữ liệu từ form
  const name = document.getElementById("productName").value;
  const desc = document.getElementById("productDesc").value;
  let price = document.getElementById("productPrice").value.trim();
  const img = document.getElementById("productImg").value;

  // Nếu giá là số -> tự thêm đơn vị ₫
  if (/^\d+$/.test(price)) {
    price = parseInt(price).toLocaleString("vi-VN") + "₫";
  }

  // Tạo sản phẩm mới
  const newProduct = document.createElement("article");
  newProduct.classList.add("product-item");
  newProduct.innerHTML = `
    <h3 class="product-name">${name}</h3>
    <img src="${img}" alt="${name}" width="300" height="200">
    <p>${desc}</p>
    <p class="price"><strong>Giá:</strong> ${price}</p>
  `;

  // Thêm vào danh sách
  document.getElementById("product-list").appendChild(newProduct);

  // Reset form + ẩn
  addProductForm.reset();
  addProductForm.classList.add("hidden");
});
