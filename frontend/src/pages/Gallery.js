import React from 'react';

const galleryImages = [
  { id: 1, src: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=navodaya%20trendz%20tshirts&image_size=square_hd', alt: 'T-Shirts' },
  { id: 2, src: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=navodaya%20trendz%20hoodies&image_size=square_hd', alt: 'Hoodies' },
  { id: 3, src: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=navodaya%20trendz%20mementos&image_size=square_hd', alt: 'Mementos' },
  { id: 4, src: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=navodaya%20trendz%20accessories&image_size=square_hd', alt: 'Accessories' },
  { id: 5, src: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=navodaya%20trendz%20alumni%20event&image_size=square_hd', alt: 'Alumni Event' },
  { id: 6, src: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=navodaya%20trendz%20merchandise%20collage&image_size=square_hd', alt: 'Merchandise' }
];

const Gallery = () => {
  return (
    <div className="gallery-page">
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title">Gallery</h1>
          <p className="page-subtitle">Explore our Navodaya Trendz collection</p>
        </div>
      </section>

      <section className="gallery-section">
        <div className="container">
          <div className="gallery-grid">
            {galleryImages.map((image) => (
              <div key={image.id} className="gallery-item">
                <img src={image.src} alt={image.alt} className="gallery-img" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
