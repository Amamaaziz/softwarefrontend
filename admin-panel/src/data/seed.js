// ─────────────────────────────────────────────────────────────────────────────
// CANONICAL SEED DATA — the single source of truth for BOTH apps.
//
// This project has no backend. Instead, both the admin panel and the public
// website read from one localStorage-backed "database" (see mockDb.js), and
// this file is what that database is seeded with the first time it runs.
//
// IMPORTANT: this file is duplicated verbatim in:
//   - frontend/src/data/seed.js
//   - admin-panel/src/data/seed.js
// Edit one, copy to the other. (Kept as copies so each Vite app stays
// self-contained and needs no path aliases or fs.allow config.)
//
// Field names follow Database-Schema.md so this can be swapped for a real
// REST API later with no changes to any page component.
// ─────────────────────────────────────────────────────────────────────────────

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();

// ── Site settings (drives the public site's header, footer, contact page) ────
export const seedSettings = {
  companyName: 'Nexbyte',
  tagline: 'We build the software behind growing businesses.',
  foundedYear: 2016,
  logo: '',
  contactEmail: 'hello@nexbyte.dev',
  contactPhone: '+92 300 1234567',
  officeAddress: 'Suite 4B, Gulgasht Colony, Multan, Punjab, Pakistan',
  social: {
    linkedin: 'https://linkedin.com/company/nexbyte',
    twitter: 'https://x.com/nexbyte',
    facebook: 'https://facebook.com/nexbyte',
    instagram: 'https://instagram.com/nexbyte',
    github: 'https://github.com/nexbyte',
  },
  stats: [
    { label: 'Years shipping software', value: '9+' },
    { label: 'Projects delivered', value: '140+' },
    { label: 'Clients served', value: '60+' },
    { label: 'Engineers on the team', value: '24' },
  ],
  seoDefaults: {
    metaTitle: 'Nexbyte — Custom Software, Web & Mobile Development',
    metaDescription:
      'We build modern web, mobile, and SaaS products for startups and growing businesses.',
  },
};

// ── Admin users. Any of these can log in with the password `demo1234`. ───────
export const seedUsers = [
  { _id: 'user-1', name: 'Ayesha Khan', email: 'ayesha@nexbyte.dev', role: 'super_admin', image: '', isActive: true, createdAt: daysAgo(120) },
  { _id: 'user-2', name: 'Bilal Ahmed', email: 'bilal@nexbyte.dev', role: 'content_editor', image: '', isActive: true, createdAt: daysAgo(80) },
  { _id: 'user-3', name: 'Sara Malik', email: 'sara@nexbyte.dev', role: 'hr_manager', image: '', isActive: true, createdAt: daysAgo(45) },
  { _id: 'user-4', name: 'Usman Tariq', email: 'usman@nexbyte.dev', role: 'content_editor', image: '', isActive: false, createdAt: daysAgo(200) },
];

