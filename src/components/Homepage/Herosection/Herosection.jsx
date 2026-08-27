import React, { useEffect, useState } from "react";

import "./Herosection.scss";

import parse from "html-react-parser";

import { motion, AnimatePresence } from "framer-motion";

import HeroSliderImg1 from "../../../assets/images/bg/HeroSliderImg1.jpg";

import HeroSliderImg2 from "../../../assets/images/bg/HeroSliderImg2.jpg";

import HeroSliderImg3 from "../../../assets/images/bg/HeroSliderImg3.jpg";

import HeroSliderImg4 from "../../../assets/images/bg/Raygpt.jpeg";

const sliderData = [

  // {

  //   image: HeroSliderImg4,

  //   title: `Create Your Own <span className="headingSpan1">Ray GPT</span> 

  //                 <span className="headingSpan2">Store</span>`,

  //   smallInfo: `Build your personalized AI-powered store with Ray GPT. 

  //                 Streamline your business, enhance customer experience, 

  //                 and boost sales with intelligent automation. Start today!`,

  //   link: "https://rayonesystem.netlify.app/",

  //   isExternal: true

  // },

  {

    image: HeroSliderImg1,

    title: `Pure <span className="headingSpan1">Wellness</span> ,

                  <span className="headingSpan2">Naturally</span> Yours`,

    smallInfo: `Ray's Healthy Living offers organic supplements for your

                  family's health. Safe, natural, and affordable, our vitamins

                  boost vitality. Shop online or in-store today.`,

  },

  {

    image: HeroSliderImg2,

    title: `<span className="headingSpan1">Nature's </span> Best for Your

                  <span className="headingSpan2">Family</span>`,

    smallInfo: `Discover Ray's Healthy Living's organic supplements. Crafted

                  for safety and affordability, our natural vitamins enhance

                  family wellness. Shop online or at our stores now.`,

  },

  {

    image: HeroSliderImg3,

    title: `<span className="headingSpan1">Vitality </span> Starts with

                  <span className="headingSpan2">Nature</span>`,

    smallInfo: `Elevate health with Ray's Healthy Living's organic vitamins.

                  Safe, affordable, and natural, our supplements boost vitality.

                  Shop online or in-store today.`,

  },

];

const handleNext = (dataArray, setCurrentIndex) => {

  console.log("handleNext");

  setCurrentIndex((curr) => (curr === dataArray.length - 1 ? 0 : curr + 1));

};

