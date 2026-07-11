import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Spinner from './components/ui/Spinner.jsx'

// Route-based code splitting: each page becomes its own chunk, so the initial
// bundle only carries the shell (Navbar/Footer) plus the page being visited.
// Vite prefetches chunks efficiently, so subsequent navigations stay snappy.
const Home = lazy(() => import('./pages/Home.jsx'))
const About = lazy(() => import('./pages/About.jsx'))
const ServicesList = lazy(() => import('./pages/ServicesList.jsx'))
const ServiceDetail = lazy(() => import('./pages/ServiceDetail.jsx'))
const PortfolioList = lazy(() => import('./pages/PortfolioList.jsx'))
const PortfolioDetail = lazy(() => import('./pages/PortfolioDetail.jsx'))
const BlogList = lazy(() => import('./pages/BlogList.jsx'))
const BlogDetail = lazy(() => import('./pages/BlogDetail.jsx'))
const CareersList = lazy(() => import('./pages/CareersList.jsx'))
const Opportunities = lazy(() => import('./pages/Opportunities.jsx'))
const JobDetail = lazy(() => import('./pages/JobDetail.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const Testimonials = lazy(() => import('./pages/Testimonials.jsx'))
const Privacy = lazy(() => import('./pages/Privacy.jsx'))
const Terms = lazy(() => import('./pages/Terms.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<Spinner className="py-32" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<ServicesList />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/portfolio" element={<PortfolioList />} />
            <Route path="/portfolio/:slug" element={<PortfolioDetail />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/careers" element={<CareersList />} />
            <Route path="/careers/opportunities" element={<Opportunities />} />
            <Route path="/careers/:slug" element={<JobDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/privacy-policy" element={<Privacy />} />
            <Route path="/terms-and-conditions" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}