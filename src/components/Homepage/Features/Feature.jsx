import React from 'react';
import vidImage from '../../../assets/images/bg/vid-img.png';
import guarantyImage from '../../../assets/images/bg/guaranty.jpg';
import madeUsaImage from '../../../assets/images/bg/made-usa.webp';

const Feature = () => {
  return (
    <div 
      className="relative overflow-visible py-12 sm:py-16 lg:py-20 mt-12 sm:mt-16 lg:mt-20 mb-16 sm:mb-20 lg:mb-24 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: '#6BA82D' }}
    >
      <div className="w-full max-w-7xl mx-auto">
        
        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div className="text-white">
            <h2 className="text-4xl lg:text-5xl font-black mb-6" style={{ letterSpacing: '1px' }}>
              100% COMPLIANT
            </h2>
            
            <div className="flex flex-col gap-2.5 text-[15px] font-medium">
              {[
                'NSF GMP Certified',
                'FDA OTC registered facility',
                'KOF-K kosher certified',
                'Certified Organic',
                'Non-GMO',
                'e Gluten-Free',
                'Allergen Testing',
                'Pesticide Testing'
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <svg 
                    className="w-5 h-5 flex-shrink-0 text-white" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="leading-tight">{item}</span>
                </div>
              ))}
            </div>

            {/* Seals for Desktop */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-white/20">
              <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg overflow-hidden flex-shrink-0">
                <img 
                  src={guarantyImage} 
                  alt="Guaranteed Quality" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg overflow-hidden flex-shrink-0">
                <img 
                  src={madeUsaImage} 
                  alt="Made in USA" 
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Right - Product Image */}
          <div className="relative">
            <div 
              className="w-full aspect-video overflow-hidden rounded-lg shadow-2xl"
              style={{ 
                border: '4px solid rgba(255, 235, 59, 0.7)',
                background: 'linear-gradient(135deg, rgba(0,0,0,0.5), rgba(0,0,0,0.3))'
              }}
            >
              <img 
                src={vidImage}
                alt="Product Showcase" 
                className="w-full h-full object-cover"
              />
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/40 hover:bg-white/30 transition-all cursor-pointer">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tablet Layout */}
        <div className="hidden md:flex lg:hidden flex-col gap-8">
          
          <div className="text-white">
            <h2 className="text-3xl font-black mb-4">
              100% COMPLIANT
            </h2>
            
            <div className="flex flex-col gap-2 text-sm font-medium">
              {[
                'NSF GMP Certified',
                'FDA OTC registered facility',
                'KOF-K kosher certified',
                'Certified Organic',
                'Non-GMO',
                'e Gluten-Free',
                'Allergen Testing',
                'Pesticide Testing'
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <svg 
                    className="w-4 h-4 flex-shrink-0 text-white" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Image */}
          <div className="relative">
            <div 
              className="w-full aspect-video overflow-hidden rounded-lg shadow-xl"
              style={{ 
                border: '3px solid rgba(255, 235, 59, 0.7)',
                background: 'linear-gradient(135deg, rgba(0,0,0,0.5), rgba(0,0,0,0.3))'
              }}
            >
              <img 
                src={vidImage}
                alt="Product Showcase" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/40">
                  <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Seals */}
          <div className="flex gap-3 items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white p-1 shadow-lg overflow-hidden flex-shrink-0">
              <img 
                src={guarantyImage} 
                alt="Guaranteed Quality" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="w-20 h-20 rounded-full bg-white p-1 shadow-lg overflow-hidden flex-shrink-0">
              <img 
                src={madeUsaImage} 
                alt="Made in USA" 
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex md:hidden flex-col items-center gap-6">
          
          <div className="text-white text-center w-full">
            <h2 className="text-2xl sm:text-3xl font-black mb-4">
              100% COMPLIANT
            </h2>
            
            <div className="flex flex-col gap-2 text-xs sm:text-sm font-medium">
              {[
                'NSF GMP Certified',
                'FDA OTC registered facility',
                'KOF-K kosher certified',
                'Certified Organic',
                'Non-GMO',
                'e Gluten-Free',
                'Allergen Testing',
                'Pesticide Testing'
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-center gap-2">
                  <svg 
                    className="w-4 h-4 flex-shrink-0 text-white" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Image */}
          <div className="relative w-full">
            <div 
              className="w-full aspect-video overflow-hidden rounded-lg shadow-lg"
              style={{ 
                border: '3px solid rgba(255, 235, 59, 0.7)',
                background: 'linear-gradient(135deg, rgba(0,0,0,0.5), rgba(0,0,0,0.3))'
              }}
            >
              <img 
                src={vidImage}
                alt="Product Showcase" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/40">
                  <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Seals */}
          <div className="flex gap-3 items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white p-1 shadow-md overflow-hidden flex-shrink-0">
              <img 
                src={guarantyImage} 
                alt="Guaranteed Quality" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="w-16 h-16 rounded-full bg-white p-1 shadow-md overflow-hidden flex-shrink-0">
              <img 
                src={madeUsaImage} 
                alt="Made in USA" 
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Feature;
