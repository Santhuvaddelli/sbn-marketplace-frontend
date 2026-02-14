import { Link } from "react-router-dom";

export default function MobileCategories({ onClose, categories }) {
  return (
    <div className="mobile-cat-overlay">
      <button className="mobile-close" onClick={onClose}>✕</button>

      <div className="mobile-cat-list">
        {categories.map((cat, i) => (
          <Link
            key={i}
            to={`/products/${cat.toLowerCase().replace(/\s+/g, "-")}`}
            className="mobile-cat-item"
            onClick={onClose}
          >
            {cat}
          </Link>
        ))}
      </div>
    </div>
  );
}
