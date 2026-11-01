// Menggunakan localStorage untuk Data Persistence
let agriculturalProducts = JSON.parse(localStorage.getItem('umkm_products')) || [
    { id: 1, name: 'Bibit Jagung Manis Super', category: 'Bibit', price: 75000 },
    { id: 2, name: 'Pupuk NPK Organik', category: 'Pupuk', price: 120000 },
    { id: 3, name: 'Alat Penyemprot Hama', category: 'Alat Tani', price: 250000 }
];

const saveToStorage = () => localStorage.setItem('umkm_products', JSON.stringify(agriculturalProducts));

// Export Data Services
export const getProducts = () => agriculturalProducts;

// HOF Dasar: Array.find() untuk mencari data spesifik (Pembaruan Edit)
export const getProductById = (id) => {
    return agriculturalProducts.find(p => p.id === id);
};

export const addProduct = (product) => {
    agriculturalProducts.push(product);
    saveToStorage();
};

// Logika Pembaruan Data (Pembaruan Edit)
export const updateProduct = (id, updatedData) => {
    const index = agriculturalProducts.findIndex(p => p.id === id);
    if (index !== -1) {
        agriculturalProducts[index] = { ...agriculturalProducts[index], ...updatedData };
        saveToStorage();
    }
};

// Penggunaan HOF: .filter()
export const deleteProduct = (id) => {
    agriculturalProducts = agriculturalProducts.filter(p => p.id !== id);
    saveToStorage();
};

// Penggunaan HOF: .reduce()
export const calculateTotalValuation = () => {
    return agriculturalProducts.reduce((total, product) => total + product.price, 0);
};
