import React, { Suspense, lazy, useState, useEffect } from 'react';
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// ── Core pages: eagerly loaded (user visits these constantly) ────────────────
import { HomePage } from "./Pages/Home";
import { Products } from "./Pages/Products";
import { ProductDetails } from "./Pages/ProductDetails";
import { Profile } from "./Pages/Profile";
import { Login } from "./Pages/auth/Login/Login";
import { Register } from "./Pages/auth/Register/Register";
import { ForgotPassword } from "./Pages/auth/ForgotPassword/ForgotPassword";
import PurchaseSummary from "./Pages/PurchaseSummary";
import OrderSuccess from "./Pages/OrderSuccess";
import OrderDetails from "./components/Profilepage/OrderDetails";
import TrackingDetail from "./components/Profilepage/TrackShipmentDetails";
import Aboutpage from "./Pages/AboutPage";
import Contactpage from "./Pages/ContactPage";
import Blog from "./Pages/auth/Blog.jsx";
import BlogDetail from "./Pages/BlogDetail.jsx";

// ── Global layout components ─────────────────────────────────────────────────
import FixedButtons from "./components/FixedButton";
import { ChatWidget } from "./components/ChatWidget/ChatWidget";
import Loader from './components/common/Loader/Loader';
import { CookieConsentProvider } from './context/CookieConsentContext';
import { CookieConsentBanner } from './components/CookieConsent/CookieConsentBanner';
import { WelcomeModal } from './components/WelcomeModal/WelcomeModal';

// ── Lazy-loaded pages (only downloaded when the user navigates to them) ───────
const FilterProduct       = lazy(() => import('./components/ProductPage/ProductLists/FilterProduct'));
const Conditionofuse      = lazy(() => import('./Pages/conditionofuse'));
const ReturnPolicy        = lazy(() => import('./Pages/ReturnPolicy'));
const PrivatePolicy       = lazy(() => import('./Pages/PrivatePolicy'));
const DeliveryPolicy      = lazy(() => import('./Pages/DeliveryPolicy'));
const CommentingPolicy    = lazy(() => import('./Pages/CommentingPolicy'));
const Faq                 = lazy(() => import('./Pages/Faq'));
const Mystorya            = lazy(() => import('./Pages/Mystory'));
const Testimonial         = lazy(() => import('./Pages/Testimonial'));
const Feedback            = lazy(() => import('./Pages/Feedback'));
const ConsultingBooking   = lazy(() => import('./Pages/ConsultingBooking').then(m => ({ default: m.ConsultingBooking })));
const SuccessPage         = lazy(() => import('./Pages/SuccessPage'));
const CancelPage          = lazy(() => import('./Pages/CancelPage'));
const BengalReview        = lazy(() => import('./Pages/BengalReview.jsx'));

