import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../MyProducts.css";

export default function MyProducts() {
    const [products, setProducts] = useState([]);
    const [deleteId, setDeleteId] = useState(null);
    const navigate = useNavigate();
    const slugify = (text) =>
        text.toLowerCase().trim().replace(/\s+/g, "-");

    useEffect(() => {
        fetchMyProducts();
    }, []);

    const fetchMyProducts = async () => {
        const token = localStorage.getItem("accessToken");
        try {
            const res = await api.get("/product/myProducts", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const confirmDelete = async () => {
        const token = localStorage.getItem("accessToken");
        try {
            await api.delete("/product/deleteProduct", {
                params: { productId: deleteId },
                headers: { Authorization: `Bearer ${token}` },
            });
            setDeleteId(null);
            fetchMyProducts();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="my-products-container">
            {/* ===== HEADER ===== */}
            <div className="products-header">
                <h2>My Products</h2>
                <button
                    className="add-product-btn"
                    onClick={() => navigate("/home/add-product")}
                >
                    + Add Product
                </button>
            </div>

            {/* ===== PRODUCTS GRID ===== */}
            {products.length ? (
                <div className="products-grid">
                    {products.map((prod) => (
                        <div key={prod._id} className="product-card">
                            <div
                                className="img-wrapper"
                                onClick={() => navigate(`/product/${slugify(prod.name)}`)}
                            >
                                <img src={prod.media?.[0]?.url} alt={prod.name} />
                            </div>

                            <div className="card-info">
                                <h3>{prod.name}</h3>
                                <p className="price">₹ {prod.price}</p>
                            </div>

                            <div className="card-actions">
                                <button
                                    className="action-btn edit"
                                    onClick={() =>
                                        navigate(`/home/add-product`, { state: { product: prod } })
                                    }
                                >
                                    Edit
                                </button>
                                <button
                                    className="action-btn delete"
                                    onClick={() => setDeleteId(prod._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <p>No products found.</p>
                </div>
            )}

            {/* ===== DELETE MODAL ===== */}
            {deleteId && (
                <div className="modal-overlay" onClick={() => setDeleteId(null)}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <h4>Are you sure you want to delete this product?</h4>
                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => setDeleteId(null)}>Cancel</button>
                            <button className="danger-btn" onClick={confirmDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
