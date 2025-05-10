const uriAll = "https://res-api-ecom.onrender.com/api/products/seeProduct";

export const fetchProducts = async () => {
    try {
        const response = await fetch(uriAll);
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        console.log("Fetched products:", data);
        return data;
    } catch (error) {
        console.error("Error fetching products", error);
        throw error;
    }
};

