import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.scss';
import { Home, Info, ShoppingBag, FileText, Mail, Building2, MessageSquare, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Footer } from '../components/common/Footer/Footer';
import { Navbar } from '../components/common/Navbar/Navbar';

// Import images
import HeroImg from '../assets/images/bg/new_hero_bg.jpg';
import FirmImg from '../assets/images/bg/firm_img.jpg';
import OrganicImg from '../assets/images/bg/organic-section.jpg';
import WholesaleLogo from '../assets/images/logos/WholesaleLogo.png';
import WholesaleLogo2 from '../assets/images/logos/WholesaleLogo2.png';
import QualityImg1 from '../assets/images/bg/imgg1.jpg'; // Safe Ingredients
import QualityImg2 from '../assets/images/bg/imgg2.jpg'; // Ideal Growing Environment
import QualityImg3 from '../assets/images/bg/imgg3.jpg'; // Scientifically Tested
import QualityImg4 from '../assets/images/bg/imgg4.jpg'; // Quality Control
import QualityImg5 from '../assets/images/bg/imgg5.jpg'; // Satisfaction
import QualityImg6 from '../assets/images/bg/imgg.jpg';   // Certified Organic
import ProductBg1 from '../assets/images/bg/ProductBg1.jpg'; // Blogs background
import MadeUsaBadge from '../assets/images/bg/made-usa.webp'; // Made in USA badge
import SafeBadge from '../assets/images/bg/image.png'; // Safe badge
import AboutImg from '../assets/images/bg/imgg.jpg'; // About section image
import WebsiteShowcase from '../assets/images/bg/website_showcase.png'; // Natural medicine website
import ProfileImg from '../assets/images/bg/ProfileImg.png'; // Profile image for testimonials
import BlogImg1 from '../assets/images/bg/BlogImg1.jpg'; // Blog image 1
import BlogImg2 from '../assets/images/bg/BlogImg2.jpg'; // Blog image 2
import BlogImg3 from '../assets/images/bg/BlogImg3.jpg'; // Blog image 3
import VidImg from '../assets/images/bg/vid-img.png'; // Video image for compliance section
import HerbIcon from '../assets/images/bg/herb.png'; // Herbs category
import VitaminsIcon from '../assets/images/bg/vitamins.png'; // Vitamins category
import BulkHerbIcon from '../assets/images/bg/bulkherb.png'; // Bulk Herbs category
import TeaIcon from '../assets/images/bg/tea.png'; // Teas category
import OilsIcon from '../assets/images/bg/oils.png'; // Oils category
import IncenseIcon from '../assets/images/bg/incense.png'; // Incense category
import HeroSliderImg1 from '../assets/images/bg/HeroSliderImg1.jpg'; // Hero slide 1
import HeroSliderImg2 from '../assets/images/bg/HeroSliderImg2.jpg'; // Hero slide 2
import HeroSliderImg3 from '../assets/images/bg/HeroSliderImg3.jpg'; // Hero slide 3

