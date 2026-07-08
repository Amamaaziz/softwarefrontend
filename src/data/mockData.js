// Mock data — shaped to match the Mongoose schema in Database-Schema.md
// Swap these arrays for real API calls (see src/lib/api.js) once the backend is live.

export const COMPANY = {
  name: 'Nexbyte',
  tagline: 'We build the software behind growing businesses.',
  foundedYear: 2016,
  email: 'hello@nexbyte.dev',
  phone: '+92 300 1234567',
  address: 'Suite 4B, Gulgasht Colony, Multan, Punjab, Pakistan',
  social: {
    linkedin: '#',
    twitter: '#',
    github: '#',
    instagram: '#',
  },
  stats: [
    { label: 'Years shipping software', value: '9+' },
    { label: 'Projects delivered', value: '140+' },
    { label: 'Clients served', value: '60+' },
    { label: 'Engineers on the team', value: '24' },
  ],
}

export const SERVICES = [
  {
    _id: 'svc-web-development',
    title: 'Web Development',
    slug: 'web-development',
    shortDescription: 'Fast, accessible websites and web apps built on modern stacks.',
    description:
      'We design and build production-grade web applications — from marketing sites to complex internal tools — using React, Next.js, and Node.js. Every build ships with performance budgets, accessibility checks, and clean, documented code your next developer can pick up without a handover call.',
    subServices: [
      { title: 'Marketing & corporate websites', description: 'Fast, CMS-driven sites your team can update without a developer.' },
      { title: 'Web applications & dashboards', description: 'Data-heavy interfaces built for real daily use, not just demos.' },
      { title: 'E-commerce storefronts', description: 'Custom or headless commerce, integrated with your payment and inventory stack.' },
    ],
    images: [],
    order: 1,
    isPublished: true,
  },
  {
    _id: 'svc-mobile-app-development',
    title: 'Mobile App Development',
    slug: 'mobile-app-development',
    shortDescription: 'Native-feel iOS and Android apps from a single React Native codebase.',
    description:
      'We build cross-platform mobile apps that feel native, ship faster than parallel native builds, and stay maintainable as your product grows. Our process covers everything from wireframes to App Store and Play Store submission.',
    subServices: [
      { title: 'Cross-platform apps (React Native)', description: 'One codebase, native performance on iOS and Android.' },
      { title: 'App modernization', description: 'Rebuild legacy apps on a stack your team can actually maintain.' },
      { title: 'API & backend integration', description: 'Connect your app to existing systems or new services we build alongside it.' },
    ],
    images: [],
    order: 2,
    isPublished: true,
  },
  {
    _id: 'svc-ui-ux-design',
    title: 'UI/UX Design',
    slug: 'ui-ux-design',
    shortDescription: 'Interfaces designed around how people actually use your product.',
    description:
      'Good design is invisible until it is missing. We research how your users actually work, then design flows, wireframes, and polished UI kits that hold up across every screen size and edge case — not just the happy path shown in a pitch deck.',
    subServices: [
      { title: 'Product design & wireframing', description: 'From user flows to high-fidelity screens, grounded in real research.' },
      { title: 'Design systems', description: 'A reusable component library so your product stays consistent as it scales.' },
      { title: 'UX audits', description: 'A clear-eyed review of what is confusing users today, with concrete fixes.' },
    ],
    images: [],
    order: 3,
    isPublished: true,
  },
  {
    _id: 'svc-digital-marketing-seo',
    title: 'Digital Marketing & SEO',
    slug: 'digital-marketing-seo',
    shortDescription: 'Technical SEO and growth support for products people can actually find.',
    description:
      'A great product nobody can find is a great product nobody uses. We handle technical SEO, content structure, and analytics setup so your site earns organic visibility instead of relying entirely on paid spend.',
    subServices: [
      { title: 'Technical SEO', description: 'Site speed, structured data, crawlability — the fundamentals search engines reward.' },
      { title: 'Content strategy', description: 'A content plan built around what your buyers are actually searching for.' },
      { title: 'Analytics & reporting', description: 'Dashboards that show what is working, not just what is happening.' },
    ],
    images: [],
    order: 4,
    isPublished: true,
  },
  {
    _id: 'svc-custom-software-saas',
    title: 'Custom Software & SaaS Development',
    slug: 'custom-software-saas',
    shortDescription: 'Multi-tenant SaaS platforms built to scale from first customer to first thousand.',
    description:
      'We build custom software and SaaS platforms end to end: architecture, multi-tenancy, billing, and the unglamorous infrastructure work that determines whether your product survives its first real growth spike.',
    subServices: [
      { title: 'SaaS architecture & MVP builds', description: 'Ship a real product fast without painting yourself into a corner.' },
      { title: 'Multi-tenant systems', description: 'Proper data isolation and role management from day one.' },
      { title: 'Billing & subscriptions', description: 'Stripe or your billing provider of choice, wired in correctly the first time.' },
    ],
    images: [],
    order: 5,
    isPublished: true,
  },
  {
    _id: 'svc-qa-testing',
    title: 'QA & Testing',
    slug: 'qa-testing',
    shortDescription: 'Manual and automated testing so releases stop being a gamble.',
    description:
      'We build test suites and QA processes that catch regressions before your users do — unit tests, integration tests, and structured manual test passes across the browsers and devices your users actually have.',
    subServices: [
      { title: 'Automated test suites', description: 'Unit and integration coverage for your critical user flows.' },
      { title: 'Manual QA passes', description: 'Structured, documented testing across real devices and browsers.' },
      { title: 'Release process setup', description: 'Staging environments and checklists so releases are routine, not risky.' },
    ],
    images: [],
    order: 6,
    isPublished: true,
  },
  {
    _id: 'svc-cloud-devops',
    title: 'Cloud & DevOps',
    slug: 'cloud-devops',
    shortDescription: 'Deployment pipelines and infrastructure that stay boring in a good way.',
    description:
      'We set up CI/CD pipelines, cloud infrastructure, and monitoring so deployments are routine instead of an event. Whether you are on AWS, Render, or Vercel, we configure it so your team ships with confidence.',
    subServices: [
      { title: 'CI/CD pipelines', description: 'Automated builds, tests, and deploys on every merge.' },
      { title: 'Cloud infrastructure setup', description: 'Right-sized infrastructure on AWS, Render, Railway, or your provider of choice.' },
      { title: 'Monitoring & alerting', description: 'Know about an outage before your customers tell you.' },
    ],
    images: [],
    order: 7,
    isPublished: true,
  },
]

