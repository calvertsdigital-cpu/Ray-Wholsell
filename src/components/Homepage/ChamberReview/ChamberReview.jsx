import React, { useState, useEffect } from 'react';
import { Star, Check, Quote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChamberReview = () => {
  const navigate = useNavigate();
  const [showChamberReviews, setShowChamberReviews] = useState(false);
  const [currentChamberReviewIndex, setCurrentChamberReviewIndex] = useState(0);

  const chamberReviews = [
    {
      name: "Kenesha Davis",
      text: "Love this store! Ray is very knowledgeable and also has educational material on health products available.",
      location: "Google · Local Guide",
      rating: 5,
      date: "Mar 2026",
      avatar: "KD",
    },
    {
      name: "Ida Gross",
      text: "Omg, where do I start? I am a cancer patient who is currently in remission! I stumbled across Mr. Ray and his health store and I'd like to think he is playing a major part in my recovery. He's knowledgeable, patient, and very compassionate, I'm thankful for him being a part of my journey.",
      location: "Google · Local Guide",
      rating: 5,
      date: "Aug 2025",
      avatar: "IG",
    },
    {
      name: "Robert Gillett",
      text: "You can go to a grocery or drug store and take your chances, or you can visit Ray's and quickly upgrade your health. You always come out with something, including an education in healthy living.",
      location: "Google",
      rating: 5,
      date: "Jul 2025",
      avatar: "RG",
    },
    {
      name: "Scott Fegan",
      text: "I stopped by Ray's recently and was really impressed! Ray knows his stuff. The store is well-organized with a great selection of vitamins and natural remedies. Good spot for anyone looking to support their health.",
      location: "Google",
      rating: 5,
      date: "Sep 2025",
      avatar: "SF",
    },
    {
      name: "Holly Grimes",
      text: "Highest quality supplements hands down. Ray is helpful in every way. Been coming here for many years!",
      location: "Google · Local Guide · 33 reviews",
      rating: 5,
      date: "Nov 2023",
      avatar: "HG",
    },
    {
      name: "Irene Blackson",
      text: "My name is Irene, and my favorite destination for health-focused products and advice in Prince Frederick is Ray's Healthy Living Store. A couple months ago, I broke my ankle after a slip in my apartment. My doctor ended up giving me a foot brace, and it was a struggle to move around the house. Out of desperation, I sought out Ray. He gave me various supplements that ended up speeding my recovery greatly, and in less than 3 weeks I was out and walking without my foot brace.",
      location: "Google",
      rating: 5,
      date: "Aug 2023",
      avatar: "IB",
    },
    {
      name: "Jason Reed",
      text: "Changed my life",
      location: "Google",
      rating: 5,
      date: "Jul 2026",
      avatar: "JR",
    },
  ];

  useEffect(() => {
    if (showChamberReviews) {
      const interval = setInterval(() => {
        setCurrentChamberReviewIndex(
          (prev) => (prev + 1) % chamberReviews.length
        );
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [showChamberReviews, chamberReviews.length]);

  const handleViewChamberReviews = () => {
    setShowChamberReviews(true);
  };

  return (
    <div className="px-4 py-12 sm:py-16 lg:py-20 mt-8 sm:mt-12 lg:mt-16">
      <div className="bg-slate-950 backdrop-blur-sm rounded-3xl border border-slate-700 p-8 sm:p-10 lg:p-12 shadow-2xl max-w-2xl mx-auto">
        <div className="text-center space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-600/10 px-4 py-2 rounded-full border border-blue-400/40 mx-auto">
            <Star className="w-4 h-4 text-blue-400 fill-blue-400" />
            <span className="text-blue-200 font-semibold text-sm">
              Chamber of Commerce
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
            Chamber of Commerce Highlights
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Local Chamber recognition and top customer feedback — first five 5-star reviews.
          </p>

          {/* Stats Bar */}
          <div className="flex justify-center items-center gap-3 sm:gap-4 flex-wrap bg-blue-500/5 px-4 py-3 rounded-xl border border-blue-400/20 mx-auto w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full">
              <span className="text-white font-semibold text-xs sm:text-sm">
                Chamber Reviews
              </span>
            </div>
            
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            
            <span className="text-xl sm:text-2xl font-bold text-white">
              5.0
            </span>
            
            <span className="text-slate-300 text-xs sm:text-sm whitespace-nowrap">
              5 Local 5-star Reviews
            </span>
          </div>

          {/* Button */}
          <button
            onClick={handleViewChamberReviews}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 text-sm sm:text-base shadow-lg shadow-blue-900/20 transform hover:scale-105"
          >
            <Star className="w-4 h-4" />
            View Chamber Reviews
          </button>

        </div>
      </div>

      {showChamberReviews && (
        <div className="mt-8 sm:mt-10 lg:mt-12 animate-fade-in max-w-4xl mx-auto">
          <div className="bg-slate-950 rounded-3xl border border-slate-700 p-6 sm:p-8 lg:p-10 shadow-2xl">
            <h3 className="text-xl sm:text-2xl font-bold text-center text-white mb-8 flex items-center justify-center gap-2">
              <Check className="text-green-400 w-5 h-5" />
              Chamber of Commerce - Top Reviews
            </h3>

            <div className="relative max-w-4xl mx-auto">
              <div className="overflow-hidden rounded-2xl">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${
                      currentChamberReviewIndex * 100
                    }%)`,
                  }}
                >
                  {chamberReviews.map((review, index) => (
                    <div
                      key={index}
                      className="w-full flex-shrink-0 px-2 sm:px-4"
                    >
                      <div className="bg-slate-900/50 rounded-2xl p-6 sm:p-7 border border-slate-700/50 shadow-lg flex flex-col min-h-[280px] hover:border-slate-600/70 transition-colors duration-300">
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                          <span className="ml-2 text-xs text-slate-400">
                            {review.date}
                          </span>
                        </div>

                        <Quote className="w-6 h-6 text-blue-500/40 mb-3" />
                        <div className="flex-1 text-slate-300 text-sm sm:text-base mb-4 leading-relaxed italic">
                          "{review.text}"
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50 gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                              {review.avatar}
                            </div>
                            <div>
                              <div className="font-semibold text-white text-sm">
                                {review.name}
                              </div>
                              <div className="text-blue-400 text-xs">
                                {review.location}
                              </div>
                            </div>
                          </div>

                          <div className="hidden sm:flex items-center gap-1.5 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/30">
                            <Check className="w-3 h-3 text-green-400" />
                            <span className="text-green-400 font-medium text-xs uppercase">
                              Verified
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-2 mt-6 sm:mt-8">
                {chamberReviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentChamberReviewIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentChamberReviewIndex
                        ? "bg-blue-500 w-6"
                        : "bg-slate-700 w-2 hover:bg-slate-600"
                    }`}
                    aria-label={`Go to review ${index + 1}`}
                  />
                ))}
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => navigate('/bengal-reviews')}
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 text-sm shadow-md hover:shadow-lg"
                >
                  View all reviews
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ChamberReview;
