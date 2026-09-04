import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiActivity,
  FiCompass,
  FiAward,
  FiBell,
  FiUser,
  FiBookmark,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { label: "Home", href: "/", icon: <FiHome /> },
    { label: "Training Zone", href: "/dashboard", icon: <FiActivity /> },
    { label: "Explore", href: "#", icon: <FiCompass /> },
    { label: "Challenges", href: "#", icon: <FiAward /> },
    { label: "Notifications", href: "#", icon: <FiBell />, badge: 3 },
    { label: "Profile", href: "/profile", icon: <FiUser /> },
    { label: "Saved", href: "#", icon: <FiBookmark /> },
    { label: "Groups", href: "#", icon: <FiUsers /> },
    { label: "Settings", href: "#", icon: <FiSettings /> },
  ];

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="fitness-navbar">
      <div className="nav-container">
        <Link to="/" className="brand-logo" onClick={closeMenu}>
          <span className="brand-icon">⌁</span>

          <span className="brand-text">
            NAVCHETNA <span className="brand-accent">2.0</span>
          </span>

          <span className="brand-subtitle">FIT • CONNECT • GROW</span>
        </Link>

        <nav className={`nav-menu ${isOpen ? "active" : ""}`}>
          {menuItems.map((item) =>
            item.href === "#" ? (
              <button
                key={item.label}
                className="nav-link nav-button"
                onClick={() => alert(`${item.label} coming soon!`)}
              >
                <span className="nav-icon">{item.icon}</span>

                <span className="nav-label">{item.label}</span>

                {item.badge && (
                  <span className="notification-badge">
                    {item.badge}
                  </span>
                )}
              </button>
            ) : (
              <Link
                key={item.href}
                to={item.href}
                className={`nav-link ${
                  location.pathname === item.href ? "active-link" : ""
                }`}
                onClick={closeMenu}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            )
          )}
        </nav>

        <button className="logout-btn">
          <FiLogOut />
          <span>Log Out</span>
        </button>

        <button
          className="mobile-menu-btn"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;