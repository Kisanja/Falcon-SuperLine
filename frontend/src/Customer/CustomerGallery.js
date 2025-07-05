import React from 'react';
import { motion } from 'framer-motion';
import CustomerHeader from './CustomerHeader';
import './CustomerGallery.css';

// Import all gallery images
import img1 from '../assets/gallery1.jpg';
import img2 from '../assets/gallery2.jpg';
import img3 from '../assets/gallery3.jpg';
import img4 from '../assets/gallery1.jpg';
import img5 from '../assets/gallery3.jpg';
import img6 from '../assets/gallery2.jpg';
import img7 from '../assets/gallery3.jpg';
import img8 from '../assets/gallery1.jpg';

const CustomerGallery = () => {
  const galleryImages = [img1, img2, img3, img4, img5, img6, img7, img8];

  return (
    <>
      <div className="gallery-header-wrapper">
        <CustomerHeader />
      </div>

      <div className="container my-5 gallery-section">
        <motion.h2
          className="mb-4 gallery-heading"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Our Gallery
        </motion.h2>

        <div className="row g-4">
          {galleryImages.map((img, idx) => (
            <motion.div
              className="col-md-4 col-sm-6"
              key={idx}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="gallery-card shadow rounded">
                <img
                  src={img}
                  alt={`Gallery ${idx + 1}`}
                  className="img-fluid rounded gallery-img"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CustomerGallery;
