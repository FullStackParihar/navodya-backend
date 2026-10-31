import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import StorefrontStyles from '../features/storefront/StorefrontStyles';
import PrintingServicesGrid from '../components/PrintingServicesGrid';
import StorefrontHeader from '../components/StorefrontHeader';
import '../components/PrintingServicesGrid.css';

/**
 * Individual Sub-Service Card matching the exact same card format as main services
 */
const SubServiceCard = ({ sub, serviceName, onSelect }) => {
  const [imageError, setImageError] = useState(false);

  const imageSrc = sub.image
    ? (sub.image.startsWith('http://') || sub.image.startsWith('https://') || sub.image.startsWith('/')
        ? sub.image
        : `/${sub.image}`)
    : 'https://res.cloudinary.com/dveqrjnui/image/upload/v1793427598/navodaya/services/visiting-cards.png';

  return (
    <div
      onClick={() => onSelect(sub)}
      className="printing-service-card group"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onSelect(sub); }}
      aria-label={`View details for ${sub.name}`}
    >
      {/* Top Image Container */}
      <div className="printing-service-card-top">
        {/* Price tag on sub-services */}
        {sub.price > 0 && (
          <span className="printing-service-price-tag">
            &#8377;{sub.price.toLocaleString('en-IN')}
          </span>
        )}

        {!imageError ? (
          <img
            src={imageSrc}
            alt={sub.name}
            loading="lazy"
            onError={() => setImageError(true)}
            className="printing-service-card-img"
          />
        ) : (
          <div className="printing-service-card-fallback">
            <i className="fas fa-layer-group"></i>
            <span>{sub.name}</span>
          </div>
        )}
      </div>

      {/* Bottom Text Area matching exact format with no text overlap */}
      <div className="printing-service-card-bottom">
        <h3 className="printing-service-card-title">
          {sub.name}
        </h3>
      </div>
    </div>
  );
};

export default function ServiceDetailPage() {
  const { slug } = useParams();

  const [service, setService] = useState(null);
  const [subServices, setSubServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected sub-service for detailed preview modal
  const [activeSubModal, setActiveSubModal] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    api.get(`/services/${slug}`)
      .then((res) => {
        if (!alive) return;
        if (res.success && res.data) {
          setService(res.data.service);
          setSubServices(res.data.subServices || []);
        }
      })
      .catch((err) => {
        console.error('Failed to load service details:', err);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => { alive = false; };
  }, [slug]);

  const handleInquireOrOrder = (sub) => {
    const text = encodeURIComponent(
      `Hello Brandera! I am interested in ordering: ${service?.name} - ${sub.name} (₹${sub.price || 0}). Please provide quotation and timeline.`
    );
    window.open(`https://wa.me/919999999999?text=${text}`, '_blank');
  };

  return (
    <>
      <StorefrontStyles />
      <main className="sf min-h-screen bg-white">
        {/* Navigation Header */}
        <StorefrontHeader />

        {/* Breadcrumb Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-500">
            <Link to="/" className="hover:text-purple-600 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/services" className="hover:text-purple-600 transition-colors">Services</Link>
            <span>/</span>
            <span className="font-bold text-slate-800">{service?.name || 'Loading...'}</span>
          </div>
        </div>

        {/* SECTION HEADER: Replicating reference layout format */}
        <div className="printing-services-header pt-6 pb-2">
          <h1 className="printing-services-title uppercase">
            {service?.name || 'Our Printing Services'}
          </h1>
          <div className="printing-services-accent-line"></div>
          <p className="printing-services-subtitle">
            {service?.description || 'Browse all premium designs and variations below. Tap any design to view full specifications, pricing, and place your order.'}
          </p>
        </div>

        {/* SUB-SERVICES GRID: Exactly matching the 6-col / 3-col / 2-col reference layout */}
        <section className="printing-services-section pt-4 pb-14">
          {loading ? (
            <div className="py-20 text-center text-slate-400">Loading designs &amp; variations...</div>
          ) : subServices.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-200 max-w-lg mx-auto">
              <i className="fas fa-layer-group text-4xl text-slate-300 mb-3"></i>
              <h3 className="text-base font-bold text-slate-800">Custom Designs Available</h3>
              <p className="text-xs text-slate-500 mt-1 mb-5">
                We produce bespoke variations and bulk quantities for {service?.name}.
              </p>
              <Link to="/bulk-order" className="sf-primary rounded-full text-xs">
                Request Custom Order &rarr;
              </Link>
            </div>
          ) : (
            <div className="printing-services-grid">
              {subServices.map((sub) => (
                <SubServiceCard
                  key={sub._id || sub.slug}
                  sub={sub}
                  serviceName={service?.name}
                  onSelect={(selected) => setActiveSubModal(selected)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Sub-Service Details Modal */}
        {activeSubModal && (
          <div
            className="subservice-modal-backdrop"
            onClick={() => setActiveSubModal(null)}
          >
            <div
              className="subservice-modal-card"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="subservice-modal-close-btn"
                onClick={() => setActiveSubModal(null)}
                aria-label="Close modal"
              >
                &times;
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="aspect-[4/3] md:aspect-auto bg-slate-100 overflow-hidden">
                  <img
                    src={activeSubModal.image || `/services/${service?.slug}.png`}
                    alt={activeSubModal.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] uppercase font-extrabold tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
                      {service?.name}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2.5 leading-tight">
                      {activeSubModal.name}
                    </h2>

                    {activeSubModal.price > 0 && (
                      <div className="mt-3 text-2xl font-black text-slate-900 flex items-baseline gap-1">
                        &#8377;{activeSubModal.price.toLocaleString('en-IN')}
                        <span className="text-xs font-semibold text-slate-400">/ starting unit</span>
                      </div>
                    )}

                    <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                      {activeSubModal.description || 'Premium industrial printing quality with high-definition colors, custom cardstock, and protective lamination.'}
                    </p>

                    {activeSubModal.features && activeSubModal.features.length > 0 && (
                      <div className="mt-5">
                        <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-2">Specifications</h4>
                        <ul className="text-xs text-slate-600 space-y-1.5">
                          {activeSubModal.features.map((feat, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <span className="text-emerald-500 font-bold">&#10003;</span> {feat}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleInquireOrOrder(activeSubModal)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                    >
                      <i className="fab fa-whatsapp text-base"></i> Order via WhatsApp
                    </button>
                    <Link
                      to="/bulk-order"
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center transition-all text-center"
                    >
                      Bulk Inquiry
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Explore Other Printing Services at the bottom */}
        <section className="bg-slate-50/70 border-t border-slate-100 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PrintingServicesGrid
              title="Explore Other Printing Services"
              accentColor="#7025ec"
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="sf-footer">
          <div className="sf-footer-inner max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 gap-4">
            <p>&copy; {new Date().getFullYear()} Brand Era. All rights reserved. Design. Print. Brand. Deliver.</p>
            <div className="flex gap-4">
              <Link to="/services">All Services</Link>
              <Link to="/terms">Terms</Link>
              <Link to="/privacy-policy">Privacy</Link>
              <Link to="/faq">FAQ</Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
