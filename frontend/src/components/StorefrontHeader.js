import React, { useState } from "react";
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
        </nav>

        <div className="sf-header-actions">
          <Link
            to="/search"
            style={{ fontSize: "24px", display: "inline-flex", alignItems: "center" }}
          >
            &#8981;
          </Link>
          {isAdmin && (
            <Link
              to="/admin-profile"
              style={{ display: "inline-flex", alignItems: "center", color: "#e63322", fontWeight: "bold" }}
            >
              &#128081; Admin
            </Link>
          )}
          <Link to="/account" style={{ display: "inline-flex", alignItems: "center" }}>
            Account
          </Link>
          <Link to="/cart" className="sf-cart-link" aria-label="Cart">
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
          style={{ position: "fixed", inset: 0, zIndex: 99 }}
        />
      )}
    </>
  );
};

export default StorefrontHeader;
