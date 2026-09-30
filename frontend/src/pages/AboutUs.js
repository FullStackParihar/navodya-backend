import React from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        {/* Breadcrumb */}
        <nav className="about-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="sep">/</span>
          <span>Company</span>
          <span className="sep">/</span>
          <span className="current">About Us</span>
        </nav>

        {/* Hero Section */}
        <header className="about-hero">
          <div className="about-hero-badge">
            <span></span>
            Brand Era &bull; Story &amp; Capabilities
          </div>
          <h1>
            Empowering Brands, Creators &amp; Communities Through <em>Precision Print &amp; Custom Merchandise</em>
          </h1>
          <p className="about-hero-tagline">Design. Print. Brand. Deliver.</p>
          <p className="about-hero-desc">
            Brand Era is India&rsquo;s modern on-demand merchandise, apparel manufacturing, and print customization platform. We unite high-precision digital printing technology, luxury bio-washed fabrics, and an intuitive online Design Studio to turn your boldest ideas into wearable realities.
          </p>
          <div className="about-hero-actions">
            <Link to="/tshirts" className="about-btn-primary">
              <i className="fas fa-tshirt"></i> Explore Products
            </Link>
            <Link to="/print-studio" className="about-btn-secondary">
              <i className="fas fa-magic"></i> Launch Design Studio
            </Link>
            <Link to="/bulk-order" className="about-btn-secondary">
              <i className="fas fa-boxes"></i> Bulk Inquiries
            </Link>
          </div>
        </header>

        {/* Stats Strip */}
        <section className="about-stats" aria-label="Brand Era Key Milestones">
          <div className="about-stat-card">
            <div className="about-stat-num">50<span>K+</span></div>
            <div className="about-stat-label">Products Printed</div>
          </div>
          <div className="about-stat-card">
            <div className="about-stat-num">500<span>+</span></div>
            <div className="about-stat-label">Clients &amp; Organizations</div>
          </div>
          <div className="about-stat-card">
            <div className="about-stat-num">19<span>K+</span></div>
            <div className="about-stat-label">Pincodes Reached</div>
          </div>
          <div className="about-stat-card">
            <div className="about-stat-num">100<span>%</span></div>
            <div className="about-stat-label">Quality Guaranteed</div>
          </div>
        </section>

        {/* Section 1: Our Story */}
        <article className="about-card">
          <div className="about-section-header">
            <div className="about-header-icon">
              <i className="fas fa-rocket"></i>
            </div>
            <h2>Our Story &amp; Journey</h2>
          </div>
          <p>
            For too long, custom merchandise was a frustrating experience. Traditional print shops were hindered by rigid minimum order quantities, hidden screen-setup fees, substandard fabrics that shrunk after the first wash, and weeks of agonizing delays.
          </p>
          <p>
            We founded <strong>Brand Era</strong> with a singular mission: <em>to make custom apparel and corporate merchandising effortless, transparent, and undeniably premium.</em>
          </p>

          <div className="about-mission-box">
            <h3><i className="fas fa-bullseye"></i> Our Mission</h3>
            <p>
              To democratize world-class printing and merchandise production for everyone—from burgeoning college clubs and startup teams to established corporations and creative labels—delivering unmatched fabric comfort, print longevity, and punctual fulfillment.
            </p>
          </div>

          <p>
            Today, Brand Era serves corporate innovators, high-growth startups, alumni associations, event organizers, and creators across India. Whether you need a single bespoke hoodie crafted in our Design Studio or 5,000 custom kits dispatched across multiple regional offices, Brand Era delivers with precision.
          </p>
        </article>

        {/* Section 2: What Sets Brand Era Apart */}
        <article className="about-card">
          <div className="about-section-header">
            <div className="about-header-icon">
              <i className="fas fa-gem"></i>
            </div>
            <h2>The Brand Era Difference</h2>
          </div>
          <p>
            We don&rsquo;t simply print on blanks; we engineer comprehensive merchandising solutions built to make an indelible impression:
          </p>

          <div className="about-grid-3">
            <div className="about-feature-box">
              <div className="about-feature-icon">
                <i className="fas fa-fingerprint"></i>
              </div>
              <h3>Precision Print Tech</h3>
              <p>
                Industrial Direct-to-Film (DTF), vibrant screen printing, high-density plastisol, precision computerized embroidery, and sublimation that resist cracking and fading wash after wash.
              </p>
            </div>

            <div className="about-feature-box">
              <div className="about-feature-icon">
                <i className="fas fa-layer-group"></i>
              </div>
              <h3>Luxury Combed Fabrics</h3>
              <p>
                100% super-combed, bio-washed cotton (180 to 240 GSM) and heavy-gauge fleece (320+ GSM). Pre-shrunk, soft to the skin, breathable, and colorfast.
              </p>
            </div>

            <div className="about-feature-box">
              <div className="about-feature-icon">
                <i className="fas fa-laptop-code"></i>
              </div>
              <h3>Interactive Design Studio</h3>
              <p>
                Visualize your concepts before production. Upload vector graphics, position logos, customize colors, and inspect digital proofs in real time.
              </p>
            </div>

            <div className="about-feature-box">
              <div className="about-feature-icon">
                <i className="fas fa-tags"></i>
              </div>
              <h3>Transparent Pricing</h3>
              <p>
                No hidden plate fees or surprise charges. Volume tier discounts are calculated upfront, with GST tax invoices provided for every order.
              </p>
            </div>

            <div className="about-feature-box">
              <div className="about-feature-icon">
                <i className="fas fa-shipping-fast"></i>
              </div>
              <h3>Express Logistics</h3>
              <p>
                Integrated with premier courier networks (Blue Dart, Delhivery, DTDC) with automated SMS and WhatsApp tracking from factory dispatch to doorstep.
              </p>
            </div>

            <div className="about-feature-box">
              <div className="about-feature-icon">
                <i className="fas fa-headset"></i>
              </div>
              <h3>Dedicated Brand Specialists</h3>
              <p>
                Our merchandising specialists assist with design vectorization, sizing guidance, fabric swatch trials, and customized B2B kit packaging.
              </p>
            </div>
          </div>
        </article>

        {/* Section 3: Product Ecosystem */}
        <article className="about-card">
          <div className="about-section-header">
            <div className="about-header-icon">
              <i className="fas fa-cubes"></i>
            </div>
            <h2>Our Merchandise Ecosystem</h2>
          </div>
          <p>
            From everyday wardrobe staples to curated executive gift sets, our production lines span across diverse categories:
          </p>

          <div className="about-product-cards">
            <div className="about-product-card">
              <h3><i className="fas fa-tshirt"></i> Custom Apparel</h3>
              <ul>
                <li>Classic Crewneck T-Shirts</li>
                <li>Premium Cotton Piqu&eacute; Polos</li>
                <li>Trendy Oversized Streetwear Tees</li>
                <li>Cozy Fleece Hoodies &amp; Sweatshirts</li>
                <li>Varsity &amp; Zipper Jackets</li>
                <li>Embroidered Caps &amp; Beanies</li>
              </ul>
            </div>

            <div className="about-product-card">
              <h3><i className="fas fa-briefcase"></i> Corporate &amp; Office Swag</h3>
              <ul>
                <li>Employee Onboarding Welcome Kits</li>
                <li>Branded Water Bottles &amp; Sippers</li>
                <li>Hardbound Debossed Notebooks</li>
                <li>Custom Lanyards &amp; RFID Badges</li>
                <li>Laptop Sleeves &amp; Executive Backpacks</li>
                <li>Engraved Metal Pens &amp; Tech Organizers</li>
              </ul>
            </div>

            <div className="about-product-card">
              <h3><i className="fas fa-users"></i> Events &amp; Alumni Kits</h3>
              <ul>
                <li>Complete Alumni Meet Packages</li>
                <li>Batch Crest &amp; Reunion Keepsakes</li>
                <li>Ceramic Mugs &amp; Coasters</li>
                <li>High-Res Vinyl Banners &amp; Standees</li>
                <li>Selfie Frames &amp; Photo Backdrops</li>
                <li>Trophies, Medals &amp; Certificates</li>
              </ul>
            </div>
          </div>
        </article>

        {/* Section 4: Our Core Values */}
        <article className="about-card">
          <div className="about-section-header">
            <div className="about-header-icon">
              <i className="fas fa-heart"></i>
            </div>
            <h2>Our Guiding Principles</h2>
          </div>
          <p>
            Everything we create at Brand Era is rooted in four enduring commitments to our clients and our craft:
          </p>

          <div className="about-values-list">
            <div className="about-value-item">
              <div className="about-value-check">&check;</div>
              <div className="about-value-text">
                <h4>Uncompromising Craftsmanship</h4>
                <p>Every garment undergoes a multi-point quality check before it leaves our production facility.</p>
              </div>
            </div>

            <div className="about-value-item">
              <div className="about-value-check">&check;</div>
              <div className="about-value-text">
                <h4>Client Artwork Integrity</h4>
                <p>We treat your corporate logos and designs as confidential assets, ensuring 100% intellectual property security.</p>
              </div>
            </div>

            <div className="about-value-item">
              <div className="about-value-check">&check;</div>
              <div className="about-value-text">
                <h4>Punctual Delivery Guarantee</h4>
                <p>We respect event deadlines. Our production pipelines are optimized to ensure on-time delivery every time.</p>
              </div>
            </div>

            <div className="about-value-item">
              <div className="about-value-check">&check;</div>
              <div className="about-value-text">
                <h4>Eco-Conscious Printing</h4>
                <p>We prioritize OEKO-TEX certified, non-toxic water-based inks and recyclable packaging materials.</p>
              </div>
            </div>
          </div>
        </article>

        {/* Manifesto Quote Box */}
        <section className="about-quote-box">
          <blockquote>
            &ldquo;A brand isn&rsquo;t just a logo on fabric&mdash;it&rsquo;s an identity, a community, and a shared statement. At Brand Era, we bring that identity to life with precision and pride.&rdquo;
          </blockquote>
          <div className="about-quote-author">The Brand Era Team</div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="about-cta">
          <div className="about-cta-text">
            <h3>Ready to Bring Your Brand to Life?</h3>
            <p>
              Start designing in our interactive Studio or reach out for custom bulk merchandising and corporate quotes.
            </p>
          </div>
          <div className="about-cta-actions">
            <Link to="/print-studio" className="about-btn-primary">
              <i className="fas fa-paint-brush"></i> Open Design Studio
            </Link>
            <Link to="/bulk-order" className="about-btn-secondary" style={{ background: '#18181b', color: '#fff' }}>
              <i className="fas fa-calculator"></i> Request Bulk Quote
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
