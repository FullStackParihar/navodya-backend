import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { resolveImageUrl } from '../utils/api';

const BannerLink = ({ to, className, children }) => {
  if (/^https?:\/\//i.test(to || '')) return <a className={className} href={to}>{children}</a>;
  return <Link className={className} to={to || '#'}>{children}</Link>;
};

export default function HomepageBanner() {
  const [banners, setBanners] = useState([]);
  const [position, setPosition] = useState(1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [timerReset, setTimerReset] = useState(0);
  const [failedImages, setFailedImages] = useState({});
  const touchStart = useRef(null);
  const resetFrame = useRef(null);

  useEffect(() => {
    let active = true;
    api.get('/banners/active').then(result => {
      if (active && result.success && Array.isArray(result.data)) setBanners(result.data.filter(banner => banner.imageUrl));
    }).catch(() => {});
    return () => {
      active = false;
      if (resetFrame.current) window.cancelAnimationFrame(resetFrame.current);
    };
  }, []);

  const visibleBanners = banners.filter(banner => !failedImages[banner._id]);
  const activeIndex = visibleBanners.length ? (position - 1 + visibleBanners.length) % visibleBanners.length : 0;

  useEffect(() => {
    if (visibleBanners.length < 2) return undefined;
    const timer = window.setTimeout(() => {
      setTransitionEnabled(true);
      setTransitioning(true);
      setPosition(current => current + 1);
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [visibleBanners.length, activeIndex, timerReset]);

  useEffect(() => {
    setTransitionEnabled(false);
    setTransitioning(false);
    setPosition(visibleBanners.length > 1 ? 1 : 0);
    resetFrame.current = window.requestAnimationFrame(() => {
      resetFrame.current = window.requestAnimationFrame(() => setTransitionEnabled(true));
    });
  }, [visibleBanners.length]);

  useEffect(() => {
    if (!transitioning) return undefined;
    const fallback = window.setTimeout(() => finishTransition(), 900);
    return () => window.clearTimeout(fallback);
  });

  const move = direction => {
    if (visibleBanners.length < 2 || transitioning) return;
    setTransitionEnabled(true);
    setTransitioning(true);
    setPosition(current => current + direction);
    setTimerReset(current => current + 1);
  };

  const finishTransition = () => {
    setTransitioning(false);
    if (position !== 0 && position !== visibleBanners.length + 1) return;
    setTransitionEnabled(false);
    setPosition(position === 0 ? visibleBanners.length : 1);
    resetFrame.current = window.requestAnimationFrame(() => {
      resetFrame.current = window.requestAnimationFrame(() => setTransitionEnabled(true));
    });
  };

  const selectBanner = dot => {
    if (dot === activeIndex || transitioning) return;
    setTransitionEnabled(true);
    setTransitioning(true);
    setPosition(dot + 1);
    setTimerReset(current => current + 1);
  };
  const swipeEnd = event => {
    if (touchStart.current === null || visibleBanners.length < 2) return;
    const distance = event.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(distance) > 45) move(distance > 0 ? -1 : 1);
    touchStart.current = null;
  };

  if (!visibleBanners.length) return <section className="hero-epic">
    <div className="hero-bg"><div className="hero-gradient" /><div className="hero-shapes"><div className="shape shape-1" /><div className="shape shape-2" /><div className="shape shape-3" /></div></div>
    <div className="container"><div className="hero-content"><div className="hero-left">
      <div className="hero-badge"><i className="fas fa-star" /> #1 JNV Merchandise</div>
      <h1 className="hero-title">Wear Your<span className="title-line"><span className="title-word" style={{'--delay':'0s'}}>Navodaya</span><span className="title-word" style={{'--delay':'0.2s'}}>Pride</span></span></h1>
      <p className="hero-description">Premium quality apparel and accessories for JNV students and alumni. Show your Navodaya spirit with style!</p>
      <div className="hero-actions"><Link to="/tshirts" className="btn btn-primary"><i className="fas fa-bolt" /> Shop Collection</Link><Link to="/events" className="btn btn-secondary"><i className="fas fa-calendar-alt" /> Events</Link></div>
      <div className="hero-stats"><div className="stat"><div className="stat-icon"><i className="fas fa-users" /></div><div className="stat-text"><span className="stat-number">15K+</span><span className="stat-label">Happy Alumni</span></div></div><div className="stat"><div className="stat-icon"><i className="fas fa-tshirt" /></div><div className="stat-text"><span className="stat-number">100+</span><span className="stat-label">Products</span></div></div><div className="stat"><div className="stat-icon"><i className="fas fa-star" /></div><div className="stat-text"><span className="stat-number">4.9</span><span className="stat-label">Rating</span></div></div></div>
    </div><div className="hero-right"><div className="hero-products"><div className="product-float product-1"><img src="/h2o.jpeg" alt="Navodaya merchandise" /></div></div></div></div></div>
    <div className="scroll-hint"><span>Scroll to explore</span><i className="fas fa-chevron-down" /></div>
  </section>;

  const slides = visibleBanners.length > 1 ? [visibleBanners[visibleBanners.length - 1], ...visibleBanners, visibleBanners[0]] : visibleBanners;

  return <section className="dynamic-banner" aria-roledescription="carousel" aria-label="Homepage offers" onTouchStart={e => { touchStart.current = e.touches[0].clientX; }} onTouchEnd={swipeEnd}>
    <div className="dynamic-banner-track" onTransitionEnd={finishTransition} style={{transform:`translate3d(-${(visibleBanners.length > 1 ? position : 0) * 100}%, 0, 0)`, transition: transitionEnabled ? undefined : 'none'}}>
      {slides.map((banner, itemIndex) => <article className="dynamic-banner-slide" key={`${banner._id}-${itemIndex}`} aria-hidden={visibleBanners.length > 1 ? itemIndex !== position : false}>
        <img src={resolveImageUrl(banner.imageUrl)} alt={banner.title || 'Homepage offer'} width="1600" height="650" onError={() => setFailedImages(current => ({ ...current, [banner._id]: true }))} />
        <div className="dynamic-banner-shade" /><div className="dynamic-banner-content">
          {banner.offerText && <span className="dynamic-banner-offer">{banner.offerText}</span>}
          <h1>{banner.title}</h1>{banner.subtitle && <p>{banner.subtitle}</p>}
          {banner.buttonText && banner.buttonLink && <BannerLink className="dynamic-banner-cta" to={banner.buttonLink}>{banner.buttonText}<i className="fas fa-arrow-right" /></BannerLink>}
        </div>
      </article>)}
    </div>
    {visibleBanners.length > 1 && <><button className="dynamic-banner-control prev" onClick={() => move(-1)} aria-label="Previous banner"><i className="fas fa-chevron-left" /></button><button className="dynamic-banner-control next" onClick={() => move(1)} aria-label="Next banner"><i className="fas fa-chevron-right" /></button><div className="dynamic-banner-dots" role="tablist" aria-label="Choose banner">{visibleBanners.map((banner, dot) => <button key={banner._id} className={dot === activeIndex ? 'active' : ''} onClick={() => selectBanner(dot)} aria-label={`Show banner ${dot + 1}`} aria-current={dot === activeIndex ? 'true' : undefined} />)}</div></>}
  </section>;
}
