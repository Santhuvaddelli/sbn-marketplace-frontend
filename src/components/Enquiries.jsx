import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import "../Enquiries.css";

export default function Enquiries() {
    const [enquiries, setEnquiries] = useState([]);
    const slugify = (text) =>
        text.toLowerCase().trim().replace(/\s+/g, "-");

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await api.get("/enquiry/myEnquiries", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEnquiries(res.data || []);
        } catch (err) {
            console.error("Error fetching enquiries:", err);
            setEnquiries([]);
        }
    };

    return (
        <div className="enquiries-page">
            {/* HEADER */}
            <div className="enquiries-header">
                <h2>Customer Enquiries</h2>
            </div>

            {/* TABLE */}
            <div className="enquiries-container">
                <table className="enquiries-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Customer</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Message</th>
                            <th>Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        {enquiries.length > 0 ? (
                            enquiries.map((e) => (
                                <tr key={e._id}>
                                    {/* PRODUCT */}
                                    <td>
                                        {e.productId ? (
                                            <Link
                                                to={`/product/${slugify(e.productId.name)}`}
                                                className="product-link"
                                            >
                                                {e.productId.media?.[0]?.url && (
                                                    <img
                                                        src={e.productId.media[0].url}
                                                        alt=""
                                                        className="table-thumb"
                                                    />
                                                )}
                                                <span>{e.productId.name}</span>
                                            </Link>
                                        ) : (
                                            <span className="text-muted">Deleted Product</span>
                                        )}
                                    </td>

                                    {/* CUSTOMER */}
                                    <td>{e.name}</td>

                                    {/* EMAIL */}
                                    <td>
                                        <a href={`mailto:${e.email}`} className="contact-link">
                                            {e.email}
                                        </a>
                                    </td>

                                    {/* PHONE */}
                                    <td>
                                        <a href={`tel:${e.phone}`} className="contact-link">
                                            {e.phone}
                                        </a>
                                    </td>

                                    {/* MESSAGE */}
                                    <td>
                                        <div className="message-content">
                                            {e.message || "-"}
                                        </div>
                                    </td>

                                    {/* DATE */}
                                    <td className="date-col">
                                        {new Date(e.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="empty-row">
                                    No enquiries found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
