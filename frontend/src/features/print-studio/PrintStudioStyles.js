import React from 'react';

const styles = `
.print-studio{--red:#e82b1d;--ink:#151515;--paper:#f6f2eb;font-family:'DM Sans',Arial,sans-serif;background:var(--paper);color:var(--ink)}.studio-hero{display:grid;grid-template-columns:1fr 1fr;min-height:590px;background:#e5d8c7}.studio-hero>div:first-child{padding:110px max(6vw,28px)}.studio-eyebrow{text-transform:uppercase;letter-spacing:.13em;font-size:11px;font-weight:700;color:#6c665f;margin:0 0 16px}.studio-hero h1,.designer h2,.quote-section h2{font:700 clamp(48px,6vw,78px)/.9 Arial,sans-serif;letter-spacing:-.08em;margin:0}.studio-hero h1 em,.designer h2 em,.quote-section h2 em{font:400 1em Georgia,serif;color:var(--red)}.studio-hero p:not(.studio-eyebrow){max-width:440px;font-size:17px;line-height:1.55}.studio-primary{display:inline-block;border:0;background:var(--red);color:white;padding:15px 20px;font:700 13px Arial,sans-serif;cursor:pointer;text-decoration:none}.studio-primary span{margin-left:20px;font-size:18px}.studio-hero-art{background:#151515;position:relative;overflow:hidden;background-image:radial-gradient(#424242 1px,transparent 1px);background-size:15px 15px}.studio-hero-art:before{content:'';position:absolute;border:85px solid var(--red);width:490px;height:490px;border-radius:50%;right:-210px;top:-170px}.studio-card-back,.studio-card-front{position:absolute;box-shadow:12px 13px 20px #0008}.studio-card-back{width:190px;height:280px;background:#292929;color:white;padding:25px;left:20%;top:100px;font:700 25px/.85 Arial,sans-serif;letter-spacing:-.08em;transform:rotate(-15deg)}.studio-hero-shirt{position:absolute;width:230px;height:260px;right:18%;top:120px;background:#f5f0e8;clip-path:polygon(22% 0,38% 8%,62% 8%,78% 0,100% 17%,84% 41%,82% 100%,18% 100%,16% 41%,0 17%);display:grid;place-items:center;filter:drop-shadow(10px 14px 8px #0008)}.studio-hero-shirt span{font:700 36px Arial,sans-serif;letter-spacing:-9px}.studio-card-front{right:9%;bottom:80px;width:215px;height:125px;padding:22px;background:linear-gradient(110deg,#e82b1d,#a20f08);color:white;font:700 26px/.82 Arial,sans-serif;letter-spacing:-.08em;transform:rotate(-7deg)}.studio-card-front i{font-family:Georgia;font-weight:400}.studio-stamp{position:absolute;left:8%;bottom:45px;color:white;border:1px solid white;border-radius:50%;width:84px;height:84px;display:grid;place-items:center;text-align:center;font-size:9px;font-weight:bold;transform:rotate(-15deg)}.studio-benefits{display:grid;grid-template-columns:repeat(4,1fr);padding:26px 6vw;background:#fff;border-bottom:1px solid #ddd}.studio-benefits span{text-align:center;font-size:12px;font-weight:700;border-right:1px solid #ddd}.studio-benefits span:last-child{border:0}.designer{padding:100px 6vw}.designer-heading{max-width:620px;margin-bottom:43px}.designer h2{font-size:clamp(42px,5vw,65px)}.designer-heading>p:last-child{line-height:1.55}.designer-grid{display:grid;grid-template-columns:28% 50% 22%;border:1px solid #d5d0c8;background:white}.designer-controls{padding:29px;border-right:1px solid #ded9d0}.designer-controls label,.quote-form label{display:block;font-size:12px;font-weight:700;margin-bottom:20px}.designer-controls select,.designer-controls input,.quote-form input,.quote-form textarea{width:100%;border:1px solid #c9c3bb;background:#fff;padding:10px;font:13px Arial,sans-serif;margin-top:7px}.studio-quantity{width:120px;display:grid;grid-template-columns:32px 1fr 32px;border:1px solid #c9c3bb;margin-top:7px}.studio-quantity button{border:0;background:#f4f1ec;font-size:18px;cursor:pointer}.studio-quantity input{border:0;margin:0;text-align:center}.studio-swatches{display:flex;gap:10px;margin-top:9px}.studio-swatches button{width:25px;height:25px;border-radius:50%;border:2px solid transparent;cursor:pointer}.studio-swatches .selected{outline:1px solid #111;outline-offset:3px}.studio-canvas-wrap{padding:22px;background:#e4ddd3;display:flex;flex-direction:column}.canvas-bar{display:flex;justify-content:space-between;font-size:11px;font-weight:700}.studio-canvas{height:420px;display:grid;place-items:center}.product-mockup{--product-color:#151515;background:var(--product-color);width:260px;height:300px;clip-path:polygon(22% 0,38% 8%,62% 8%,78% 0,100% 17%,84% 41%,82% 100%,18% 100%,16% 41%,0 17%);display:grid;place-items:center;position:relative;filter:drop-shadow(10px 13px 10px #0005)}.product-mockup span{max-width:145px;color:white;text-align:center;font:700 25px/.85 Arial,sans-serif;letter-spacing:-.07em}.product-mockup img{max-width:108px;max-height:108px;object-fit:contain}.upload-zone{background:#fff;padding:14px;display:grid;gap:4px;text-align:center;cursor:pointer;font-size:12px}.upload-zone input{display:none}.upload-zone small{color:#777}.studio-summary{padding:60px 21px 20px}.studio-summary p{font-size:11px;text-transform:uppercase;letter-spacing:.08em}.studio-summary strong{font:700 28px Arial,sans-serif;letter-spacing:-.06em}.studio-summary small,.studio-summary span{display:block;font-size:11px;line-height:1.5;color:#777;margin-top:8px}.studio-summary hr{border:0;border-top:1px solid #ddd;margin:28px 0}.quote-section{padding:100px 6vw;background:#171717;color:white;display:grid;grid-template-columns:36% 64%;gap:60px}.quote-section .studio-eyebrow{color:#e2ddd5}.quote-section h2 em{color:white}.quote-section>div>p:last-child{max-width:260px;line-height:1.5;color:#ddd}.quote-form{background:#f7f4ee;color:#151515;padding:31px}.quote-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 18px}.quote-form textarea{resize:vertical;min-height:75px}.studio-message{font-size:13px;line-height:1.4;margin:15px 0 0}.studio-next{padding:48px 6vw;display:flex;gap:30px;align-items:center;background:#e7ded2}.studio-next p{font:400 21px Georgia,serif;margin:0 auto 0 0}.studio-next a{font-size:13px;font-weight:700;border-bottom:1px solid;padding-bottom:5px;text-decoration:none;color:#151515}.studio-next a span{color:var(--red)}@media(max-width:850px){.studio-hero,.quote-section{grid-template-columns:1fr}.studio-hero>div:first-child{padding:75px 26px}.studio-hero-art{min-height:440px}.studio-benefits{grid-template-columns:1fr 1fr;gap:20px}.studio-benefits span:nth-child(2){border-right:0}.designer{padding:70px 24px}.designer-grid{grid-template-columns:1fr}.designer-controls{border-right:0;border-bottom:1px solid #ded9d0}.designer-controls label{max-width:400px}.studio-summary{padding:25px;display:flex;gap:20px;align-items:center}.studio-summary hr,.studio-summary p:nth-of-type(2),.studio-summary span{display:none}.quote-section{padding:70px 24px;gap:30px}.studio-next{flex-wrap:wrap;padding:35px 24px}.studio-next p{width:100%}}@media(max-width:500px){.studio-hero h1{font-size:52px}.studio-card-back{left:10px}.studio-hero-shirt{right:7%}.studio-card-front{right:6%;bottom:55px}.designer-grid{margin:0 -8px}.studio-canvas{height:350px}.product-mockup{transform:scale(.78)}.quote-form-grid{grid-template-columns:1fr}.studio-next{gap:16px}}
`;

