import React from 'react';
const css = `.sf{--red:#e63322;--ink:#151515;--paper:#f6f3ee;--line:#d8d2c8;background:var(--paper);color:var(--ink);font-family:Arial,sans-serif}.sf *{box-sizing:border-box}.sf a{text-decoration:none;color:inherit}.sf-header{height:84px;display:flex;align-items:center;justify-content:space-between;padding:0 5.5vw;border-bottom:1px solid var(--line);background:var(--paper)}.sf-logo{display:grid;grid-template-columns:47px auto;align-items:center;column-gap:7px;line-height:1}.sf-logo span{grid-row:1/3;font:700 43px Arial;letter-spacing:-12px;transform:skewY(-7deg)}.sf-logo span i,.sf-logo em{color:var(--red);font-style:normal}.sf-logo b{font-size:18px;letter-spacing:-1.6px}.sf-logo small{font-size:6px;font-weight:bold;letter-spacing:.9px;margin-top:4px}.sf-header nav{display:flex;gap:27px;font-size:13px;font-weight:bold}.sf-header nav a:hover,.sf-header-actions a:hover{color:var(--red)}.sf-header-actions{display:flex;gap:17px;font-size:13px;font-weight:bold}.sf-header-actions b{color:var(--red)}.sf-hero{display:grid;grid-template-columns:50% 50%;min-height:620px;background:#e4d9ca}.sf-hero-copy{padding:100px 6vw 45px}.sf-kicker{text-transform:uppercase;letter-spacing:1.6px;font-size:10px;font-weight:bold;color:#6e6860;margin:0 0 16px}.sf h1,.sf h2{font:700 clamp(42px,5.5vw,76px)/.91 Arial,sans-serif;letter-spacing:-5px;margin:0}.sf h1 em,.sf h2 em{font:400 1em Georgia,serif;letter-spacing:-5px;color:var(--red)}.sf-hero-copy>p:not(.sf-kicker){max-width:440px;font-size:16px;line-height:1.55;margin:28px 0}.sf-primary,.sf-secondary,.sf-light{display:inline-block;padding:15px 19px;font-size:13px;font-weight:bold}.sf-primary{background:var(--red);color:#fff}.sf-primary span{margin-left:17px;font-size:17px}.sf-secondary{border:1px solid #222;margin-left:8px}.sf-stats{display:flex;gap:32px;margin-top:65px}.sf-stats span{font-size:9px;text-transform:uppercase;letter-spacing:.6px;display:grid;gap:4px}.sf-stats b{font-size:18px;letter-spacing:-1px}.sf-hero-art{position:relative;background:#171717;overflow:hidden;background-image:radial-gradient(#444 1px,transparent 1px);background-size:14px 14px}.sf-hero-art:before{content:'';position:absolute;width:540px;height:540px;border:88px solid var(--red);border-radius:50%;right:-220px;top:-145px}.sf-back-card,.sf-front-card{position:absolute;color:#fff;box-shadow:12px 13px 22px #0008;font-weight:bold}.sf-back-card{width:195px;height:280px;padding:24px;background:#292929;left:25%;top:100px;font-size:25px;line-height:.85;transform:rotate(-15deg)}.sf-shirt{position:absolute;width:230px;height:260px;right:18%;top:115px;background:#f4efe6;clip-path:polygon(22% 0,38% 8%,62% 8%,78% 0,100% 17%,84% 41%,82% 100%,18% 100%,16% 41%,0 17%);display:grid;place-items:center;font-size:34px;font-weight:bold;letter-spacing:-9px;filter:drop-shadow(9px 14px 9px #0008)}.sf-shirt::first-letter{color:var(--red)}.sf-front-card{width:215px;height:125px;right:9%;bottom:75px;padding:21px;background:linear-gradient(110deg,#e63322,#9c100a);font-size:26px;line-height:.8;transform:rotate(-7deg)}.sf-front-card i{font:400 1em Georgia}.sf-mug{position:absolute;left:14%;bottom:55px;width:105px;height:105px;border-radius:5px 5px 16px 16px;background:#e3d5c2;display:grid;place-items:center;font-size:35px;font-weight:bold;letter-spacing:-9px}.sf-mug:after{content:'';position:absolute;right:-38px;width:38px;height:50px;border:11px solid #e3d5c2;border-left:0;border-radius:0 28px 28px 0}.sf-dot{position:absolute;left:8%;top:70px;color:white;border:1px solid white;border-radius:50%;width:80px;height:80px;display:grid;place-items:center;text-align:center;font-size:9px;font-weight:bold;transform:rotate(-15deg)}.sf-strip{display:grid;grid-template-columns:1.2fr repeat(4,1fr);padding:0 5.5vw;background:#fff;border-bottom:1px solid var(--line)}.sf-strip>*{padding:27px 16px;border-right:1px solid var(--line);font-size:13px;font-weight:bold}.sf-strip p{padding-left:0;margin:0;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#777}.sf-strip a span{float:right;color:var(--red)}.sf-section{padding:98px 5.5vw}.sf-title{display:flex;justify-content:space-between;align-items:end;margin-bottom:43px}.sf-title h2{font-size:clamp(36px,4vw,59px)}.sf-title>a{font-size:12px;font-weight:bold;border-bottom:1px solid;padding-bottom:5px}.sf-solutions{display:grid;grid-template-columns:1.05fr 1fr 1fr;gap:16px}.sf-solution{height:410px;padding:26px;position:relative;overflow:hidden;display:flex;flex-direction:column}.sf-solution small{font-size:11px;font-weight:bold;margin-bottom:auto}.sf-solution h3{font-size:34px;letter-spacing:-3px;line-height:.9;margin:0 0 15px}.sf-solution p{max-width:240px;font-size:13px;line-height:1.4;margin:0}.sf-solution>b{margin-top:22px;font-size:12px}.sf-solution.dark{color:white;background:#181818}.sf-solution.dark:after{content:'';position:absolute;width:240px;height:240px;border:42px solid var(--red);border-radius:50%;right:-120px;bottom:-115px}.sf-solution.paper{background:#dcc9ad}.sf-solution.paper i{position:absolute;right:28px;bottom:25px;width:140px;height:184px;background:#f8f2e8;padding:19px;font-size:20px;font-weight:bold;font-style:normal;line-height:.9;transform:rotate(8deg);box-shadow:6px 8px 10px #0002}.sf-solution.red{background:var(--red);color:white}.sf-solution.red:after{content:'✳';font-size:205px;position:absolute;right:-30px;bottom:-75px;color:#171717}.sf-feature{display:grid;grid-template-columns:1fr 1fr;background:#ded7cd}.sf-feature>div:last-child{padding:100px 8vw}.sf-feature h2{font-size:clamp(36px,4vw,58px)}.sf-feature>div:last-child>p:not(.sf-kicker){line-height:1.55;max-width:390px}.sf-feature ul{padding:0;list-style:none;margin:25px 0}.sf-feature li{padding:12px 0;border-top:1px solid #aaa39b;font-size:13px;font-weight:bold}.sf-feature li b{color:var(--red);margin-right:16px;font-size:11px}.sf-feature-art{background:#171717;min-height:520px;display:grid;place-items:center;position:relative;overflow:hidden}.sf-feature-art:after{content:'';position:absolute;border:60px solid var(--red);width:420px;height:420px;border-radius:50%;bottom:-275px;left:-145px}.sf-feature-art span{color:#fff;font-size:140px;font-weight:bold;letter-spacing:-38px;transform:skewY(-7deg);z-index:1}.sf-feature-art span::first-letter{color:var(--red)}.sf-feature-art i{position:absolute;border:1px solid white;color:white;width:330px;height:330px;border-radius:50%;padding:16px;font-size:11px;letter-spacing:3px;font-style:normal;z-index:1}.sf-products{background:#f8f5f0}.sf-products-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:17px}.sf-product-image{height:275px;background:#e4ded4;display:grid;place-items:center;position:relative;overflow:hidden}.sf-product-image img{width:100%;height:100%;object-fit:contain;mix-blend-mode:multiply}.sf-product-image span{position:absolute;left:10px;top:10px;background:#fff;padding:6px 8px;font-size:9px;font-weight:bold;text-transform:uppercase}.sf-product h3{font-size:17px;margin:15px 0 4px;letter-spacing:-.7px}.sf-product p{height:30px;font-size:12px;color:#706b65;margin:0}.sf-product-bottom{display:flex;justify-content:space-between;align-items:center;margin-top:12px}.sf-product-bottom strong{font-size:14px}.sf-product-bottom button{border:0;background:none;color:var(--red);font-weight:bold;font-size:12px;cursor:pointer}.sf-product-bottom button b{font-size:18px;margin-left:4px}.sf-loading{padding:60px 0;text-align:center;color:#777}.sf-kit{display:grid;grid-template-columns:48% 52%;padding:95px 10vw;background:var(--red);color:#fff;min-height:480px}.sf-kit .sf-kicker{color:#fff}.sf-kit h2{font-size:clamp(45px,5vw,70px)}.sf-kit p:not(.sf-kicker){max-width:360px;line-height:1.5}.sf-light{background:#fff;color:#111;margin-top:12px}.sf-kit-art{position:relative}.sf-kit-art b{position:absolute;right:75px;top:80px;width:235px;height:205px;background:#171717;padding:32px;font-size:37px;line-height:.8;letter-spacing:-4px;box-shadow:18px 18px #9c180d}.sf-kit-art b i{font:400 1em Georgia;color:var(--red)}.sf-kit-art span{position:absolute;right:0;top:25px;width:190px;background:#f6f1e7;color:#111;padding:24px;font-size:19px;font-weight:bold;line-height:1;transform:rotate(8deg)}.sf-category-hero{padding:100px 6vw;background:#171717;color:#fff;text-align:center}.sf-category-hero .sf-kicker{color:#ddd}.sf-category-hero h1{font-size:clamp(47px,6vw,78px)}.sf-category-hero h1:first-letter{color:var(--red)}.sf-category-hero>p:not(.sf-kicker){max-width:550px;margin:22px auto 32px;line-height:1.55}.sf-promise{display:grid;grid-template-columns:repeat(4,1fr);padding:25px 6vw;background:#fff;border-top:1px solid var(--line)}.sf-promise span{text-align:center;font-size:11px;font-weight:bold}.sf-footer{padding:58px 6vw 27px;background:#171717;color:#fff;display:grid;grid-template-columns:1.4fr 1fr 1.6fr;gap:30px}.sf-footer .sf-logo{align-self:start}.sf-footer p{font:400 18px Georgia;margin:0;color:#ddd}.sf-footer>div:last-child{display:flex;justify-content:flex-end;gap:20px;font-size:12px;font-weight:bold}.sf-notice{position:fixed;right:22px;bottom:22px;border:0;background:#171717;color:#fff;padding:14px 18px;box-shadow:0 7px 20px #0004;z-index:9;font-size:12px;cursor:pointer}@media(max-width:850px){.sf-header{height:70px;padding:0 20px}.sf-header nav{display:none}.sf-header-actions a:nth-child(1),.sf-header-actions a:nth-child(2){display:none}.sf-hero,.sf-feature,.sf-kit{grid-template-columns:1fr}.sf-hero-copy{padding:75px 25px 42px}.sf-hero-art{min-height:450px}.sf-strip{overflow:auto;padding:0;grid-template-columns:110px repeat(4,170px)}.sf-section{padding:70px 24px}.sf-solutions,.sf-products-grid{grid-template-columns:repeat(2,1fr)}.sf-feature>div:last-child{padding:70px 24px}.sf-kit{padding:70px 25px}.sf-kit-art{height:295px}.sf-title>a{display:none}.sf-footer{grid-template-columns:1fr}.sf-footer>div:last-child{justify-content:flex-start}.sf-promise{grid-template-columns:1fr 1fr;gap:18px}}@media(max-width:500px){.sf-logo b{font-size:16px}.sf-logo span{font-size:37px}.sf h1{font-size:49px}.sf-hero-art{min-height:390px}.sf-back-card{left:7%;top:55px;width:155px;height:230px;font-size:21px}.sf-shirt{width:185px;height:210px;right:8%;top:82px}.sf-front-card{width:170px;height:105px;bottom:38px;right:5%;font-size:20px}.sf-mug{transform:scale(.7);left:2%;bottom:18px}.sf-dot{left:4%;top:22px;transform:scale(.7)}.sf-stats{gap:18px;margin-top:42px}.sf-stats b{font-size:15px}.sf-solutions,.sf-products-grid{grid-template-columns:1fr}.sf-solution{height:330px}.sf-feature-art{min-height:360px}.sf-feature-art span{font-size:105px}.sf-feature-art i{width:260px;height:260px}.sf-kit-art b{right:35px;top:60px;transform:scale(.8)}.sf-kit-art span{right:0}.sf-footer{padding:45px 25px}.sf-footer>div:last-child{flex-wrap:wrap}.sf-category-hero{padding:75px 24px}}`;
const logoOverrides = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');.sf, .sf * {font-family:'Inter', sans-serif !important;}.sf-header{background:linear-gradient(135deg, #050505 0%, #1a0000 100%);color:#fff;border-bottom:2px solid var(--red);height:65px;box-shadow:0 4px 15px rgba(230,51,34,0.2)}.sf-logo{display:flex;align-items:center;line-height:1}.sf-logo img{display:block;width:140px;height:auto}.sf-header nav { margin-left: 8vw !important; }.sf-header-actions { margin-right: 2vw !important; }.sf-footer .sf-logo img{display:block;width:205px;height:auto}@media(max-width:850px){.sf-header{height:55px}}@media(max-width:500px){.sf-logo img{width:110px}}`;
const heroOverrides = `.sf-hero { background: #e4d9ca !important; color: #151515 !important; border-bottom: 1px solid var(--line) !important; } .sf-hero-copy { display: flex !important; flex-direction: column !important; justify-content: center !important; } .sf-hero-copy h1 { color: #151515 !important; font-size: clamp(50px, 6vw, 85px) !important; font-weight: 800 !important; line-height: 1.05 !important; margin-bottom: 20px !important; text-shadow: none !important; } .sf-hero-copy h1 em { color: var(--red) !important; font-style: normal !important; text-shadow: none !important; } .sf-kicker { color: var(--red) !important; background: rgba(230,51,34,0.1) !important; display: inline-block !important; padding: 8px 16px !important; border-radius: 20px !important; border: 1px solid rgba(230,51,34,0.2) !important; letter-spacing: 2px !important; margin-bottom: 24px !important; width: fit-content !important; } .sf-hero-copy > p:not(.sf-kicker) { color: #151515 !important; font-size: 18px !important; max-width: 500px !important; margin-bottom: 30px !important; } .sf-hero-copy > div { display: flex !important; gap: 15px !important; } .sf-primary { background: linear-gradient(90deg, #e63322, #ff1a1a) !important; border-radius: 30px !important; box-shadow: 0 4px 15px rgba(230,51,34,0.4) !important; transition: transform 0.3s, box-shadow 0.3s !important; border: none !important; } .sf-primary:hover { transform: translateY(-3px) !important; box-shadow: 0 8px 25px rgba(230,51,34,0.6) !important; color: #fff !important; } .sf-secondary { border-radius: 30px !important; border: 2px solid #222 !important; color: #222 !important; transition: all 0.3s !important; } .sf-secondary:hover { border-color: #000 !important; background: rgba(0,0,0,0.05) !important; } .sf-stats { margin-top: 50px !important; padding-top: 30px !important; border-top: 1px solid rgba(0,0,0,0.1) !important; } .sf-stats span { color: #555 !important; } .sf-stats b { color: #151515 !important; font-size: 24px !important; } .sf-hero-art { background: #171717 !important; background-image: radial-gradient(#444 1px, transparent 1px) !important; } .sf-hero-art:before { border-color: var(--red) !important; box-shadow: none !important; } @keyframes float1 { 0%, 100% { transform: translateY(0) rotate(-15deg); } 50% { transform: translateY(-15px) rotate(-12deg); } } @keyframes float2 { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-10px) rotate(3deg); } } @keyframes float3 { 0%, 100% { transform: translateY(0) rotate(-7deg); } 50% { transform: translateY(-12px) rotate(-10deg); } } .sf-back-card { background: #111 !important; border: 1px solid #333 !important; box-shadow: 15px 20px 30px rgba(0,0,0,0.4) !important; animation: float1 6s ease-in-out infinite !important; } .sf-shirt { background: #ffffff !important; color: #000 !important; filter: drop-shadow(15px 20px 20px rgba(0,0,0,0.3)) !important; animation: float2 5s ease-in-out infinite 1s !important; } .sf-front-card { background: linear-gradient(135deg, #ff1a1a, #9c100a) !important; box-shadow: 15px 20px 30px rgba(230,51,34,0.3) !important; animation: float3 7s ease-in-out infinite 0.5s !important; border: none !important; } .sf-mug { background: #ffffff !important; color: #000 !important; filter: drop-shadow(10px 15px 15px rgba(0,0,0,0.3)) !important; animation: float2 6s ease-in-out infinite 1.5s !important; } .sf-mug:after { border-color: #ffffff !important; } .sf-dot { background: #111 !important; border: 1px solid #ff1a1a !important; color: #ff1a1a !important; box-shadow: 0 0 20px rgba(230,51,34,0.3) !important; animation: float1 4s ease-in-out infinite !important; }`;
const stripOverrides = `.sf-strip { background: #050505 !important; border-bottom: 1px solid #222 !important; border-top: 1px solid #333 !important; color: #fff !important; box-shadow: 0 5px 15px rgba(0,0,0,0.3) !important; } .sf-strip > * { border-right: 1px solid #222 !important; padding: 25px 20px !important; display: flex !important; align-items: center !important; justify-content: space-between !important; font-size: 15px !important; transition: all 0.3s ease !important; } .sf-strip > *:last-child { border-right: none !important; } .sf-strip p { justify-content: center !important; background: linear-gradient(90deg, #111, #1a0000) !important; color: #ff1a1a !important; letter-spacing: 3px !important; font-size: 12px !important; text-shadow: 0 0 10px rgba(230,51,34,0.3) !important; margin: 0 !important; } .sf-strip a:hover { background: #1a0000 !important; color: #ff1a1a !important; cursor: pointer !important; } .sf-strip a span { color: #e63322 !important; font-size: 18px !important; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important; } .sf-strip a:hover span { transform: translate(4px, -4px) scale(1.2) !important; color: #ff1a1a !important; }`;
const sectionOverrides = `.sf-title h2 { font-size: clamp(40px, 5vw, 65px) !important; font-weight: 800 !important; letter-spacing: -2px !important; line-height: 1 !important; margin-top: 10px !important; } .sf-title h2 em { color: var(--red) !important; font-style: normal !important; text-shadow: 0 0 15px rgba(230,51,34,0.4) !important; } .sf-title > a { color: var(--red) !important; border-color: var(--red) !important; text-transform: uppercase !important; letter-spacing: 2px !important; transition: all 0.3s !important; padding: 12px 24px !important; border: 2px solid var(--red) !important; border-radius: 30px !important; text-decoration: none !important; font-size: 14px !important; } .sf-title > a:hover { background: var(--red) !important; color: #fff !important; box-shadow: 0 5px 15px rgba(230,51,34,0.4) !important; transform: translateY(-3px) !important; } .sf-solutions { gap: 30px !important; perspective: 1000px !important; } .sf-solution { border-radius: 24px !important; transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.5s !important; box-shadow: 0 15px 35px rgba(0,0,0,0.4) !important; } .sf-solution:hover { transform: translateY(-20px) rotateX(2deg) !important; box-shadow: 0 30px 60px rgba(230,51,34,0.4) !important; z-index: 10 !important; } .sf-solution small { background: rgba(255,255,255,0.2) !important; padding: 6px 12px !important; border-radius: 20px !important; width: fit-content !important; font-size: 13px !important; letter-spacing: 1px !important; } .sf-solution h3 { font-size: 30px !important; margin-bottom: 14px !important; letter-spacing: -0.5px !important; position: relative !important; z-index: 2 !important; line-height: 1.15 !important; } .sf-solution p { position: relative !important; z-index: 2 !important; } .sf-solution > b { display: inline-block !important; background: rgba(0,0,0,0.1) !important; padding: 12px 24px !important; border-radius: 30px !important; transition: background 0.3s !important; width: fit-content !important; font-size: 14px !important; position: relative !important; z-index: 2 !important; } .sf-solution:hover > b { background: rgba(0,0,0,0.3) !important; } .sf-solution.dark { background: linear-gradient(135deg, #111, #220000) !important; border: 1px solid #330000 !important; } .sf-solution.dark h3 { color: #f0f0f0 !important; text-shadow: 0 2px 10px rgba(0,0,0,0.5) !important; } .sf-solution.dark p { color: #aaaaaa !important; } .sf-solution.dark:after { border-color: rgba(230,51,34,0.5) !important; filter: drop-shadow(0 0 20px rgba(230,51,34,0.5)) !important; z-index: 1 !important; } .sf-solution.dark > b { background: rgba(255,255,255,0.1) !important; color: #fff !important; } .sf-solution.dark:hover > b { background: rgba(230,51,34,0.8) !important; } .sf-solution.paper { background: linear-gradient(135deg, #f0e6d6, #cbbca5) !important; color: #111 !important; border: 1px solid #cbbca5 !important; overflow: hidden !important; } .sf-solution.paper small { background: rgba(0,0,0,0.1) !important; } .sf-solution.paper h3 { font-size: 26px !important; max-width: 55% !important; color: #1a1a1a !important; } .sf-solution.paper p { font-size: 13px !important; max-width: 55% !important; color: #444 !important; } .sf-solution.paper i { position: absolute !important; right: 18px !important; bottom: 18px !important; width: 110px !important; height: 140px !important; background: #fff !important; border-radius: 12px !important; padding: 14px !important; font-size: 14px !important; font-weight: bold !important; font-style: normal !important; line-height: 1.2 !important; transform: rotate(6deg) !important; box-shadow: 10px 15px 30px rgba(0,0,0,0.2) !important; z-index: 1 !important; } .sf-solution.red { background: linear-gradient(135deg, #ff2a17, #b31008) !important; border: 1px solid #ff4d3d !important; } .sf-solution.red:after { color: #220000 !important; filter: drop-shadow(0 0 10px rgba(0,0,0,0.5)) !important; } .sf-solution.red > b { background: rgba(0,0,0,0.2) !important; } .sf-solution.red:hover > b { background: #000 !important; color: #fff !important; }`;
export default function StorefrontStyles() { return <style>{css + logoOverrides + heroOverrides + stripOverrides + sectionOverrides + featureOverrides + productOverrides + kitOverrides + footerOverrides + categoryHeroOverrides + bannerOverrides}</style> }
const categoryHeroOverrides = `
.sf-category-hero { 
  background: radial-gradient(ellipse at top, #2a0505 0%, #050505 80%) !important; 
  padding: 120px 6vw !important; 
  text-align: center !important; 
  border-bottom: 1px solid #1a1a1a !important;
  position: relative !important;
  overflow: hidden !important;
}
.sf-category-hero::before {
  content: '' !important;
  position: absolute !important;
  top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
  background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px) !important;
  background-size: 24px 24px !important;
  pointer-events: none !important;
}
.sf-category-hero .sf-kicker { 
  color: var(--red) !important; 
  background: rgba(230,51,34,0.08) !important; 
  border: 1px solid rgba(230,51,34,0.2) !important; 
  padding: 8px 24px !important; 
  border-radius: 30px !important; 
  display: inline-block !important; 
  letter-spacing: 3px !important; 
  font-size: 11px !important; 
  margin-bottom: 24px !important;
  position: relative !important;
  z-index: 2 !important;
}
.sf-category-hero h1 { 
  font-size: clamp(50px, 7vw, 90px) !important; 
  font-weight: 800 !important; 
  color: #fff !important; 
  letter-spacing: -2px !important; 
  line-height: 1.1 !important; 
  margin: 0 0 20px !important;
  position: relative !important;
  z-index: 2 !important;
}
.sf-category-hero h1::first-letter { 
  color: var(--red) !important; 
  text-shadow: 0 0 30px rgba(230,51,34,0.6) !important;
}
.sf-category-hero > p:not(.sf-kicker) { 
  color: #bbb !important; 
  font-size: 18px !important; 
  max-width: 600px !important; 
  margin: 0 auto 40px !important; 
  line-height: 1.6 !important;
  position: relative !important;
  z-index: 2 !important;
}
.sf-category-hero .sf-primary {
  position: relative !important;
  z-index: 2 !important;
}
`;
const footerOverrides = `
.sf-promise {
  background: #fff !important;
  color: #111 !important;
  border-top: 1px solid rgba(0,0,0,0.1) !important;
  padding: 50px 8vw !important;
}
.sf-promise span {
  font-size: 14px !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  gap: 15px !important;
  transition: transform 0.3s !important;
  cursor: default !important;
}
.sf-promise span:hover { transform: translateY(-5px) !important; color: var(--red) !important; }
.sf-promise span::first-letter { font-size: 28px !important; color: var(--red) !important; margin-bottom: 5px !important; display: inline-block !important; text-shadow: 0 4px 10px rgba(230,51,34,0.2) !important; }
/* ── Shared footer ── */
.sf-footer { background: #0a0a0a !important; padding: 0 !important; display: block !important; border-top: 1px solid #1e1e1e !important; color: #e0e0e0 !important; }
.sf-footer-inner { display: grid !important; grid-template-columns: 1.6fr 2.4fr !important; gap: 60px !important; padding: 64px 6vw 48px !important; border-bottom: 1px solid #1e1e1e !important; }
.sf-footer-brand .sf-logo img { width: 160px !important; height: auto !important; display: block !important; margin-bottom: 20px !important; }
.sf-footer-tagline { font-size: 15px !important; font-weight: 700 !important; color: #fff !important; margin: 0 0 10px !important; letter-spacing: -.3px !important; }
.sf-footer-sub { font-size: 13px !important; color: #888 !important; line-height: 1.6 !important; max-width: 280px !important; margin: 0 !important; }
.sf-footer-links { display: grid !important; grid-template-columns: repeat(4, 1fr) !important; gap: 32px !important; }
.sf-footer-col h4 { font-size: 11px !important; text-transform: uppercase !important; letter-spacing: 1.8px !important; color: #fff !important; font-weight: 700 !important; margin: 0 0 16px !important; }
.sf-footer-col a { display: block !important; font-size: 13px !important; color: #888 !important; text-decoration: none !important; margin-bottom: 10px !important; transition: color 0.2s !important; }
.sf-footer-col a:hover { color: var(--red) !important; }
.sf-footer-bottom { display: flex !important; justify-content: space-between !important; align-items: center !important; padding: 20px 6vw !important; font-size: 12px !important; color: #555 !important; }
.sf-footer-bottom-links { display: flex !important; gap: 22px !important; }
.sf-footer-bottom-links a { color: #555 !important; text-decoration: none !important; font-size: 12px !important; transition: color 0.2s !important; }
.sf-footer-bottom-links a:hover { color: #fff !important; }
@media (max-width: 900px) {
  .sf-footer-inner { grid-template-columns: 1fr !important; gap: 40px !important; padding: 48px 6vw 32px !important; }
  .sf-footer-links { grid-template-columns: repeat(2, 1fr) !important; gap: 24px !important; }
}
@media (max-width: 500px) {
  .sf-footer-links { grid-template-columns: 1fr 1fr !important; }
  .sf-footer-bottom { flex-direction: column !important; gap: 12px !important; text-align: center !important; }
}
`;
const kitOverrides = `
.sf-kit { 
  background: linear-gradient(135deg, #050505 0%, #150000 100%) !important; 
  position: relative !important;
  overflow: hidden !important;
  border-top: 1px solid #222 !important;
  padding: 100px 8vw !important;
  align-items: center !important;
}
.sf-kit::before {
  content: '' !important;
  position: absolute !important;
  top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
  background: radial-gradient(circle at 75% 50%, rgba(230,51,34,0.15) 0%, transparent 50%) !important;
  pointer-events: none !important;
}
.sf-kit > div:first-child {
  position: relative !important;
  z-index: 2 !important;
}
.sf-kit .sf-kicker { 
  color: var(--red) !important; 
  background: rgba(230,51,34,0.1) !important; 
  padding: 8px 16px !important; 
  border-radius: 20px !important; 
  border: 1px solid rgba(230,51,34,0.2) !important;
  letter-spacing: 2px !important;
  display: inline-block !important;
}
.sf-kit h2 { 
  font-size: clamp(45px, 5vw, 70px) !important; 
  font-weight: 800 !important; 
  letter-spacing: -2px !important; 
  line-height: 1.05 !important; 
  color: #fff !important;
  margin: 24px 0 !important;
}
.sf-kit p:not(.sf-kicker) { 
  color: #aaa !important; 
  font-size: 16px !important; 
  max-width: 420px !important; 
  margin-bottom: 40px !important;
  line-height: 1.6 !important;
}
.sf-kit .sf-light { 
  display: inline-flex !important;
  background: var(--red) !important; 
  color: #fff !important; 
  border-radius: 30px !important; 
  padding: 15px 30px !important; 
  font-size: 14px !important; 
  font-weight: 700 !important; 
  box-shadow: 0 8px 25px rgba(230,51,34,0.4) !important; 
  transition: transform 0.3s, box-shadow 0.3s !important;
  text-decoration: none !important;
  border: none !important;
  margin-top: 0 !important;
  align-items: center !important;
  gap: 8px !important;
}
.sf-kit .sf-light:hover { 
  transform: translateY(-4px) !important; 
  box-shadow: 0 12px 35px rgba(230,51,34,0.6) !important;
}
.sf-kit-art { 
  perspective: 1200px !important; 
  display: flex !important; 
  justify-content: center !important; 
  align-items: center !important;
  position: relative !important;
  height: 100% !important;
  min-height: 400px !important;
}
@keyframes floatBox {
  0%, 100% { transform: rotateY(-15deg) rotateX(5deg) translateY(0); }
  50% { transform: rotateY(-10deg) rotateX(8deg) translateY(-20px); }
}
.sf-kit-art b { 
  position: relative !important; 
  right: auto !important; 
  top: auto !important; 
  width: 320px !important; 
  height: 320px !important; 
  background: linear-gradient(145deg, #1a1a1a, #050505) !important; 
  border: 1px solid #333 !important;
  border-radius: 24px !important; 
  box-shadow: 30px 40px 60px rgba(0,0,0,0.6), inset 0 2px 10px rgba(255,255,255,0.05) !important; 
  display: flex !important; 
  flex-direction: column !important; 
  justify-content: center !important; 
  align-items: center !important;
  text-align: center !important;
  font-size: 48px !important;
  letter-spacing: -3px !important;
  animation: floatBox 6s ease-in-out infinite !important;
}
.sf-kit-art b i { 
  color: var(--red) !important; 
  font-style: normal !important;
  font-weight: 800 !important;
}
.sf-kit-art span { 
  position: absolute !important; 
  right: -30px !important; 
  top: -30px !important; 
  background: #fff !important; 
  color: #111 !important; 
  border-radius: 12px !important; 
  box-shadow: 0 20px 40px rgba(0,0,0,0.5) !important; 
  transform: translateZ(60px) rotate(12deg) !important;
  padding: 24px 28px !important;
  font-size: 18px !important;
  line-height: 1.2 !important;
  pointer-events: none !important;
}
`;
const productOverrides = `
.sf-products { background: #f6f3ee !important; padding-top: 80px !important; padding-bottom: 80px !important; }
.sf-products .sf-title h2 { color: #111 !important; }
.sf-products-grid { gap: 24px !important; }
.sf-product { 
  background: #fff !important; 
  border-radius: 20px !important; 
  overflow: hidden !important;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04) !important;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s !important;
  display: flex !important;
  flex-direction: column !important;
  border: 1px solid rgba(0,0,0,0.03) !important;
}
.sf-product:hover {
  transform: translateY(-8px) !important;
  box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important;
}
.sf-product-image { 
  height: 280px !important; 
  background: #f4efe6 !important; 
}
.sf-product-image img { 
  object-fit: cover !important; 
  mix-blend-mode: normal !important; 
  transition: transform 0.6s ease !important;
}
.sf-product:hover .sf-product-image img {
  transform: scale(1.06) !important;
}
.sf-product-image span { 
  background: var(--red) !important; 
  color: #fff !important;
  border-radius: 20px !important;
  top: 16px !important;
  left: 16px !important;
  padding: 6px 12px !important;
  letter-spacing: 1px !important;
  box-shadow: 0 4px 10px rgba(230,51,34,0.3) !important;
}
.sf-product > div { 
  padding: 24px !important; 
  display: flex !important; 
  flex-direction: column !important; 
  flex-grow: 1 !important;
}
.sf-product h3 { 
  font-size: 18px !important; 
  color: #111 !important; 
  margin: 0 0 10px !important;
  line-height: 1.3 !important;
  display: -webkit-box !important;
  -webkit-line-clamp: 2 !important;
  -webkit-box-orient: vertical !important;
  overflow: hidden !important;
}
.sf-product p { 
  color: #666 !important; 
  height: auto !important; 
  margin-bottom: 24px !important;
  line-height: 1.5 !important;
  font-size: 13px !important;
  display: -webkit-box !important;
  -webkit-line-clamp: 2 !important;
  -webkit-box-orient: vertical !important;
  overflow: hidden !important;
}
.sf-product-bottom { 
  margin-top: auto !important; 
  padding-top: 18px !important;
  border-top: 1px solid rgba(0,0,0,0.06) !important;
}
.sf-product-bottom strong { 
  font-size: 20px !important; 
  color: #111 !important;
}
.sf-product-bottom button { 
  background: rgba(230,51,34,0.08) !important;
  color: var(--red) !important;
  padding: 8px 18px !important;
  border-radius: 20px !important;
  transition: all 0.3s !important;
  display: flex !important;
  align-items: center !important;
  border: 1px solid transparent !important;
}
.sf-product-bottom button:hover {
  background: var(--red) !important;
  color: #fff !important;
  box-shadow: 0 4px 12px rgba(230,51,34,0.3) !important;
  transform: translateY(-2px) !important;
}
.sf-product-bottom button b {
  font-size: 18px !important;
  margin-left: 6px !important;
}
`;
const bannerOverrides = `
/* ── Dynamic Banner (HomepageBanner component) ───────────────────── */
.dynamic-banner {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: transparent;
  margin: 0;
  padding: 0;
  line-height: 0;
}
.dynamic-banner-track {
  display: flex;
  height: 100%;
  will-change: transform;
  transition: transform 0.75s cubic-bezier(0.77, 0, 0.175, 1);
  margin: 0;
  padding: 0;
}
.dynamic-banner-slide {
  flex: 0 0 100%;
  position: relative;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
.dynamic-banner-slide img {
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
}
.dynamic-banner-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 55%, transparent 100%);
}
.dynamic-banner-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 7vw;
  color: #fff;
  max-width: 660px;
  line-height: normal;
}
.dynamic-banner-offer {
  display: inline-block;
  background: var(--red, #e63322);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 6px 14px;
  border-radius: 20px;
  margin-bottom: 16px;
  width: fit-content;
}
.dynamic-banner-content h1 {
  font-size: clamp(28px, 4.5vw, 68px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -2px;
  margin: 0 0 12px;
  color: #fff;
  text-shadow: 0 2px 12px rgba(0,0,0,0.4);
}
.dynamic-banner-content p {
  font-size: clamp(13px, 1.5vw, 18px);
  line-height: 1.55;
  color: rgba(255,255,255,0.88);
  margin: 0 0 26px;
  max-width: 480px;
}
.dynamic-banner-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--red, #e63322);
  color: #fff !important;
  font-size: 13px;
  font-weight: 700;
  padding: 13px 26px;
  border-radius: 30px;
  text-decoration: none;
  width: fit-content;
  box-shadow: 0 6px 20px rgba(230,51,34,0.45);
  transition: transform 0.3s, box-shadow 0.3s;
}
.dynamic-banner-cta:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(230,51,34,0.6);
}
.dynamic-banner-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(4px);
  border: 2px solid rgba(255,255,255,0.35);
  color: #fff;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  line-height: 1;
  font-family: Arial, sans-serif !important;
  cursor: pointer;
  transition: background 0.25s ease, transform 0.25s ease, border-color 0.25s ease;
  z-index: 20;
  box-shadow: 0 4px 16px rgba(0,0,0,0.4);
  padding: 0;
  outline: none;
}
.dynamic-banner-control:hover {
  background: rgba(230,51,34,0.85);
  border-color: rgba(230,51,34,0.6);
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 6px 24px rgba(230,51,34,0.5);
}
.dynamic-banner-control.prev { left: 20px; }
.dynamic-banner-control.next { right: 20px; }
.dynamic-banner-control span {
  font-family: Arial, Helvetica, sans-serif !important;
  font-size: 28px !important;
  font-weight: 300 !important;
  line-height: 1 !important;
  color: #fff !important;
  display: block;
  margin-top: -2px;
}
.dynamic-banner-dots {
  position: absolute;
  bottom: 18px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
}
.dynamic-banner-dots button {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.45);
  cursor: pointer;
  padding: 0;
  transition: background 0.25s, transform 0.25s;
}
.dynamic-banner-dots button.active {
  background: #fff;
  transform: scale(1.4);
}

/* ── Fallback hero (shown when no banners are active) ─────────────── */
.hero-epic {
  position: relative;
  min-height: 560px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  background: #e4d9ca;
}
.hero-bg { position: absolute; inset: 0; }
.hero-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #f0ebe2 0%, #d9cfbf 100%);
}
.hero-shapes { position: absolute; inset: 0; pointer-events: none; }
.shape { position: absolute; border-radius: 50%; opacity: 0.12; }
.shape-1 { width: 520px; height: 520px; background: #e63322; top: -200px; right: -100px; }
.shape-2 { width: 300px; height: 300px; background: #e63322; bottom: -120px; left: -80px; }
.shape-3 { width: 160px; height: 160px; background: #111; top: 60px; left: 35%; }
.hero-epic .container { max-width: 1240px; margin: 0 auto; padding: 0 5.5vw; position: relative; z-index: 2; }
.hero-content { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 60px; padding: 100px 0 80px; }
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(230,51,34,0.1);
  border: 1px solid rgba(230,51,34,0.25);
  color: #e63322;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 8px 16px;
  border-radius: 20px;
  margin-bottom: 22px;
}
.hero-title {
  font-size: clamp(44px, 5.5vw, 76px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -3px;
  color: #151515;
  margin: 0 0 20px;
}
.title-line { display: flex; gap: 14px; }
.title-word { color: #e63322; }
.hero-description {
  font-size: 17px;
  line-height: 1.6;
  color: #555;
  max-width: 460px;
  margin: 0 0 32px;
}
.hero-actions { display: flex; gap: 14px; margin-bottom: 50px; }
.hero-actions .btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  border-radius: 30px;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.3s, box-shadow 0.3s;
}
.btn-primary {
  background: #e63322;
  color: #fff;
  box-shadow: 0 6px 20px rgba(230,51,34,0.4);
}
.btn-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 28px rgba(230,51,34,0.55); }
.btn-secondary { border: 2px solid #222; color: #222; }
.btn-secondary:hover { background: #111; color: #fff; }
.hero-stats { display: flex; gap: 32px; }
.stat { display: flex; align-items: center; gap: 12px; }
.stat-icon { width: 40px; height: 40px; background: rgba(230,51,34,0.1); border-radius: 10px; display: grid; place-items: center; color: #e63322; font-size: 16px; }
.stat-number { display: block; font-size: 20px; font-weight: 800; letter-spacing: -1px; color: #151515; }
.stat-label { display: block; font-size: 10px; color: #777; text-transform: uppercase; letter-spacing: 1px; }
.hero-products { position: relative; height: 380px; }
.product-float { position: absolute; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.15); }
.product-float img { width: 100%; height: 100%; object-fit: cover; }
.product-1 { width: 280px; height: 340px; top: 20px; left: 50%; transform: translateX(-50%); }
.scroll-hint {
  position: absolute;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: #777;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1px;
  animation: bounce 2s infinite;
  z-index: 2;
}
@keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(8px)} }

@media(max-width:850px) {
  .dynamic-banner-content h1 { font-size: clamp(22px,6vw,42px); }
  .hero-content { grid-template-columns:1fr; padding:70px 0 50px; gap:30px; }
  .hero-right { display:none; }
  .hero-stats { gap:18px; }
}
@media(max-width:500px) {
  .dynamic-banner-control { display:none; }
  .hero-title { font-size:44px; letter-spacing:-2px; }
}
`;
const featureOverrides = `.sf-feature { min-height: auto !important; } .sf-feature > div:last-child { padding: 30px 6vw !important; display: flex !important; flex-direction: column !important; justify-content: center !important; } .sf-feature h2 { font-size: clamp(26px, 3vw, 42px) !important; font-weight: 800 !important; letter-spacing: -1.5px !important; line-height: 1.1 !important; margin-bottom: 8px !important; } .sf-feature h2 em { color: var(--red) !important; font-style: normal !important; text-shadow: 0 0 15px rgba(230,51,34,0.3) !important; } .sf-feature > div:last-child > p:not(.sf-kicker) { font-size: 13px !important; line-height: 1.5 !important; color: #555 !important; max-width: 320px !important; margin-bottom: 14px !important; } .sf-feature ul { margin: 0 0 14px !important; } .sf-feature li { padding: 7px 0 !important; font-size: 12px !important; font-weight: 600 !important; border-top: 1px solid rgba(0,0,0,0.1) !important; display: flex !important; align-items: center !important; gap: 10px !important; } .sf-feature li b { color: var(--red) !important; font-size: 10px !important; font-weight: 800 !important; letter-spacing: 1px !important; background: rgba(230,51,34,0.08) !important; padding: 3px 7px !important; border-radius: 10px !important; min-width: 26px !important; text-align: center !important; } .sf-feature-art { min-height: unset !important; max-height: unset !important; height: 100% !important; } .sf-feature-art:after { width: 400px !important; height: 400px !important; bottom: -220px !important; left: -130px !important; border-width: 50px !important; } .sf-feature-art span { font-size: 130px !important; letter-spacing: -32px !important; } .sf-feature-art i { width: 300px !important; height: 300px !important; font-size: 11px !important; letter-spacing: 3px !important; } .sf-feature a { display: inline-flex !important; align-items: center !important; gap: 8px !important; background: var(--red) !important; color: #fff !important; padding: 10px 20px !important; border-radius: 30px !important; font-size: 13px !important; font-weight: 700 !important; text-decoration: none !important; transition: all 0.3s !important; box-shadow: 0 5px 15px rgba(230,51,34,0.35) !important; } .sf-feature a:hover { transform: translateY(-3px) !important; box-shadow: 0 10px 25px rgba(230,51,34,0.5) !important; }`;