// ── Services ────────────────────────────────────────────────────────────────
export const seedServices = [
  {
    _id: 'svc-web-development',
    title: 'Web Development',
    slug: 'web-development',
    shortDescription: 'Fast, accessible websites and web apps built on modern stacks.',
    description:
      '<p>We design and build production-grade web applications — from marketing sites to complex internal tools — using React, Next.js, and Node.js. Every build ships with performance budgets, accessibility checks, and clean, documented code your next developer can pick up without a handover call.</p>',
    subServices: [
      { title: 'Marketing & corporate websites', description: 'Fast, CMS-driven sites your team can update without a developer.' },
      { title: 'Web applications & dashboards', description: 'Data-heavy interfaces built for real daily use, not just demos.' },
      { title: 'E-commerce storefronts', description: 'Custom or headless commerce, integrated with your payment and inventory stack.' },
    ],
    images: [],
    order: 1,
    isPublished: true,
    createdBy: 'user-2',
    createdAt: daysAgo(90),
    updatedAt: daysAgo(10),
  },
  {
    _id: 'svc-mobile-app-development',
    title: 'Mobile App Development',
    slug: 'mobile-app-development',
    shortDescription: 'Native-feel iOS and Android apps from a single React Native codebase.',
    description:
      '<p>We build cross-platform mobile apps that feel native, ship faster than parallel native builds, and stay maintainable as your product grows. Our process covers everything from wireframes to App Store and Play Store submission.</p>',
    subServices: [
      { title: 'Cross-platform apps (React Native)', description: 'One codebase, native performance on iOS and Android.' },
      { title: 'App modernization', description: 'Rebuild legacy apps on a stack your team can actually maintain.' },
      { title: 'API & backend integration', description: 'Connect your app to existing systems or new services we build alongside it.' },
    ],
    images: [],
    order: 2,
    isPublished: true,
    createdBy: 'user-2',
    createdAt: daysAgo(85),
    updatedAt: daysAgo(20),
  },
  {
    _id: 'svc-ui-ux-design',
    title: 'UI/UX Design',
    slug: 'ui-ux-design',
    shortDescription: 'Interfaces designed around how people actually use your product.',
    description:
      '<p>Good design is invisible until it is missing. We research how your users actually work, then design flows, wireframes, and polished UI kits that hold up across every screen size and edge case — not just the happy path shown in a pitch deck.</p>',
    subServices: [
      { title: 'Product design & wireframing', description: 'From user flows to high-fidelity screens, grounded in real research.' },
      { title: 'Design systems', description: 'A reusable component library so your product stays consistent as it scales.' },
      { title: 'UX audits', description: 'A clear-eyed review of what is confusing users today, with concrete fixes.' },
    ],
    images: [],
    order: 3,
    isPublished: true,
    createdBy: 'user-2',
    createdAt: daysAgo(70),
    updatedAt: daysAgo(12),
  },
  {
    _id: 'svc-digital-marketing-seo',
    title: 'Digital Marketing & SEO',
    slug: 'digital-marketing-seo',
    shortDescription: 'Technical SEO and growth support for products people can actually find.',
    description:
      '<p>A great product nobody can find is a great product nobody uses. We handle technical SEO, content structure, and analytics setup so your site earns organic visibility instead of relying entirely on paid spend.</p>',
    subServices: [
      { title: 'Technical SEO', description: 'Site speed, structured data, crawlability — the fundamentals search engines reward.' },
      { title: 'Content strategy', description: 'A content plan built around what your buyers are actually searching for.' },
      { title: 'Analytics & reporting', description: 'Dashboards that show what is working, not just what is happening.' },
    ],
    images: [],
    order: 4,
    isPublished: true,
    createdBy: 'user-2',
    createdAt: daysAgo(60),
    updatedAt: daysAgo(15),
  },
  {
    _id: 'svc-custom-software-saas',
    title: 'Custom Software & SaaS Development',
    slug: 'custom-software-saas',
    shortDescription: 'Multi-tenant SaaS platforms built to scale from first customer to first thousand.',
    description:
      '<p>We build custom software and SaaS platforms end to end: architecture, multi-tenancy, billing, and the unglamorous infrastructure work that determines whether your product survives its first real growth spike.</p>',
    subServices: [
      { title: 'SaaS architecture & MVP builds', description: 'Ship a real product fast without painting yourself into a corner.' },
      { title: 'Multi-tenant systems', description: 'Proper data isolation and role management from day one.' },
      { title: 'Billing & subscriptions', description: 'Stripe or your billing provider of choice, wired in correctly the first time.' },
    ],
    images: [],
    order: 5,
    isPublished: true,
    createdBy: 'user-1',
    createdAt: daysAgo(50),
    updatedAt: daysAgo(9),
  },
  {
    _id: 'svc-qa-testing',
    title: 'QA & Testing',
    slug: 'qa-testing',
    shortDescription: 'Manual and automated testing so releases stop being a gamble.',
    description:
      '<p>We build test suites and QA processes that catch regressions before your users do — unit tests, integration tests, and structured manual test passes across the browsers and devices your users actually have.</p>',
    subServices: [
      { title: 'Automated test suites', description: 'Unit and integration coverage for your critical user flows.' },
      { title: 'Manual QA passes', description: 'Structured, documented testing across real devices and browsers.' },
      { title: 'Release process setup', description: 'Staging environments and checklists so releases are routine, not risky.' },
    ],
    images: [],
    order: 6,
    isPublished: true,
    createdBy: 'user-1',
    createdAt: daysAgo(40),
    updatedAt: daysAgo(6),
  },
  {
    _id: 'svc-cloud-devops',
    title: 'Cloud & DevOps',
    slug: 'cloud-devops',
    shortDescription: 'Deployment pipelines and infrastructure that stay boring in a good way.',
    description:
      '<p>We set up CI/CD pipelines, cloud infrastructure, and monitoring so deployments are routine instead of an event. Whether you are on AWS, Render, or Vercel, we configure it so your team ships with confidence.</p>',
    subServices: [
      { title: 'CI/CD pipelines', description: 'Automated builds, tests, and deploys on every merge.' },
      { title: 'Cloud infrastructure setup', description: 'Right-sized infrastructure on AWS, Render, Railway, or your provider of choice.' },
      { title: 'Monitoring & alerting', description: 'Know about an outage before your customers tell you.' },
    ],
    images: [],
    order: 7,
    isPublished: true,
    createdBy: 'user-1',
    createdAt: daysAgo(30),
    updatedAt: daysAgo(3),
  },
];

