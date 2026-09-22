import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/common/Navbar/Navbar';
import { Footer } from '../components/common/Footer/Footer';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import './ReviewsPage.scss';

const ReviewsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 6;

  // Scroll to reviews content when page loads
  useEffect(() => {
    // Small delay to ensure page is fully rendered
    const timer = setTimeout(() => {
      // Scroll to show the hero section properly
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const reviews = [
    {
      name: "Holly Grimes",
      platform: "Google",
      date: "Jun 7th, 2024",
      rating: 5,
      text: "Ray is the best and so are his products!",
      initial: "H"
    },
    {
      name: "piggy and sam yett",
      platform: "Google", 
      date: "May 7th, 2024",
      rating: 5,
      text: "Ray is so kind and helpful. He knows just what I need. He actually takes time to understand what you are actually looking for!",
      initial: "P"
    },
    {
      name: "monique washington",
      platform: "Google",
      date: "Sep 24th, 2023",
      rating: 5,
      text: "I have been seeing Ray and his healthy healing plan...... visited his store today September 24th 2023 , he took his time with my girlfriend and I he has so many samples, so much knowledge. I purchased the best Seamoss I ever taste and I been taking Seamoss for years. I STRONGLY RECOMMEND ESP WATER, that water healed my girlfriend sore throat on the spot I can go on and on about this place..... I'm from Philly but I will be back soon LOVE YOU RAY",
      initial: "M"
    },
    {
      name: "Rana Latin",
      platform: "Google",
      date: "Jan 1st, 2024",
      rating: 5,
      text: "I LOVE going into Rays - Healthy Living, its always time well spent. I am learning how to care for myself and my family. My health is wealth goes without saying. I am extremely blessed every time I go in the store. If you haven't been to his store (Located in Prince Frederick) Run don't walk, you won't be disappointed. Trust me!",
      initial: "R"
    },
    {
      name: "Irene Blackson",
      platform: "Google",
      date: "Feb 26th, 2024",
      rating: 5,
      text: "My family and I my family have been patronizing his health-focused products and service in Prince Frederick & Ray's Healthy Living Store. A couple years ago, I was extremely able after a very long apartment. My doctor ended up giving me a foot heal It was a struggle to move around the house. Out of desperation, I thought after so I had tried almost everything I and in less than 1 weeks I was out and walking without my foot brace. Another notable experience at Ray's Healthy Living Store was when I was grappling with a persistent thyroid issue for a year. The problem was showing no signs of improvement, despite the medication prescribed to me. Ray settled so quickly. I decided to give the natural herb-based medicine another chance. I feel stopped by and spoke to my about the issue, and then was when he told me about Sea Moss. I had tried it for a couple of weeks! The exact nutrient work starts about where I had been stocked for too the thyroid hormone condition, Ray's Healthy Living Store is the best place to go if in Prince Frederick, and squarely, the entire state of Maryland! Thank you, Ray, for always helping, pointing out new customer service, and the help you've brought me and so many others.",
      initial: "I"
    },
    {
      name: "St Johns Wort",
      platform: "Google", 
      date: "Feb 15th, 2024",
      rating: 5,
      text: "It helps with anxiety and depression. I have it really bad nowadays. My therapist wanted tou put me on antidepressants and I decided to give this a try. I haven't really had a negative/depressing thought since I started taking it.",
      initial: "S"
    },
    {
      name: "Linessa Brown",
      platform: "Google",
      date: "Jul 8th, 2024",
      rating: 5,
      text: "",
      initial: "L"
    },
    {
      name: "Ralph Curtis",
      platform: "Google",
      date: "Jul 4th, 2024",
      rating: 5,
      text: "Ray has reasonable prices, gives discounts and always gives knowledge on his products. Plus he is a cool dude to talk to.",
      initial: "R"
    },
    {
      name: "Chris Garner",
      platform: "Google",
      date: "Jun 1st, 2024",
      rating: 5,
      text: "I love this place. Good selection of stuff and owners very personable and knowledgeable. Highly Recommend",
      initial: "C"
    },
    {
      name: "Savannah Brock",
      platform: "Google",
      date: "Jun 1st, 2024",
      rating: 5,
      text: "The sweetest man! Helped me find prenatal for my specific needs and a detox for my daughter! Even threw in some free stuff for me to try definitely coming back for all my needs!",
      initial: "S"
    },
    {
      name: "Roxie Rivera",
      platform: "Google",
      date: "Apr 20th, 2024",
      rating: 5,
      text: "Very knowledgeable!",
      initial: "R"
    },
    {
      name: "Steven Elliott",
      platform: "Google", 
      date: "Feb 1st, 2024",
      rating: 5,
      text: "So I drove to the local spot in this area. The customer service was so great! And the store has so much to offer, whatever you may need. I just walked into to see what the store was all about. We don't see a lot of herbal shops on this side of town, so I was super press to see what a store like this offer. & boy was I surprised! Not only was I greeted as soon I walked in, but I was able to get great information on several Items I was interested in getting! I definitely will be returning, love supporting local shops, especially one with phenomenal customer service like this one!",
      initial: "S"
    },
    {
      name: "James Mbah",
      platform: "Google",
      date: "Apr 28th, 2024",
      rating: 5,
      text: "Rays Maximum Cardio is by far the best dietary supplement I have come across. You immediately feel the difference and the shift within once you begin to apply use. This product lives up to everything it states from energy, strength, mental clarity, stamina, immunity & muscle growth! Rays Maximum Cardio has truly helped to make me feel 10-15 yrs younger and even surprise it surpass physical limitations that were once a barrier for myself. I have been using Rays Maximum Cardio products for over 3yrs now and can definitely attest that ALL of their products are in a class of it's own. I will continue to use, I also have tried other Ray's Healthy Living products such as sea moss, herbs, and bitters! All have given quality, healthy, results, and price! Rays Healthy Living always comes through. I am they a satisfied customer with this excellent service and products!",
      initial: "J"
    },
    {
      name: "Justin Holt",
      platform: "Google",
      date: "Apr 1st, 2024",
      rating: 5,
      text: "Sea moss gel on point!",
      initial: "J"
    },
    {
      name: "J. Jeffery",
      platform: "Google",
      date: "Mar 26th, 2024",
      rating: 5,
      text: "High quality products that work in a short period of time!",
      initial: "J"
    },
    {
      name: "Crystal Goldring",
      platform: "Google",
      date: "Mar 22nd, 2024",
      rating: 5,
      text: "This place is so awesome and available!! It is extremely important now to care for your inner self. Our immunity, organs and mental health need all what a daily diet can provide. I enjoy my visits immensely. I can definitively say, you will not find a business today like Rays. I recommend anyone to just visit, you will leave with a wealth of knowledge to construct a daily regimen that best works for you. Ray values customers and takes great pride in providing quality products.",
      initial: "C"
    },
    {
      name: "Christina Numero-Segrett",
      platform: "Google",
      date: "Mar 15th, 2024",
      rating: 5,
      text: "Love this store! Ray is full of knowledge and cares about every person that walks through the door. He attentively listens to what you have to say and then helps you to make the right purchase. Be sure to check out the store and get a fabulous personal experience!",
      initial: "C"
    },
    {
      name: "Belinda Barber",
      platform: "Google",
      date: "Feb 6th, 2024",
      rating: 5,
      text: "I absolutely love that Rays Healthy Living is located in my backyard (Prince Frederick). The store always has what I need and if not, the owner Mr. Ray will order for me. His prices are reasonable and offers discounts. His knowledgeable and will gives samples without you making a purchase. Ray genuinely cares about the health of the community. Thank you Ray! Healthy Living for bringing whole health and wellness to Calvert County. I don't have to leave out the county to purchase my health products anymore!!",
      initial: "B"
    },
    {
      name: "Jarmar Coates",
      platform: "Google",
      date: "Jan 27th, 2024",
      rating: 5,
      text: "Thank you Ray for my sea moss",
      initial: "J"
    },
    {
      name: "Janice",
      platform: "Google",
      date: "Aug 4th, 2024",
      rating: 5,
      text: "Ray is awesome and a very friendly guy! He knows his products! Every time I shop at the store, Im always learning something new from him of what certain herbs and supplements can positively do. I love how he shows me actual books on the information about certain herbs. I love that I always feel like Im getting an education as I shop! What I love most of his products are all natural. The base one he been taking is in Maximum Cardio and he notices a huge difference. I noticed my moods have improved. I feel a lot more energized. I feel like I got more out of my work out at gym when I do cardio. I noticed my appetite has decreased as well as some heart rate around the gym. I am looking at my body needs in order to function! Im so my 3rd container to be and Im planning on buying more!",
      initial: "J"
    },
    {
      name: "St Leonard Development",
      platform: "Google",
      date: "Jul 7th, 2024",
      rating: 5,
      text: "this is a great local resource.",
      initial: "S"
    },
    {
      name: "jazzbytarlife",
      platform: "Google",
      date: "Jul 1st, 2024",
      rating: 5,
      text: "I was looking for a all natural supplement that would give me an energy boost without fillers or additives. His recipe of Irish Moss is the answer. What his knowledge and genuine warmth are reasons enough to visit the store, the product are great and will not leave you disappointed. Allen B.",
      initial: "J"
    },
    {
      name: "sabrina singleton",
      platform: "Google",
      date: "Jun 8th, 2024",
      rating: 5,
      text: "We been ordering different supplements and Rays cardio for a while and they are all excellent products that I greatly recommend. The level of customer service and knowledge is impeccable im truly satisfied with all recommendations given. A satisfied customer for life much continued success and blessings.",
      initial: "S"
    },
    {
      name: "Deandre Boodhoo-Howard",
      platform: "Google",
      date: "May 2nd, 2024",
      rating: 5,
      text: "I highly recommend going to Ray's Healthy Living. I had a chest injury that I was told would take 3 or more months to heal. Ray had giving me the remedy for a fast recovery. I astounded by the results. I wouldn't recommend going anywhere for vitamins and sit besides this place.",
      initial: "D"
    },
    {
      name: "Miranda Paige Beauty",
      platform: "Google",
      date: "May 1st, 2024",
      rating: 5,
      text: "So helpful, educational & friendly. Amazing service. I am So! I had not visited this place sooner. Thank you!",
      initial: "M"
    },
    {
      name: "Barbara Butter",
      platform: "Google",
      date: "May 1st, 2024",
      rating: 5,
      text: "Mr. Ray's knowledge, friendliness, wisdom and expertise is impeccable. He takes the time to explain thoroughly all the benefits of each product and has the books. The herbal was paired with a variety of products to promotes healthy living. I've purchased the sea moss, dandelion root tea, mangonium cardio and the salmon fish powder 100% natural collagen and I'm feeling awesome! Thanks, Mr. Ray!",
      initial: "B"
    },
    {
      name: "Mikki Ward",
      platform: "Google",
      date: "Apr 4th, 2024",
      rating: 5,
      text: "If your health matters to you, Rays Healthy Living is where you want to go! I visited several weeks ago wanting to find a weight loss regime, what I found was so much more. Mr. Say explained how the body generates calories and gains weight. I never thought of the trace amounts of sugars and sodium in the so called 'healthy' foods we eat that prohibit our body from working foods and taking in the nutrition that harmful body needs to sustain health. I purchased an array of items for my journey including, Rays Oregano oil and dandelion tea. By following a daily regimen change has begun. I started my journey weighing 240. Today, 4 weeks later Im at 234. Im so proud of the 3 pounds, for I know that these extra pounds will not return! Consistency is the key for success! Thank you Mr. Ray! It will be back to us in a few weeks",
      initial: "M"
    },
    {
      name: "Katrina Rice",
      platform: "Google",
      date: "Feb 1st, 2024",
      rating: 5,
      text: "I remember I have been knowledgeable Ray is. He really take the time to explain every detail to you. His products are amazing! He gives several samples. Prices are VERY reasonable. Sea Moss is great. I will be handing over my paycheck next visit lol. Thanks Ray!",
      initial: "K"
    },
    {
      name: "Anthony Feliz Maya",
      platform: "Google",
      date: "Jan 1st, 2024",
      rating: 5,
      text: "Sea moss gel looks and taste great!! Ray was very friendly and shared a lot of information with me on health. Will definitely be back to buy more.",
      initial: "A"
    },
    {
      name: "Michelle Taylor",
      platform: "Google",
      date: "Dec 1st, 2023",
      rating: 5,
      text: "Great energy, friendly service, very knowledgeable of products and their function. High quality products. I REALLY love this store!",
      initial: "M"
    },
    {
      name: "Tiauna Quarles",
      platform: "Google",
      date: "Nov 1st, 2023",
      rating: 5,
      text: "I recommend Rays to anybody looking to change your lifestyle for the better, whether that be detoxing, boosting your immune system etc. Mr. Ray really cares about his customers, and thus once again. Go shop with him, you wont be disappointed.",
      initial: "T"
    },
    {
      name: "Erin Knowles",
      platform: "Google",
      date: "Nov 1st, 2023",
      rating: 5,
      text: "Great store with knowledgeable friendly staff!",
      initial: "E"
    },
    {
      name: "shawn grott",
      platform: "Google",
      date: "Oct 1st, 2023",
      rating: 5,
      text: "It's awesome he knows the stuff you need some stuff you need vitamins you need CBD oils and creams the help of back pain he has a very good store",
      initial: "S"
    },
    {
      name: "Stacey Savoy",
      platform: "Google",
      date: "Sep 1st, 2023",
      rating: 5,
      text: "I went in with a lot of questions, he answered every question. Very friendly, even gave samples to test before you buy. Will be returning.",
      initial: "S"
    },
    {
      name: "Albert Nelson",
      platform: "Google",
      date: "Apr 1st, 2023",
      rating: 5,
      text: "Ray knows his stuff...very helpful and knowledgeable. He stands by his products so much that he had given me a free sample. I will definitely be returning",
      initial: "A"
    },
    {
      name: "david fagan",
      platform: "Google",
      date: "Apr 1st, 2023",
      rating: 5,
      text: "Great place, highly recommend.",
      initial: "D"
    },
    {
      name: "Caleb Fry",
      platform: "Google",
      date: "Dec 1st, 2023",
      rating: 5,
      text: "This man went far out of his way to help me detoxify my body and gave me new insights on how to do it effectively. He understands functional medicine enough to explain it simply and provides what you need in order to heal yourself. He deserves your business.",
      initial: "C"
    },
    {
      name: "Lisa Hogue",
      platform: "Google",
      date: "Dec 1st, 2023",
      rating: 5,
      text: "Great place, wide selection and helpful friendly staff!",
      initial: "L"
    }
  ];

  // Calculate pagination
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star 
        key={index} 
        size={16} 
        className={index < rating ? 'star-filled' : 'star-empty'}
        fill={index < rating ? '#FFB800' : 'none'}
      />
    ));
  };

  const renderPagination = () => {
    const pages = [];
    
    // Previous button
    if (currentPage > 1) {
      pages.push(
        <button 
          key="prev" 
          onClick={() => handlePageChange(currentPage - 1)}
          className="pagination-btn pagination-nav"
        >
          <ChevronLeft size={16} />
          Prev
        </button>
      );
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
          >
            {i}
          </button>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push(<span key={`ellipsis-${i}`} className="pagination-ellipsis">...</span>);
      }
    }

    // Next button
    if (currentPage < totalPages) {
      pages.push(
        <button 
          key="next" 
          onClick={() => handlePageChange(currentPage + 1)}
          className="pagination-btn pagination-nav"
        >
          Next
          <ChevronRight size={16} />
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="reviews-page">
      <Navbar />
      
      <div className="reviews-container">
        {/* Hero Section */}
        <section className="reviews-hero">
          <div className="hero-content">
            <h1 className="hero-title">Customer Reviews</h1>
            <p className="hero-subtitle">
              Discover what our customers say about Ray's Healthy Living
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">{reviews.length}+</span>
                <span className="stat-label">Happy Customers</span>
              </div>
              <div className="stat-item">
                <div className="rating-display">
                  {renderStars(5)}
                  <span className="rating-text">5.0</span>
                </div>
                <span className="stat-label">Average Rating</span>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Grid */}
        <section className="reviews-section" id="reviews-content">
          <div className="container">
            <div className="reviews-grid">
              {currentReviews.map((review, index) => (
                <div key={`${review.name}-${index}`} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="avatar">
                        {review.initial}
                      </div>
                      <div className="reviewer-details">
                        <h3 className="reviewer-name">{review.name}</h3>
                        <div className="review-meta">
                          <span className="platform">on {review.platform}</span>
                          <span className="date">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="rating">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  {review.text && (
                    <div className="review-content">
                      <p className="review-text">{review.text}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="pagination">
              {renderPagination()}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2 className="cta-title">Experience the Ray's Difference</h2>
              <p className="cta-text">
                Join thousands of satisfied customers who trust Ray's Healthy Living 
                for their wellness journey.
              </p>
              <div className="cta-buttons">
                <a href="/products" className="cta-btn primary">
                  Shop Now
                </a>
                <a href="/contact" className="cta-btn secondary">
                  Get In Touch
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default ReviewsPage;