// ── Health Concern pages: all lazy (rarely visited, large bundle impact) ─────
const HealthConcern             = lazy(() => import('./Pages/HealthConcern.jsx'));
const ADDHADH                   = lazy(() => import('./Pages/A-ZList/AddAdhd'));
const Alcholism                 = lazy(() => import('./Pages/A-ZList/Alcholism'));
const Alopecia                  = lazy(() => import('./Pages/A-ZList/Alopecia'));
const Amyotrophic               = lazy(() => import('./Pages/A-ZList/Amyotrophic'));
const Angina                    = lazy(() => import('./Pages/A-ZList/Angina'));
const Arrhythmia                = lazy(() => import('./Pages/A-ZList/Arrhythmia'));
const Arthritis                 = lazy(() => import('./Pages/A-ZList/Arthritis'));
const Asthama                   = lazy(() => import('./Pages/A-ZList/Asthama'));
const Atherosclerosis           = lazy(() => import('./Pages/A-ZList/Atherosclerosis'));
const AutoimmuneDisorders       = lazy(() => import('./Pages/A-ZList/AutoimmuneDisorders'));
const AvianInfluenza            = lazy(() => import('./Pages/A-ZList/AvianInfluenza'));
const Ayurveda                  = lazy(() => import('./Pages/A-ZList/Ayurveda'));
const ENT                       = lazy(() => import('./Pages/A-ZList/ENT'));
const Eyeandvision              = lazy(() => import('./Pages/A-ZList/Eyeandvision'));
const Fatigue                   = lazy(() => import('./Pages/A-ZList/Fatigue'));
const Fibromyalgia              = lazy(() => import('./Pages/A-ZList/Fibromyalgia'));
const FoodAllergy               = lazy(() => import('./Pages/A-ZList/FoodAllergy'));
const FootCenter                = lazy(() => import('./Pages/A-ZList/FootCenter'));
const Gallstones                = lazy(() => import('./Pages/A-ZList/Gallstones'));
const GastricUlcer              = lazy(() => import('./Pages/A-ZList/GastricUlcer'));
const Gout                      = lazy(() => import('./Pages/A-ZList/Gout'));
const Headache                  = lazy(() => import('./Pages/A-ZList/Headache'));
const HeartburnAndGERD          = lazy(() => import('./Pages/A-ZList/HeartburnAndGERD'));
const Hemorrhoids               = lazy(() => import('./Pages/A-ZList/Hemorrhoids'));
const Hepatitis                 = lazy(() => import('./Pages/A-ZList/Hepatiti'));
const ImmuneSupport             = lazy(() => import('./Pages/A-ZList/ImmuneSupport'));
const JointsAndLegaments        = lazy(() => import('./Pages/A-ZList/JointsAndLegaments'));
const KidneyBladderDiseases     = lazy(() => import('./Pages/A-ZList/KidneyBladderDiseases'));
const Leukemia                  = lazy(() => import('./Pages/A-ZList/Leukemia'));
const Menopause                 = lazy(() => import('./Pages/A-ZList/Menopause'));
const Backpain                  = lazy(() => import('./Pages/A-ZList/Backpain'));
const BacterialInfections       = lazy(() => import('./Pages/A-ZList/BacterialInfections'));
const BladderInfection          = lazy(() => import('./Pages/A-ZList/BladderInfection'));
const BoneOsteoporosis          = lazy(() => import('./Pages/A-ZList/BoneOsteoporosis'));
const BrainandCognitiveFunction = lazy(() => import('./Pages/A-ZList/BrainAndCognitiveFunction'));
const Breastcancer              = lazy(() => import('./Pages/A-ZList/BreastCancer'));
const BruisingAndContusions     = lazy(() => import('./Pages/A-ZList/BruisingAndContusions'));
const VaricoseAndVeinCare       = lazy(() => import('./Pages/A-ZList/VaricoseAndVeinCare'));
const UterineFibroid            = lazy(() => import('./Pages/A-ZList/UterineFibroid'));
const Trauma                    = lazy(() => import('./Pages/A-ZList/Trauma'));
const RespiratoryHealth         = lazy(() => import('./Pages/A-ZList/RespiratoryHealth'));
const Stroke                    = lazy(() => import('./Pages/A-ZList/Stroke'));
const ParkinsonsDisease         = lazy(() => import('./Pages/A-ZList/ParkinsonsDisease'));
const OralCare                  = lazy(() => import('./Pages/A-ZList/OralCare'));
const NailHealth                = lazy(() => import('./Pages/A-ZList/NailHealth'));
const Thyroid                   = lazy(() => import('./Pages/A-ZList/Thyroid'));
const SleepSupport              = lazy(() => import('./Pages/A-ZList/SleepSupport'));
const SkinHealth                = lazy(() => import('./Pages/A-ZList/SkinHealth'));
const Cancer                    = lazy(() => import('./Pages/A-ZList/Cancer'));
const Cataract                  = lazy(() => import('./Pages/A-ZList/Cataract'));
const Candida                   = lazy(() => import('./Pages/A-ZList/Candida'));
const CankerSores               = lazy(() => import('./Pages/A-ZList/CankerSores'));
const Cardiomyopathy            = lazy(() => import('./Pages/A-ZList/Cardiomyopathy'));
const CarpalTunnel              = lazy(() => import('./Pages/A-ZList/CarpalTunnel'));
const ChildrensHealth           = lazy(() => import('./Pages/A-ZList/ChildrensHealth'));
const Cholesterol               = lazy(() => import('./Pages/A-ZList/Cholesterol'));
const ChronicFatigue            = lazy(() => import('./Pages/A-ZList/ChronicFatigue'));
const CleanseAndDetox           = lazy(() => import('./Pages/A-ZList/CleanseAndDetox'));
const ColdFluAndViral           = lazy(() => import('./Pages/A-ZList/ColdFluAndViral'));
const Constipation              = lazy(() => import('./Pages/A-ZList/Constipation'));
const Depression                = lazy(() => import('./Pages/A-ZList/Depression'));
const Diarrhea                  = lazy(() => import('./Pages/A-ZList/Diarrhea'));
const DietAndWeightLoss         = lazy(() => import('./Pages/A-ZList/Diet And Weight Loss'));
const DigestionAndStomachAilments = lazy(() => import('./Pages/A-ZList/Digestion And Stomach Ailments'));
const DryMouth                  = lazy(() => import('./Pages/A-ZList/Dry Mouth'));
const ColonHealth               = lazy(() => import('./Pages/A-ZList/Colon Health'));
const CongestiveHeartFailure    = lazy(() => import('./Pages/A-ZList/Congestive Heart Failure'));

