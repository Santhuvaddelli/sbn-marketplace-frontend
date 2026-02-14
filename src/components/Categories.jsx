import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLayerGroup,
  faLaptopCode,
  faBolt,
  faMicrochip,
  faBuilding,
  faShieldHalved,
  faGlobe,
  faCakeCandles,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import MobileCategories from "./MobileCategories";
import api from "../api/axios";

const icons = {
  Software: faLaptopCode,
  Electrical: faBolt,
  Electronics: faMicrochip,
  Construction: faBuilding,
  "Safety & Security": faShieldHalved,
  "Export & Import": faGlobe,
  Bakery: faCakeCandles,
};

// Only these appear in top bar
const topBarCategories = [
  "Bakery",
  "Software",
  "Electrical",
  "Electronics",
  "Construction",
  "Safety & Security",
  "Export & Import",
];

export default function Categories() {
  const [openMenu, setOpenMenu] = useState(null);
  const [showMobileCats, setShowMobileCats] = useState(false);
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          { data: categories },
          { data: subcategories },
          { data: segments },
        ] = await Promise.all([
          api.get("/categories"),
          api.get("/subcategories"),
          api.get("/segments"),
        ]);

        // Transform flat data to nested structure expected by the component
        // Structure: { name: "Category", items: [{ title: "SubCategory", sub: ["Segment1", "Segment2"] }] }
        const nestedData = categories.map((cat) => {
          const relevantSubs = subcategories.filter(
            (sub) => sub.categoryId === cat._id
          );

          const items = relevantSubs.map((sub) => {
            const relevantSegs = segments.filter(
              (seg) => seg.subCategoryId === sub._id
            );

            return {
              title: sub.name,
              sub: relevantSegs.map((s) => s.name),
            };
          });

          return {
            name: cat.name,
            items: items,
          };
        });

        setAllCategories(nestedData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    fetchData();
  }, []);

  // Split categories
  const topCategories = allCategories.filter((c) =>
    topBarCategories.includes(c.name)
  );

  return (
    <div className="categories">
      {/* ===== ALL CATEGORIES ===== */}
      <div
        className={`mega ${openMenu === "mega" ? "open" : ""}`}
        onClick={() => {
          if (window.innerWidth <= 768) {
            setShowMobileCats(true);
          } else {
            setOpenMenu(openMenu === "mega" ? null : "mega");
          }
        }}
      >
        <FontAwesomeIcon icon={faLayerGroup} /> All Categories
        <div className="mega-panel">
          <div className="mega-col">
            {allCategories.map((cat, i) => (
              <div key={i} className="mega-item">
                <Link
                  to={`/products/${cat.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {cat.name}
                </Link>

                <div className="mega-sub">
                  {cat.items.map((sub, j) => (
                    <div key={j} className="mega-sub-item">
                      <Link
                        to={`/products/${cat.name
                          .toLowerCase()
                          .replace(/\s+/g, "-")}/${sub.title
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                      >
                        {sub.title}
                      </Link>

                      <div className="mega-sub-sub">
                        {sub.sub.map((seg, k) => (
                          <Link
                            key={k}
                            to={`/products/${cat.name
                              .toLowerCase()
                              .replace(/\s+/g, "-")}/${sub.title
                                .toLowerCase()
                                .replace(/\s+/g, "-")}/${seg
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")}`}
                          >
                            {seg}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== TOP BAR CATEGORIES ===== */}
      {topCategories.map((cat, i) => (
        <div key={i} className="normal">
          <FontAwesomeIcon icon={icons[cat.name]} />
          <Link
            to={`/products/${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {cat.name}
          </Link>

          <div className="normal-menu">
            {cat.items.map((item, j) => (
              <div key={j} className="normal-item">
                <Link
                  to={`/products/${cat.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}/${item.title
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                >
                  {item.title}
                </Link>

                <div className="normal-sub">
                  {item.sub.map((s, k) => (
                    <Link
                      key={k}
                      to={`/products/${cat.name
                        .toLowerCase()
                        .replace(/\s+/g, "-")}/${item.title
                          .toLowerCase()
                          .replace(/\s+/g, "-")}/${s
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                    >
                      {s}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {showMobileCats && (
        <MobileCategories
          categories={allCategories.map((c) => c.name)}
          onClose={() => setShowMobileCats(false)}
        />
      )}
    </div>
  );
}