import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import Features from './components/Features'
import Stats from './components/Stats'
import About from './components/About'
import CTA from './components/CTA'
import Footer from './components/Footer'
import AuthPage from './components/AuthPage'
import ForgotPassword from './components/ForgotPassword'
import AppShell from './components/app/AppShell'
import AnalyzePrescription from './components/app/AnalyzePrescription'
import PricingComparisons from './components/app/PricingComparisons'
import KnowYourPrescription from './components/app/KnowYourPrescription'

function Landing() {
  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Stats />
      <About />
      <CTA />
      <Footer />
    </>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/app" element={<AppShell />}>
        <Route index element={<Navigate to="/app/analyze" replace />} />
        <Route path="analyze" element={<AnalyzePrescription />} />
        <Route path="pricing" element={<PricingComparisons />} />
        <Route path="know" element={<KnowYourPrescription />} />
      </Route>
    </Routes>
  )
}

export default App
