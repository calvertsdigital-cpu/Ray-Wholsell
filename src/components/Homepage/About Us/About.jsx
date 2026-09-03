import React, { useEffect, useRef } from 'react';
import imagelogo from '../../../assets/images/bg/imgg.jpg'

export const About = () => {
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === leftRef.current) {
              entry.target.classList.add('animate-fadeInLeft');
            } else if (entry.target === rightRef.current) {
              entry.target.classList.add('animate-fadeInRight');
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (leftRef.current) observer.observe(leftRef.current);
    if (rightRef.current) observer.observe(rightRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-orange-50 mb-20 pt-20 pb-16">
      <div className="flex justify-center">
        <div className="w-[90%] max-w-7xl flex flex-col lg:flex-row justify-between items-center gap-12">
          
          {/* Left Side - Image with Enhanced Styling */}
          <div
            ref={leftRef}
            className="fade-element w-full lg:w-1/2 flex justify-center mb-8 lg:mb-0"
          >
            <div className="relative w-full max-w-[500px] group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg blur-xl opacity-25 group-hover:opacity-40 transition-all duration-500 transform group-hover:scale-105"></div>
              <img
                src={imagelogo}
                alt="Ray's Healthy Living - Natural health supplements and herbal products"
                loading="lazy"
                className="relative w-full aspect-square object-cover rounded-lg shadow-2xl transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-orange-500 rounded-full opacity-10 blur-2xl"></div>
            </div>
          </div>

          {/* Right Side - Content with Enhanced Styling */}
          <div
            ref={rightRef}
            className="fade-element w-full lg:w-1/2 flex justify-center"
          >
            <div className="text-left max-w-[550px]">
              
              {/* Title Section */}
              <div className="mb-10">
                <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">About Our Firm</span>
                <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mt-3">
                  Ray's <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Healthy Living</span>
                </h2>
                <div className="h-1 w-20 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 mt-4 rounded-full"></div>
              </div>

              {/* Description */}
              <div className="text-gray-700 text-lg leading-relaxed space-y-6 mb-8">
                <p className="font-light">
                  We serve the community through a trusted network of physical retail locations and our comprehensive online platform. Ray's Healthy Living specializes in premium natural vitamins, minerals, and herbal supplements formulated to the highest quality standards.
                </p>
                <p className="font-light">
                  <span className="font-semibold text-gray-900">Our Commitment:</span> We prioritize customer satisfaction and safety above all else. At Ray's Healthy Living, we believe our customers are family—and family deserves the very best care and attention.
                </p>
                <p className="text-sm text-gray-600 italic border-l-4 border-orange-500 pl-4">
                  Discover the vision behind our mission by reading our founder and CEO's personal story.
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 mb-2">100%</div>
                  <p className="text-xs text-gray-600 font-medium">Natural Quality</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 mb-2">20+</div>
                  <p className="text-xs text-gray-600 font-medium">Years Experience</p>
                </div>
              </div>

              {/* CTA Button */}
              <div className="flex gap-4">
                <a
                  href="https://rayshealthyliving.com/about-us/"
                  className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-sm md:text-base uppercase tracking-wide px-8 py-4 rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 flex items-center gap-2"
                >
                  Learn More
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default About;