export const Herosection = () => {

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {

    const autoSlide = setInterval(() => {

      handleNext(sliderData, setCurrentIndex);

    }, 8000);

    return () => {

      clearInterval(autoSlide);

    };

  }, []);

  return (

    <AnimatePresence mode="popLayout">

      <div className="Homepage__heroMainWrapper">

        <div className="Homepage__mainContainerWrapper">

          <div className="HP__heroSliderWrapper">

            {sliderData.map((cur, id) => (

              <motion.div

                animate={{

                  x: `-${currentIndex * 100}%`,

                  opacity: currentIndex === id ? 1 : 0,

                }}

                transition={{

                  duration: 0.5,

                  ease: "easeInOut",

                }}

                key={id}

                className="mainSliderWrapper"

              >

                <div className="sliderImgWrapper">

                  <img src={cur.image} alt="wholesale-retailer.com" />

                </div>

                <div className="sliderContentWrapper">

                  <div className="contentWrapper">

                    <h2>{parse(cur.title)}</h2>

                    <p>{cur.smallInfo}</p>

                    {/* Regular View All button for non-Ray GPT slides */}

                    {id !== 0 && cur.link && (

                      <a

                        href={cur.link}

                        target={cur.isExternal ? "_blank" : "_self"}

                        rel="noopener noreferrer"

                        className="heroViewBTN"

                      >

                        View All

                      </a>

                    )}

                  </div>

                  {/* Ray GPT Create Store Button - positioned like wholesaler badge */}

                  {id === 0 && (

                    <motion.a

                      href={cur.link}

                      target={cur.isExternal ? "_blank" : "_self"}

                      rel="noopener noreferrer"

                      className="createStore__badge"

                      initial={{ opacity: 0, scale: 0.8, y: 20 }}

                      animate={{

                        opacity: currentIndex === id ? 1 : 0,

                        scale: currentIndex === id ? 1 : 0.8,

                        y: currentIndex === id ? 0 : 20

                      }}

                      transition={{

                        duration: 0.8,

                        delay: 0.5,

                        ease: "backOut"

                      }}

                      whileHover={{ scale: 1.05 }}

                      whileTap={{ scale: 0.95 }}

                    >

                      <motion.div

                        className="createStore__icon"

                        animate={{

                          rotate: [0, 360],

                          scale: [1, 1.1, 1]

                        }}

                        transition={{

                          duration: 3,

                          repeat: Infinity,

                          ease: "linear"

                        }}

                      >

                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

                          <path

                            d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"

                            stroke="currentColor"

                            strokeWidth="2"

                            strokeLinecap="round"

                            strokeLinejoin="round"

                            fill="currentColor"

                          />

                        </svg>

                      </motion.div>

                      <div className="createStore__content">

                        <motion.span

                          className="createStore__title"

                          animate={{

                            textShadow: [

                              "0 0 5px rgba(255, 255, 255, 0.5)",

                              "0 0 15px rgba(255, 255, 255, 0.8)",

                              "0 0 5px rgba(255, 255, 255, 0.5)"

                            ]

                          }}

                          transition={{

                            duration: 2,

                            repeat: Infinity,

                            ease: "easeInOut"

                          }}

                        >

                          Create

                        </motion.span>

                        <span className="createStore__subtitle">Store</span>

                      </div>

                      <motion.div

                        className="createStore__glow"

                        animate={{

                          opacity: [0.5, 1, 0.5],

                          scale: [1, 1.2, 1]

                        }}

                        transition={{

                          duration: 2,

                          repeat: Infinity,

                          ease: "easeInOut"

                        }}

                      />

                    </motion.a>

                  )}

                  {/* Wholesaler Badge - only show for non-Ray GPT slides */}

                  {id !== 0 && (

                    <motion.div

                      className="wholesaler__badge my-[-2rem]"

                      initial={{ opacity: 0, scale: 0.8, y: 20 }}

                      animate={{

                        opacity: currentIndex === id ? 1 : 0,

                        scale: currentIndex === id ? 1 : 0.8,

                        y: currentIndex === id ? 0 : 20

                      }}

                      transition={{

                        duration: 0.8,

                        delay: 0.5,

                        ease: "backOut"

                      }}

                    >

                      {/* ...existing badge content... */}

                      <motion.div

                        className="badge__icon"

                        animate={{

                          rotate: [0, 360],

                          scale: [1, 1.1, 1]

                        }}

                        transition={{

                          duration: 3,

                          repeat: Infinity,

                          ease: "linear"

                        }}

                      >

                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

                          <path

                            d="M3 7H21L19 19H5L3 7ZM3 7L2 3H1M16 11V13M8 11V13M7.5 3L9.5 7M16.5 3L14.5 7"

                            stroke="currentColor"

                            strokeWidth="2"

                            strokeLinecap="round"

                            strokeLinejoin="round"

                          />

                        </svg>

                      </motion.div>

                      <div className="badge__content">

                        <motion.span

                          className="badge__title"

                          animate={{

                            x: [0, 2, 0],

                          }}

                          transition={{

                            duration: 2,

                            repeat: Infinity,

                            ease: "easeInOut"

                          }}

                        >

                          Authorized

                        </motion.span>

                        <span className="badge__subtitle">Wholesaler</span>

                      </div>

                      <motion.div

                        className="badge__glow"

                        animate={{

                          opacity: [0.5, 1, 0.5],

                          scale: [1, 1.2, 1]

                        }}

                        transition={{

                          duration: 2,

                          repeat: Infinity,

                          ease: "easeInOut"

                        }}

                      />

                    </motion.div>

                  )}

                </div>

              </motion.div>

            ))}

          </div>

        </div>

        <div className="slider__indicatorWrapper">

          {sliderData.map((_, id) => (

            <motion.div

              onClick={() => {

                setCurrentIndex(id);

              }}

              animate={{

                scale: currentIndex === id ? 1.05 : 0.8,

                opacity: currentIndex === id ? 1 : 0.8,

              }}

              transition={{

                duration: 0.3,

                ease: "easeInOut",

              }}

              key={id}

              className="sliderIndicator"

            />

          ))}

        </div>

      </div>

    </AnimatePresence>

  );

};
