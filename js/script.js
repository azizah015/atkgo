/* ==========================================================
   ATKGO.ID — JavaScript
   Isi file:
   1. PENGATURAN  → email tujuan, nama penyimpanan keranjang
   2. Menu mobile
   3. Keranjang belanja
   4. Pencarian & filter produk
   5. Formulir kontak
   ========================================================== */

/* ---------- 1. PENGATURAN (edit di sini) ---------- */
const CONFIG = {
  contactEmail: 'hello@atkgo.id',   // ganti dengan email resmi
  cartStorageKey: 'atkgo_cart',
  toastDuration: 1800               // milidetik
};

/* ---------- Fungsi bantu ---------- */
function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CONFIG.cartStorageKey)) || [];
  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CONFIG.cartStorageKey, JSON.stringify(cart));
  } catch (error) {
    /* penyimpanan browser tidak tersedia, abaikan */
  }
}

/* ---------- 2. Menu mobile ---------- */
function initMobileMenu() {
  const menuBtn = document.getElementById('menuBtn');
  const mainNav = document.getElementById('mainNav');
  if (!menuBtn || !mainNav) return;

  function setOpen(isOpen) {
    mainNav.classList.toggle('open', isOpen);
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    menuBtn.textContent = isOpen ? '✕' : '☰';
  }

  menuBtn.addEventListener('click', function () {
    setOpen(!mainNav.classList.contains('open'));
  });

  // Tutup menu setelah salah satu link diklik
  mainNav.addEventListener('click', function (event) {
    if (event.target.closest('a')) setOpen(false);
  });

  // Tutup menu dengan tombol Esc
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') setOpen(false);
  });

  // Reset saat layar diperbesar kembali ke desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth > 850) setOpen(false);
  });
}

/* ---------- 3. Keranjang ---------- */
function updateCartCount() {
  const counter = document.getElementById('cartCount');
  if (!counter) return;
  const total = readCart().reduce(function (sum, item) { return sum + item.qty; }, 0);
  counter.textContent = 'Keranjang: ' + total;
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(function () {
    toast.classList.remove('show');
  }, CONFIG.toastDuration);
}

function addToCart(name, price) {
  const cart = readCart();
  const existing = cart.find(function (item) { return item.name === name; });
  if (existing) existing.qty += 1;
  else cart.push({ name: name, price: price, qty: 1 });

  saveCart(cart);
  updateCartCount();
  showToast(name + ' ditambahkan ke keranjang ✓');
}

function initCart() {
  updateCartCount();
  // Satu listener untuk semua tombol "Tambah ke Keranjang"
  document.addEventListener('click', function (event) {
    const button = event.target.closest('.add');
    if (!button) return;
    addToCart(button.dataset.name, Number(button.dataset.price));
  });
}

/* ---------- 4. Pencarian & filter produk ---------- */
function initProductFilter() {
  const search = document.getElementById('searchProducts');
  const filter = document.getElementById('filter');
  const products = document.querySelectorAll('#products .product');
  if (!search || !filter) return;

  function applyFilter() {
    const query = search.value.trim().toLowerCase();
    const category = filter.value;

    products.forEach(function (product) {
      // Pencarian mengecek nama produk dan kategorinya
      const searchable = (product.dataset.name + ' ' + product.dataset.category).toLowerCase();
      const nameMatch = searchable.includes(query);
      const categoryMatch = category === 'all' || product.dataset.category === category;
      const show = nameMatch && categoryMatch;
      product.hidden = !show;
    });
  }

  search.addEventListener('input', applyFilter);
  filter.addEventListener('change', applyFilter);
}

/* ---------- 5. Formulir kontak ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const body =
      'Nama: ' + document.getElementById('nama').value + '\n' +
      'Email: ' + document.getElementById('email').value + '\n' +
      'Keperluan: ' + document.getElementById('keperluan').value + '\n' +
      'Pesan: ' + document.getElementById('pesan').value;

    window.location.href =
      'mailto:' + CONFIG.contactEmail +
      '?subject=' + encodeURIComponent('Pesan dari website ATKGO.ID') +
      '&body=' + encodeURIComponent(body);
  });
}

/* ---------- Jalankan semua ---------- */
document.addEventListener('DOMContentLoaded', function () {
  initMobileMenu();
  initCart();
  initProductFilter();
  initContactForm();
});
