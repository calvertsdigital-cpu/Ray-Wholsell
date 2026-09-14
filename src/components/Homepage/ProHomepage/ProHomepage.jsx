import React from 'react';
import './ProHomepage.scss';
import firm_img from '../../../assets/images/bg/firm_img.jpg';
import organic_section from '../../../assets/images/bg/organic-section.jpg';
import guaranty from '../../../assets/images/bg/guaranty.jpg';
import vid_img from '../../../assets/images/bg/vid-img.png';

export const ProHomepage = () => {
  return (
    <>
      {/* Quality & Features Section */}
      <section className="quality-section">
        <div className="wrap">
          <p className="eyebrow">OUR COMMITMENT</p>
          <h2>Quality, Safety, And Satisfaction</h2>
          <div className="quality-rule" />
          
          <div className="quality-grid">
            {[
              {
                title: 'Safe ingredients',
                text: 'Every product is made using only safe, natural ingredients derived from premium organic herbs and fruits. We ensure that all formulations are completely free from artificial additives.',
                image: 'quality-one'
              },
              {
                title: 'Ideal growing environment',
                text: 'Our herbs and fruits are sourced from ideal growing environments, ensuring they are cultivated under optimal conditions for highest quality and potency.',
                image: 'quality-two'
              },
              {
                title: 'Scientifically tested',
                text: 'Our manufacturers employ advanced techniques like chromatographic fingerprinting to ensure our herbs and fruits are of the highest quality and authenticity.',
                image: 'quality-three'
              },
              {
                title: 'Quality control',
                text: 'We maintain strict quality control measures throughout our supply chain. Each batch undergoes rigorous testing to ensure it meets our high standards.',
                image: 'quality-four'
              },
              {
                title: 'Satisfaction',
                text: 'We are committed to customer satisfaction and stand behind our products. We offer a hassle-free return policy to ensure a positive experience.',
                image: 'quality-five'
              },
              {
                title: 'Certified organic',
                text: 'We partner with certified organic farmers and responsible harvesters. Our commitment to organic sourcing means you can trust every ingredient.',
                image: 'quality-six'
              },
            ].map((item, index) => (
              <article key={index} className="quality-card">
                <div className={`quality-image ${item.image}`} />
                <div className="quality-copy">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="story-section">
        <div className="story wrap">
          <div className="story-image" style={{backgroundImage: `url(${firm_img})`}} />
          <div className="story-copy">
            <p className="eyebrow">ABOUT OUR FIRM</p>
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

      {/* Organic & Ethical Sourcing */}
      <section className="sourcing-section">
        <div className="sourcing-card">
          <p className="eyebrow">OUR VALUES</p>
          <h2>Organic and Ethical Sourcing</h2>
          <div className="sourcing-rule" />
          <p>Quality is the foundation of our work, which is why we partner with certified organic farmers and responsible wild harvesters. We are committed to sustainability and do not source endangered herbs. Our carefully chosen growers and wild crafters share our dedication to ethical harvesting practices and environmental conservation.</p>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="compliance-section">
        <div className="compliance wrap">
          <div>
            <p className="eyebrow">OUR PROMISE</p>
            <h2>100% COMPLIANT</h2>
            <ul>
              {[
                'NSF GMP Certified',
                'FDA OTC registered facility',
                'KOF-K kosher certified',
                'Certified Organic',
                'Non-GMO',
                'Gluten-Free',
                'Allergen Testing',
                'Pesticide Testing'
              ].map((item, index) => (
                <li key={index}>✓ <span>{item}</span></li>
              ))}
            </ul>
          </div>
          <div className="video-card" style={{backgroundImage: `url(${vid_img})`}}>
            <button aria-label="Play quality video">▶</button>
          </div>
        </div>
      </section>

      {/* Chamber of Commerce */}
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
          <a className="chamber-link" href="#about">View Chamber Reviews</a>
        </div>
      </section>

      {/* Benefits Footer Section */}
      <section className="benefits-section">
        <div className="benefits wrap">
          {[
            ['Free shipping', 'On orders over $99', '▱'],
            ['Guarantee', '30 days money back', '↔'],
            ['Safe payment', 'Safe your online payment', '▭'],
            ['Online support', 'We have support 24/7', '◎'],
          ].map(([title, text, icon], index) => (
            <div key={index}>
              <span className="benefit-icon">{icon}</span>
              <div>
                <strong>{title}</strong>
                <small>{text}</small>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default ProHomepage;
