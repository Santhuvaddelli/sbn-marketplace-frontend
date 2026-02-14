import { useEffect, useState } from "react";
import "../AddProduct.css";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

export default function AddProduct() {
    const navigate = useNavigate();
    const location = useLocation();
    const editProduct = location.state?.product || null;

    // Data States
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [segments, setSegments] = useState([]); // All segments

    // Selection States
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("");

    // Form State
    const [form, setForm] = useState({
        name: "",
        brand: "",
        price: "",
        description: "",
        segmentId: "",
    });

    const [specs, setSpecs] = useState([{ key: "", value: "" }]);
    const [files, setFiles] = useState([]);
    const [existingMedia, setExistingMedia] = useState([]); // Media to keep
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 🔹 Fetch All Data on Mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const headers = { Authorization: `Bearer ${token}` };

                const [catRes, subRes, segRes] = await Promise.all([
                    api.get("/categories", { headers }),
                    api.get("/subcategories", { headers }),
                    api.get("/segments", { headers })
                ]);

                setCategories(catRes.data);
                setSubcategories(subRes.data);
                setSegments(segRes.data);

                // If editing, initialize selection states and form
                if (editProduct) {
                    const segment = segRes.data.find(s => s._id === editProduct.segmentId);
                    if (segment) {
                        const subcategory = subRes.data.find(sub => sub._id === segment.subCategoryId);
                        if (subcategory) {
                            setSelectedCategory(subcategory.categoryId);
                            setSelectedSubcategory(subcategory._id);
                        }
                    }

                    setForm({
                        name: editProduct.name || "",
                        brand: editProduct.brand || "",
                        price: editProduct.price || "",
                        description: editProduct.description || "",
                        segmentId: editProduct.segmentId?._id || editProduct.segmentId || "",
                    });

                    setExistingMedia(editProduct.media || []);

                    if (editProduct.specifications) {
                        const loadedSpecs = Object.entries(editProduct.specifications).map(([key, value]) => ({ key, value }));
                        setSpecs(loadedSpecs.length > 0 ? loadedSpecs : [{ key: "", value: "" }]);
                    }
                }
            } catch (err) {
                console.error("Error fetching data", err);
            }
        };
        fetchData();
    }, [editProduct]);

    // 🔹 Derived Lists based on selections
    const filteredSubcategories = subcategories.filter(
        (sub) => sub.categoryId === selectedCategory
    );

    const filteredSegments = segments.filter(
        (seg) => seg.subCategoryId === selectedSubcategory
    );

    // 🔹 Handle text fields
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 🔹 Handle specifications
    const handleSpecChange = (index, field, value) => {
        const updated = [...specs];
        updated[index][field] = value;
        setSpecs(updated);
    };

    const addSpec = () => {
        setSpecs([...specs, { key: "", value: "" }]);
    };

    const removeSpec = (index) => {
        const updated = specs.filter((_, i) => i !== index);
        setSpecs(updated);
    };

    // 🔹 Handle file upload
    const handleFiles = (e) => {
        setFiles([...files, ...Array.from(e.target.files)]);
    };

    // 🔹 Remove existing media
    const removeExistingMedia = (index) => {
        setExistingMedia(existingMedia.filter((_, i) => i !== index));
    };

    // 🔹 Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure segmentId is a string if it's an object
        const finalSegmentId = typeof form.segmentId === 'object' ? form.segmentId._id : form.segmentId;

        if (!finalSegmentId) {
            toast.error("Please select a segment.");
            return;
        }

        setIsSubmitting(true);

        const token = localStorage.getItem("accessToken");

        // Convert specs to object
        const specObject = {};
        specs.forEach((s) => {
            if (s.key && s.value) {
                specObject[s.key] = s.value;
            }
        });

        try {
            let response;
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("brand", form.brand);
            formData.append("price", Number(form.price)); // Ensure number
            formData.append("description", form.description);
            formData.append("segmentId", finalSegmentId);
            formData.append("specifications", JSON.stringify(specObject));

            // Append new files
            files.forEach((file) => {
                formData.append("files", file);
            });

            if (editProduct) {
                // Also send remaining existing media info
                formData.append("existingMedia", JSON.stringify(existingMedia));

                response = await api.put(
                    `/product/updateProduct?productId=${editProduct._id}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                toast.success("✅ Product Updated Successfully!");
            } else {
                response = await api.post(
                    "/product/createProduct",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                toast.success("✅ Product Created Successfully!");
            }

            setTimeout(() => {
                navigate("/home/my-products");
            }, 500);
        } catch (err) {
            console.error("Error saving product:", err);
            toast.error(editProduct ? "❌ Error updating product" : "❌ Error creating product");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="add-product-wrapper">
            <div className="add-product-container">
                {isSubmitting ? (
                    <div className="loading-container-inplace">
                        <div className="loading-content">
                            <div className="rocket">🚀</div>
                            <h2 className="loading-title">Publishing Your Product...</h2>
                            <div className="loading-spinner">
                                <div className="spinner-dot"></div>
                                <div className="spinner-dot"></div>
                                <div className="spinner-dot"></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="form-header">
                            <h2>{editProduct ? "Edit Product" : "Add New Product"}</h2>
                        </div>

                        <form className="add-product-form" onSubmit={handleSubmit}>
                            {/* --- Product Details Section --- */}
                            <div className="form-section">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Product Name</label>
                                        <input
                                            name="name"
                                            value={form.name}
                                            placeholder="e.g. Wireless Headphones"
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Brand</label>
                                        <input
                                            name="brand"
                                            value={form.brand}
                                            placeholder="e.g. Sony"
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Price (₹)</label>
                                        <input
                                            name="price"
                                            value={form.price}
                                            type="number"
                                            placeholder="0.00"
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        placeholder="Describe your product..."
                                        onChange={handleChange}
                                        rows="4"
                                    />
                                </div>
                            </div>

                            {/* --- Categorization Section --- */}
                            <div className="form-section">
                                <h3>Categorization</h3>
                                <div className="form-grid-3">
                                    <div className="form-group">
                                        <label>Category</label>
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => {
                                                setSelectedCategory(e.target.value);
                                                setSelectedSubcategory("");
                                                setForm({ ...form, segmentId: "" });
                                            }}
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(cat => (
                                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Subcategory</label>
                                        <select
                                            value={selectedSubcategory}
                                            onChange={(e) => {
                                                setSelectedSubcategory(e.target.value);
                                                setForm({ ...form, segmentId: "" });
                                            }}
                                            disabled={!selectedCategory}
                                            required
                                        >
                                            <option value="">Select Subcategory</option>
                                            {filteredSubcategories.map(sub => (
                                                <option key={sub._id} value={sub._id}>{sub.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Segment</label>
                                        <select
                                            name="segmentId"
                                            value={form.segmentId}
                                            onChange={handleChange}
                                            disabled={!selectedSubcategory}
                                            required
                                        >
                                            <option value="">Select Segment</option>
                                            {filteredSegments.map(seg => (
                                                <option key={seg._id} value={seg._id}>{seg.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* --- Specifications Section --- */}
                            <div className="form-section">
                                <h3>Specifications</h3>
                                <div className="specs-container">
                                    {specs.map((spec, index) => (
                                        <div key={index} className="spec-row">
                                            <input
                                                placeholder="Key (e.g. Color)"
                                                value={spec.key}
                                                onChange={(e) => handleSpecChange(index, "key", e.target.value)}
                                            />
                                            <input
                                                placeholder="Value (e.g. Black)"
                                                value={spec.value}
                                                onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                                            />
                                            {specs.length > 1 && (
                                                <button type="button" className="remove-spec-btn" onClick={() => removeSpec(index)}>×</button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button type="button" className="add-spec-btn" onClick={addSpec}>
                                    + Add Another Field
                                </button>
                            </div>

                            {/* --- Media Section --- */}
                            <div className="form-section">
                                <h3>Media</h3>
                                <div className="file-upload">
                                    <input type="file" multiple onChange={handleFiles} id="fileInput" accept="image/*,video/*" />
                                    <label htmlFor="fileInput" className="file-label">
                                        <span>Click to Upload Images / Videos</span>
                                    </label>
                                </div>

                                {existingMedia.length > 0 && (
                                    <div className="file-previews">
                                        {existingMedia.map((item, index) => (
                                            <div key={index} className="file-preview-card">
                                                <div className="preview-media">
                                                    {item.resourceType === 'image' ? (
                                                        <img src={item.url} alt={`Existing ${index}`} />
                                                    ) : (
                                                        <div className="video-placeholder">
                                                            <span>▶</span>
                                                        </div>
                                                    )}
                                                    <button
                                                        type="button"
                                                        className="remove-file-btn"
                                                        onClick={() => removeExistingMedia(index)}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                                <p className="file-name">Existing Media {index + 1}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {files.length > 0 && (
                                    <div className="file-previews">
                                        {files.map((file, index) => (
                                            <div key={index} className="file-preview-card">
                                                <div className="preview-media">
                                                    {file.type.startsWith('image/') ? (
                                                        <img src={URL.createObjectURL(file)} alt={file.name} />
                                                    ) : (
                                                        <div className="video-placeholder">
                                                            <span>▶</span>
                                                        </div>
                                                    )}
                                                    <button
                                                        type="button"
                                                        className="remove-file-btn"
                                                        onClick={() => {
                                                            const updatedFiles = files.filter((_, i) => i !== index);
                                                            setFiles(updatedFiles);
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                                <p className="file-name" title={file.name}>{file.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="form-actions">
                                <button type="button" className="cancel-btn" onClick={() => navigate('/home/my-products')}>Cancel</button>
                                <button type="submit" className="submit-btn">{editProduct ? "Update Product" : "Publish Product"}</button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
