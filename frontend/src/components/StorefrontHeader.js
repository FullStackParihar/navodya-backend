import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

/**
 * StorefrontHeader — shared navbar used across ALL storefront pages.
 * Keeps nav links (including "Services") consistent everywhere.
 */
const StorefrontHeader = () => {
  const location = useLocation();
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const close = () => setMenuOpen(false);

  // Close menu on route navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const userRole = localStorage.getItem("userRole") || "user";
  const isAdmin =
    userRole === "admin" ||
    localStorage.getItem("userEmail") === "admin@navodaya.com";

  const navLinks = [
    { to: "/products",     label: "Products" },
    { to: "/services",     label: "Services" },
    { to: "/alumni-kits",  label: "Solutions" },
    { to: "/print-studio", label: "Design Studio" },
    { to: "/bulk-order",   label: "Bulk Orders" },
  ];

  return (
    <>
      <header className="sf-header">
        <Link to="/" className="sf-logo" onClick={close}>
          <img src="/brlogo.png" alt="Brand Era" />
        </Link>

        <nav className={menuOpen ? "sf-nav-open" : ""}>
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={close}
              style={
                location.pathname === to ||
                location.pathname.startsWith(to + "/")
                  ? { color: "#e63322", fontWeight: 700 }
                  : {}
              }
            >
              {label}
            </Link>
          ))}

          {/* Mobile-accessible links */}
          <div className="sf-mobile-divider"></div>
          <div className="sf-mobile-extras">
            <Link to="/wishlist" onClick={close} className="sf-mobile-extra-link">
              <i className="fas fa-heart"></i>
              <span>Saved Products</span>
            </Link>
            <Link to="/account" onClick={close} className="sf-mobile-extra-link">
              <i className="fas fa-user"></i>
              <span>My Account</span>
            </Link>
            {isAdmin && (
              <Link to="/admin-profile" onClick={close} className="sf-mobile-extra-link sf-admin-link">
                <i className="fas fa-crown"></i>
                <span>Admin Panel</span>
              </Link>
            )}
          </div>
        </nav>

        <div className="sf-header-actions">
          <Link
            to="/search"
            className="sf-search-link"
            aria-label="Search"
            onClick={close}
          >
            <i className="fas fa-search"></i>
            <span className="sf-search-text">Search</span>
          </Link>
          {isAdmin && (
            <Link
              to="/admin-profile"
              className="sf-desktop-action"
              style={{ display: "inline-flex", alignItems: "center", color: "#e63322", fontWeight: "bold" }}
            >
              👑 Admin
            </Link>
          )}
          <Link to="/account" className="sf-desktop-action" style={{ display: "inline-flex", alignItems: "center" }}>
            Account
          </Link>
          <Link to="/cart" className="sf-cart-link" aria-label="Cart" onClick={close}>
            <i className="fas fa-shopping-cart"></i>
            {totalItems > 0 && <span className="sf-cart-badge">{totalItems}</span>}
          </Link>
          <button
            className={`sf-hamburger ${menuOpen ? "sf-hamburger-open" : ""}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {menuOpen && (
        <div
          className="sf-nav-backdrop"
          onClick={close}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default StorefrontHeader;