const backViewStyles = `.canvas-bar{align-items:center}.view-switch{display:flex;gap:3px;background:#d3cbc0;padding:3px}.view-switch button{border:0;background:transparent;padding:7px 10px;font:700 10px Arial,sans-serif;cursor:pointer}.view-switch .active{background:#171717;color:#fff}.product-mockup.back-view:before{content:'';position:absolute;width:54px;height:29px;background:#e4ddd3;border-radius:0 0 25px 25px;top:0}.side-status{display:flex;justify-content:space-between;gap:12px;background:#f4f0e9;padding:10px 13px;font-size:11px}.side-status span{color:#706b65;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}@media(max-width:500px){.canvas-bar>span{display:none}.view-switch button{padding:7px 9px}.side-status{display:grid;gap:3px}}`;

const heroEnhancement = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');

/* ── Hero left column ── */
.studio-hero {
  background: linear-gradient(120deg, #f0e6d6 0%, #e5d8c7 55%, #ddd0be 100%) !important;
  min-height: 640px !important;
  position: relative !important;
}
.studio-hero > div:first-child {
  padding: 100px max(7vw, 40px) !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  gap: 0 !important;
  position: relative !important;
  z-index: 2 !important;
}
.studio-eyebrow {
  font-family: 'Inter', Arial, sans-serif !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  letter-spacing: 0.2em !important;
  color: var(--red) !important;
  background: rgba(232,43,29,0.08) !important;
  border: 1px solid rgba(232,43,29,0.15) !important;
  display: inline-block !important;
  padding: 6px 14px !important;
  border-radius: 30px !important;
  margin-bottom: 24px !important;
  width: fit-content !important;
}
.studio-hero h1 {
  font-family: 'Inter', Arial, sans-serif !important;
  font-size: clamp(52px, 6.5vw, 88px) !important;
  font-weight: 900 !important;
  letter-spacing: -3px !important;
  line-height: 0.92 !important;
  color: #111 !important;
  margin: 0 0 28px !important;
}
.studio-hero h1 em {
  font-family: Georgia, serif !important;
  font-weight: 400 !important;
  font-style: italic !important;
  color: var(--red) !important;
  position: relative !important;
  display: inline-block !important;
}
.studio-hero p:not(.studio-eyebrow) {
  font-family: 'Inter', Arial, sans-serif !important;
  font-size: 16px !important;
  line-height: 1.65 !important;
  color: #555 !important;
  max-width: 400px !important;
  margin-bottom: 36px !important;
}
/* CTA button */
.studio-primary {
  font-family: 'Inter', Arial, sans-serif !important;
  background: linear-gradient(90deg, #e82b1d, #ff2a1a) !important;
  color: #fff !important;
  padding: 16px 32px !important;
  border-radius: 4px !important;
  font-size: 14px !important;
  font-weight: 700 !important;
  letter-spacing: 0.04em !important;
  box-shadow: 0 8px 24px rgba(232,43,29,0.35) !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 12px !important;
  text-decoration: none !important;
  border: none !important;
  cursor: pointer !important;
  width: fit-content !important;
}
.studio-primary:hover {
  transform: translateY(-3px) !important;
  box-shadow: 0 14px 32px rgba(232,43,29,0.5) !important;
}
.studio-primary span {
  font-size: 20px !important;
  margin-left: 0 !important;
  transition: transform 0.3s ease !important;
}
.studio-primary:hover span {
  transform: translateX(4px) !important;
}

/* ── Hero right art panel ── */
.studio-hero-art {
  background: #0f0f0f !important;
  background-image:
    radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px) !important;
  background-size: 20px 20px !important;
  position: relative !important;
  overflow: hidden !important;
}
.studio-hero-art::after {
  content: '' !important;
  position: absolute !important;
  inset: 0 !important;
  background: radial-gradient(ellipse at 60% 40%, rgba(232,43,29,0.18) 0%, transparent 60%) !important;
  pointer-events: none !important;
}
.studio-hero-art:before {
  border: 90px solid var(--red) !important;
  width: 520px !important;
  height: 520px !important;
  right: -220px !important;
  top: -180px !important;
  opacity: 0.85 !important;
  box-shadow: 0 0 60px rgba(232,43,29,0.3) !important;
}

/* Floating card animations */
@keyframes studioFloat1 {
  0%, 100% { transform: rotate(-15deg) translateY(0); }
  50% { transform: rotate(-13deg) translateY(-12px); }
}
@keyframes studioFloat2 {
  0%, 100% { transform: rotate(-7deg) translateY(0); }
  50% { transform: rotate(-5deg) translateY(-10px); }
}
@keyframes studioFloatShirt {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.studio-card-back {
  background: linear-gradient(145deg, #1e1e1e, #111) !important;
  border: 1px solid #333 !important;
  box-shadow: 20px 24px 40px rgba(0,0,0,0.6) !important;
  animation: studioFloat1 6s ease-in-out infinite !important;
  padding: 30px !important;
  font-size: 26px !important;
  line-height: 0.85 !important;
}
.studio-hero-shirt {
  box-shadow: none !important;
  filter: drop-shadow(12px 18px 16px rgba(0,0,0,0.5)) !important;
  animation: studioFloatShirt 5s ease-in-out infinite 0.8s !important;
}
.studio-card-front {
  background: linear-gradient(115deg, #e82b1d 0%, #8f0a04 100%) !important;
  box-shadow: 20px 24px 40px rgba(232,43,29,0.35) !important;
  animation: studioFloat2 7s ease-in-out infinite 0.4s !important;
}
.studio-stamp {
  border: 1.5px solid rgba(255,255,255,0.6) !important;
  box-shadow: 0 0 20px rgba(255,255,255,0.08) !important;
  font-family: 'Inter', Arial, sans-serif !important;
  font-size: 8.5px !important;
  letter-spacing: 0.08em !important;
}

/* ── Benefits bar — matches home page dark strip ── */
.studio-benefits {
  background: #050505 !important;
  border-top: 1px solid #222 !important;
  border-bottom: 1px solid #222 !important;
  padding: 0 !important;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3) !important;
}
.studio-benefits span {
  font-family: 'Inter', Arial, sans-serif !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  letter-spacing: 0.04em !important;
  color: #ccc !important;
  border-right: 1px solid #222 !important;
  border-radius: 0 !important;
  padding: 26px 20px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 10px !important;
  transition: background 0.3s, color 0.3s !important;
  cursor: default !important;
}
.studio-benefits span:last-child {
  border-right: none !important;
}
.studio-benefits span:hover {
  background: #1a0000 !important;
  color: #ff1a1a !important;
}
.studio-benefits span::before {
  content: attr(data-icon) !important;
  color: #e63322 !important;
  font-size: 16px !important;
  flex-shrink: 0 !important;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
}
.studio-benefits span:hover::before {
  transform: translate(3px, -3px) scale(1.2) !important;
}

/* ══════════════════════════════════════
   QUOTE & PRODUCTION — Premium Redesign
   ══════════════════════════════════════ */

.quote-section {
  display: grid !important;
  grid-template-columns: 40% 60% !important;
  gap: 48px !important;
  align-items: center !important;
  background: #080808 !important;
  background-image: radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px) !important;
  background-size: 20px 20px !important;
  padding: 56px 7vw !important;
  position: relative !important;
  overflow: hidden !important;
  border-top: 1px solid #1a1a1a !important;
}

/* Subtle red glow behind the heading */
.quote-section::before {
  content: '' !important;
  position: absolute !important;
  left: -80px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  width: 320px !important;
  height: 320px !important;
  background: radial-gradient(circle, rgba(232,43,29,0.1) 0%, transparent 70%) !important;
  pointer-events: none !important;
}

/* ── Left: Copy ── */
.quote-section > div:first-child {
  position: relative !important;
  z-index: 2 !important;
}

.quote-section .studio-eyebrow {
  font-family: 'Inter', Arial, sans-serif !important;
  font-size: 13px !important;
  font-weight: 800 !important;
  letter-spacing: 0.15em !important;
  text-transform: uppercase !important;
  color: var(--red) !important;
  background: rgba(232,43,29,0.08) !important;
  border: 1px solid rgba(232,43,29,0.18) !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 6px !important;
  padding: 8px 16px !important;
  border-radius: 100px !important;
  margin-bottom: 28px !important;
}

.quote-section h2 {
  font-family: 'Inter', Arial, sans-serif !important;
  font-size: clamp(40px, 4.8vw, 64px) !important;
  font-weight: 900 !important;
  letter-spacing: -2px !important;
  line-height: 1.0 !important;
  color: #ffffff !important;
  margin: 0 0 24px !important;
}

.quote-section h2 em {
  font-family: Georgia, 'Times New Roman', serif !important;
  font-style: italic !important;
  font-weight: 400 !important;
  color: var(--red) !important;
}

.quote-section > div:first-child > p {
  font-family: 'Inter', Arial, sans-serif !important;
  font-size: 15px !important;
  line-height: 1.65 !important;
  color: #999 !important;
  max-width: 300px !important;
  margin: 0 !important;
}

/* ── Right: Form Card ── */
.quote-form {
  background: #f8f5f0 !important;
  border-radius: 12px !important;
  padding: 24px 28px 20px !important;
  box-shadow:
    0 2px 0 rgba(255,255,255,0.04) inset,
    0 24px 60px rgba(0,0,0,0.55),
    0 0 0 1px rgba(255,255,255,0.05) !important;
  position: relative !important;
  z-index: 2 !important;
}

/* Thin red accent line at top of card */
.quote-form::before {
  content: '' !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  height: 3px !important;
  background: linear-gradient(90deg, var(--red), #ff5a4a) !important;
  border-radius: 12px 12px 0 0 !important;
}

.quote-form-grid {
  display: grid !important;
  grid-template-columns: 1fr 1fr !important;
  gap: 0 14px !important;
}

/* Labels */
.quote-form label {
  display: block !important;
  font-family: 'Inter', Arial, sans-serif !important;
  font-size: 9.5px !important;
  font-weight: 700 !important;
  letter-spacing: 0.1em !important;
  text-transform: uppercase !important;
  color: #6b6560 !important;
  margin-bottom: 10px !important;
}

/* Inputs */
.quote-form input,
.quote-form textarea {
  display: block !important;
  width: 100% !important;
  font-family: 'Inter', Arial, sans-serif !important;
  font-size: 12px !important;
  color: #1a1a1a !important;
  background: #ffffff !important;
  border: 1px solid #ddd7ce !important;
  border-radius: 6px !important;
  padding: 8px 10px !important;
  margin-top: 4px !important;
  transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
  box-sizing: border-box !important;
  -webkit-appearance: none !important;
  appearance: none !important;
}

.quote-form input:hover {
  border-color: #c9c0b5 !important;
}

.quote-form input:focus,
.quote-form textarea:focus {
  outline: none !important;
  border-color: var(--red) !important;
  box-shadow: 0 0 0 3px rgba(232,43,29,0.1) !important;
}

.quote-form input::placeholder,
.quote-form textarea::placeholder {
  color: #c8c0b7 !important;
  font-size: 11.5px !important;
}

.quote-form textarea {
  min-height: 52px !important;
  resize: vertical !important;
  line-height: 1.5 !important;
}

/* CTA Button */
.quote-form .studio-primary {
  display: flex !important;
  width: 100% !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 10px !important;
  font-family: 'Inter', Arial, sans-serif !important;
  font-size: 12.5px !important;
  font-weight: 700 !important;
  letter-spacing: 0.06em !important;
  text-transform: uppercase !important;
  color: #fff !important;
  background: linear-gradient(90deg, #e82b1d 0%, #c0180c 100%) !important;
  border: none !important;
  border-radius: 6px !important;
  padding: 12px 20px !important;
  margin-top: 6px !important;
  cursor: pointer !important;
  text-decoration: none !important;
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s !important;
  box-shadow: 0 4px 14px rgba(232,43,29,0.3) !important;
}

.quote-form .studio-primary:hover {
  background: linear-gradient(90deg, #ff3322 0%, #d41a0e 100%) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 22px rgba(232,43,29,0.45) !important;
}

.quote-form .studio-primary span {
  font-size: 16px !important;
  margin-left: 0 !important;
  transition: transform 0.25s ease !important;
}

.quote-form .studio-primary:hover span {
  transform: translateX(4px) !important;
}

/* ── Responsive ── */
@media (max-width: 850px) {
  .quote-section {
    grid-template-columns: 1fr !important;
    padding: 40px 6vw !important;
    gap: 28px !important;
  }
  .quote-section > div:first-child > p {
    max-width: 100% !important;
  }
}

@media (max-width: 500px) {
  .quote-form {
    padding: 18px 16px 16px !important;
  }
  .quote-form-grid {
    grid-template-columns: 1fr !important;
  }
  .quote-section {
    padding: 32px 20px !important;
  }
}

/* ── Next Section (Footer Cross-sell) ── */
.studio-next {
  padding: 100px 5vw !important;
  background: #050505 !important;
  position: relative !important;
  overflow: hidden !important;
  text-align: center !important;
  border-top: 1px solid #1a1a1a !important;
  display: block !important;
}
.studio-next::before {
  content: '' !important;
  position: absolute !important;
  top: -100px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  width: 600px !important;
  height: 600px !important;
  background: radial-gradient(circle, rgba(232,43,29,0.08) 0%, transparent 70%) !important;
  pointer-events: none !important;
}

.studio-next p {
  position: relative !important;
  z-index: 2 !important;
  font-family: 'Inter', Arial, sans-serif !important;
  font-size: clamp(32px, 4vw, 52px) !important;
  font-weight: 900 !important;
  letter-spacing: -2px !important;
  color: #fff !important;
  margin: 0 0 32px 0 !important;
  display: block !important;
}

.studio-next p em {
  font-style: normal !important;
  color: var(--red) !important;
}

.studio-next a {
  position: relative !important;
  z-index: 2 !important;
  font-family: 'Inter', Arial, sans-serif !important;
  font-size: 13px !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.1em !important;
  color: #fff !important;
  background: rgba(255,255,255,0.05) !important;
  text-decoration: none !important;
  border: 1px solid rgba(255,255,255,0.15) !important;
  padding: 16px 32px !important;
  border-radius: 100px !important;
  transition: all 0.3s ease !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 12px !important;
  margin: 0 10px 10px !important;
}

.studio-next a:hover {
  transform: translateY(-3px) !important;
  background: var(--red) !important;
  border-color: var(--red) !important;
  box-shadow: 0 10px 30px rgba(232,43,29,0.4) !important;
}

.studio-next a span {
  font-size: 18px !important;
  transition: transform 0.3s ease !important;
}

.studio-next a:hover span {
  transform: translateX(4px) !important;
}

@media (max-width: 850px) {
  .studio-next {
    padding: 70px 6vw !important;
  }
  .studio-next a {
    width: 100% !important;
    justify-content: center !important;
    margin: 0 0 12px !important;
  }
}
}`


export default function PrintStudioStyles() { return <><style>{styles}</style><style>{backViewStyles}</style><style>{heroEnhancement}</style></>; }
