import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import "../Dashboard.css";

export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [enquiries, setEnquiries] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const headers = { Authorization: `Bearer ${token}` };

        api
            .get("/product/myProducts", { headers })
            .then((res) => setProducts(res.data))
            .catch(() => { });

        api
            .get("/enquiry/myEnquiries", { headers })
            .then((res) => setEnquiries(res.data))
            .catch(() => { });
    }, []);

    const recentProducts = products.slice(0, 3);
    const recentEnquiries = enquiries.slice(0, 3);

    return (
        <div className="dashboard-page">
            {/* ===== COUNT CARDS ===== */}
            <div className="count-row">
                <div className="count-card">
                    <span className="count-label">My Products</span>
                    <span className="count-value">{products.length}</span>
                </div>

                <div className="count-card">
                    <span className="count-label">My Enquiries</span>
                    <span className="count-value">{enquiries.length}</span>
                </div>
            </div>

            {/* ===== HALF SECTIONS ===== */}
            <div className="half-sections">
                {/* PRODUCTS */}
                <div className="section-box">
                    <div className="section-header">
                        <h4>Products</h4>
                        <Link to="/home/my-products" className="view-all-btn">
                            View all
                        </Link>
                    </div>

                    {recentProducts.length ? (
                        <table className="mini-table">
                            <tbody>
                                {recentProducts.map((p) => (
                                    <tr key={p._id}>
                                        <td className="cell-title">{p.name}</td>
                                        <td className="cell-meta">₹ {p.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="empty-text">No products added yet</p>
                    )}
                </div>

                {/* ENQUIRIES */}
                <div className="section-box">
                    <div className="section-header">
                        <h4>Enquiries</h4>
                        <Link to="/home/enquiries" className="view-all-btn">
                            View all
                        </Link>
                    </div>

                    {recentEnquiries.length ? (
                        <table className="mini-table">
                            <tbody>
                                {recentEnquiries.map((e) => (
                                    <tr key={e._id}>
                                        <td className="cell-title">{e.name}</td>
                                        <td className="cell-meta">{e.phone}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="empty-text">No enquiries yet</p>
                    )}
                </div>
            </div>
        </div>
    );
}