// ── Portfolio / case studies ────────────────────────────────────────────────
export const seedPortfolio = [
  {
    _id: 'proj-fintrack',
    title: 'FinTrack — Expense Management for SMEs',
    slug: 'fintrack-expense-management',
    client: 'FinTrack Inc.',
    service: 'svc-custom-software-saas',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    challenge:
      '<p>FinTrack was managing expense approvals across spreadsheets and email, which meant lost receipts, slow approvals, and no real-time visibility into spend.</p>',
    solution:
      '<p>We built a multi-tenant SaaS platform with role-based approval chains, receipt OCR, and a real-time spend dashboard, backed by a Node.js and MongoDB API.</p>',
    result:
      '<p>Approval turnaround dropped from 4 days to under 6 hours, and finance teams now close the books 3 days faster each month.</p>',
    technologies: ['React', 'Node.js', 'MongoDB', 'AWS S3'],
    isFeatured: true,
    isPublished: true,
    createdBy: 'user-2',
    createdAt: daysAgo(70),
    updatedAt: daysAgo(5),
  },
  {
    _id: 'proj-loop',
    title: 'Loop — On-Demand Delivery App',
    slug: 'loop-delivery-app',
    client: 'Loop Logistics',
    service: 'svc-mobile-app-development',
    coverImage: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=1200&q=80',
    challenge:
      '<p>Loop needed a rider and customer app to launch a same-day delivery service in three cities within one quarter.</p>',
    solution:
      '<p>We shipped a React Native app with live tracking, route optimization, and push notifications, sharing a single codebase across iOS and Android to hit the deadline.</p>',
    result:
      '<p>Loop launched on schedule in all three cities and now handles over 2,000 deliveries a day.</p>',
    technologies: ['React Native', 'Node.js', 'MongoDB', 'Google Maps API'],
    isFeatured: true,
    isPublished: true,
    createdBy: 'user-2',
    createdAt: daysAgo(55),
    updatedAt: daysAgo(12),
  },
  {
    _id: 'proj-harborhealth',
    title: 'Harbor Health — Patient Portal Redesign',
    slug: 'harbor-health-patient-portal',
    client: 'Harbor Health Clinics',
    service: 'svc-ui-ux-design',
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80',
    challenge:
      '<p>Patients were abandoning appointment bookings partway through because the existing portal was confusing and not usable on mobile.</p>',
    solution:
      '<p>We ran usability sessions with real patients, then redesigned the booking flow and rebuilt the front end as a responsive React app.</p>',
    result:
      '<p>Booking completion rate rose from 61% to 89%, and support calls about the portal dropped by half.</p>',
    technologies: ['React', 'Tailwind CSS', 'Figma'],
    isFeatured: false,
    isPublished: true,
    createdBy: 'user-1',
    createdAt: daysAgo(40),
    updatedAt: daysAgo(8),
  },
  {
    _id: 'proj-cartly',
    title: 'Cartly — Headless Commerce Storefront',
    slug: 'cartly-headless-commerce',
    client: 'Cartly Retail Group',
    service: 'svc-web-development',
    coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80',
    challenge:
      '<p>Cartly&rsquo;s existing storefront could not handle Black Friday traffic without slowing to a crawl, costing them sales.</p>',
    solution:
      '<p>We rebuilt the storefront as a headless commerce site with edge caching and a performance budget enforced in CI.</p>',
    result:
      '<p>Page load times dropped by 68%, and the site held steady through the next two Black Friday peaks with zero downtime.</p>',
    technologies: ['Next.js', 'Node.js', 'MongoDB', 'Vercel'],
    isFeatured: true,
    isPublished: true,
    createdBy: 'user-2',
    createdAt: daysAgo(25),
    updatedAt: daysAgo(4),
  },
  {
    _id: 'proj-internal-tools',
    title: 'Internal Tools Revamp',
    slug: 'internal-tools-revamp',
    client: 'Confidential',
    service: 'svc-web-development',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    challenge: '<p>Legacy admin tools were slowing down internal operations.</p>',
    solution: '<p>Rebuilt the dashboard from scratch with modern tooling.</p>',
    result: '<p>Draft — not yet published, so it does not appear on the public site.</p>',
    technologies: ['React', 'Express'],
    isFeatured: false,
    isPublished: false,
    createdBy: 'user-2',
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1),
  },
];

