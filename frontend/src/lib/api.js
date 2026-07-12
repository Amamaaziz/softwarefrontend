// Mock "API" layer — mirrors the shape a real Axios client would return.
// Swap the bodies of these functions for real axios calls once the backend is live, e.g.:
//   export const getServices = () => axios.get('/api/services').then(r => r.data)
// Every function returns a Promise and simulates network latency so loading states are visible.

import { SERVICES, PORTFOLIO, BLOGS, TESTIMONIALS, JOBS } from '../data/mockData.js'

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getServices() {
  await delay()
  return SERVICES.filter((s) => s.isPublished).sort((a, b) => a.order - b.order)
}

export async function getServiceBySlug(slug) {
  await delay()
  return SERVICES.find((s) => s.slug === slug && s.isPublished) || null
}

export async function getPortfolio() {
  await delay()
  return PORTFOLIO.filter((p) => p.isPublished)
}

export async function getFeaturedPortfolio() {
  await delay(350)
  return PORTFOLIO.filter((p) => p.isPublished && p.isFeatured)
}

export async function getPortfolioBySlug(slug) {
  await delay()
  return PORTFOLIO.find((p) => p.slug === slug && p.isPublished) || null
}

export async function getBlogs() {
  await delay()
  return BLOGS.filter((b) => b.status === 'published')
}

export async function getBlogBySlug(slug) {
  await delay()
  return BLOGS.find((b) => b.slug === slug && b.status === 'published') || null
}

export async function getTestimonials() {
  await delay(350)
  return TESTIMONIALS.filter((t) => t.isPublished)
}

export async function getJobs() {
  await delay()
  return JOBS
}

export async function getJobBySlug(slug) {
  await delay()
  return JOBS.find((j) => j.slug === slug) || null
}

export async function submitContactForm(payload) {
  await delay(700)
  // eslint-disable-next-line no-console
  console.log('Contact form submitted (mock):', payload)
  return { success: true }
}

export async function submitJobApplication(payload) {
  await delay(700)
  // eslint-disable-next-line no-console
  console.log('Job application submitted (mock):', payload)
  return { success: true }
}

export async function submitNewsletter(email) {
  await delay(400)
  // eslint-disable-next-line no-console
  console.log('Newsletter signup (mock):', email)
  return { success: true }
}
