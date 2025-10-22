// ====== Hàm bỏ dấu tiếng Việt ======
function removeVietnameseTones(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// ====== Khởi tạo dữ liệu ======
let products = [];

// Khi load trang → lấy từ localStorage
window.onload = function () {
  const data = localStorage.getItem("products");
  if (data) {
    products = JSON.parse(data);
  } else {
    // Khởi tạo mẫu nếu chưa có
    products = [
      {
        name: "Phở Bò",
        desc: "Phở truyền thống với nước dùng đậm đà.",
        price: "50.000₫",
        img: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2024_1_26_638418715174070559_pho-bo-anh-dai-dien.jpg"
      },
      {
        name: "Bún Chả",
        desc: "Bún chả Hà Nội, thịt nướng thơm ngon.",
        price: "45.000₫",
        img: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2024_1_13_638407567967930759_tong-hop-cac-cach-an-bun-cha-ha-noi-chuan-4.png"
      },
      {
        name: "Nem Rán",
        desc: "Nem vàng giòn rụm, ăn kèm rau sống.",
        price: "40.000₫",
        img: "https://cdn.tgdd.vn/2022/10/CookDishThumb/cach-lam-mon-nem-ran-thom-ngon-chuan-vi-don-gian-tai-nha-thumb-620x620.jpg"
      },
      {
        name: "Cơm Tấm",
        desc: "Cơm tấm sườn bì chả trứng.",
        price: "55.000₫",
        img: "https://statics.vinpearl.com/com-tam-ha-noi-1_1692527283.jpg"
      }
    ];
    localStorage.setItem("products", JSON.stringify(products));
  }

  renderProducts(products);
};

// ====== Hiển thị danh sách sản phẩm ======
function renderProducts(list) {
  const container = document.getElementById("product-list");
  container.innerHTML = "";
  list.forEach(p => {
    const item = document.createElement("article");
    item.className = "product-item";
    item.innerHTML = `
      <h3 class="product-name">${p.name}</h3>
      <img src="${p.img}" alt="${p.name}" width="300" height="200">
      <p>${p.desc}</p>
      <p class="price"><strong>Giá:</strong> ${p.price}</p>
    `;
    container.appendChild(item);
  });
}

// ====== Tìm kiếm sản phẩm ======
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

function searchProducts() {
  const keyword = removeVietnameseTones(searchInput.value.toLowerCase().trim());
  const filtered = products.filter(p =>
    removeVietnameseTones(p.name.toLowerCase()).includes(keyword)
  );
  renderProducts(filtered);
}

searchBtn.addEventListener("click", searchProducts);
searchInput.addEventListener("keyup", e => {
  if (e.key === "Enter") searchProducts();
});

// ====== Hiệu ứng mở/đóng form ======
const addProductBtn = document.getElementById("addProductBtn");
const addProductForm = document.getElementById("addProductForm");

addProductBtn.addEventListener("click", () => {
  addProductForm.classList.toggle("show");
});

// ====== Thêm sản phẩm mới ======
addProductForm.addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("productName").value.trim();
  const desc = document.getElementById("productDesc").value.trim();
  let price = document.getElementById("productPrice").value.trim();
  const img = document.getElementById("productImg").value.trim();

  if (!name || !desc || !price || !img) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  if (/^\d+$/.test(price)) {
    price = parseInt(price).toLocaleString("vi-VN") + "₫";
  }

  const newProduct = { name, desc, price, img };
  products.push(newProduct);
  localStorage.setItem("products", JSON.stringify(products));

  renderProducts(products);

  addProductForm.reset();
  addProductForm.classList.remove("show");
});
