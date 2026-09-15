import React, { useState } from 'react';
import { Navbar } from '../components/common/Navbar/Navbar';
import { Footer } from '../components/common/Footer/Footer';
import { Calendar, Clock, User, Mail, Phone, MessageSquare, CheckCircle } from 'lucide-react';
import axios from 'axios';
import './ConsultingBooking.scss';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const ConsultingBooking = () => {
  const [formStep, setFormStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({
    consultationType: 'general',
    fullName: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    message: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const consultationTypes = [
    { id: 'general', label: 'General Consultation', description: 'General health and wellness advice' },
    { id: 'nutrition', label: 'Nutrition Consultation', description: 'Personalized nutrition guidance' },
    { id: 'supplement', label: 'Supplement Consultation', description: 'Product recommendations and guidance' },
  ];

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'
  ];

  const validateField = (field, value) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'fullName':
        if (!value.trim()) {
          newErrors.fullName = 'Full name is required';
        } else if (value.trim().length < 2) {
          newErrors.fullName = 'Full name must be at least 2 characters';
        } else {
          delete newErrors.fullName;
        }
        break;

      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;

      case 'phone':
        if (!value.trim()) {
          newErrors.phone = 'Phone number is required';
        } else if (!/^\+?\d{10,14}$/.test(value.replace(/\D/g, ''))) {
          newErrors.phone = 'Please enter a valid phone number';
        } else {
          delete newErrors.phone;
        }
        break;

      case 'preferredDate':
        if (!value) {
          newErrors.preferredDate = 'Please select a date';
        } else {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selectedDate < today) {
            newErrors.preferredDate = 'Please select a future date';
          } else {
            delete newErrors.preferredDate;
          }
        }
        break;

      case 'preferredTime':
        if (!value) {
          newErrors.preferredTime = 'Please select a time';
        } else {
          delete newErrors.preferredTime;
        }
        break;

      case 'message':
        if (value.trim().length > 500) {
          newErrors.message = 'Message must be less than 500 characters';
        } else {
          delete newErrors.message;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, value);
  };

  const canProceedToStep2 = () => {
    return formData.consultationType && !errors.consultationType;
  };

  const canProceedToStep3 = () => {
    return (
      formData.fullName &&
      formData.email &&
      formData.phone &&
      !errors.fullName &&
      !errors.email &&
      !errors.phone
    );
  };

  const canSubmit = () => {
    return (
      formData.fullName &&
      formData.email &&
      formData.phone &&
      formData.preferredDate &&
      formData.preferredTime &&
      formData.agreeToTerms &&
      !errors.fullName &&
      !errors.email &&
      !errors.phone &&
      !errors.preferredDate &&
      !errors.preferredTime
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canSubmit()) {
      setSubmitError('Please fill in all required fields correctly');
      return;
    }

    setLoading(true);
    setSubmitError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/bookings/create-consultation`, {
        consultationType: formData.consultationType,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        message: formData.message,
        submittedAt: new Date().toISOString()
      });

      setSuccessMessage('Consultation request submitted successfully!');
      setFormStep(4);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          consultationType: 'general',
          fullName: '',
          email: '',
          phone: '',
          preferredDate: '',
          preferredTime: '',
          message: '',
          agreeToTerms: false
        });
        setFormStep(1);
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error submitting consultation:', error);
      setSubmitError(
        error.response?.data?.message || 
        'Failed to submit consultation request. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  };

  return (
    <main className="consulting-booking-page">
      <Navbar />

      <section className="consulting-hero">
        <div className="hero-content">
          <h1>Schedule a Consultation</h1>
          <p>Get personalized guidance from our wellness experts</p>
        </div>
      </section>

      <section className="consulting-container">
        <div className="consulting-wrapper">
          {/* Progress Steps */}
          <div className="progress-steps">
            {[1, 2, 3, 4].map((step) => (
              <React.Fragment key={step}>
                <div className={`step ${step === formStep ? 'active' : ''} ${step < formStep ? 'completed' : ''}`}>
                  <div className="step-number">{step < formStep ? '✓' : step}</div>
                  <span className="step-label">
                    {step === 1 && 'Consultation Type'}
                    {step === 2 && 'Contact Info'}
                    {step === 3 && 'Schedule'}
                    {step === 4 && 'Confirmation'}
                  </span>
                </div>
                {step < 4 && <div className={`step-connector ${step < formStep ? 'completed' : ''}`} />}
              </React.Fragment>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="consulting-form">
            {submitError && (
              <div className="error-message">
                <span>{submitError}</span>
              </div>
            )}

            {/* STEP 1: Consultation Type */}
            {formStep === 1 && (
              <div className="form-step active">
                <h2>What type of consultation are you interested in?</h2>
                <p className="step-description">Choose the consultation that best fits your needs</p>

                <div className="consultation-types">
                  {consultationTypes.map((type) => (
                    <label key={type.id} className={`consultation-card ${formData.consultationType === type.id ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="consultationType"
                        value={type.id}
                        checked={formData.consultationType === type.id}
                        onChange={(e) => handleInputChange('consultationType', e.target.value)}
                      />
                      <div className="card-content">
                        <h3>{type.label}</h3>
                        <p>{type.description}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    disabled
                    style={{ visibility: 'hidden' }}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setFormStep(2)}
                    disabled={!canProceedToStep2()}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Contact Information */}
            {formStep === 2 && (
              <div className="form-step active">
                <h2>Contact Information</h2>
                <p className="step-description">Please provide your contact details</p>

                <div className="form-group-grid">
                  <div className="form-group">
                    <label htmlFor="fullName">
                      <User size={18} />
                      Full Name *
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={`form-input ${touched.fullName && errors.fullName ? 'error' : ''}`}
                    />
                    {touched.fullName && errors.fullName && (
                      <span className="field-error">{errors.fullName}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      <Mail size={18} />
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`form-input ${touched.email && errors.email ? 'error' : ''}`}
                    />
                    {touched.email && errors.email && (
                      <span className="field-error">{errors.email}</span>
                    )}
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="phone">
                      <Phone size={18} />
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`form-input ${touched.phone && errors.phone ? 'error' : ''}`}
                    />
                    {touched.phone && errors.phone && (
                      <span className="field-error">{errors.phone}</span>
                    )}
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setFormStep(1)}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setFormStep(3)}
                    disabled={!canProceedToStep3()}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Schedule & Message */}
            {formStep === 3 && (
              <div className="form-step active">
                <h2>Schedule Your Consultation</h2>
                <p className="step-description">Choose your preferred date and time</p>

                <div className="form-group-grid">
                  <div className="form-group">
                    <label htmlFor="preferredDate">
                      <Calendar size={18} />
                      Preferred Date *
                    </label>
                    <input
                      id="preferredDate"
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                      min={getMinDate()}
                      className={`form-input ${touched.preferredDate && errors.preferredDate ? 'error' : ''}`}
                    />
                    {touched.preferredDate && errors.preferredDate && (
                      <span className="field-error">{errors.preferredDate}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="preferredTime">
                      <Clock size={18} />
                      Preferred Time *
                    </label>
                    <select
                      id="preferredTime"
                      value={formData.preferredTime}
                      onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                      className={`form-input ${touched.preferredTime && errors.preferredTime ? 'error' : ''}`}
                    >
                      <option value="">Select a time</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                    {touched.preferredTime && errors.preferredTime && (
                      <span className="field-error">{errors.preferredTime}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">
                    <MessageSquare size={18} />
                    Additional Information (Optional)
                  </label>
                  <textarea
                    id="message"
                    placeholder="Tell us more about your health concerns or questions..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows="5"
                    className={`form-input textarea ${touched.message && errors.message ? 'error' : ''}`}
                  />
                  <span className="char-count">{formData.message.length}/500</span>
                  {touched.message && errors.message && (
                    <span className="field-error">{errors.message}</span>
                  )}
                </div>

                <div className="form-group checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={(e) => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                    />
                    <span>I agree to be contacted and understand that emails will be sent to info@rayshealthyliving.com *</span>
                  </label>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setFormStep(2)}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!canSubmit() || loading}
                  >
                    {loading ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Success Message */}
            {formStep === 4 && (
              <div className="form-step active">
                <div className="success-container">
                  <CheckCircle size={64} className="success-icon" />
                  <h2>Request Submitted Successfully!</h2>
                  <p>Thank you for scheduling a consultation with Ray's Healthy Living.</p>
                  <div className="success-details">
                    <p><strong>What happens next:</strong></p>
                    <ul>
                      <li>Your request has been sent to our team at info@rayshealthyliving.com</li>
                      <li>We will confirm your appointment within 24 hours</li>
                      <li>A confirmation email will be sent to {formData.email}</li>
                      <li>If you have any questions, call us at (651) 699-3438</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Contact Info Sidebar */}
        <div className="contact-sidebar">
          <div className="contact-card">
            <h3>Need Help?</h3>
            <p>If you have any questions or need immediate assistance, feel free to reach out:</p>
            
            <div className="contact-item">
              <Phone size={20} />
              <div>
                <p className="label">Phone</p>
                <a href="tel:+16516993438">(651) 699-3438</a>
              </div>
            </div>

            <div className="contact-item">
              <Mail size={20} />
              <div>
                <p className="label">Email</p>
                <a href="mailto:info@rayshealthyliving.com">info@rayshealthyliving.com</a>
              </div>
            </div>

            <div className="contact-item">
              <Clock size={20} />
              <div>
                <p className="label">Business Hours</p>
                <p>Mon - Fri: 9:00 AM - 5:00 PM</p>
                <p>Sat: 10:00 AM - 4:00 PM</p>
                <p>Sun: Closed</p>
              </div>
            </div>
          </div>

          <div className="faq-card">
            <h3>Frequently Asked Questions</h3>
            <div className="faq-item">
              <p className="faq-question">How long is a consultation?</p>
              <p className="faq-answer">Initial consultations typically last 30-45 minutes.</p>
            </div>
            <div className="faq-item">
              <p className="faq-question">Can I reschedule?</p>
              <p className="faq-answer">Yes, please contact us at least 24 hours before your appointment.</p>
            </div>
            <div className="faq-item">
              <p className="faq-question">What should I prepare?</p>
              <p className="faq-answer">Have your health history and current medications available.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ConsultingBooking;
