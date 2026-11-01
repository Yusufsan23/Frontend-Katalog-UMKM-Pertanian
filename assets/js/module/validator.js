export const validateProduct = (name, price) => {
    let isValid = true;
    const errors = { name: '', price: '' };

    if (!name.trim()) {
        errors.name = '⚠ Nama produk wajib diisi.';
        isValid = false;
    }

    if (!price || isNaN(price) || price <= 0) {
        errors.price = '⚠ Harga tidak valid. Harus berupa angka > 0.';
        isValid = false;
    }

    return { isValid, errors };
};