export const PORTFOLIO = [
  {
    _id: 'proj-fintrack',
    title: 'FinTrack — Expense Management for SMEs',
    slug: 'fintrack-expense-management',
    client: 'FinTrack Inc.',
    service: 'svc-custom-software-saas',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    challenge:
      'FinTrack was managing expense approvals across spreadsheets and email, which meant lost receipts, slow approvals, and no real-time visibility into spend.',
    solution:
      'We built a multi-tenant SaaS platform with role-based approval chains, receipt OCR, and a real-time spend dashboard, backed by a Node.js and MongoDB API.',
    result:
      'Approval turnaround dropped from 4 days to under 6 hours, and finance teams now close the books 3 days faster each month.',
    technologies: ['React', 'Node.js', 'MongoDB', 'AWS S3'],
    isFeatured: true,
    isPublished: true,
  },
  {
    _id: 'proj-loop',
    title: 'Loop — On-Demand Delivery App',
    slug: 'loop-delivery-app',
    client: 'Loop Logistics',
    service: 'svc-mobile-app-development',
    coverImage: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=1200&q=80',
    challenge:
      'Loop needed a rider and customer app to launch a same-day delivery service in three cities within one quarter.',
    solution:
      'We shipped a React Native app with live tracking, route optimization, and push notifications, sharing a single codebase across iOS and Android to hit the deadline.',
    result:
      'Loop launched on schedule in all three cities and now handles over 2,000 deliveries a day.',
    technologies: ['React Native', 'Node.js', 'MongoDB', 'Google Maps API'],
    isFeatured: true,
    isPublished: true,
  },
  {
    _id: 'proj-harborhealth',
    title: 'Harbor Health — Patient Portal Redesign',
    slug: 'harbor-health-patient-portal',
    client: 'Harbor Health Clinics',
    service: 'svc-ui-ux-design',
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80',
    challenge:
      'Patients were abandoning appointment bookings partway through because the existing portal was confusing and not usable on mobile.',
    solution:
      'We ran usability sessions with real patients, then redesigned the booking flow and rebuilt the front end as a responsive React app.',
    result:
      'Booking completion rate rose from 61% to 89%, and support calls about the portal dropped by half.',
    technologies: ['React', 'Tailwind CSS', 'Figma'],
    isFeatured: false,
    isPublished: true,
  },
  {
    _id: 'proj-cartly',
    title: 'Cartly — Headless Commerce Storefront',
    slug: 'cartly-headless-commerce',
    client: 'Cartly Retail Group',
    service: 'svc-web-development',
    coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80',
    challenge:
      'Cartly\'s existing storefront could not handle Black Friday traffic without slowing to a crawl, costing them sales.',
    solution:
      'We rebuilt the storefront as a headless commerce site with edge caching and a performance budget enforced in CI.',
    result:
      'Page load times dropped by 68%, and the site held steady through the next two Black Friday peaks with zero downtime.',
    technologies: ['Next.js', 'Node.js', 'MongoDB', 'Vercel'],
    isFeatured: true,
    isPublished: true,
  },
]

