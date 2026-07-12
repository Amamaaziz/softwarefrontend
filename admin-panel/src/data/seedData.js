// Static seed data for the admin panel. This is a frontend-only project —
// there is no backend, no API, no network calls. Everything here lives in
// memory and resets on page refresh. Field names match Database-Schema.md.

let idCounter = 1000;
export function nextId() {
  idCounter += 1;
  return `mock-${idCounter}`;
}

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();

export const seedUsers = [
  { _id: 'user-1', name: 'Ayesha Khan', email: 'ayesha@softwarehouse.com', role: 'super_admin', image: '', isActive: true, createdAt: daysAgo(120) },
  { _id: 'user-2', name: 'Bilal Ahmed', email: 'bilal@softwarehouse.com', role: 'content_editor', image: '', isActive: true, createdAt: daysAgo(80) },
  { _id: 'user-3', name: 'Sara Malik', email: 'sara@softwarehouse.com', role: 'hr_manager', image: '', isActive: true, createdAt: daysAgo(45) },
  { _id: 'user-4', name: 'Usman Tariq', email: 'usman@softwarehouse.com', role: 'content_editor', image: '', isActive: false, createdAt: daysAgo(200) },
];

export const seedServices = [
  {
    _id: 'svc-1', title: 'Web Development', slug: 'web-development',
    shortDescription: 'Fast, scalable, and modern websites built with the latest frameworks.',
    description: '<p>We build responsive, high-performance websites using React, Next.js, and Node.js.</p>',
    subServices: [
      { title: 'Landing Pages', description: 'Conversion-focused single pages for campaigns.' },
      { title: 'E-commerce Sites', description: 'Full online stores with payment integration.' },
    ],
    images: [], order: 1, isPublished: true, createdBy: 'user-2', createdAt: daysAgo(90), updatedAt: daysAgo(10),
  },
  {
    _id: 'svc-2', title: 'Mobile App Development', slug: 'mobile-app-development',
    shortDescription: 'Native and cross-platform mobile apps for iOS and Android.',
    description: '<p>Using React Native and Flutter, we deliver mobile experiences that feel native on every device.</p>',
    subServices: [], images: [], order: 2, isPublished: true, createdBy: 'user-2', createdAt: daysAgo(85), updatedAt: daysAgo(20),
  },
  {
    _id: 'svc-3', title: 'UI/UX Design', slug: 'ui-ux-design',
    shortDescription: 'User-centered design that balances beauty and usability.',
    description: '<p>From wireframes to polished prototypes, our design team crafts interfaces people love using.</p>',
    subServices: [], images: [], order: 3, isPublished: false, createdBy: 'user-2', createdAt: daysAgo(30), updatedAt: daysAgo(2),
  },
  {
    _id: 'svc-4', title: 'Cloud & DevOps', slug: 'cloud-devops',
    shortDescription: 'Reliable infrastructure, CI/CD pipelines, and 24/7 monitoring.',
    description: '<p>We set up scalable, secure cloud infrastructure on AWS, Azure, and GCP.</p>',
    subServices: [], images: [], order: 4, isPublished: true, createdBy: 'user-1', createdAt: daysAgo(60), updatedAt: daysAgo(15),
  },
];

export const seedPortfolio = [
  {
    _id: 'proj-1', title: 'FinTrack — Personal Finance App', slug: 'fintrack-personal-finance-app', client: 'FinTrack Inc.', service: 'svc-2',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    challenge: '<p>The client needed a secure, intuitive way for users to track spending across multiple bank accounts.</p>',
    solution: '<p>We built a React Native app with Plaid integration and biometric authentication.</p>',
    result: '<p>50,000+ downloads in the first 3 months with a 4.8 star rating.</p>',
    technologies: ['React Native', 'Node.js', 'MongoDB', 'Plaid API'], isFeatured: true, isPublished: true, createdBy: 'user-2', createdAt: daysAgo(70), updatedAt: daysAgo(5),
  },
  {
    _id: 'proj-2', title: 'GreenCart — Sustainable E-commerce', slug: 'greencart-sustainable-ecommerce', client: 'GreenCart Co.', service: 'svc-1',
    coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
    challenge: '<p>Launching an online store for eco-friendly products with complex filtering needs.</p>',
    solution: '<p>Built on Next.js with a headless CMS and Stripe checkout.</p>',
    result: '<p>Achieved a 3.2% conversion rate, well above industry average.</p>',
    technologies: ['Next.js', 'Stripe', 'Tailwind CSS'], isFeatured: true, isPublished: true, createdBy: 'user-2', createdAt: daysAgo(55), updatedAt: daysAgo(12),
  },
  {
    _id: 'proj-3', title: 'MedConnect — Telehealth Platform', slug: 'medconnect-telehealth-platform', client: 'MedConnect Health', service: 'svc-1',
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    challenge: '<p>Connecting patients with doctors remotely while staying HIPAA compliant.</p>',
    solution: '<p>Video consultation platform with encrypted messaging and appointment scheduling.</p>',
    result: '<p>Now used by 40+ clinics across the region.</p>',
    technologies: ['React', 'WebRTC', 'PostgreSQL'], isFeatured: false, isPublished: true, createdBy: 'user-1', createdAt: daysAgo(40), updatedAt: daysAgo(8),
  },
  {
    _id: 'proj-4', title: 'Internal Tools Revamp', slug: 'internal-tools-revamp', client: 'Confidential', service: '',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    challenge: '<p>Legacy admin tools were slowing down internal operations.</p>',
    solution: '<p>Rebuilt the dashboard from scratch with modern tooling.</p>',
    result: '<p>Draft — not yet published.</p>',
    technologies: ['React', 'Express'], isFeatured: false, isPublished: false, createdBy: 'user-2', createdAt: daysAgo(5), updatedAt: daysAgo(1),
  },
];

