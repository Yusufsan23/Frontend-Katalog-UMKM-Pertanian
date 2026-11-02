// Utilitas format uang
const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);

// Penggunaan HOF: .map() untuk merender elemen antarmuka
export const renderCatalog = (products, containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (products.length === 0) {
        container.innerHTML = `<p style="color: #757575;">Belum ada produk di etalase.</p>`;
        return;
    }

    // Pembaruan: Penambahan Tombol Edit di dalam Card
    container.innerHTML = products.map(p => `
        <article class="product-card">
            <span class="badge">${p.category}</span>
            <h3>${p.name}</h3>
            <p class="price">${formatRupiah(p.price)}</p>
            <div class="card-actions">
                <button class="btn-action btn-edit" data-id="${p.id}">Edit</button>
                <button class="btn-action btn-delete" data-id="${p.id}">Hapus</button>
            </div>
        </article>
    `).join('');
};

export const renderTotal = (total, elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = formatRupiah(total);
    }
};


export const renderErrors = (errors) => {
    const nameErr = document.getElementById('name-error');
    if (nameErr) nameErr.textContent = errors.name || '';

    const priceErr = document.getElementById('price-error');
    if (priceErr) priceErr.textContent = errors.price || '';
};

// Fitur Baru: Menampilkan Notifikasi Toast (Melayang)
export const showNotification = (message, type = 'success') => {
    const toast = document.getElementById('toast-container');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast ${type} show`;

    // Hilangkan otomatis setelah 3 detik
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
};
