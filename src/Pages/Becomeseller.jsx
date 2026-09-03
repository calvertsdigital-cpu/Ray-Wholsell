import React from 'react';
import { motion } from 'framer-motion';
import herb from '../assets/images/bg/herb.png';
import vitamins from '../assets/images/bg/vitamins.png';
import tea from '../assets/images/bg/tea.png';
import oils from '../assets/images/bg/oils.png';
import bulkherb from '../assets/images/bg/bulkherb.png';
import incense from '../assets/images/bg/incense.png';

const BecomeSeller = () => {
  const categories = [
    { name: 'Herbs', icon: herb },
    { name: 'Vitamins', icon: vitamins },
    { name: 'Bulk Herbs', icon: bulkherb },
    { name: 'Teas', icon: tea },
    { name: 'Oils', icon: oils },
    { name: 'Incense', icon: incense }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-x-hidden">
      {/* Header Section with Product Categories */}
      <div className="w-full bg-white py-12 sm:py-16 lg:py-20 shadow-sm">
        <div className="w-full flex justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-7xl">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
              {categories.map((category, index) => (
                <motion.div 
                  key={index} 
                  className="flex flex-col items-center justify-center text-center group cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="w-16 sm:w-20 h-16 sm:h-20 mb-4 sm:mb-6 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <img 
                      src={category.icon} 
                      alt={category.name} 
                      className="w-10 sm:w-12 h-10 sm:h-12 object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                  <span className="text-gray-800 font-semibold text-xs sm:text-sm lg:text-base group-hover:text-green-600 transition-colors duration-300">{category.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section - Properly Centered */}
      <div className="w-full flex justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div className="w-full max-w-2xl">
          
          {/* Title Section */}
          <motion.div 
            className="text-center mb-20 sm:mb-24 lg:mb-32"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight mb-6 px-2">
              Become an Authorized Ray's Healthy Living Reseller
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 via-green-400 to-green-600 mx-auto rounded-full"></div>
          </motion.div>

          {/* Intro Card */}
          <motion.div 
            className="mb-12 sm:mb-16 lg:mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg p-6 sm:p-8 lg:p-10 border border-gray-200 transition-shadow duration-300">
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base lg:text-lg">
                Ray's healthy living products are available at wholesale pricing to qualified resellers including retailers, health care practitioners, and e-commerce retailers. For additional information or to apply to become a wholesale customer, please complete our{' '}
                <a href="/auth/register" className="text-green-600 underline font-semibold hover:text-green-700 transition-all duration-200">
                  WHOLESALE REGISTRATION FORM
                </a>{' '}
                for approval.
              </p>
            </div>
          </motion.div>

          {/* Wholesale Accounts Section */}
          <motion.div 
            className="mb-12 sm:mb-16 lg:mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-1 sm:w-1.5 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full flex-shrink-0 mt-1"></div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Wholesale accounts...
              </h2>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg p-6 sm:p-8 lg:p-10 border border-gray-200 transition-shadow duration-300">
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base lg:text-lg">
                If you are an established business licensed to sell nutritional, medical and/or athletic products, you may be qualified to receive wholesale prices on our products. To get started, complete our{' '}
                <a href="/auth/register" className="text-green-600 underline font-semibold hover:text-green-700 transition-all duration-200">
                  WHOLESALE REGISTRATION FORM
                </a>. Please upload copies of your business license or other documentation for verification at the bottom on the same form, fax them to{' '}
                <span className="font-semibold text-gray-800">443-432-3295</span> or email them to{' '}
                <a href="mailto:info@rayshealthyliving.com" className="text-blue-600 underline font-semibold hover:text-blue-700 transition-all duration-200">
                  info@rayshealthyliving.com
                </a>
              </p>
            </div>
          </motion.div>

          {/* Distributor Accounts Section */}
          <motion.div 
            className="mb-12 sm:mb-16 lg:mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-1 sm:w-1.5 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full flex-shrink-0 mt-1"></div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Distributor accounts...
              </h2>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg p-6 sm:p-8 lg:p-10 border border-gray-200 transition-shadow duration-300">
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base lg:text-lg mb-4 sm:mb-6">
                If you are an established distributor licensed to sell nutritional, medical and/or athletic products, you may wish to offer the ray's healthy living line to your wholesale customers.
              </p>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base lg:text-lg">
                Based upon volume, distributors may be qualified to receive discounts off wholesale prices! Please complete our{' '}
                <a href="/auth/register?type=distributor" className="text-green-600 underline font-semibold hover:text-green-700 transition-all duration-200">
                  DISTRIBUTOR REGISTRATION FORM
                </a>{' '}
                and provide us with a copy of your business license and letter on your business letterhead describing your business, lines carried and areas served for verification. Please upload your documents, fax them to{' '}
                <span className="font-semibold text-gray-800">443-432-3295</span> or email to{' '}
                <a href="mailto:info@rayshealthyliving.com" className="text-blue-600 underline font-semibold hover:text-blue-700 transition-all duration-200">
                  info@rayshealthyliving.com
                </a>
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default BecomeSeller;
