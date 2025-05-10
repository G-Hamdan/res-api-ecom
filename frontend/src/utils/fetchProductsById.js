const uri = "http://localhost:3000/api/products/seeProductId"


export const fetchProductById = async (_id) => {
    try {
        const response = await fetch(`${uri}/${_id}`); // Dynamically append the product ID to the URL
        if (!response.ok) {
            throw new Error("Failed to fetch product details");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching product:", error);
        throw error;
    }
};