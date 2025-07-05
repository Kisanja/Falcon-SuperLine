import React from 'react';
import CustomerHeader from './CustomerHeader';
import { Carousel } from 'react-bootstrap';
import { motion } from 'framer-motion';
import './Dashboard.css';
import Footer from './Footer';

// Swiper Imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

// Hero Images
import img1 from '../assets/hero1.jpg';
import img2 from '../assets/hero2.jpg';
import img3 from '../assets/hero3.jpg';
import img4 from '../assets/hero4.jpg';
import img5 from '../assets/hero5.jpg';

// Destination Images
import imgBadullaColombo from '../assets/badulla.jpg';
import imgBadullaKandy from '../assets/kandy.jpg';
import imgMataraColombo from '../assets/matara.jpg';
import imgKollupitiyaKaduwela from '../assets/colombo.jpg';
import imgKurunagalaColombo from '../assets/kurunagala.jpg';

const Dashboard = () => {
  const popularRoutes = [
    { route: 'Badulla 99 Colombo', img: imgBadullaColombo },
    { route: 'Badulla 21 Kandy', img: imgBadullaKandy },
    { route: 'Matara 02 Colombo', img: imgMataraColombo },
    { route: 'Kollupity 177 Kaduwela', img: imgKollupitiyaKaduwela },
    { route: 'Colombo 15 Kurunagala', img: imgKurunagalaColombo }
  ];

  return (
    <div>
      <CustomerHeader />

      {/* 🔹 Hero Carousel */}
      <Carousel
        fade
        interval={3000}
        controls
        indicators={false}
        pause={false}
        className="custom-carousel"
      >
        {[img1, img2, img3, img4, img5].map((img, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100 hero-img"
              src={img}
              alt={`Slide ${index + 1}`}
            />
          </Carousel.Item>
        ))}
      </Carousel>

      {/* 🔹 Company Profile Section */}
      <section className="company-profile container my-5">
        <motion.div
          className="row"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="col-md-6 mb-4">
            <h3 className="text-primary">Company Profile</h3>
            <p>
              Falcon SuperLine is a leading name in Sri Lankan transportation, known for its commitment to quality and comfort. 
              Our fleet includes a range of vehicles from economy to ultra-luxury, ensuring a perfect fit for every passenger’s needs. 
              Whether you're commuting across cities or traveling with family, Falcon ensures a safe, smooth, and dependable journey.
            </p>
          </div>
          <div className="col-md-6">
            <ul className="list-unstyled">
              <li>● Multiple travel classes: economy to luxury</li>
              <li>● Expert drivers trained in safety protocols</li>
              <li>● On-time arrivals and streamlined boarding</li>
              <li>● Routes connecting major towns and tourist hotspots</li>
              <li>● Commitment to cleanliness, comfort, and care</li>
            </ul>
          </div>
        </motion.div>
      </section>

      {/* 🔹 Popular Designations */}
      <section className="popular-designations py-5">
        <div className="container">
          <motion.h3
            className="text-primary mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Our Most Popular Designations
          </motion.h3>

          {/* Swiper Container with Custom Arrows */}
          <div className="swiper-container-wrapper position-relative">
            <Swiper
              modules={[Navigation]}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              spaceBetween={20}
              breakpoints={{
                0: { slidesPerView: 1 },
                576: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                992: { slidesPerView: 4 }
              }}
            >
              {popularRoutes.map((item, idx) => (
                <SwiperSlide key={idx}>
                  <motion.div
                    className="destination-card shadow-sm rounded"
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="destination-image-wrapper">
                      <img
                        src={item.img}
                        alt={item.route}
                        className="img-fluid rounded"
                      />
                      <div className="route-overlay">{item.route}</div>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Prev/Next Buttons */}
            <div className="swiper-button-prev-custom">&#10094;</div>
            <div className="swiper-button-next-custom">&#10095;</div>
          </div>
        </div>
      </section>
      {/* 🔹 About Us Section */}
<section className="about-us-section py-5 bg-light">
  <div className="container">
    <motion.h3
      className="text-primary mb-3"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      About Us
    </motion.h3>

    <motion.p
      className="about-text"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.8 }}
      viewport={{ once: true }}
    >
      At Falcon SuperLine, we take pride in being one of Sri Lanka’s most dependable and forward-thinking transport providers. 
      Our journey began with a vision to redefine comfort, safety, and accessibility in intercity travel. 
      With a modern fleet categorized into Super Luxury, Luxury, Semi-Luxury, and Standard classes, we offer seamless travel experiences 
      that cater to every passenger’s need. Trusted by thousands, we continue to expand our services across the island, ensuring punctuality, 
      professionalism, and unmatched reliability on every route we serve.
    </motion.p>
  </div>
</section>
<section className="mission-vision-section py-5">
  <div className="container">
    <motion.h3
      className="text-white mb-4"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      Our Mission & Vision
    </motion.h3>

    <div className="row text-white">
      <motion.div
        className="col-md-6 mb-4"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h5 className="fw-bold text-primary">Our Mission</h5>
        <p>
          To deliver dependable, safe, and customer-focused transportation across Sri Lanka —
          redefining intercity travel with consistency and care.
        </p>
      </motion.div>
      <motion.div
        className="col-md-6"
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h5 className="fw-bold text-primary">Our Vision</h5>
        <p>
          To be Sri Lanka’s leading and most innovative transport brand,
          trusted for excellence, nationwide reach, and continuous improvement.
        </p>
      </motion.div>
    </div>
  </div>
</section>

{/* 🔹 Why Choose Falcon Section */}
<section className="why-falcon-section py-5">
  <div className="container">
    <motion.h3
      className="text-primary mb-4"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      Why Choose Falcon?
    </motion.h3>

    <div className="row g-4">
      {[
        { icon: '🛏️', title: 'Reclining Seats', desc: 'Enjoy adjustable, spacious seating for a more relaxing journey.' },
        { icon: '⏰', title: 'On-Time Departures', desc: 'We pride ourselves on 99.5% punctuality across all routes.' },
        { icon: '🧼', title: 'Daily Sanitized Buses', desc: 'Your safety matters — every vehicle is cleaned before departure.' },
        { icon: '🧑‍✈️', title: 'Trained Drivers', desc: 'All drivers are certified and trained for both safety and courtesy.' },
        { icon: '🌍', title: 'Island-Wide Coverage', desc: 'From city centers to remote towns, we’ve got Sri Lanka covered.' },
        { icon: '💳', title: 'Easy Booking', desc: 'Book online or on mobile — fast, secure, and always available.' },
      ].map((item, idx) => (
        <motion.div
          key={idx}
          className="col-md-4 col-sm-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
          viewport={{ once: true }}
        >
          <div className="why-card p-4 shadow-sm rounded text-center h-100">
            <div className="display-5">{item.icon}</div>
            <h5 className="fw-bold mt-3 mb-2 text-dark">{item.title}</h5>
            <p className="text-secondary small mb-0">{item.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>

<Footer />
    </div>
  );
};

export default Dashboard;
