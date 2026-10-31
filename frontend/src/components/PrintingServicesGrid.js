import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import './PrintingServicesGrid.css';

/**
 * 13 Services matching the exact reference UI design
 */
export const FALLBACK_PRINTING_SERVICES = [
  {
    _id: '1',
    name: 'VISITING CARDS',
    slug: 'visiting-cards',
    badge: null,
    image: 'https://res.cloudinary.com/dveqrjnui/image/upload/v1793427598/navodaya/services/visiting-cards.png'
  },
  {
    _id: '2',
    name: 'PAMPHLETS',
    slug: 'pamphlets',
    badge: null,
    image: 'https://res.cloudinary.com/dveqrjnui/image/upload/v1793427595/navodaya/services/pamphlets.png'
  },
  {
    _id: '3',
    name: 'ENVELOPES',
    slug: 'envelopes',
    badge: null,
    image: 'https://res.cloudinary.com/dveqrjnui/image/upload/v1793427592/navodaya/services/envelopes.png'
  },
  {
    _id: '4',
    name: 'Website Development',
    slug: 'website-development',
    badge: 'NEW',
    image: 'https://res.cloudinary.com/dveqrjnui/image/upload/v1793427599/navodaya/services/website-development.png'
  },
  {
    _id: '5',
    name: 'POSTERS',
    slug: 'posters',
    badge: null,
    image: 'https://res.cloudinary.com/dveqrjnui/image/upload/v1793427596/navodaya/services/posters.png'
  },
  {
    _id: '6',
    name: 'LETTER HEADS',
    slug: 'letter-heads',
    badge: null,
    image: 'https://res.cloudinary.com/dveqrjnui/image/upload/v1793427593/navodaya/services/letter-heads.png'
  },
  {
    _id: '7',
    name: 'DOCTOR FILES',
    slug: 'doctor-files',
    badge: null,
    image: 'https://res.cloudinary.com/dveqrjnui/image/upload/v1793427592/navodaya/services/doctor-files.png'
  },
  {
    _id: '8',
    name: 'ATM POUCH',
    slug: 'atm-pouch',
    badge: null,
    image: 'https://res.cloudinary.com/dveqrjnui/image/upload/v1793427589/navodaya/services/atm-pouch.png'
  },
  {
    _id: '9',
    name: 'Bill Book',
    slug: 'bill-book',
    badge: null,
    image: 'https://res.cloudinary.com/dveqrjnui/image/upload/v1793427590/navodaya/services/bill-book.png'
  },
  {
    _id: '10',
    name: 'SAMPLE FILES',
    slug: 'sample-files',
    badge: null,
    image: 'https://res.cloudinary.com/dveqrjnui/image/upload/v1793427597/navodaya/services/sample-files.png'
  },
  {
    _id: '11',
    name: 'NFC Cards',
    slug: 'nfc-cards',
    badge: 'NEW',
    image: 'https://res.cloudinary.com/dveqrjnui/image/upload/v1793427594/navodaya/services/nfc-cards.png'
  },
  {
    _id: '12',
    name: 'Brochures',
    slug: 'brochures',
    badge: null,
    image: 'https://res.cloudinary.com/dveqrjnui/image/upload/v1793427591/navodaya/services/brochures.png'
  },
  {
    _id: '13',
    name: 'Paper Bags',
    slug: 'paper-bags',
    badge: null,
    image: 'https://res.cloudinary.com/dveqrjnui/image/upload/v1793427595/navodaya/services/paper-bags.png'
  }
];

/**
 * Service Card replicating the exact reference UI card
 */
const ServiceCard = ({ item }) => {
  const [imageError, setImageError] = useState(false);
  const targetUrl = `/services/${item.slug || item._id}`;

  const imageSrc = item.image
    ? (item.image.startsWith('http://') || item.image.startsWith('https://') || item.image.startsWith('/')
        ? item.image
        : `/${item.image}`)
    : `/services/${item.slug}.png`;

  return (
    <Link
      to={targetUrl}
      aria-label={`View ${item.name}`}
      className="printing-service-card group"
    >
      {/* Top Image Container with aspect ratio matching reference */}
      <div className="printing-service-card-top">
        {/* Diagonal Orange Ribbon Badge for "NEW" */}
        {item.badge && (
          <div className="brandera-ribbon-wrapper" aria-label={`Badge: ${item.badge}`}>
            <div className="brandera-ribbon-badge">
              {item.badge}
            </div>
          </div>
        )}

        {!imageError ? (
          <img
            src={imageSrc}
            alt={item.name}
            loading="lazy"
            onError={() => setImageError(true)}
            className="printing-service-card-img"
          />
        ) : (
          <div className="printing-service-card-fallback">
            <i className="fas fa-print"></i>
            <span>{item.name}</span>
          </div>
        )}
      </div>

      {/* Bottom Text Area matching reference casing and padding */}
      <div className="printing-service-card-bottom">
        <h3 className="printing-service-card-title">
          {item.name}
        </h3>
      </div>
    </Link>
  );
};

/**
 * Reusable Our Printing Services Grid Component
 * Loads dynamically from database, with fallback to reference images
 */
const PrintingServicesGrid = ({
  title = 'Our Printing Services',
  accentColor = '#7025ec',
  className = '',
  showHeader = true
}) => {
  const [services, setServices] = useState(FALLBACK_PRINTING_SERVICES);

  useEffect(() => {
    let alive = true;
    api.get('/services')
      .then((res) => {
        if (alive && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setServices(res.data);
        }
      })
      .catch((err) => {
        console.warn('Using offline reference printing services:', err);
      });

    return () => { alive = false; };
  }, []);

  return (
    <section className={`printing-services-section ${className}`}>
      {/* 1. SECTION HEADER */}
      {showHeader && (
        <div className="printing-services-header">
          <h2 className="printing-services-title">
            {title}
          </h2>
          {/* Centered purple accent line beneath title */}
          <div
            className="printing-services-accent-line"
            style={{ backgroundColor: accentColor }}
          />
        </div>
      )}

      {/* 2. RESPONSIVE GRID LAYOUT: 6 on desktop, 3 on tablet, 2 on mobile */}
      <div className="printing-services-grid">
        {services.map((item) => (
          <ServiceCard key={item._id || item.slug} item={item} />
        ))}
      </div>
    </section>
  );
};

export default PrintingServicesGrid;