// ── Blog ────────────────────────────────────────────────────────────────────
export const seedBlogs = [
  {
    _id: 'blog-mern-scaling',
    title: 'Scaling a MERN Stack Beyond the First 10,000 Users',
    slug: 'scaling-mern-stack-beyond-10000-users',
    author: 'Sara Malik',
    category: 'Engineering',
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&q=80',
    excerpt:
      'The patterns that keep a MongoDB and Express backend fast once real traffic arrives — indexing, caching, and the mistakes we see most often.',
    content:
      '<p>Most MERN projects are built for zero users and never revisited before launch day. In this piece we walk through the indexing strategy, caching layers, and connection pooling changes we apply once a project crosses real production traffic, along with the monitoring setup that tells you when it is time to make each change.</p>',
    seoMeta: { metaTitle: '', metaDescription: '' },
    status: 'published',
    publishedAt: daysAgo(20),
    createdAt: daysAgo(22),
    updatedAt: daysAgo(20),
  },
  {
    _id: 'blog-design-systems',
    title: 'Why Every Client Project Now Starts With a Design System',
    slug: 'why-every-project-starts-with-a-design-system',
    author: 'Bilal Ahmed',
    category: 'Design',
    coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1000&q=80',
    excerpt:
      'Skipping the design system to save a week upfront usually costs a month later. Here is how we scoped ours for a recent SaaS build.',
    content:
      '<p>A shared token system for color, spacing, and type sounds like overhead on a tight timeline, but it is the reason a five-person frontend team can ship consistent screens without a design review on every pull request. This post walks through how we scope a design system for a typical six-week engagement.</p>',
    seoMeta: { metaTitle: '', metaDescription: '' },
    status: 'published',
    publishedAt: daysAgo(45),
    createdAt: daysAgo(47),
    updatedAt: daysAgo(45),
  },
  {
    _id: 'blog-react-native-vs-native',
    title: 'React Native vs. Native: What We Actually Recommend Clients in 2026',
    slug: 'react-native-vs-native-2026',
    author: 'Bilal Ahmed',
    category: 'Mobile',
    coverImage: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=1000&q=80',
    excerpt:
      'The honest tradeoffs between React Native and fully native development, based on the last dozen client projects we shipped.',
    content:
      '<p>The &ldquo;React Native vs native&rdquo; debate online is mostly stale. In practice, the decision usually comes down to three questions: does the app need deep hardware access, does the client have a native team already, and how fast does the first version need to ship. We break down how we answer each one with recent clients.</p>',
    seoMeta: { metaTitle: '', metaDescription: '' },
    status: 'published',
    publishedAt: daysAgo(80),
    createdAt: daysAgo(82),
    updatedAt: daysAgo(80),
  },
  {
    _id: 'blog-security-checklist',
    title: 'The Pre-Launch Security Checklist We Run on Every Project',
    slug: 'pre-launch-security-checklist',
    author: 'Sara Malik',
    category: 'Security',
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1000&q=80',
    excerpt:
      'JWT expiry, input sanitization, rate limiting — the checklist our backend team runs before any client project goes live.',
    content:
      '<p>Security work is easy to skip when a deadline is close, which is exactly when it matters most. This is the checklist our team runs against every project before launch: token expiry and refresh handling, input sanitization on every form, rate limiting on auth routes, and a dependency audit. We share the reasoning behind each item.</p>',
    seoMeta: { metaTitle: '', metaDescription: '' },
    status: 'published',
    publishedAt: daysAgo(120),
    createdAt: daysAgo(122),
    updatedAt: daysAgo(120),
  },
  {
    _id: 'blog-office-launch',
    title: 'Behind the Scenes: Our New Office Launch',
    slug: 'behind-the-scenes-new-office-launch',
    author: 'Ayesha Khan',
    category: 'Company News',
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&q=80',
    excerpt: 'We are excited to share photos and stories from our new office space.',
    content: '<p>A draft post — it stays hidden from the public site until an editor sets its status to published.</p>',
    seoMeta: { metaTitle: '', metaDescription: '' },
    status: 'draft',
    publishedAt: null,
    createdAt: daysAgo(3),
    updatedAt: daysAgo(1),
  },
];