export const BLOGS = [
  {
    _id: 'blog-mern-scaling',
    title: 'Scaling a MERN Stack Beyond the First 10,000 Users',
    slug: 'scaling-mern-stack-beyond-10000-users',
    author: 'Sara Ahmed',
    category: 'Engineering',
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&q=80',
    excerpt:
      'The patterns that keep a MongoDB and Express backend fast once real traffic arrives — indexing, caching, and the mistakes we see most often.',
    content:
      'Most MERN projects are built for zero users and never revisited before launch day. In this piece we walk through the indexing strategy, caching layers, and connection pooling changes we apply once a project crosses real production traffic, along with the monitoring setup that tells you when it is time to make each change.',
    status: 'published',
    publishedAt: '2026-05-14',
  },
  {
    _id: 'blog-design-systems',
    title: 'Why Every Client Project Now Starts With a Design System',
    slug: 'why-every-project-starts-with-a-design-system',
    author: 'Bilal Raza',
    category: 'Design',
    coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1000&q=80',
    excerpt:
      'Skipping the design system to save a week upfront usually costs a month later. Here is how we scoped ours for a recent SaaS build.',
    content:
      'A shared token system for color, spacing, and type sounds like overhead on a tight timeline, but it is the reason a five-person frontend team can ship consistent screens without a design review on every pull request. This post walks through how we scope a design system for a typical six-week engagement.',
    status: 'published',
    publishedAt: '2026-04-02',
  },
  {
    _id: 'blog-react-native-vs-native',
    title: 'React Native vs. Native: What We Actually Recommend Clients in 2026',
    slug: 'react-native-vs-native-2026',
    author: 'Hamza Iqbal',
    category: 'Mobile',
    coverImage: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=1000&q=80',
    excerpt:
      'The honest tradeoffs between React Native and fully native development, based on the last dozen client projects we shipped.',
    content:
      'The "React Native vs native" debate online is mostly stale. In practice, the decision usually comes down to three questions: does the app need deep hardware access, does the client have a native team already, and how fast does the first version need to ship. We break down how we answer each one with recent clients.',
    status: 'published',
    publishedAt: '2026-03-18',
  },
  {
    _id: 'blog-security-checklist',
    title: 'The Pre-Launch Security Checklist We Run on Every Project',
    slug: 'pre-launch-security-checklist',
    author: 'Sara Ahmed',
    category: 'Security',
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1000&q=80',
    excerpt:
      'JWT expiry, input sanitization, rate limiting — the checklist our backend team runs before any client project goes live.',
    content:
      'Security work is easy to skip when a deadline is close, which is exactly when it matters most. This is the checklist our team runs against every project before launch: token expiry and refresh handling, input sanitization on every form, rate limiting on auth routes, and a dependency audit. We share the reasoning behind each item.',
    status: 'published',
    publishedAt: '2026-02-22',
  },
]

export const TESTIMONIALS = [
  {
    _id: 'test-1',
    clientName: 'Amina Farooq',
    company: 'FinTrack Inc.',
    photo: 'https://i.pravatar.cc/150?img=32',
    message:
      'Nexbyte rebuilt our approval workflow from scratch and it just works. Our finance team stopped complaining about the software within the first week of launch.',
    rating: 5,
    isPublished: true,
  },
  {
    _id: 'test-2',
    clientName: 'David Chen',
    company: 'Loop Logistics',
    photo: 'https://i.pravatar.cc/150?img=12',
    message:
      'We had a hard launch date across three cities and no room for slippage. The team hit every milestone and the app has not had a major incident since.',
    rating: 5,
    isPublished: true,
  },
  {
    _id: 'test-3',
    clientName: 'Priya Nair',
    company: 'Harbor Health Clinics',
    photo: 'https://i.pravatar.cc/150?img=45',
    message:
      'They actually talked to our patients before redesigning anything. That research work is the reason the new booking flow performs so much better.',
    rating: 4,
    isPublished: true,
  },
  {
    _id: 'test-4',
    clientName: 'Omar Sheikh',
    company: 'Cartly Retail Group',
    photo: 'https://i.pravatar.cc/150?img=51',
    message:
      'Our storefront used to fall over every Black Friday. It has now handled two peak seasons without a single alert firing overnight.',
    rating: 5,
    isPublished: true,
  },
]

export const JOBS = [
  {
    _id: 'job-frontend-react',
    title: 'Frontend Engineer (React)',
    slug: 'frontend-engineer-react',
    department: 'Engineering',
    location: 'Multan, PK (Hybrid)',
    type: 'full-time',
    experienceLevel: 'Mid',
    description:
      'You will build client-facing product interfaces using React and Tailwind CSS, working closely with our design and backend teams on 2-3 concurrent client projects.',
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
      'You will design and build the APIs powering both client-facing products and our internal admin platform, with a focus on data integrity and security.',
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
      'You will lead UX research and UI design for client SaaS and mobile projects, from early wireframes through polished, developer-ready screens.',
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
      'You will build and run test plans across web and mobile client projects, and help the team move toward more automated coverage.',
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
  },
]
