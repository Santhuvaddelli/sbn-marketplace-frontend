import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhoneVolume } from "@fortawesome/free-solid-svg-icons";
import api from "../api/axios";
import { toast } from "react-toastify";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Loader from "./Loader";

export default function SingleProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [mainMedia, setMainMedia] = useState(null);
  const [tab, setTab] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Helper to convert slug back to name for API call
  const deSlug = (text) => text?.replace(/-/g, " ");
  // Helper to slugify for links
  const makeSlug = (text) => text?.toLowerCase().replace(/\s+/g, "-");

  // Enquiry Form State
  const [enquiry, setEnquiry] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  })
  const handleEnquiry = (e) => {
    setEnquiry({
      ...enquiry,
      [e.target.name]: e.target.value
    });
  }
  const handleEnquirySubmit = async () => {
    if (!validateRequiredFields()) return;
    if (!validateNameFormat()) return;
    if (!validatePhoneFormat()) return;
    if (!validateEmailFormat()) return;
    if (!product?._id) {
      return;
    }
    if (!enquiry.name || !enquiry.phone || !enquiry.email || !enquiry.message) {
      toast.info("Please fill all the fields");
      return;
    }
    try {
      await api.post("/enquiry/createEnquiry", {
        ...enquiry,
        productId: product._id,
      });
      toast.success("Enquiry sent Successfully");
      setEnquiry({
        name: "",
        phone: "",
        email: "",
        message: ""
      })
    }
    catch (error) {
      toast.error("Failed to Send Enquiry");
    }
  }

  // Handle Required Fields Data
  const validateRequiredFields = () => {
    const requiredFields = [
      { key: "name", label: "Name" },
      { key: "phone", label: "Phone Number" },
      { key: "email", label: "Email Address" }
    ]
    for (let field of requiredFields) {
      if (!enquiry[field.key] || enquiry[field.key].trim() === "") {
        toast.error(`${field.label} is required`);
        return false;
      }
    }
    return true;
  }
  const validateNameFormat = () => {
    const nameRegEx = /^[A-Za-z\s]+$/;
    if (!nameRegEx.test(enquiry.name.trim())) {
      toast.error("Name must contain only letters");
      return false;
    }
    return true;
  };
  const validatePhoneFormat = () => {
    const phoneRegEx = /^\+?\d{10,14}$/;

    if (!phoneRegEx.test(enquiry.phone.trim())) {
      toast.error("Enter valid phone number (with country code if needed)");
      return false;
    }

    return true;
  };
  const validateEmailFormat = () => {
    const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegEx.test(enquiry.email.trim())) {
      toast.error("Enter a valid email address");
      return false;
    }
    return true;
  };

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const name = deSlug(slug);
        const { data } = await api.get(`/product/details/${name}`);
        setProduct(data);

        if (data && data.media && data.media.length > 0) {
          setMainMedia(data.media[0].url);
        }

        // Fetch related products (same segment)
        if (data && data.segmentId) {
          const res = await api.get(`/product/allProducts`); // Or filtering endpoint if available
          // Client side filter for demo, optimally create /product/related/:id endpoint
          const related = res.data.filter(p => p.segmentId === data.segmentId && p._id !== data._id);
          setRelatedProducts(related.slice(0, 4));
        }

      } catch (err) {
        console.error("Failed to fetch product", err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return <Loader />;
  if (!product) return <div className="no-product">Product Not Found</div>;

  return (
    <div className="single-wrapper">
      {/* TOP SECTION: Gallery + Info + Form */}
      <div className="mobile-back" onClick={() => window.history.back()}>
        <ArrowLeftIcon style={{ width: '20px', height: '20px' }} />
      </div>
      <div className="single-top">

        {/* LEFT: THUMBS */}
        <div className="thumbs-column">
          {product.media?.map((item, i) => (
            <div
              key={i}
              className={`thumb-box ${mainMedia === item.url ? "active-thumb" : ""}`}
              onMouseEnter={() => window.innerWidth > 768 && setMainMedia(item.url)}
              onClick={() => setMainMedia(item.url)}
            >
              {item.resourceType === 'video' ? (
                <video src={item.url} className="thumb-img" muted />
              ) : (
                <img src={item.url} className="thumb-img" alt="thumb" />
              )}
            </div>
          ))}
        </div>

        {/* CENTER-LEFT: SMALLER MAIN IMAGE */}
        <div className="image-display">
          {mainMedia?.endsWith('.mp4') || mainMedia?.endsWith(".webm") || product.media?.find(m => m.url === mainMedia)?.resourceType === 'video' ? (
            <video src={mainMedia} controls autoPlay muted className="main-media"></video>
          ) : (
            <img src={mainMedia} alt={product.name} className="main-media" />
          )}
        </div>

        {/* CENTER-RIGHT: PRODUCT DETAILS */}
        <div className="product-details-side">
          <div className="brand-tag">{product.brand}</div>
          <h2>{product.name}</h2>
          <div className="small-price">₹ {product.price?.toLocaleString()}</div>

          <div className="mini-specs">
            {product.specifications && Object.entries(product.specifications).slice(0, 4).map(([k, v], i) => (
              <div key={i} className="mini-spec-line">
                <span className="key">{k}:</span> <span className="val">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: COMPACT ENQUIRE BOX */}
        <div className="enquiry-sidebar">
          <div className="compact-form">
            <div className="form-head">
              <FontAwesomeIcon icon={faPhoneVolume} />
              <span>Enquire Now</span>
            </div>
            <input placeholder="Full Name *" className="small-input" onChange={handleEnquiry} name="name" value={enquiry.name} />
            <input placeholder="Mobile *" className="small-input" onChange={handleEnquiry} name="phone" value={enquiry.phone} />
            <input placeholder="Email *" className="small-input" onChange={handleEnquiry} name="email" value={enquiry.email} />
            <textarea placeholder="Message" className="small-text" onChange={handleEnquiry} name="message" value={enquiry.message}></textarea>
            <button className="small-btn" onClick={handleEnquirySubmit}>Submit Enquiry</button>
          </div>
        </div>
      </div>

      {/* CENTERED DESCRIPTION & SPECS */}
      <div className="center-info-section">
        <div className="tab-menu">
          <span className={tab === "desc" ? "active" : ""} onClick={() => setTab("desc")}>Description</span>
          <span className={tab === "spec" ? "active" : ""} onClick={() => setTab("spec")}>Specifications</span>
        </div>
        <div className="tab-panel">
          {tab === "desc" ? (
            <p className="small-desc">{product.description}</p>
          ) : (
            <table className="mini-table">
              <tbody>
                {product.specifications && Object.entries(product.specifications).map(([k, v], i) => (
                  <tr key={i}>
                    <td>{k}</td>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <div className="related-section">
        <h3>Related Products</h3>
        <div className="related-grid">
          {relatedProducts.map((p) => (
            <Link to={`/product/${makeSlug(p.name)}`} key={p._id} className="related-item">
              <img src={p.media?.[0]?.url} alt={p.name} />
              <h4>{p.name}</h4>
              <p>₹{p.price?.toLocaleString()}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}