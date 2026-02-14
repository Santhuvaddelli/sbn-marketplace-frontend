import { useState, useRef, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import api from "../api/axios";
import "../LoggedInLayout.css";

export default function LoggedInLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [user, setUser] = useState(null);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState(null);
    const [showResults, setShowResults] = useState(false);

    const menuRef = useRef(null);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => { fetchUser(); }, []);

    const fetchUser = async () => {
        try {
            const res = await api.get("/api/myProfile");
            setUser(res.data.user);
        } catch (err) { console.error("Error fetching initials:", err); }
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false);
            }
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowResults(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const logout = () => {
        setShowMenu(false); // <--- FIX: Close dropdown on click
        localStorage.removeItem("accessToken");
        navigate("/");
    };

    const handleProfileClick = () => {
        setShowMenu(false); // <--- FIX: Close dropdown on click
        navigate("/home/my-profile");
    };

    const getInitials = () => {
        if (!user) return "U";
        const first = user.firstName?.charAt(0) || "";
        const last = user.lastName?.charAt(0) || "";
        return (first + last).toUpperCase() || "U";
    };

    return (
        <div className="logged-layout">
            <div className="sticky-header-wrapper">
                <header className="header">
                    <div className="header-left-group">
                        <button
                            className={`sidebar-toggle-btn ${isSidebarOpen ? 'open' : ''}`}
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>

                        <div className="logo-box">
                            <img src="/SBN_LOGO.jpeg" className="logo-img" alt="SBN Logo" />
                            <div className="logo-text">
                                <span className="sbn">SBN</span>
                                <h5 className="marketplace">Marketplace</h5>
                            </div>
                        </div>
                    </div>

                    <div className="search-box-wrapper" ref={searchRef}>
                        <div className="search-box">
                            <input
                                placeholder="Search..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <button><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                        </div>
                    </div>

                    <div className="header-right" ref={menuRef}>
                        <div className="avatar" onClick={() => setShowMenu(!showMenu)}>
                            {getInitials()}
                        </div>
                        {showMenu && (
                            <div className="dropdown">
                                {/* UPDATED: Closes menu before navigating */}
                                <div onClick={handleProfileClick}>My Profile</div>
                                <div onClick={logout}>Logout</div>
                            </div>
                        )}
                    </div>
                </header>
            </div>

            <div className="logged-body">
                {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

                <aside className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>
                    <NavLink to="/home/dashboard" onClick={() => setIsSidebarOpen(false)}>Dashboard</NavLink>
                    <NavLink to="/home/my-products" onClick={() => setIsSidebarOpen(false)}>My Products</NavLink>
                    <NavLink to="/home/enquiries" onClick={() => setIsSidebarOpen(false)}>Enquiries</NavLink>
                </aside>

                <main className="dashboard-content">
                    <div className="outlet-wrapper">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}