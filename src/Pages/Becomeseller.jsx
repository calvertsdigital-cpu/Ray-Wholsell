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
    <div className="min-h-screen bg-gray-50">
      {/* Header Section with Product Categories */}
      <div className="bg-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 mb-20">
            {categories.map((category, index) => (
              <motion.div 
                key={index} 
                className="flex flex-col items-center text-center group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-20 h-20 mb-6 bg-[#f5f5f5] from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <img 
                    src={category.icon} 
                    alt={category.name} 
                    className="w-12 h-12 object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
                <span className="text-gray-800 font-semibold text-base group-hover:text-green-600 transition-colors duration-300">{category.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Rest of your component remains unchanged */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-[3rem] font-bold text-gray-900 leading-tight mb-6" style={{lineHeight:"62px"}}>
            Become an Authorized Ray's Healthy Living Reseller
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto rounded-full"></div>
        </motion.div>

        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <p className="text-gray-700 leading-relaxed text-lg">
              Ray's healthy living products are available at wholesale pricing to qualified resellers including retailers, health care practitioners, and e-commerce retailers. For additional information or to apply to become a wholesale customer, please complete our{' '}
              <a href="/auth/register" className="text-green-600 underline font-semibold hover:text-green-700 hover:no-underline transition-all duration-200">WHOLESALE REGISTRATION FORM
              </a>{' '}
              for approval.
            </p>
          </div>
        </motion.div>

        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <span className="w-2 h-8 bg-green-500 rounded-full mr-4"></span>
            Wholesale accounts...
          </h2>
          <div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <p className="text-gray-700 leading-relaxed text-lg">
              If you are an established business licensed to sell nutritional, medical and/or athletic products, you may be qualified to receive wholesale prices on our products. To get started, complete our{' '}
              <a href="/auth/register" className="text-green-600 underline font-semibold hover:text-green-700 hover:no-underline transition-all duration-200">WHOLESALE REGISTRATION FORM
              </a>. Please upload copies of your business license or other documentation for verification at the bottom on the same form, fax them to{' '}
              <span className="font-semibold text-gray-800">443-432-3295</span> or email them to{' '}
              <a href="mailto:info@rayshealthyliving.com" className="text-blue-600 underline font-semibold hover:text-blue-700 hover:no-underline transition-all duration-200">
                info@rayshealthyliving.com
              </a>
            </p>
          </div>
        </motion.div>

        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <span className="w-2 h-8 bg-blue-500 rounded-full mr-4"></span>
            Distributor accounts...
          </h2>
          <div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              If you are an established distributor licensed to sell nutritional, medical and/or athletic products, you may wish to offer the ray's healthy living line to your wholesale customers.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              Based upon volume, distributors may be qualified to receive discounts off wholesale prices! Please complete our{' '}
              <a href="/auth/register?type=distributor" className="text-green-600 underline font-semibold hover:text-green-700 hover:no-underline transition-all duration-200">DISTRIBUTOR REGISTRATION FORM
              </a>{' '}
              and provide us with a copy of your business license and letter on your business letterhead describing your business, lines carried and areas served for verification. Please upload your documents, fax them to{' '}
              <span className="font-semibold text-gray-800">443-432-3295</span> or email to{' '}
              <a href="mailto:info@rayshealthyliving.com" className="text-blue-600 underline font-semibold hover:text-blue-700 hover:no-underline transition-all duration-200">
                info@rayshealthyliving.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BecomeSeller;
