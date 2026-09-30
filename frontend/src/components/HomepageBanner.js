import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { resolveImageUrl } from '../utils/api';

const BannerLink = ({ to, className, children }) => {
  if (/^https?:\/\//i.test(to || '')) return <a className={className} href={to}>{children}</a>;
  return <Link className={className} to={to || '#'}>{children}</Link>;
};

export default function HomepageBanner({ fallback = null }) {
  const [banners, setBanners] = useState([]);
  const [loaded, setLoaded] = useState(false);
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
      if (!active) return;
      if (result.success && Array.isArray(result.data)) setBanners(result.data.filter(banner => banner.imageUrl));
      setLoaded(true);
    }).catch(() => { if (active) setLoaded(true); });
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
    const fb = window.setTimeout(() => finishTransition(), 900);
    return () => window.clearTimeout(fb);
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

  // Still fetching — render nothing to avoid any flash
  if (!loaded) return null;

  // API returned but no active banners — render the fallback (sf-hero) or nothing
  if (!visibleBanners.length) return fallback;

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
    {visibleBanners.length > 1 && <><button className="dynamic-banner-control prev" onClick={() => move(-1)} aria-label="Previous banner"><span aria-hidden="true">&#8249;</span></button><button className="dynamic-banner-control next" onClick={() => move(1)} aria-label="Next banner"><span aria-hidden="true">&#8250;</span></button><div className="dynamic-banner-dots" role="tablist" aria-label="Choose banner">{visibleBanners.map((banner, dot) => <button key={banner._id} className={dot === activeIndex ? 'active' : ''} onClick={() => selectBanner(dot)} aria-label={`Show banner ${dot + 1}`} aria-current={dot === activeIndex ? 'true' : undefined} />)}</div></>}
  </section>;

}
