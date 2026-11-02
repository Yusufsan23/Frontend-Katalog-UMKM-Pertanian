export const validateProduct = (name, price) => {
    let isValid = true;
    const errors = { name: '', price: '' };

    if (!name.trim()) {
        errors.name = '⚠ Nama produk wajib diisi.';
        isValid = false;
        console.log('Validasi Gagal: Nama produk kosong.');
    }

    if (!price || isNaN(price) || price <= 0) {
        errors.price = '⚠ Harga tidak valid. Harus berupa angka > 0.';
        isValid = false;
        console.log(`Validasi Gagal: Harga yang dimasukkan adalah ${price}`);
    }

    return { isValid, errors };
};