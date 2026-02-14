import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function ProductPage() {
  const { category, item, product: segment } = useParams();
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 768;
  const [products, setProducts] = useState([]);
  const [currentCat, setCurrentCat] = useState(null);
  const [currentSub, setCurrentSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const slug = (text) => text?.toLowerCase().replace(/\s+/g, "-");
  const deSlug = (text) => text?.replace(/-/g, " ");

  useEffect(() => {
    async function loadData() {
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

        // Fetch Data in Parallel:
        // 1. Products (from specific endpoint)
        // 2. Categories/SubCats/Segments (for the side menu/filtering UI)
        const [
          { data: fetchedProducts },
          { data: allCategories },
          { data: allSubCategories },
          { data: allSegments },
        ] = await Promise.all([
          api.get(productEndpoint),
          api.get("/categories"),
          api.get("/subcategories"),
          api.get("/segments"),
        ]);

        setProducts(fetchedProducts);

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

            // If we are deep in subcategory view, find that subcategory too
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
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [category, item, segment]);
  const formatTitle = (text) => {
    if (!text) return "";
    return text
      .replace(/-/g, " ") // Replace dashes with spaces
      .split(" ")         // Split into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
      .join(" ");        // Join back together
  };

  const title = formatTitle(segment || item || category);

  if (loading) return <div className="loading">Loading...</div>;

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