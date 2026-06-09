import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { PrescriptionProvider } from './contexts/PrescriptionContext'
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

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-deep)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--sage)] border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <PrescriptionProvider>
              <AppShell />
            </PrescriptionProvider>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/app/analyze" replace />} />
        <Route path="analyze" element={<AnalyzePrescription />} />
        <Route path="pricing" element={<PricingComparisons />} />
        <Route path="know" element={<KnowYourPrescription />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