export const HomePage = () => {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [showAllDepts, setShowAllDepts] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [showChamberReviews, setShowChamberReviews] = useState(false);
  const [currentReviewSlide, setCurrentReviewSlide] = useState(0);

  // Fetch categories for departments (works with or without login)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('userToken');
        
        // Try with backend (supports both logged in and non-logged in users)
        const response = await axios.get(`${BASE_URL}/api/user/categories`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const data = Array.isArray(response.data) ? response.data : [];
        
        // Define the 10 departments we want to show
        const departmentNames = [
          'Single Herbal Liquid Extracts', 
          'Herbal Formula Liquid Extracts', 
          'CBD', 
          'Kids Formulas', 
          'Carrier Oils', 
          'Essential Oils', 
          'Herbal Oils', 
          'Herbal Powders', 
          'Empty Bottles', 
          'Literature'
        ];
        
        // Filter to only show the 10 departments in order
        const filteredCategories = departmentNames
          .map(name => data.find(cat => cat.name === name))
          .filter(cat => cat !== undefined);
        
        setCategories(filteredCategories);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching categories:', err);
        // Fallback to default departments if API fails
        setCategories([]);
        setLoading(false);
      }
    };

    fetchCategories();
  }, [BASE_URL]);

  // Hero slider auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % 3); // 3 slides
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const departments = categories.length > 0 
    ? categories.map(c => c.name)
    : [
        'Single Herbal Liquid Extracts', 
        'Herbal Formula Liquid Extracts', 
        'CBD', 
        'Kids Formulas', 
        'Carrier Oils', 
        'Essential Oils', 
        'Herbal Oils', 
        'Herbal Powders', 
        'Empty Bottles', 
        'Literature'
      ];

  // Top 5 best reviews for the chamber section
  const topReviews = [
    {
      name: "Irene Blackson",
      platform: "Google",
      date: "Aug 4th, 2023",
      rating: 5,
      text: "My favorite destination for health-focused products and advice in Prince Frederick is Ray's Healthy Living Store.\n\nMy doctor ended up giving me a foot brace after I broke my ankle, and it was a struggle to move around the house. Out of desperation, I sought out Ray.\n\nHe gave me various supplements that ended up speeding my recovery greatly, and in less than 3 weeks I was out and walking without my foot brace.",
      initial: "I"
    },
    {
      name: "James Mbah",
      platform: "Google",
      date: "Apr 28th, 2024",
      rating: 5,
      text: "Rays Maximum Cardio is by far the best dietary supplement I have come across. You immediately feel the difference and the shift within once you begin to apply use.\n\nThis product lives up to everything it states from energy, strength, mental clarity, stamina, immunity & muscle growth!\n\nRays Maximum Cardio has truly helped to make me feel 10-15 yrs younger and even surpass physical limitations that were once a barrier for myself.",
      initial: "J"
    },
    {
      name: "Crystal Goldring",
      platform: "Google",
      date: "Mar 22nd, 2024",
      rating: 5,
      text: "This place is so awesome and available! It is extremely important now to care for your inner self.\n\nOur immunity, organs and mental health need all what a daily diet can provide. I enjoy my visits immensely.\n\nI can definitively say, you will not find a business today like Rays. I recommend anyone to just visit, you will leave with a wealth of knowledge.",
      initial: "C"
    },
    {
      name: "Belinda Barber",
      platform: "Google",
      date: "Feb 6th, 2024",
      rating: 5,
      text: "I absolutely love that Rays Healthy Living is located in my backyard (Prince Frederick). The store always has what I need and if not, the owner Mr. Ray will order for me.\n\nHis prices are reasonable and offers discounts. His knowledgeable and will gives samples without you making a purchase.\n\nRay genuinely cares about the health of the community.",
      initial: "B"
    },
    {
      name: "Rana Latin",
      platform: "Google",
      date: "Jan 1st, 2024",
      rating: 5,
      text: "I LOVE going into Rays - Healthy Living, its always time well spent. I am learning how to care for myself and my family.\n\nMy health is wealth goes without saying. I am extremely blessed every time I go in the store.\n\nIf you haven't been to his store (Located in Prince Frederick) Run don't walk, you won't be disappointed. Trust me!",
      initial: "R"
    }
  ];

  // Auto-slide functionality for chamber reviews
  useEffect(() => {
    if (showChamberReviews) {
      const slideInterval = setInterval(() => {
        setCurrentReviewSlide((prev) => (prev + 1) % topReviews.length);
      }, 5000); // Change slide every 5 seconds
      return () => clearInterval(slideInterval);
    }
  }, [showChamberReviews, topReviews.length]);

  // Chamber reviews functions
  const toggleChamberReviews = () => {
    setShowChamberReviews(!showChamberReviews);
    if (!showChamberReviews) {
      setCurrentReviewSlide(0);
    }
  };

  const nextReviewSlide = () => {
    const newSlide = (currentReviewSlide + 1) % topReviews.length;
    console.log('Next slide:', newSlide);
    setCurrentReviewSlide(newSlide);
  };

  const prevReviewSlide = () => {
    const newSlide = (currentReviewSlide - 1 + topReviews.length) % topReviews.length;
    console.log('Previous slide:', newSlide);
    setCurrentReviewSlide(newSlide);
  };

  const goToReviewSlide = (index) => {
    console.log('Go to slide:', index);
    setCurrentReviewSlide(index);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star 
        key={index} 
        size={16} 
        className={index < rating ? 'star-filled' : 'star-empty'}
        fill={index < rating ? '#FFB800' : 'none'}
        style={{color: index < rating ? '#FFB800' : '#d1d5db'}}
      />
    ));
  };

  const categoryIcons = ['Herbs', 'Vitamins', 'Bulk Herbs', 'Teas', 'Oils', 'Incense'];

  const benefits = [
    ['Free shipping', 'On orders over $99', '▱'],
    ['Guarantee', '30 days money back', '↔'],
    ['Safe payment', 'Safe your online payment', '▭'],
    ['Online support', 'We have support 24/7', '◎'],
  ];

  const qualityFeatures = [
    {
      title: 'Safe ingredients',
      text: 'Every product is made using only safe, natural ingredients derived from premium organic herbs and fruits.',
      image: QualityImg1
    },
    {
      title: 'Ideal growing environment',
      text: 'Our herbs and fruits are sourced from ideal growing environments for highest quality and potency.',
      image: QualityImg2
    },
    {
      title: 'Scientifically tested',
      text: 'Our manufacturers employ advanced techniques to ensure our herbs and fruits are of highest quality.',
      image: QualityImg3
    },
    {
      title: 'Quality control',
      text: 'Strict quality control measures throughout our supply chain. Each batch undergoes rigorous testing.',
      image: QualityImg4
    },
    {
      title: 'Satisfaction',
      text: 'We are committed to customer satisfaction and stand behind our products with a hassle-free return policy.',
      image: QualityImg5
    },
    {
      title: 'Certified organic',
      text: 'We partner with certified organic farmers and responsible harvesters for sustainable sourcing.',
      image: QualityImg6
    },
  ];

  const handleShopClick = (categoryId) => {
    if (categoryId) {
      navigate(`/products?category=${categoryId}`);
    } else {
      navigate('/products');
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      console.log('Newsletter signup:', email);
      setEmail('');
      alert('Thank you for subscribing!');
    }
  };

  const heroImages = [HeroImg, FirmImg, OrganicImg];

  const heroSlides = [
    {
      image: HeroSliderImg1,
      title: 'Pure Wellness',
      subtitle: 'Naturally Yours',
      text: 'Ray\'s Healthy Living offers organic supplements for your family\'s health. Safe, natural, and affordable, our vitamins boost vitality. Shop online or in-store today.'
    },
    {
      image: HeroSliderImg2,
      title: 'Nature\'s Best',
      subtitle: 'for Your Family',
      text: 'Discover Ray\'s Healthy Living\'s organic supplements. Crafted for safety and affordability, our natural vitamins enhance family wellness. Shop online or at our stores now.'
    },
    {
      image: HeroSliderImg3,
      title: 'Vitality Starts',
      subtitle: 'with Nature',
      text: 'Elevate health with Ray\'s Healthy Living\'s organic vitamins. Safe, affordable, and natural, our supplements boost vitality. Shop online or in-store today.'
    }
  ];

  return (
    <main className="landing-page">
      {/* NAVBAR */}
      <Navbar />

      {/* HERO SECTION WITH SLIDER */}
      <section 
        className="hero wrap hero-slider" 
        id="top" 
        style={{
          backgroundImage: `url(${heroSlides[heroIndex].image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          transition: 'background-image 1s ease-in-out',
          minHeight: '600px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingLeft: '60px'
        }}
      >
        <div className="hero-overlay" />
        <div className="hero-copy">
          <p className="hero-eyebrow">RAY'S HEALTHY LIVING</p>
          <h1 className="hero-title">
            <span className="hero-main">{heroSlides[heroIndex]?.title || "Pure Wellness"}</span>
            <br />
            <span className="hero-accent">{heroSlides[heroIndex]?.subtitle || "Naturally Yours"}</span>
          </h1>
          <p className="hero-description">{heroSlides[heroIndex]?.text || "Ray's Healthy Living offers organic supplements for your family's health."}</p>
          <a className="orange-button hero-button" href="/products">Shop products <span>→</span></a>
        </div>
        <div className="hero-slider-dots">
          {heroSlides.map((_, idx) => (
            <button 
              key={idx}
              className={`dot ${idx === heroIndex ? 'active' : ''}`}
              onClick={() => setHeroIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* DEPARTMENTS SECTION */}
      <section className="department-section wrap" id="departments">
        <div className="section-heading">
          <div>
            <p className="eyebrow orange-text">EXPLORE OUR COLLECTION</p>
            <h2>Shop by Department</h2>
          </div>
          <button className="dept-toggle-btn" onClick={() => setShowAllDepts(!showAllDepts)}>
            {showAllDepts ? (
              <><span>Show Less</span><span className="toggle-arrow up">▲</span></>
            ) : (
              <><span>View all departments</span><span className="toggle-arrow">▼</span></>
            )}
          </button>
        </div>

        {/* default: 5 cards, expanded: max 15 */}
        <div className={`dept-cards-row ${showAllDepts ? 'dept-expanded' : ''}`}>
          {(showAllDepts ? departments.slice(0, 15) : departments.slice(0, 5)).map((dept, idx) => {
            return (
              <button
                key={idx}
                className="dept-card"
                onClick={() => navigate('/products')}
                title={`Browse ${dept} products`}
              >
                <span className="dept-card-icon">🌿</span>
                <span className="dept-card-name">{dept}</span>
                <span className="dept-card-arrow">→</span>
              </button>
            );
          })}
        </div>

        {/* CATEGORY ICONS SECTION */}
        <div className="category-icons-section">
          <div className="category-icon-grid">
            {[
              { name: 'Herbs', image: HerbIcon },
              { name: 'Vitamins', image: VitaminsIcon },
              { name: 'Bulk Herbs', image: BulkHerbIcon },
              { name: 'Teas', image: TeaIcon },
              { name: 'Oils', image: OilsIcon },
              { name: 'Incense', image: IncenseIcon }
            ].map((category, idx) => (
              <button
                key={idx}
                className="category-icon-card"
                onClick={() => navigate('/products')}
                title={`Browse ${category.name}`}
              >
                <div className="category-icon-image">
                  <img src={category.image} alt={category.name} />
                </div>
                <span className="category-icon-label">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* RESELLER SECTION */}
      <section className="reseller-section" id="wholesale">
        <div className="reseller wrap">
          <p className="eyebrow orange-text">WHOLESALE PARTNERSHIPS</p>
          <h2>Become an Authorized Ray's<br />Healthy Living Reseller</h2>
          <div className="reseller-intro">
            Ray's healthy living products are available at wholesale pricing to qualified resellers including retailers, health care practitioners, and e-commerce retailers. For additional information or to apply to become a wholesale customer, please <a href="/auth/login">Login to access WHOLESALE REGISTRATION FORM</a> for approval.
          </div>
          <div className="reseller-grid">
            <article>
              <h3>Wholesale accounts</h3>
              <p>If you are an established business licensed to sell nutritional, medical and/or athletic products, you may be qualified to receive wholesale prices on our products. To get started, <a href="/auth/login">Login to access WHOLESALE REGISTRATION FORM</a>. Please upload copies of your business license or other documentation for verification at the bottom on the same form, fax them to <strong>443-432-3295</strong> or email them to <a href="mailto:info@rayshealthyliving.com">info@rayshealthyliving.com</a></p>
            </article>
            <article>
              <h3>Distributor accounts</h3>
              <p>If you are an established distributor licensed to sell nutritional, medical and/or athletic products, you may wish to offer the Ray's Healthy Living line to your wholesale customers. Based upon volume, distributors may be qualified to receive discounts off wholesale prices! Please <a href="/auth/login">Login to access DISTRIBUTOR REGISTRATION FORM</a> and provide us with a copy of your business license and letter on your business letterhead describing your business, lines carried and areas served for verification. Please upload your documents, fax them to <strong>443-432-3295</strong> or email to <a href="mailto:info@rayshealthyliving.com">info@rayshealthyliving.com</a></p>
            </article>
          </div>
        </div>
      </section>

      {/* QUALITY SECTION */}
      <section className="quality-section">
        <div className="wrap">
          <p className="eyebrow orange-text" style={{textAlign: 'center', marginBottom: 8}}>OUR COMMITMENT</p>
          <h2 style={{textAlign: 'center', fontSize: 'clamp(38px, 5vw, 62px)', margin: '0 0 28px'}}>Quality, Safety, And Satisfaction</h2>
          <div className="quality-rule" />
          <div className="quality-grid">
            {qualityFeatures.map((feature, idx) => (
              <article key={idx} className="quality-card">
                <div className="quality-image">
                  <img src={feature.image} alt={feature.title} />
                </div>
                <div className="quality-copy">
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SOURCING SECTION */}
      <section className="sourcing-section">
        <div className="sourcing-card">
          <p className="eyebrow">OUR VALUES</p>
          <h2>Organic and Ethical Sourcing</h2>
          <div className="sourcing-rule" />
          <p>Quality is the foundation of our work, which is why we partner with certified organic farmers and responsible wild harvesters. We are committed to sustainability and do not source endangered herbs. Our carefully chosen growers and wild crafters share our dedication to ethical harvesting practices and environmental conservation.</p>
        </div>
      </section>

      {/* NATURAL MEDICINE SECTION */}
      <section className="natural-section" id="natural" style={{backgroundColor: '#7d9f48'}}>
        <div className="natural wrap">
          <div className="natural-content">
            <p className="eyebrow">RAY'S HEALTHY LIVING</p>
            <h2>Better Choices. Better Health. Better Living.</h2>
            <div className="natural-rule" />
            <p>Ray’s Healthy Living brings together quality wellness products designed to support a healthier, more active lifestyle.
From carefully selected nutritional products and supplements to everyday wellness essentials, our goal is simple — to make trusted health and wellness solutions accessible, convenient, and easy to understand.
We believe healthy living starts with better choices. That is why we focus on product quality, responsible sourcing, safety, and customer satisfaction at every stage
</p>
          </div>
          <div className="natural-art" style={{backgroundImage: `url(${WebsiteShowcase})`}} aria-label="Natural medicine website showcase" role="img" />
        </div>
      </section>

      {/* TESTIMONIALS/PARTNERS SECTION */}
      <section className="testimonials-section" id="testimonials">
        <div className="wrap">
          <p className="eyebrow orange-text">TRUSTED PARTNERS</p>
          <h2>What Our Partners Say</h2>
          <div className="testimonials-container">
            <div className="testimonials-slider">
              {[
                { name: 'John Smith', role: 'Health Practitioner', text: 'Ray\'s products have transformed my practice. Quality is unmatched and customer service is exceptional.', image: ProfileImg },
                { name: 'Sarah Johnson', role: 'Retail Manager', text: 'Excellent wholesale support and customer service. Our clients love these products and return for more.', image: ProfileImg },
                { name: 'Michael Chen', role: 'Distributor', text: 'Best margins in the industry. Our customers love the products and we\'ve built a loyal customer base.', image: ProfileImg }
              ].map((testimonial, idx) => (
                <article 
                  key={idx} 
                  className={`testimonial-card ${idx === testimonialIndex ? 'active' : ''}`}
                >
                  <div className="testimonial-image">
                    <img src={testimonial.image} alt={testimonial.name} />
                  </div>
                  <div className="testimonial-stars">★★★★★</div>
                  <p>{testimonial.text}</p>
                  <strong>{testimonial.name}</strong>
                  <small>{testimonial.role}</small>
                </article>
              ))}
            </div>
            <div className="testimonial-controls">
              <button 
                className="testimonial-arrow prev"
                onClick={() => setTestimonialIndex((prev) => (prev - 1 + 3) % 3)}
                aria-label="Previous testimonial"
              >
                ‹
              </button>
              <div className="testimonial-dots">
                {[0, 1, 2].map((idx) => (
                  <button
                    key={idx}
                    className={`dot ${idx === testimonialIndex ? 'active' : ''}`}
                    onClick={() => setTestimonialIndex(idx)}
                    aria-label={`Testimonial ${idx + 1}`}
                  />
                ))}
              </div>
              <button 
                className="testimonial-arrow next"
                onClick={() => setTestimonialIndex((prev) => (prev + 1) % 3)}
                aria-label="Next testimonial"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BLOGS & NEWSLETTERS SECTION */}
      <section className="blogs-section" id="blogs" style={{backgroundImage: `url(${ProductBg1})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
        <div className="blogs-overlay" />
        <div className="wrap">
          <p className="eyebrow orange-text">KNOWLEDGE CENTER</p>
          <h2>Blogs & Newsletters</h2>
          <div className="blogs-grid">
            {[
              { title: 'Top 5 Herbal Remedies for Wellness', date: 'Jan 15, 2025', category: 'Health', image: BlogImg1 },
              { title: 'Understanding Supplements: A Beginner\'s Guide', date: 'Jan 10, 2025', category: 'Education', image: BlogImg2 },
              { title: 'Organic vs Non-Organic: What\'s the Difference?', date: 'Jan 5, 2025', category: 'Wellness', image: BlogImg3 }
            ].map((blog, idx) => (
              <article key={idx} className="blog-card">
                <div className="blog-image">
                  <img src={blog.image} alt={blog.title} />
                </div>
                <h3>{blog.title}</h3>
                <div className="blog-meta">
                  <span className="blog-date">{blog.date}</span>
                  <span className="blog-category">{blog.category}</span>
                </div>
                <a href="#blogs">Read more →</a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER SIGNUP */}
      <section className="newsletter-section">
        <div className="newsletter-card wrap">
          <div>
            <p className="eyebrow">STAY UPDATED</p>
            <h2>Subscribe to Our Newsletter</h2>
            <p>Get health tips, product updates, and exclusive offers delivered to your inbox.</p>
          </div>
          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="orange-button">Subscribe</button>
          </form>
        </div>
      </section>

      {/* STORY/ABOUT SECTION */}
      <section className="story-section" id="about">
        <div className="story wrap">
          <div 
            className="story-image" 
            style={{backgroundImage: `url(${AboutImg})`}}
            aria-label="Ray's Healthy Living about section"
            role="img"
          />
          <div className="story-copy">
            <p className="eyebrow orange-text">ABOUT OUR FIRM</p>
            <h2>Ray's <span>Healthy Living</span></h2>
            <div className="accent-line" />
            <p>We serve the community through a trusted network of physical retail locations and our comprehensive online platform. Ray's Healthy Living specializes in premium natural vitamins, minerals, and herbal supplements formulated to the highest quality standards.</p>
            <p><strong>Our Commitment:</strong> We prioritize customer satisfaction and safety above all else. At Ray's Healthy Living, we believe our customers are family—and family deserves the very best care and attention.</p>
            <div className="stats">
              <div>
                <strong>100%</strong>
                <small>Natural Quality</small>
              </div>
              <div>
                <strong>20+</strong>
                <small>Years Experience</small>
              </div>
            </div>
            <a className="orange-button small" href="#contact">Learn more →</a>
          </div>
        </div>
      </section>

      {/* CHAMBER SECTION */}
      <section className="chamber-section">
        <div className="chamber-card">
          <span className="chamber-badge">★ Chamber of Commerce</span>
          <h2>Chamber of Commerce Highlights</h2>
          <p>Local Chamber recognition and top customer feedback — first five 5-star reviews.</p>
          <div className="chamber-rating">
            <strong>Chamber Reviews</strong>
            <span className="stars">★★★★★</span>
            <b>5.0</b>
            <small>5 Local 5-star Reviews</small>
          </div>
          <button className="chamber-link" onClick={toggleChamberReviews}>
            {showChamberReviews ? 'Hide Chamber Reviews' : 'View Chamber Reviews'}
          </button>
        </div>

        {/* Chamber Reviews Section - Shows when toggled */}
        {showChamberReviews && (
          <div className="chamber-reviews-section">
            <div className="chamber-reviews-container">
              <div className="section-header">
                <div className="check-icon">✓</div>
                <h3 className="section-title">Chamber of Commerce - Top 5 Reviews</h3>
                <span style={{color: 'white', marginLeft: '10px', fontSize: '14px'}}>
                  ({currentReviewSlide + 1}/5)
                </span>
              </div>

              <div className="reviews-carousel">
                <button className="carousel-btn prev" onClick={prevReviewSlide}>
                  <ChevronLeft size={20} />
                </button>

                <div className="carousel-container">
                  <div 
                    className="carousel-track"
                    style={{ transform: `translateX(-${currentReviewSlide * 20}%)` }}
                  >
                    {topReviews.map((review, index) => (
                      <div key={index} className="review-slide">
                        <div className="review-card">
                          <div className="review-header">
                            <div className="rating">
                              {renderStars(review.rating)}
                            </div>
                            <span className="review-date">{review.date}</span>
                          </div>
                          
                          <div className="review-content">
                            <p className="review-text">{review.text}</p>
                          </div>

                          <div className="reviewer-info">
                            <div className="avatar">
                              {review.initial}
                            </div>
                            <div className="reviewer-details">
                              <h4 className="reviewer-name">{review.name}</h4>
                              <div className="reviewer-meta">
                                <span className="platform">{review.platform}</span>
                                <span className="verified">✓ VERIFIED</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="carousel-btn next" onClick={nextReviewSlide}>
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Carousel Indicators */}
              <div className="carousel-indicators">
                {topReviews.map((_, index) => (
                  <button
                    key={index}
                    className={`indicator ${currentReviewSlide === index ? 'active' : ''}`}
                    onClick={() => goToReviewSlide(index)}
                  />
                ))}
              </div>

              {/* View All Reviews Button */}
              <div className="view-all-section">
                <button 
                  className="view-all-btn"
                  onClick={() => navigate('/reviews')}
                >
                  View all reviews
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* COMPLIANCE SECTION */}
      <section className="compliance-section">
        <div className="compliance wrap">
          <div>
            <p className="eyebrow">OUR PROMISE</p>
            <h2>100% COMPLIANT</h2>
            <ul>
              {['NSF GMP Certified', 'FDA OTC registered facility', 'KOF-K kosher certified', 'Certified Organic', 'Non-GMO', 'Gluten-Free', 'Allergen Testing', 'Pesticide Testing'].map((item) => (
                <li key={item}>✓ <span>{item}</span></li>
              ))}
            </ul>
            <div className="compliance-badges">
              <div className="badge-item">
                <img src={SafeBadge} alt="Safe & Certified" className="badge-image" />
              </div>
              <div className="badge-item">
                <img src={MadeUsaBadge} alt="Made in USA" className="badge-image" />
              </div>
            </div>
          </div>
          <div className="video-card" style={{backgroundImage: `url(${VidImg})`}}>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </main>
  );
};

export default HomePage;