export const seedBlogs = [
  {
    _id: 'blog-1', title: 'Why We Chose React Query Over Redux in 2026', slug: 'why-react-query-over-redux-2026', author: 'user-2', category: 'Engineering',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    content: '<p>Server state and client state are different problems. Here is how we simplified our data layer...</p>',
    excerpt: 'Server state and client state are different problems — here is how we simplified our data layer.',
    seoMeta: { metaTitle: '', metaDescription: '' }, status: 'published', publishedAt: daysAgo(14), createdAt: daysAgo(16), updatedAt: daysAgo(14),
  },
  {
    _id: 'blog-2', title: '5 Signs Your Startup Needs a Custom Software Solution', slug: '5-signs-startup-needs-custom-software', author: 'user-2', category: 'Industry Insights',
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
    content: '<p>Off-the-shelf tools work — until they do not. Here are the signs it is time to go custom...</p>',
    excerpt: 'Off-the-shelf tools work until they do not. Here are the signs it is time to go custom.',
    seoMeta: { metaTitle: '', metaDescription: '' }, status: 'published', publishedAt: daysAgo(30), createdAt: daysAgo(32), updatedAt: daysAgo(30),
  },
  {
    _id: 'blog-3', title: 'Behind the Scenes: Our New Office Launch', slug: 'behind-the-scenes-new-office-launch', author: 'user-1', category: 'Company News',
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    content: '<p>We are excited to share photos and stories from our new office space...</p>',
    excerpt: 'We are excited to share photos and stories from our new office space.',
    seoMeta: { metaTitle: '', metaDescription: '' }, status: 'draft', publishedAt: null, createdAt: daysAgo(3), updatedAt: daysAgo(1),
  },
];

export const seedTestimonials = [
  { _id: 'test-1', clientName: 'Sarah Johnson', company: 'FinTrack Inc.', photo: '', message: 'The team delivered beyond our expectations. Communication was excellent throughout the whole project.', rating: 5, isPublished: true, createdAt: daysAgo(60) },
  { _id: 'test-2', clientName: 'Ahmed Raza', company: 'GreenCart Co.', photo: '', message: 'Professional, fast, and detail-oriented. Our online store has never performed better.', rating: 5, isPublished: true, createdAt: daysAgo(45) },
  { _id: 'test-3', clientName: 'Emily Chen', company: 'MedConnect Health', photo: '', message: 'Great experience overall, though the timeline slipped by a couple of weeks.', rating: 4, isPublished: false, createdAt: daysAgo(20) },
];

export const seedJobs = [
  {
    _id: 'job-1', title: 'Senior Frontend Developer (React)', slug: 'senior-frontend-developer-react', department: 'Engineering', location: 'Remote', type: 'full-time', experienceLevel: 'Senior',
    description: '<p>We are looking for a Senior Frontend Developer to help lead our React-based projects.</p>',
    requirements: ['5+ years with React', 'Strong TypeScript skills', 'Experience with design systems'],
    responsibilities: ['Own frontend architecture decisions', 'Mentor junior developers', 'Review pull requests'],
    status: 'open', postedBy: 'user-3', createdAt: daysAgo(10), updatedAt: daysAgo(2),
  },
  {
    _id: 'job-2', title: 'UI/UX Designer', slug: 'ui-ux-designer', department: 'Design', location: 'Lahore, PK', type: 'full-time', experienceLevel: 'Mid',
    description: '<p>Join our design team to craft delightful user experiences across web and mobile.</p>',
    requirements: ['3+ years product design experience', 'Portfolio required', 'Figma expertise'],
    responsibilities: ['Design wireframes and prototypes', 'Collaborate with engineering', 'Run user research sessions'],
    status: 'open', postedBy: 'user-3', createdAt: daysAgo(25), updatedAt: daysAgo(5),
  },
  {
    _id: 'job-3', title: 'QA Engineer', slug: 'qa-engineer', department: 'Quality Assurance', location: 'Remote', type: 'contract', experienceLevel: 'Mid',
    description: '<p>Help us maintain quality across our growing portfolio of client projects.</p>',
    requirements: ['Experience with automated testing', 'Familiarity with Cypress or Playwright'],
    responsibilities: ['Write and maintain test suites', 'Report and track bugs'],
    status: 'closed', postedBy: 'user-3', createdAt: daysAgo(90), updatedAt: daysAgo(60),
  },
];

