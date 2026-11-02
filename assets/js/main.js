import { getProducts, getProductById, addProduct, updateProduct, deleteProduct, calculateTotalValuation } from './module/service.js';
import { validateProduct } from './module/validator.js';
import { renderCatalog, renderTotal, renderErrors, showNotification } from './module/ui-renderer.js';

// FUNGSI KUNCI EFEK REAL-TIME: 
// Fungsi ini akan menyapu bersih tabel lama dan merender ulang data terbaru dari memori
const refreshUI = () => {
    const products = getProducts();
    renderCatalog(products, 'product-grid');
    const totalValuation = calculateTotalValuation();
    renderTotal(calculateTotalValuation(), 'total-valuation');
    console.log("Data Produk saat ini di memori:", products);
    console.log("Total Valuasi Aset Saat Ini: Rp ", totalValuation.toLocaleString('id-ID'));
};

// Helper: Kembalikan Form ke Mode Tambah Default (Dengan Pengaman Null)
const resetFormMode = () => {
    const form = document.getElementById('product-form');
    if (form) {
        form.reset();
        delete form.dataset.editId;
    }

    const formTitle = document.getElementById('form-title');
    if (formTitle) formTitle.textContent = 'Tambah Produk Baru';

    const btnSubmit = document.getElementById('btn-submit');
    if (btnSubmit) btnSubmit.textContent = 'Simpan Produk';

    const btnCancel = document.getElementById('btn-cancel');
    if (btnCancel) btnCancel.style.display = 'none';

    if (typeof renderErrors === 'function') {
        renderErrors({ name: '', price: '' }); // Bersihkan pesan error jika ada
    }
};

// Event Listeners Lifecycle
document.addEventListener('DOMContentLoaded', () => {
    // 1. Render data pertama kali saat halaman dibuka
    refreshUI();

    const form = document.getElementById('product-form');
    const grid = document.getElementById('product-grid');
    const btnCancel = document.getElementById('btn-cancel');

    // ==========================================
    // 2. EVENT HANDLING: Submit Form (Mode Tambah & Update)
    // ==========================================
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('product-name').value;
        const category = document.getElementById('product-category').value;
        const price = Number(document.getElementById('product-price').value);
        const editId = form.dataset.editId; // Cek apakah sedang mode Edit

        // Validasi form
        const validation = validateProduct(name, price);
        renderErrors(validation.errors);

        // Jika lolos validasi
        if (validation.isValid) {
            if (editId) {
                // AKSI: UPDATE DATA
                updateProduct(parseInt(editId), { name, category, price });
                showNotification('Produk berhasil diperbarui!', 'success');
                console.log(`Produk dengan ID ${editId} telah diperbarui.`);
            } else {
                // AKSI: TAMBAH DATA BARU
                const newProduct = { id: Date.now(), name, category, price };
                addProduct(newProduct);
                showNotification('Produk baru berhasil ditambahkan!', 'success');
                console.log('Produk baru ditambahkan:', newProduct);
            }

            // KEMBALIKAN KE MODE AWAL & RENDER ULANG (REAL-TIME)
            resetFormMode();
            refreshUI(); // <--- Baris ini yang membuat tampilannya Real-Time!
        }
    });

    // ==========================================
    // 3. EVENT HANDLING: Tombol Batal Edit
    // ==========================================
    btnCancel.addEventListener('click', () => {
        resetFormMode();
        showNotification('Batal mengedit produk.', 'info');
    });

    // ==========================================
    // 4. EVENT DELEGATION: Aksi Hapus dan Edit pada Grid Kartu
    // ==========================================
    grid.addEventListener('click', (event) => {
        const target = event.target;

        // Pastikan yang diklik adalah tombol aksi
        if (!target.classList.contains('btn-action')) return;

        const productId = Number(target.dataset.id);


        // JIKA KLIK TOMBOL HAPUS
        if (target.classList.contains('btn-delete')) {
            if (confirm('Yakin ingin menghapus produk ini?')) {
                // AKSI: HAPUS DATA
                deleteProduct(productId);
                showNotification('Produk berhasil dihapus!', 'danger');
                console.log(`Produk dengan ID ${productId} telah dihapus.`);

                // RENDER ULANG (REAL-TIME)
                refreshUI(); // <--- Baris ini yang membuat produk langsung hilang!

                // Jika produk yang sedang diedit ternyata dihapus, bersihkan form
                if (form.dataset.editId == productId) resetFormMode();
            }
        }
        // JIKA KLIK TOMBOL EDIT
        else if (target.classList.contains('btn-edit')) {
            const product = getProductById(productId);
            if (product) {
                // Isi input dengan data lama
                document.getElementById('product-name').value = product.name;
                document.getElementById('product-category').value = product.category;
                document.getElementById('product-price').value = product.price;

                // Ubah status antarmuka form menjadi Mode Edit
                form.dataset.editId = product.id;
                const formTitle = document.getElementById('form-title');
                if (formTitle) formTitle.textContent = 'Edit Produk';

                const btnSubmit = document.getElementById('btn-submit');
                if (btnSubmit) btnSubmit.textContent = 'Update Data';

                if (btnCancel) btnCancel.style.display = 'block';

                // Animasi scroll halus ke arah form
                form.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    // ==========================================
    // 5. EVENT HANDLING: Pencarian Produk (Filter Real-Time)
    // ==========================================
    // Ambil elemen input pencarian
    const searchInput = document.getElementById('search-input');

    // EVENT HANDLING: Pencarian Produk (Real-time Filter)
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            // Ambil teks yang diketik pengguna dan ubah ke huruf kecil
            const keyword = event.target.value.toLowerCase();
            
            // Ambil seluruh data produk dari memori
            const allProducts = getProducts();
            
            // Gunakan HOF .filter() untuk mencocokkan nama produk
            const filteredProducts = allProducts.filter(product => 
                product.name.toLowerCase().includes(keyword)
            );
            
            // Render ulang grid produk HANYA dengan data hasil filter
            renderCatalog(filteredProducts, 'product-grid');
        });
    }
});