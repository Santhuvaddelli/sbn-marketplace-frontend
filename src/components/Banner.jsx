import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Banner() {
  const legalRef = useRef(null);
  const electronicRef = useRef(null);
  const exportRef = useRef(null);

  const [legal, setLegalProducts] = useState([]);
  const [electronics, setElectronicProducts] = useState([]);
  const [exportImp, setExportandimportProducts] = useState([]);
  const slugify = (text) =>
    text.toLowerCase().trim().replace(/\s+/g, "-");


  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const [legalRes, electronicsRes, exportImpRes] = await Promise.all([
          api.get("/product/category/legal"),
          api.get("/product/category/electronics"),
          api.get("/product/category/export-&-import"),
        ]);

        setLegalProducts(legalRes.data);
        setElectronicProducts(electronicsRes.data);
        setExportandimportProducts(exportImpRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 200; // Reduced scroll amount to match smaller cards
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="home-banner-wrapper">
        <div className="home-banner-container">
          <img src="/Home.jpg" alt="Home Banner" />
        </div>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h4>Loading latest products...</h4>
        </div>
      </div>
    );
  }

  return (
    <div className="home-banner-wrapper">
      <div className="home-banner-container">
        <img src="/Home.jpg" alt="Home Banner" />
      </div>

      {/* Legal Service Section */}
      <div className="legal-replica-section">
        <div className="legal-replica-header">
          <h4>Legal Services</h4>
          <div className="replica-controls">
            <button className="ctrl-btn" onClick={() => scroll(legalRef, "left")}>&#10094;</button>
            <button className="ctrl-btn" onClick={() => scroll(legalRef, "right")}>&#10095;</button>
          </div>
        </div>

        <div className="legal-replica-scroll" ref={legalRef}>
          {legal.map((service) => (
            <div key={service._id} className="replica-card">
              <div className="replica-card-top">
                <Link to={`/product/${slugify(service.name)}`} className="replica-enquire-btn">
                  <img src={service.media[0]?.url} alt={service.name} />
                </Link>
              </div>
              <div className="replica-card-bottom">
                <h3>{service.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Electronics Section */}
      <div className="legal-replica-section">
        <div className="legal-replica-header">
          <h4>Electronics</h4>
          <div className="replica-controls">
            <button className="ctrl-btn" onClick={() => scroll(electronicRef, "left")}>&#10094;</button>
            <button className="ctrl-btn" onClick={() => scroll(electronicRef, "right")}>&#10095;</button>
          </div>
        </div>

        <div className="legal-replica-scroll" ref={electronicRef}>
          {electronics.map((service) => (
            <div key={service._id} className="replica-card">
              <div className="replica-card-top">
                <Link to={`/product/${slugify(service.name)}`} className="replica-enquire-btn">
                  <img src={service.media[0]?.url} alt={service.name} />
                </Link>
              </div>
              <div className="replica-card-bottom">
                <h3>{service.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exports & Import Section */}
      <div className="legal-replica-section">
        <div className="legal-replica-header">
          <h4>Exports & Imports</h4>
          <div className="replica-controls">
            <button className="ctrl-btn" onClick={() => scroll(exportRef, "left")}>&#10094;</button>
            <button className="ctrl-btn" onClick={() => scroll(exportRef, "right")}>&#10095;</button>
          </div>
        </div>

        <div className="legal-replica-scroll" ref={exportRef}>
          {exportImp.map((service) => (
            <div key={service._id} className="replica-card">
              <div className="replica-card-top">
                <Link to={`/product/${slugify(service.name)}`} className="replica-enquire-btn">
                  <img src={service.media[0]?.url} alt={service.name} />
                </Link>
              </div>
              <div className="replica-card-bottom">
                <h3>{service.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}