// ── Minimal fallback for lazy routes ─────────────────────────────────────────
const PageFallback = () => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh' }}>
    <div style={{ width:32, height:32, border:'3px solid #77a13d', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
  </div>
);

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reduced from 3000ms — show loader just long enough for critical assets
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loader show={true} fullScreen={true} />;
  }

  return (
    <CookieConsentProvider>
      <BrowserRouter>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {/* ── Core routes ───────────────────────────── */}
            <Route path="/" exact element={<HomePage />} />
            <Route path="/products" exact element={<Products />} />
            <Route path="/products-details/:pid" exact element={<ProductDetails />} />
            <Route path="/account/my-profile" exact element={<Profile />} />
            <Route path="/account/order-details/:orderId" exact element={<OrderDetails />} />
            <Route path="/auth/login" exact element={<Login />} />
            <Route path="/auth/register" exact element={<Register />} />
            <Route path="/auth/forgot-password" exact element={<ForgotPassword />} />
            <Route path="/purchase-summary" exact element={<PurchaseSummary />} />
            <Route path="/checkout" exact element={<PurchaseSummary />} />
            <Route path="/order-success" exact element={<OrderSuccess />} />
            <Route path="/tracking" element={<TrackingDetail />} />
            <Route path="/about" element={<Aboutpage />} />
            <Route path="/blogs" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/bengal-reviews" element={<BengalReview />} />
            <Route path="/product/:categoryId" element={<Products />} />
            <Route path="/contact" exact element={<Contactpage />} />

            {/* ── Policy / info (lazy) ──────────────────── */}
            <Route path="/conditionofuse" exact element={<Conditionofuse />} />
            <Route path="/return-policy" exact element={<ReturnPolicy />} />
            <Route path="/private-policy" exact element={<PrivatePolicy />} />
            <Route path="/delivery-policy" exact element={<DeliveryPolicy />} />
            <Route path="/commenting-policy" exact element={<CommentingPolicy />} />
            <Route path="/faq" exact element={<Faq />} />
            <Route path="/my-story" exact element={<Mystorya />} />
            <Route path="/our-testimonials" exact element={<Testimonial />} />
            <Route path="/feedback" exact element={<Feedback />} />
            <Route path="/counseling" exact element={<ConsultingBooking />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/cancel" element={<CancelPage />} />

            {/* ── Health Concern (all lazy) ─────────────── */}
            <Route path="/health-concern" exact element={<HealthConcern />} />
            <Route path="/health-concern/add-adhd" exact element={<ADDHADH />} />
            <Route path="/health-concern/alcoholism" exact element={<Alcholism />} />
            <Route path="/health-concern/alopecia" exact element={<Alopecia />} />
            <Route path="/health-concern/amyotrophic-lateral-sclerosis" exact element={<Amyotrophic />} />
            <Route path="/health-concern/angina" exact element={<Angina />} />
            <Route path="/health-concern/arrhythmia" exact element={<Arrhythmia />} />
            <Route path="/health-concern/arthritis" exact element={<Arthritis />} />
            <Route path="/health-concern/asthma" exact element={<Asthama />} />
            <Route path="/health-concern/atherosclerosis" exact element={<Atherosclerosis />} />
            <Route path="/health-concern/autoimmune-disorders" exact element={<AutoimmuneDisorders />} />
            <Route path="/health-concern/avian-influenza" exact element={<AvianInfluenza />} />
            <Route path="/health-concern/ayurveda" exact element={<Ayurveda />} />
            <Route path="/health-concern/ear-hearing-and-tinnitus" exact element={<ENT />} />
            <Route path="/health-concern/eye-and-vision-care" exact element={<Eyeandvision />} />
            <Route path="/health-concern/fatigue" exact element={<Fatigue />} />
            <Route path="/health-concern/fibromyalgia" exact element={<Fibromyalgia />} />
            <Route path="/health-concern/food-allergy" exact element={<FoodAllergy />} />
            <Route path="/health-concern/foot-center" exact element={<FootCenter />} />
            <Route path="/health-concern/gallstones" exact element={<Gallstones />} />
            <Route path="/health-concern/gastric-ulcer" exact element={<GastricUlcer />} />
            <Route path="/health-concern/gout" exact element={<Gout />} />
            <Route path="/health-concern/headache" exact element={<Headache />} />
            <Route path="/health-concern/heartburn-and-gerd" exact element={<HeartburnAndGERD />} />
            <Route path="/health-concern/hemorrhoids" exact element={<Hemorrhoids />} />
            <Route path="/health-concern/hepatitis" exact element={<Hepatitis />} />
            <Route path="/health-concern/immune-support" exact element={<ImmuneSupport />} />
            <Route path="/health-concern/joints-and-ligaments" exact element={<JointsAndLegaments />} />
            <Route path="/health-concern/kidney-bladder-diseases" exact element={<KidneyBladderDiseases />} />
            <Route path="/health-concern/leukemia" exact element={<Leukemia />} />
            <Route path="/health-concern/menopause" exact element={<Menopause />} />
            <Route path="/health-concern/back-pain" exact element={<Backpain />} />
            <Route path="/health-concern/bacterial-infections" exact element={<BacterialInfections />} />
            <Route path="/health-concern/bladder-infection" exact element={<BladderInfection />} />
            <Route path="/health-concern/bone-osteoporosis" exact element={<BoneOsteoporosis />} />
            <Route path="/health-concern/brain-and-cognitive-function" exact element={<BrainandCognitiveFunction />} />
            <Route path="/health-concern/breast-cancer" exact element={<Breastcancer />} />
            <Route path="/health-concern/bruising-and-contusions" exact element={<BruisingAndContusions />} />
            <Route path="/health-concern/varicose-and-vein-care" exact element={<VaricoseAndVeinCare />} />
            <Route path="/health-concern/uterine-fibroid" exact element={<UterineFibroid />} />
            <Route path="/health-concern/trauma" exact element={<Trauma />} />
            <Route path="/health-concern/respiratory-health" exact element={<RespiratoryHealth />} />
            <Route path="/health-concern/stroke" exact element={<Stroke />} />
            <Route path="/health-concern/parkinsons-disease" exact element={<ParkinsonsDisease />} />
            <Route path="/health-concern/oral-care" exact element={<OralCare />} />
            <Route path="/health-concern/nail-health" exact element={<NailHealth />} />
            <Route path="/health-concern/thyroid" exact element={<Thyroid />} />
            <Route path="/health-concern/sleep-support" exact element={<SleepSupport />} />
            <Route path="/health-concern/skin-health" exact element={<SkinHealth />} />
            <Route path="/health-concern/cancer" exact element={<Cancer />} />
            <Route path="/health-concern/cataract" exact element={<Cataract />} />
            <Route path="/health-concern/candida-fungal" exact element={<Candida />} />
            <Route path="/health-concern/canker-sores" exact element={<CankerSores />} />
            <Route path="/health-concern/cardiomyopathy" exact element={<Cardiomyopathy />} />
            <Route path="/health-concern/carpal-tunnel" exact element={<CarpalTunnel />} />
            <Route path="/health-concern/childrens-health" exact element={<ChildrensHealth />} />
            <Route path="/health-concern/cholesterol" exact element={<Cholesterol />} />
            <Route path="/health-concern/chronic-fatigue" exact element={<ChronicFatigue />} />
            <Route path="/health-concern/cleanse-and-detox" exact element={<CleanseAndDetox />} />
            <Route path="/health-concern/cold-flu-and-viral" exact element={<ColdFluAndViral />} />
            <Route path="/health-concern/constipation" exact element={<Constipation />} />
            <Route path="/health-concern/depression" exact element={<Depression />} />
            <Route path="/health-concern/diarrhea" exact element={<Diarrhea />} />
            <Route path="/health-concern/diet-and-weight-loss" exact element={<DietAndWeightLoss />} />
            <Route path="/health-concern/digestion-and-stomach-ailments" exact element={<DigestionAndStomachAilments />} />
            <Route path="/health-concern/dry-mouth" exact element={<DryMouth />} />
            <Route path="/health-concern/colon-health" exact element={<ColonHealth />} />
            <Route path="/health-concern/congestive-heart-failure" exact element={<CongestiveHeartFailure />} />
          </Routes>
        </Suspense>

        <FixedButtons />
        <ChatWidget />
        <WelcomeModal />
      </BrowserRouter>
      <CookieConsentBanner />
    </CookieConsentProvider>
  );
}

export default App;
