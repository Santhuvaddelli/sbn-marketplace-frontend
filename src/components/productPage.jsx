import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useData } from "../context/DataContext";
import api from "../api/axios";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Loader from "./Loader";

export default function ProductPage() {
  const { category, item, product: segment } = useParams();
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 768;
  const { categories: allCategories, subcategories: allSubCategories, segments: allSegments, loading: globalLoading } = useData();
  const [products, setProducts] = useState([]);
  const [currentCat, setCurrentCat] = useState(null);
  const [currentSub, setCurrentSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const slug = (text) => text?.toLowerCase().replace(/\s+/g, "-");
  const deSlug = (text) => text?.replace(/-/g, " ");

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        let productEndpoint = "/product/allProducts";
        if (segment) {
          productEndpoint = `/product/segment/${segment}`;
        } else if (item) {
          productEndpoint = `/product/subcategory/${item}`;
        } else if (category) {
          productEndpoint = `/product/category/${category}`;
        }

        const { data } = await api.get(productEndpoint);
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [category, item, segment]);

  useEffect(() => {
    if (!globalLoading && allCategories.length > 0) {
      if (category) {
        const categoryName = deSlug(category);
        const foundCategory = allCategories.find(
          (c) => c.name.toLowerCase() === categoryName.toLowerCase()
        );

        if (foundCategory) {
          const relatedSubCats = allSubCategories.filter(
            (s) => s.categoryId.toString() === foundCategory._id.toString()
          );
          setCurrentCat({ ...foundCategory, subcategories: relatedSubCats });

          if (item) {
            const subCategoryName = deSlug(item);
            const foundSubCategory = allSubCategories.find(
              (s) =>
                s.name.toLowerCase() === subCategoryName.toLowerCase() &&
                s.categoryId.toString() === foundCategory._id.toString()
            );

            if (foundSubCategory) {
              const relatedSegments = allSegments.filter(
                (seg) =>
                  seg.subCategoryId.toString() ===
                  foundSubCategory._id.toString()
              );
              setCurrentSub({ ...foundSubCategory, segments: relatedSegments });
            }
          }
        }
      }
    }
  }, [category, item, allCategories, allSubCategories, allSegments, globalLoading]);
  const formatTitle = (text) => {
    if (!text) return "";
    return text
      .replace(/-/g, " ") // Replace dashes with spaces
      .split(" ")         // Split into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
      .join(" ");        // Join back together
  };

  const title = formatTitle(segment || item || category);

  if (loading) return <Loader />;

  return (
    <div className="product-page-container">
      {isMobile && (
        <div className="mobile-prod-header">
          <button onClick={() => navigate(-1)}><ArrowLeftIcon style={{ width: '20px', height: '20px' }} /></button>
          <span>{title}</span>
        </div>
      )}

      {!isMobile && (
        <div className="product-banner">
          <img src="/ProductBanner.png" alt="Category Banner" />
        </div>
      )}

      {!isMobile && (
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          {category && (
            <>
              <span className="separator">❯</span>
              <Link to={`/products/${category}`}>
                {category.replace(/-/g, " ")}
              </Link>
            </>
          )}
          {item && (
            <>
              <span className="separator">❯</span>
              <Link to={`/products/${category}/${item}`}>
                {item.replace(/-/g, " ")}
              </Link>
            </>
          )}
          {segment && (
            <>
              <span className="separator">❯</span>
              <span className="current-page">
                {segment.replace(/-/g, " ")}
              </span>
            </>
          )}
        </nav>
      )}

      <div className="product-main-content">
        {isMobile && currentCat && (
          <div className="mobile-sub-scroll">
            {!item
              ? currentCat?.subcategories?.map((it, idx) => (
                <Link
                  key={idx}
                  to={`/products/${category}/${slug(it.name)}`}
                  className="mobile-sub-pill"
                >
                  {it.name}
                </Link>
              ))
              : currentSub?.segments?.map((s, idx) => (
                <Link
                  key={idx}
                  to={`/products/${category}/${item}/${slug(s.name)}`}
                  className="mobile-sub-pill"
                >
                  {s.name}
                </Link>
              ))}
          </div>
        )}

        {!isMobile && (
          <div className="segment-selector">
            <h3>
              {item
                ? `Explore ${item.replace(/-/g, " ")}`
                : "Select a Category"}
            </h3>
            <div className="desktop-sub-list">
              {!item &&
                currentCat?.subcategories?.map((it) => (
                  <Link
                    key={it._id}
                    to={`/products/${category}/${slug(it.name)}`}
                    className="desktop-sub-link"
                  >
                    {it.name}
                  </Link>
                ))}
              {item &&
                currentSub?.segments?.map((s) => (
                  <Link
                    key={s._id}
                    to={`/products/${category}/${item}/${slug(s.name)}`}
                    className="desktop-sub-link"
                  >
                    {s.name}
                  </Link>
                ))}
            </div>
          </div>
        )}

        {!isMobile && <hr className="section-divider" />}

        <div className="products-grid">
          {products.length > 0 ? (
            products.map((p) => (
              <Link
                key={p._id}
                to={`/product/${slug(p.name)}`}
                className="product-card"
              >
                <div className="product-img-wrapper">
                  <img src={p.media?.[0]?.url} alt={p.name} />
                </div>
                <div className="product-card-info">
                  <h4>{p.name}</h4>
                  <p className="product-price">
                    ₹{p.price?.toLocaleString()}
                  </p>
                  <div className="product-meta">{p.brand}</div>
                </div>
              </Link>
            ))
          ) : (
            <div className="no-products">
              <h2>No products found in this section.</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}