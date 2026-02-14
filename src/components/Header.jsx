import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faCircleInfo, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Header() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        fetchResults();
      } else {
        setResults(null);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchResults = async () => {
    try {
      const res = await api.get(`/product/search?q=${query}`);
      setResults(res.data);
      setShowResults(true);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const handleResultClick = (type, item) => {
    setShowResults(false);
    setQuery("");
    const slugify = (text) => text?.toLowerCase().replace(/ /g, '-');

    if (type === 'product') {
      navigate(`/product/${slugify(item.name)}`);
    } else if (type === 'category') {
      navigate(`/products/${slugify(item.name)}`);
    } else if (type === 'subcategory') {
      const catSlug = slugify(item.categoryId?.name);
      const subSlug = slugify(item.name);
      navigate(`/products/${catSlug}/${subSlug}`);
    } else if (type === 'segment') {
      const catSlug = slugify(item.subCategoryId?.categoryId?.name);
      const subSlug = slugify(item.subCategoryId?.name);
      const segSlug = slugify(item.name);
      navigate(`/products/${catSlug}/${subSlug}/${segSlug}`);
    }
  };

  return (
    <header className="header">
      <div className="logo-box">
        <Link to="/"><img src="/SBN_LOGO.jpeg" className="logo-img" /></Link>

        <div className="logo-text">
          <div className="sbn">SBN</div>
          <div className="marketplace">Marketplace</div>
        </div>
      </div>

      <div className="search-box-wrapper" ref={searchRef}>
        <div className="search-box">
          <input
            placeholder="Search products, categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && setShowResults(true)}
          />
          <button><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
        </div>

        {showResults && results && (
          <div className="search-results-dropdown">
            {/* Products */}
            {results.products?.length > 0 && (
              <div className="search-section">
                <h4>Products</h4>
                {results.products.map(p => (
                  <div key={p._id} className="search-item" onClick={() => handleResultClick('product', p)}>
                    {p.name}
                  </div>
                ))}
              </div>
            )}

            {/* Categories */}
            {results.categories?.length > 0 && (
              <div className="search-section">
                <h4>Categories</h4>
                {results.categories.map(c => (
                  <div key={c._id} className="search-item" onClick={() => handleResultClick('category', c)}>
                    {c.name}
                  </div>
                ))}
              </div>
            )}

            {/* SubCategories */}
            {results.subcategories?.length > 0 && (
              <div className="search-section">
                <h4>Sub-categories</h4>
                {results.subcategories.map(s => (
                  <div key={s._id} className="search-item" onClick={() => handleResultClick('subcategory', s)}>
                    {s.name}
                  </div>
                ))}
              </div>
            )}

            {/* Segments */}
            {results.segments?.length > 0 && (
              <div className="search-section">
                <h4>Segments</h4>
                {results.segments.map(seg => (
                  <div key={seg._id} className="search-item" onClick={() => handleResultClick('segment', seg)}>
                    {seg.name}
                  </div>
                ))}
              </div>
            )}

            {!results.products?.length && !results.categories?.length &&
              !results.subcategories?.length && !results.segments?.length && (
                <div className="no-results">No results found for "{query}"</div>
              )}
          </div>
        )}
      </div>

      <div className="nav-links">
        <Link to="/member">
          <FontAwesomeIcon icon={faUserPlus} color="#0095ff" /> Become a Member
        </Link>
        <a href="#">
          <FontAwesomeIcon icon={faCircleInfo} color="#0095ff" /> About Us
        </a>
      </div>
    </header>
  );
}