export const seedJobApplications = [
  { _id: 'app-1', job: { _id: 'job-1', title: 'Senior Frontend Developer (React)' }, applicantName: 'Hassan Ali', email: 'hassan.ali@example.com', phone: '+92 300 1234567', resumeUrl: 'https://example.com/resumes/hassan-ali.pdf', status: 'new', createdAt: daysAgo(2) },
  { _id: 'app-2', job: { _id: 'job-1', title: 'Senior Frontend Developer (React)' }, applicantName: 'Maria Gonzalez', email: 'maria.g@example.com', phone: '+1 555 123 4567', resumeUrl: 'https://example.com/resumes/maria-gonzalez.pdf', status: 'shortlisted', createdAt: daysAgo(6) },
  { _id: 'app-3', job: { _id: 'job-2', title: 'UI/UX Designer' }, applicantName: 'Fatima Sheikh', email: 'fatima.sheikh@example.com', phone: '+92 301 9876543', resumeUrl: 'https://example.com/resumes/fatima-sheikh.pdf', status: 'interview', createdAt: daysAgo(10) },
  { _id: 'app-4', job: { _id: 'job-3', title: 'QA Engineer' }, applicantName: 'David Kim', email: 'david.kim@example.com', phone: '+1 555 987 6543', resumeUrl: 'https://example.com/resumes/david-kim.pdf', status: 'rejected', createdAt: daysAgo(45) },
];

export const seedLeads = [
  { _id: 'lead-1', name: 'John Peterson', email: 'john.peterson@example.com', phone: '+1 555 234 5678', message: 'We need a quote for building a SaaS dashboard for our logistics company.', source: 'contact', status: 'new', createdAt: daysAgo(1) },
  { _id: 'lead-2', name: 'Layla Ahmadi', email: 'layla.ahmadi@example.com', phone: '+92 333 4455667', message: 'Interested in a mobile app similar to your FinTrack case study. Budget around $15k.', source: 'contact', status: 'contacted', createdAt: daysAgo(4) },
  { _id: 'lead-3', name: 'Michael Chen', email: 'michael.chen@example.com', phone: '', message: 'Can you help redesign our existing e-commerce site? Looking for a UI refresh mainly.', source: 'contact', status: 'converted', createdAt: daysAgo(20) },
  { _id: 'lead-4', name: 'Priya Nair', email: 'priya.nair@example.com', phone: '+91 98765 43210', message: 'Just exploring options for now, will follow up in a few months.', source: 'contact', status: 'closed', createdAt: daysAgo(35) },
];

export const seedActivityLogs = [
  { _id: 'log-1', user: { _id: 'user-1', name: 'Ayesha Khan' }, action: 'publish', module: 'Portfolio', description: 'Published project: GreenCart — Sustainable E-commerce', createdAt: daysAgo(5) },
  { _id: 'log-2', user: { _id: 'user-2', name: 'Bilal Ahmed' }, action: 'update', module: 'Services', description: 'Updated service: Cloud & DevOps', createdAt: daysAgo(15) },
  { _id: 'log-3', user: { _id: 'user-3', name: 'Sara Malik' }, action: 'create', module: 'Jobs', description: 'Posted new job: QA Engineer', createdAt: daysAgo(90) },
  { _id: 'log-4', user: { _id: 'user-1', name: 'Ayesha Khan' }, action: 'login', module: 'Auth', description: 'Logged in to the admin panel', createdAt: daysAgo(0) },
  { _id: 'log-5', user: { _id: 'user-2', name: 'Bilal Ahmed' }, action: 'delete', module: 'Blog', description: 'Deleted draft post: "Untitled Draft"', createdAt: daysAgo(18) },
];

export const seedSettings = {
  logo: '',
  contactEmail: 'hello@softwarehouse.com',
  contactPhone: '+92 300 1112233',
  officeAddress: '123 Tech Park, Gulberg III, Lahore, Pakistan',
  social: {
    linkedin: 'https://linkedin.com/company/softwarehouse',
    twitter: 'https://x.com/softwarehouse',
    facebook: 'https://facebook.com/softwarehouse',
    instagram: 'https://instagram.com/softwarehouse',
  },
  seoDefaults: {
    metaTitle: 'Software House — Custom Software, Web & Mobile Development',
    metaDescription: 'We build modern web, mobile, and SaaS products for startups and enterprises worldwide.',
  },
};

export function buildDashboardStats() {
  const leadsOverTime = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000);
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: Math.max(0, Math.round(2 + Math.sin(i / 2) * 2 + Math.random() * 2)),
    };
  });

  return {
    leadsCount: seedLeads.length,
    leadsTrend: 12,
    openJobsCount: seedJobs.filter((j) => j.status === 'open').length,
    publishedPortfolioCount: seedPortfolio.filter((p) => p.isPublished).length,
    publishedBlogCount: seedBlogs.filter((b) => b.status === 'published').length,
    leadsOverTime,
  };
}