// ── Testimonials ────────────────────────────────────────────────────────────
export const seedTestimonials = [
  { _id: 'test-1', clientName: 'Amina Farooq', company: 'FinTrack Inc.', photo: 'https://i.pravatar.cc/150?img=32', message: 'Nexbyte rebuilt our approval workflow from scratch and it just works. Our finance team stopped complaining about the software within the first week of launch.', rating: 5, isPublished: true, createdAt: daysAgo(60), updatedAt: daysAgo(60) },
  { _id: 'test-2', clientName: 'David Chen', company: 'Loop Logistics', photo: 'https://i.pravatar.cc/150?img=12', message: 'We had a hard launch date across three cities and no room for slippage. The team hit every milestone and the app has not had a major incident since.', rating: 5, isPublished: true, createdAt: daysAgo(45), updatedAt: daysAgo(45) },
  { _id: 'test-3', clientName: 'Priya Nair', company: 'Harbor Health Clinics', photo: 'https://i.pravatar.cc/150?img=45', message: 'They actually talked to our patients before redesigning anything. That research work is the reason the new booking flow performs so much better.', rating: 4, isPublished: true, createdAt: daysAgo(30), updatedAt: daysAgo(30) },
  { _id: 'test-4', clientName: 'Omar Sheikh', company: 'Cartly Retail Group', photo: 'https://i.pravatar.cc/150?img=51', message: 'Our storefront used to fall over every Black Friday. It has now handled two peak seasons without a single alert firing overnight.', rating: 5, isPublished: true, createdAt: daysAgo(20), updatedAt: daysAgo(20) },
  { _id: 'test-5', clientName: 'Emily Chen', company: 'MedConnect Health', photo: '', message: 'Great experience overall, though the timeline slipped by a couple of weeks.', rating: 4, isPublished: false, createdAt: daysAgo(10), updatedAt: daysAgo(10) },
];

