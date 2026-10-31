import React from 'react';
import { Link } from 'react-router-dom';
import PrintingServicesGrid from '../components/PrintingServicesGrid';
import StorefrontStyles from '../features/storefront/StorefrontStyles';
import StorefrontHeader from '../components/StorefrontHeader';

const ServicesPage = () => {

  return (
    <>
      <StorefrontStyles />
      <main className="sf min-h-screen bg-slate-50">
        {/* Header */}
        <StorefrontHeader />

        {/* Hero Section */}
        <section className="sf-category-hero bg-slate-900 text-white text-center py-16 px-4">
          <p className="sf-kicker text-purple-400 font-bold uppercase tracking-wider text-xs">Custom Printing & Solutions</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mt-3 tracking-tight">
            Brandera Services
          </h1>
          <p className="max-w-2xl mx-auto mt-4 text-slate-300 text-base sm:text-lg">
            High-precision printing, premium business stationery, custom apparel, and next-generation smart NFC products tailored for your brand.
          </p>
        </section>

        {/* Brandera Services Reusable Grid */}
        <section className="bg-white py-6">
          <PrintingServicesGrid 
            title="Our Printing Services"
            accentColor="#7025ec"
            showHeader={true}
          />
        </section>

        {/* Bulk & Custom Inquiry CTA */}
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <div className="brandera-cta-banner">
            <h2>Need Custom Sizing or Bulk Quantities?</h2>
            <p>
              Get personalized rates, dedicated print manager support, and sample kits delivered right to your office.
            </p>
            <div className="cta-buttons-wrap">
              <Link to="/bulk-order" className="btn-cta-primary">
                Request Bulk Quote &rarr;
              </Link>
              <Link to="/print-studio" className="btn-cta-secondary">
                Open Print Studio
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="sf-footer">
          <div className="sf-footer-inner max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 gap-4">
            <p>&copy; {new Date().getFullYear()} Brand Era. All rights reserved. Design. Print. Brand. Deliver.</p>
            <div className="flex gap-4">
              <Link to="/terms">Terms</Link>
              <Link to="/privacy-policy">Privacy</Link>
              <Link to="/faq">FAQ</Link>
              <Link to="/about-us">About Us</Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
};

export default ServicesPage;