// ── Jobs ────────────────────────────────────────────────────────────────────
export const seedJobs = [
  {
    _id: 'job-frontend-react',
    title: 'Frontend Engineer (React)',
    slug: 'frontend-engineer-react',
    department: 'Engineering',
    location: 'Multan, PK (Hybrid)',
    type: 'full-time',
    experienceLevel: 'Mid',
    description:
      '<p>You will build client-facing product interfaces using React and Tailwind CSS, working closely with our design and backend teams on 2-3 concurrent client projects.</p>',
    requirements: [
      '2+ years building production React applications',
      'Comfortable with Tailwind CSS or a similar utility-first system',
      'Experience integrating REST APIs and handling loading/error states properly',
      'Strong eye for responsive, accessible UI',
    ],
    responsibilities: [
      'Build and maintain client-facing React interfaces',
      'Collaborate with designers to translate Figma files into production UI',
      'Write clean, componentized code that other engineers can extend',
      'Participate in code review and sprint planning',
    ],
    status: 'open',
    postedBy: 'user-3',
    createdAt: daysAgo(10),
    updatedAt: daysAgo(2),
  },
  {
    _id: 'job-backend-node',
    title: 'Backend Engineer (Node.js)',
    slug: 'backend-engineer-nodejs',
    department: 'Engineering',
    location: 'Remote',
    type: 'full-time',
    experienceLevel: 'Senior',
    description:
      '<p>You will design and build the APIs powering both client-facing products and our internal admin platform, with a focus on data integrity and security.</p>',
    requirements: [
      '4+ years with Node.js and Express in production',
      'Strong understanding of MongoDB schema design and indexing',
      'Experience implementing JWT-based authentication and role-based access control',
      'Comfortable writing automated tests for critical flows',
    ],
    responsibilities: [
      'Design and document REST APIs for two frontend teams',
      'Implement authentication, authorization, and data validation',
      'Set up monitoring and health checks for production services',
      'Mentor junior engineers on backend best practices',
    ],
    status: 'open',
    postedBy: 'user-3',
    createdAt: daysAgo(18),
    updatedAt: daysAgo(4),
  },
  {
    _id: 'job-product-designer',
    title: 'Product Designer',
    slug: 'product-designer',
    department: 'Design',
    location: 'Remote',
    type: 'contract',
    experienceLevel: 'Mid',
    description:
      '<p>You will lead UX research and UI design for client SaaS and mobile projects, from early wireframes through polished, developer-ready screens.</p>',
    requirements: [
      '3+ years of product design experience, portfolio required',
      'Comfortable running lightweight user research on tight timelines',
      'Fluent in Figma with experience building component libraries',
    ],
    responsibilities: [
      'Run discovery and usability sessions with client end-users',
      'Design wireframes, flows, and high-fidelity UI for client products',
      'Maintain and extend our internal design system',
    ],
    status: 'open',
    postedBy: 'user-3',
    createdAt: daysAgo(25),
    updatedAt: daysAgo(5),
  },
  {
    _id: 'job-qa-engineer',
    title: 'QA Engineer',
    slug: 'qa-engineer',
    department: 'Quality Assurance',
    location: 'Multan, PK (On-site)',
    type: 'full-time',
    experienceLevel: 'Entry',
    description:
      '<p>You will build and run test plans across web and mobile client projects, and help the team move toward more automated coverage.</p>',
    requirements: [
      '1+ years in a QA or testing role, or a strong personal testing project',
      'Familiarity with writing structured manual test cases',
      'Basic scripting ability (JavaScript preferred)',
    ],
    responsibilities: [
      'Write and execute test plans for each release',
      'Log and track defects through resolution',
      'Support the team in building out automated test coverage',
    ],
    status: 'closed',
    postedBy: 'user-3',
    createdAt: daysAgo(90),
    updatedAt: daysAgo(60),
  },
];

// ── Job applications (what the public careers form writes into) ──────────────
export const seedJobApplications = [
  { _id: 'app-1', job: { _id: 'job-frontend-react', title: 'Frontend Engineer (React)' }, applicantName: 'Hassan Ali', email: 'hassan.ali@example.com', phone: '+92 300 1234567', resumeUrl: 'https://example.com/resumes/hassan-ali.pdf', resumeName: 'hassan-ali.pdf', status: 'new', createdAt: daysAgo(2) },
  { _id: 'app-2', job: { _id: 'job-frontend-react', title: 'Frontend Engineer (React)' }, applicantName: 'Maria Gonzalez', email: 'maria.g@example.com', phone: '+1 555 123 4567', resumeUrl: 'https://example.com/resumes/maria-gonzalez.pdf', resumeName: 'maria-gonzalez.pdf', status: 'shortlisted', createdAt: daysAgo(6) },
  { _id: 'app-3', job: { _id: 'job-product-designer', title: 'Product Designer' }, applicantName: 'Fatima Sheikh', email: 'fatima.sheikh@example.com', phone: '+92 301 9876543', resumeUrl: 'https://example.com/resumes/fatima-sheikh.pdf', resumeName: 'fatima-sheikh.pdf', status: 'interview', createdAt: daysAgo(10) },
  { _id: 'app-4', job: { _id: 'job-qa-engineer', title: 'QA Engineer' }, applicantName: 'David Kim', email: 'david.kim@example.com', phone: '+1 555 987 6543', resumeUrl: 'https://example.com/resumes/david-kim.pdf', resumeName: 'david-kim.pdf', status: 'rejected', createdAt: daysAgo(45) },
];

// ── Leads (what the public contact form writes into) ─────────────────────────
export const seedLeads = [
  { _id: 'lead-1', name: 'John Peterson', email: 'john.peterson@example.com', phone: '+1 555 234 5678', category: 'Custom Software', message: 'We need a quote for building a SaaS dashboard for our logistics company.', source: 'contact', status: 'new', createdAt: daysAgo(1) },
  { _id: 'lead-2', name: 'Layla Ahmadi', email: 'layla.ahmadi@example.com', phone: '+92 333 4455667', category: 'Mobile App', message: 'Interested in a mobile app similar to your FinTrack case study. Budget around $15k.', source: 'contact', status: 'contacted', createdAt: daysAgo(4) },
  { _id: 'lead-3', name: 'Michael Chen', email: 'michael.chen@example.com', phone: '', category: 'UI/UX Design', message: 'Can you help redesign our existing e-commerce site? Looking for a UI refresh mainly.', source: 'contact', status: 'converted', createdAt: daysAgo(20) },
  { _id: 'lead-4', name: 'Priya Nair', email: 'priya.nair@example.com', phone: '+91 98765 43210', category: 'Other', message: 'Just exploring options for now, will follow up in a few months.', source: 'contact', status: 'closed', createdAt: daysAgo(35) },
];

// ── Activity logs ───────────────────────────────────────────────────────────
export const seedActivityLogs = [
  { _id: 'log-1', user: { _id: 'user-1', name: 'Ayesha Khan' }, action: 'publish', module: 'Portfolio', description: 'Published project: Cartly — Headless Commerce Storefront', createdAt: daysAgo(4) },
  { _id: 'log-2', user: { _id: 'user-2', name: 'Bilal Ahmed' }, action: 'update', module: 'Services', description: 'Updated service: Cloud & DevOps', createdAt: daysAgo(3) },
  { _id: 'log-3', user: { _id: 'user-3', name: 'Sara Malik' }, action: 'create', module: 'Jobs', description: 'Posted new job: Frontend Engineer (React)', createdAt: daysAgo(10) },
  { _id: 'log-4', user: { _id: 'user-2', name: 'Bilal Ahmed' }, action: 'delete', module: 'Blog', description: 'Deleted draft post: "Untitled Draft"', createdAt: daysAgo(18) },
];

// One object holding the whole "database". mockDb.js writes this shape to
// localStorage on first run.
export function buildSeedDb() {
  return {
    __version: 1,
    settings: JSON.parse(JSON.stringify(seedSettings)),
    users: JSON.parse(JSON.stringify(seedUsers)),
    services: JSON.parse(JSON.stringify(seedServices)),
    portfolio: JSON.parse(JSON.stringify(seedPortfolio)),
    blogs: JSON.parse(JSON.stringify(seedBlogs)),
    testimonials: JSON.parse(JSON.stringify(seedTestimonials)),
    jobs: JSON.parse(JSON.stringify(seedJobs)),
    applications: JSON.parse(JSON.stringify(seedJobApplications)),
    leads: JSON.parse(JSON.stringify(seedLeads)),
    activityLogs: JSON.parse(JSON.stringify(seedActivityLogs)),
  };
}
