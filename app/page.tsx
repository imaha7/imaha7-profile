"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

function ClientLogoMarquee() {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const clients = useMemo(
    () =>
      [
        { name: "PT. Astra Honda Motor", url: "https://ik.imagekit.io/zlt25mb52fx/ahmcdn/assets/images/logo/ahm.svg" },
        { name: "Ogloba Ltd.", url: "https://i2.wp.com/www.ogloba.com/wp-content/uploads/2013/12/Logo-header.png?fit=188%2C75&ssl=1" },
        { name: "Sinotif", url: "https://campaign.sinotif.com/wp-content/uploads/2023/09/Logo-Sinotif.png" },
        { name: "CRM Track", url: "https://crmtrack.id/wp-content/uploads/2021/08/logo.png" },
        { name: "PT. Medan Jaya Pangan Mutu", url: "https://medanjayafood.com/wp-content/uploads/2024/10/79logo-biru.png" },
      ],
    []
  );

  const items = useMemo(() => [...clients, ...clients], [clients]);

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const el = scrollerRef.current;
    if (!el) return;

    const speedPxPerSec = 42;

    const tick = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      if (!paused) {
        offsetRef.current += speedPxPerSec * dt;
        const width = el.scrollWidth / 2;
        // wrap around for seamless loop
        if (offsetRef.current >= width) offsetRef.current -= width;
        el.scrollLeft = offsetRef.current;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [paused, prefersReducedMotion]);


  const onPause = () => setPaused(true);
  const onResume = () => setPaused(false);

  const gradientMask =
    "[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]";

  return (
    <div
      className="relative rounded-[2rem] border border-[var(--surface-border)] bg-[var(--surface)] p-6 shadow-[0_20px_80px_-45px_rgba(14,165,233,0.35)]"
      onMouseEnter={onPause}
      onMouseLeave={onResume}
      onFocusCapture={onPause}
      onBlurCapture={onResume}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[var(--surface)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--surface)] to-transparent" />

      <div className={`relative ${gradientMask} `}>
        <div
          ref={scrollerRef}
          className="no-scrollbar flex gap-5 overflow-x-auto scroll-smooth px-2 py-3"
          style={{ scrollSnapType: "none" }}
          aria-label="Client logos auto-scrolling"
        >
          {items.map((c, idx) => (
            <div
              key={`${c.name}-${idx}`}
              className="shrink-0 w-[240px] rounded-2xl border border-[var(--surface-border)] bg-[var(--background)]/40 px-5 py-4 flex items-center justify-center"
            >
              {/* image-only: use DuckDuckGo icon from client name */}
              <img
                src={`${c.url}`}
                alt={c.name}
                className="h-18 w-48 rounded-xl border border-[var(--surface-border)] bg-white/5"
                onError={(e: any) => (e.currentTarget.style.display = "none")}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([
    {
      sender: "bot",
      text: "Hello! Ask me anything about Ilham Maulana Habibie — education, experience, projects, skills, or contact.",
    },
  ]);
  const currentYear = new Date().getFullYear();

  const profileResponses = [
    {
      keys: ["name", "who are", "who is"],
      text: "I am Ilham Maulana Habibie, a Full Stack Developer and BI Specialist based in Jakarta, Indonesia.",
    },
    {
      keys: ["degree", "education", "university", "mikroskil", "computer science"],
      text: "I hold a Bachelor of Computer Science from Mikroskil University.",
    },
    {
      keys: ["contact", "whatsapp", "phone", "number", "email"],
      text: "You can contact me by email at ilham.maulana.07.0698@gmail.com or via WhatsApp at +62 831 9431 0725.",
    },
    {
      keys: ["github", "repo", "repository", "code"],
      text: "Explore my code and project work on GitHub: https://github.com/imaha7.",
    },
    {
      keys: ["linkedin"],
      text: "Connect with me on LinkedIn: https://www.linkedin.com/in/imaha7.",
    },
    {
      keys: ["experience", "current", "work", "job"],
      text: "I currently work as an Information Technology Developer at PT. Sazanka Henig Solusi, building BI dashboards, MotionBoard visualizations, and enterprise data solutions.",
    },
    {
      keys: ["projects", "featured", "dashboard", "budget", "egift", "crm", "mobile"],
      text: "My recent projects include Common Process Monitoring Dashboard, Budget Preparation dashboards, and eGift Card web and mobile solutions for clients like Ogloba Ltd. and PT. Astra Honda Motor.",
    },
    {
      keys: ["skills", "tech", "stack", "tools"],
      text: "My core skills include React, Next.js, TypeScript, Tailwind CSS, Node.js, MotionBoard, Vue.js, Laravel, React Native, Kotlin, REST APIs, SQL / InfluxQL / OracleQL, mobile development, and BI visualization.",
    },
    {
      keys: ["location", "jakarta", "indonesia"],
      text: "I am based in Jakarta, Indonesia.",
    },
    {
      keys: ["help", "assist", "support", "ask"],
      text: "Just ask me anything about my background, experience, education, projects, GitHub, or contact details.",
    },
  ];

  const answerQuestion = (question: string) => {
    const lower = question.toLowerCase();
    if (/(hi|hello|hey|good morning|good afternoon|good evening)/.test(lower)) {
      return "Hi there! I’m ready to answer your questions about Ilham Maulana Habibie.";
    }

    for (const response of profileResponses) {
      if (response.keys.some((key) => lower.includes(key))) {
        return response.text;
      }
    }

    return "I’m happy to help! Ask me about Ilham’s experience, education, project work, skills, or contact details.";
  };

  const sendChatMessage = () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;

    const userMessage = { sender: "user" as const, text: trimmed };
    const botMessage = { sender: "bot" as const, text: answerQuestion(trimmed) };

    setChatMessages((prev) => [...prev, userMessage, botMessage]);
    setChatInput("");
  };

  const [news, setNews] = useState<{ id: number; title: string; url: string; by?: string; time?: number }[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [newsError, setNewsError] = useState<string | null>(null);

  const fetchNews = async () => {
    setLoadingNews(true);
    setNewsError(null);
    try {
      const res = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
      const ids: number[] = await res.json();
      const top = ids.slice(0, 12);
      const items = await Promise.all(
        top.map(async (id) => {
          const r = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          return await r.json();
        })
      );
      const parsed = items
        .filter(Boolean)
        .map((i: any) => ({
          id: i.id,
          title: i.title,
          url: i.url ? i.url : `https://news.ycombinator.com/item?id=${i.id}`,
          by: i.by,
          time: i.time,
        }))
        // Sort newest -> oldest
        .sort((a, b) => (b.time ?? 0) - (a.time ?? 0));

      setNews(parsed);
    } catch (e) {
      setNewsError("Failed to load news");
    } finally {
      setLoadingNews(false);
    }
  };

  React.useEffect(() => {
    fetchNews();
  }, []);

  const carouselRef = React.useRef<HTMLDivElement | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(1);
  const cardWidth = 320; // px
  const cardGap = 16; // px
  const programmaticScrollRef = React.useRef(false);
  const programmaticTimerRef = React.useRef<number | null>(null);
  const animationFrameRef = React.useRef<number | null>(null);

  const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  const smoothScrollTo = (el: HTMLElement, targetLeft: number, duration = 500) => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    const startLeft = el.scrollLeft;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = easeInOutCubic(t);
      el.scrollLeft = Math.round(startLeft + (targetLeft - startLeft) * eased);
      if (t < 1) {
        animationFrameRef.current = requestAnimationFrame(step);
      } else {
        animationFrameRef.current = null;
        // ensure programmatic flag is cleared after animation
        if (programmaticTimerRef.current) {
          window.clearTimeout(programmaticTimerRef.current);
          programmaticTimerRef.current = null;
        }
        programmaticScrollRef.current = false;
      }
    };
    animationFrameRef.current = requestAnimationFrame(step);
  };

  React.useEffect(() => {
    const update = () => {
      const el = carouselRef.current;
      if (!el) return;
      const per = Math.max(1, Math.floor((el.clientWidth + cardGap) / (cardWidth + cardGap)));
      setCardsPerPage(per);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  React.useEffect(() => {
    if (carouselRef.current) carouselRef.current.scrollTo({ left: 0 });
    setCurrentPage(0);
  }, [news]);

  const pageCount = Math.max(1, Math.ceil(news.length / cardsPerPage));
  const maxDots = 5; // maximum visible pagination dots
  const dotCount = Math.min(pageCount, maxDots);
  const pagesPerDot = Math.max(1, Math.ceil(pageCount / dotCount));
  const activeDot = Math.floor(currentPage / pagesPerDot);

  const computePageOffsets = () => {
    const el = carouselRef.current;
    if (!el) return [] as number[];
    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-card-index]"));
    const offsets: number[] = [];
    for (let p = 0; p < pageCount; p++) {
      const firstIndex = p * cardsPerPage;
      const card = cards[firstIndex];
      if (card) offsets.push(card.offsetLeft);
      else offsets.push(p * el.clientWidth);
    }
    return offsets;
  };

  const goToPage = (p: number) => {
    const el = carouselRef.current;
    if (!el) return;
    const page = ((p % pageCount) + pageCount) % pageCount; // wrap
    const offsets = computePageOffsets();
    const left = offsets[page] ?? page * el.clientWidth;
    // mark programmatic scroll so onScroll doesn't overwrite our optimistic state
    programmaticScrollRef.current = true;
    if (programmaticTimerRef.current) window.clearTimeout(programmaticTimerRef.current);
    programmaticTimerRef.current = window.setTimeout(() => {
      programmaticScrollRef.current = false;
      programmaticTimerRef.current = null;
    }, 700);

    // update UI immediately so active page (and any UI) responds without waiting for scroll end
    setCurrentPage(page);
    smoothScrollTo(el, left, 520);
  };

  const prevPage = () => goToPage(currentPage - 1);
  const nextPage = () => goToPage(currentPage + 1);

  React.useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      if (programmaticScrollRef.current) return; // ignore programmatic smooth-scrolling
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // compute current page by finding closest page offset to viewport center
        const center = el.scrollLeft + el.clientWidth / 2;
        const offsets = computePageOffsets();
        if (offsets.length === 0) return;
        let closest = 0;
        let bestDist = Infinity;
        offsets.forEach((off, idx) => {
          const pageCenter = off + el.clientWidth / 2;
          const d = Math.abs(center - pageCenter);
          if (d < bestDist) {
            bestDist = d;
            closest = idx;
          }
        });
        const next = Math.max(0, Math.min(pageCount - 1, closest));
        setCurrentPage(next);
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
      if (programmaticTimerRef.current) {
        window.clearTimeout(programmaticTimerRef.current);
        programmaticTimerRef.current = null;
      }
    };
  }, [news.length, pageCount]);

  const sectionIds = ["home", "about", "projects", "experience", "contact"];

  React.useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme") as "dark" | "light" | null;
    const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme = savedTheme || preferredTheme;
    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const scrollPosition = window.scrollY + window.innerHeight * 0.25;
      let active = sectionIds[0];

      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (!section) continue;

        const { top } = section.getBoundingClientRect();
        if (top <= window.innerHeight * 0.3) {
          active = id;
        }
      }

      setActiveSection(active);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const projects = [
    {
      id: 1,
      title: "Common Process Monitoring Dashboard",
      client: "PT. Sazanka Henig Solusi",
      period: "Okt 2025–Mar 2026",
      relation: "Related with PT. Sazanka Henig Solusi",
      description: "Implement and develop the requirement of DCM Division into visualization data dashboard based.",
      skills: ["Business Intelligence (BI)", "MotionBoard"],
    },
    {
      id: 2,
      title: "Budget Preparation and Standard Using Analysis Manufacture Cost Budget",
      client: "PT. Sazanka Henig Solusi",
      period: "Mar 2025–Okt 2025",
      relation: "Related with PT. Sazanka Henig Solusi",
      description: "Implement and develop the requirement of Finance Division into visualization data dashboard based.",
      skills: ["Board", "Board International"],
    },
    {
      id: 3,
      title: "Dashboard Visualization",
      client: "PT. Sazanka Henig Solusi",
      period: "Okt 2023–Mar 2025",
      relation: "Related with PT. Sazanka Henig Solusi",
      description:
        "Designing data visualization displays in the form of more than 9 dashboards; translating initial requirements from end users into project solutions; troubleshooting and resolving bugs on the visualization dashboard.",
      skills: ["MotionBoard", "InfluxQL"],
    },
    {
      id: 4,
      title: "Carrefour Webportal eGift Card",
      client: "Ogloba Ltd.",
      period: "Nov 2022–Jul 2023",
      relation: "Related with Ogloba Ltd.",
      description: "Design and code new layout e-Gift Card for web app; troubleshoot and resolve client bugs.",
      skills: ["TypeScript", "REST APIs"],
    },
    {
      id: 5,
      title: "E-Gift Card",
      client: "Ogloba Ltd.",
      period: "Nov 2022–Jul 2023",
      relation: "Related with Ogloba Ltd.",
      description: "Design and code new layout e-Gift Card for web app; troubleshoot and resolve client bugs.",
      skills: ["TypeScript", "REST APIs"],
    },
    {
      id: 6,
      title: "Emrys eGift Card Mobile App",
      client: "Ogloba Ltd.",
      period: "Nov 2022–Jul 2023",
      relation: "Related with Ogloba Ltd.",
      description: "Design and code new layout e-Gift Card for mobile app; troubleshoot and resolve client bugs.",
      skills: ["React Native", "TypeScript"],
    },
    {
      id: 7,
      title: "CRM Track",
      client: "Zegen Solusi Mandiri",
      period: "Apr 2022–Nov 2022",
      relation: "Related with Zegen Solusi Mandiri",
      description: "Developing UI Sales Management Apps Web Based using React.js & Next.js.",
      skills: ["REST APIs", "Agile Methodologies"],
    },
    {
      id: 8,
      title: "CRPRO NFT Stacking",
      client: "Zegen Solusi Mandiri",
      period: "Jun 2022–Nov 2022",
      relation: "Related with Zegen Solusi Mandiri",
      description: "Developed UI Cryptocurrency Investment Apps Web Based using React.js & Next.js.",
      skills: ["REST APIs", "Agile Methodologies"],
    },
    {
      id: 9,
      title: "SINOTIF",
      client: "Zegen Solusi Mandiri",
      period: "Sep 2022–Nov 2022",
      relation: "Related with Zegen Solusi Mandiri",
      description: "Developing UI Education Apps Web Based using React.js & Next.js.",
      skills: ["TypeScript", "REST APIs"],
    },
    {
      id: 10,
      title: "Seruni",
      client: "PT. Tiga Ruang Imaji",
      period: "Jul 2021–Nov 2021",
      relation: "Related with PT. Tiga Ruang Imaji",
      description: "Developed Education Apps Web Based using Vue.js & Laravel.",
      skills: ["REST APIs", "Agile Methodologies"],
    },
    {
      id: 11,
      title: "SiAkar (Absensi Online)",
      client: "PT. Tiga Ruang Imaji",
      period: "Agu 2021–Sep 2021",
      relation: "Related with PT. Tiga Ruang Imaji",
      description: "Developed Employee Absence Apps Web Based using Vue.js & Laravel.",
      skills: ["REST APIs", "Agile Methodologies"],
    },
    {
      id: 12,
      title: "Wakprint (Marketplace Jasa Percetakan)",
      client: "Universitas Mikroskil",
      period: "Nov 2019–Feb 2021",
      relation: "Related with Universitas Mikroskil",
      description: "Developed Printing Service Marketplace Apps Web & Android using Vue.js, Laravel & Kotlin.",
      skills: ["REST APIs", "Agile Methodologies"],
    },
  ];

  const skills = [
    {
      category: "Frontend",
      items: [
        "React",
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Vue.js",
        "HTML",
        "CSS",
        "Material UI",
      ],
    },
    {
      category: "Backend & Data",
      items: [
        "Node.js",
        "Express",
        "Laravel",
        "REST APIs",
        "PostgreSQL",
        "MongoDB",
        "Firebase",
        "SQL / InfluxQL / OracleQL",
        "MotionBoard",
      ],
    },
    {
      category: "Mobile & Cloud",
      items: [
        "React Native",
        "Kotlin",
        "Android",
        "Docker",
        "AWS",
        "Vercel",
        "npm",
        "CI/CD",
      ],
    },
    {
      category: "Certifications & Growth",
      items: [
        "MotionBoard Expert Certified",
        "MotionBoard Professional Certified",
        "JavaScript Intermediate",
        "REST API Intermediate",
        "Problem Solving",
        "Network Security",
        "Project Management",
        "English Proficiency",
      ],
    },
  ];

  const experience = [
    {
      role: "Information Technology Developer",
      company: "PT. Sazanka Henig Solusi",
      period: "Oct 2023 - Present",
      description: "Support client on development and implementation projects; develop expertise in Business Intelligence products (MotionBoard).",
      details: [
        "Support the Company’s Client development and implementation project.",
        "Develop expertise in Products Business Intelligence like MotionBoard of the Company.",
        "Develop marketing and communication materials together with Sales team (e.g., sales presentation slides, product information).",
        "Conduct product demos and presentations.",
        "Support principal, partner, and customer in all sales and project stages.",
        "Skills: REST APIs, Web Application Development, +4 keahlian",
      ],
    },
    {
      role: "Product Owner",
      company: "Man Barista Coffee",
      period: "Nov 2024 - Jan 2026",
      description: "Managed product and sales for Man Barista Coffee and led product launches.",
      details: [
        "Manage and sale date seed coffee best choice.",
        "Led product launches such as 'Man Barista Coffee 25gr' and 'Kopi Biji Kurma 25gr' including packaging and thumbnails.",
        "Responsible for product management, sales strategy, and day-to-day operations.",
        "Skills: Manajemen Produk, Manajemen, +3 keahlian",
      ],
    },
    {
      role: "Frontend Engineer",
      company: "Ogloba Ltd.",
      period: "Nov 2022 - Jul 2023",
      description: "Worked on web and mobile UI/UX and user-facing applications.",
      details: [
        "Overseeing the structure and design of web and mobile pages to enhance user-friendliness.",
        "Developing user-facing applications and monitoring their effectiveness.",
        "Collaborating with colleagues and stakeholders to ensure optimal user experience.",
        "Working with Back-End Developers to ensure all pages work per briefs.",
        "Modifying existing page designs and content for improved client and user benefits.",
        "Skills: JavaScript, REST APIs, +15 keahlian",
      ],
    },
    {
      role: "Mobile Engineer",
      company: "Ogloba Ltd.",
      period: "Nov 2022 - Jul 2023",
      description: "Built and maintained mobile application features and collaborated across teams.",
      details: [
        "Overseeing the structure and design of web and mobile pages to enhance user-friendliness.",
        "Developing user-facing applications and monitoring their effectiveness.",
        "Collaborating with colleagues and stakeholders to ensure optimal user experience.",
        "Working with Back-End Developers to ensure all pages work per briefs.",
        "Modifying existing page designs and content for improved client and user benefits.",
        "Skills: REST APIs, GitHub, +10 keahlian",
      ],
    },
    {
      role: "Frontend Developer",
      company: "Zegen Solusi Mandiri",
      period: "Apr 2022 - Nov 2022",
      description: "Built web applications and converted designs into front-end code.",
      details: [
        "Building web application by adhering to best development practices.",
        "Transforming app designs into front-end code using HTML, CSS, and JavaScript.",
        "Collaborating with back-end developers to integrate UI components with APIs and databases.",
        "Debugging errors and optimizing performance of web applications.",
        "Creating high-quality, scalable, and reusable code.",
        "Skills: JavaScript, REST APIs, +5 keahlian",
      ],
    },
    {
      role: "Full Stack Developer",
      company: "PT. Tiga Ruang Imaji",
      period: "Jul 2021 - Nov 2021",
      description: "Worked across front-end and back-end to deliver full solutions.",
      details: [
        "Collaborating with development teams to ideate software solutions.",
        "Designing client-side and server-side architecture.",
        "Building appealing front-end applications and managing databases.",
        "Writing effective APIs and ensuring software responsiveness.",
        "Conducting troubleshooting and upgrading software performance.",
        "Skills: JavaScript, REST APIs, +7 keahlian",
      ],
    },
    {
      role: "Content Creator",
      company: "PT. Medan Jaya Pangan Mutu",
      period: "May 2021",
      description: "Created promotional video content and marketing assets.",
      details: [
        "Produced short-form video content using Adobe Premiere Pro.",
        "Worked on video editing and promotional material for product launches.",
      ],
    },
    {
      role: "Android Developer",
      company: "PT. Bes Digital Indonesia",
      period: "Dec 2018 - Dec 2019",
      description: "Built Android applications and collaborated on cross-functional features.",
      details: [
        "Designed and built advanced applications for the Android platform.",
        "Collaborated with cross-functional teams to define, design, and ship new features.",
        "Worked with APIs and outside data sources.",
        "Performed unit testing for code reliability.",
        "Continuously discovered and integrated new technologies.",
        "Skills: REST APIs, Kotlin, +5 keahlian",
      ],
    },
    {
      role: "Program Kreativitas Mahasiswa",
      company: "Kemenristek / BRIN RI",
      period: "Oct 2018 - Jan 2019",
      description: "Participated in the student creativity program contributing to research and project development.",
      details: [
        "Involved in collaborative student research and project development efforts.",
        "Skills: JavaScript, REST APIs, +8 keahlian",
      ],
    },
  ];

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    // { id: "clients", label: "Clients" },
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),transparent_30%),radial-gradient(circle_at_80%_10%,_rgba(14,165,233,0.14),transparent_22%)] blur-3xl" />

      <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[var(--surface)] backdrop-blur-xl border-b border-[var(--surface-border)] shadow-lg shadow-cyan-500/5' : 'bg-transparent'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <a href="#home" onClick={() => { setActiveSection('home'); setMobileNavOpen(false); document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }); }} className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface)] text-sm font-semibold uppercase tracking-[0.24em] text-[var(--foreground)] shadow-sm shadow-white/5">
                I
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-semibold tracking-tight text-[var(--foreground)]">IMAHA</span>
                <span className="text-[0.65rem] uppercase tracking-[0.24em] text-[var(--muted)]">Profile</span>
              </div>
            </a>
            <div className="hidden lg:flex items-center gap-8 ml-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`relative text-sm font-medium transition-all duration-300 py-1 ${activeSection === item.id ? 'text-[var(--brand-text)]' : 'text-[var(--muted)] hover:text-[var(--foreground)]'}`}
                >
                  {item.label}
                  <span className={`absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-300 ${activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a href="#projects" className="hidden md:inline-flex items-center rounded-md bg-gradient-to-r from-cyan-500 to-indigo-500 px-5 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105">
              View Projects
            </a>
            <a
              href="https://api.whatsapp.com/send?phone=6283194310725&text=Hi%20Ilham%2C%20I%20would%20like%20to%20discuss%20a%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="border inline-flex items-center rounded-md border border-[var(--surface-border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface)]/90 transition-all duration-300"
            >
              Contact
            </a>
            <button
              type="button"
              onClick={() => {
                const nextTheme = theme === "dark" ? "light" : "dark";
                setTheme(nextTheme);
                window.localStorage.setItem("theme", nextTheme);
                document.documentElement.dataset.theme = nextTheme;
              }}
              className="hidden sm:inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface)]/90 transition-all duration-300"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[var(--foreground)]">
                  <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[var(--foreground)]">
                  <path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMobileNavOpen((open) => !open)}
              className="ml-2 inline-flex items-center rounded-md bg-[var(--surface)] p-2 text-[var(--foreground)] hover:bg-[var(--surface)] transition-all duration-300 md:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileNavOpen}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>
        <div className={`absolute inset-x-0 top-full bg-[var(--surface)] border-t border-[var(--surface-border)] overflow-hidden transition-all duration-300 md:hidden ${mobileNavOpen ? 'max-h-60 py-4 opacity-100' : 'max-h-0 py-0 opacity-0'}`}>
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 sm:px-6 lg:px-8">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection(item.id);
                  setMobileNavOpen(false);
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${activeSection === item.id ? 'bg-cyan-500/10 text-[var(--brand-text)]' : 'text-[var(--foreground)] hover:bg-[var(--surface)]'
                  }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <main className="relative pt-32">
        {/* SEO-only keywords block (kept visually hidden, still crawlable) */}
        <div className="sr-only" aria-hidden="false">
          imaha7 profile. Ilham Maulana Habibie. Ilham Software Engineer. Full Stack Developer.
          BI Specialist. React Next.js TypeScript Tailwind Node.js MotionBoard dashboards.
          Laravel Vue.js React Native Kotlin Android REST APIs SQL InfluxQL OracleQL.
          MotionBoard Expert Certified. JavaScript Intermediate. REST API Intermediate.
          Network Security. Project Management. English proficiency. Jakarta developer.
          GitHub: https://github.com/imaha7. LinkedIn: https://www.linkedin.com/in/imaha7.
        </div>

        <section id="home" className="pb-32 px-4 pt-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-16 lg:grid-cols-2 items-center">
              <div className="space-y-10">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--brand-text)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    Full Stack Developer & BI Specialist
                  </div>
                  <h1 className="text-6xl sm:text-7xl font-bold leading-tight text-[var(--foreground)]">
                    Hi, I’m Ilham Maulana Habibie.
                  </h1>
                  <p className="text-xl text-[var(--muted)] leading-relaxed max-w-lg">
                    Bachelor of Computer Science from Mikroskil University. I create premium web applications, intelligent dashboards, and scalable BI solutions for enterprise clients.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <a
                    href="#projects"
                    className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
                  >
                    Explore Projects
                  </a>

                  <a
                    href="mailto:ilham.maulana.07.0698@gmail.com"
                    className="border inline-flex items-center justify-center rounded-lg px-8 py-4 text-base font-semibold text-[var(--foreground)] hover:bg-[var(--surface)]/90 hover:border-cyan-400/50 hover:shadow-[0_0_0_1px_rgba(34,211,238,0.35)] transition-all duration-300"
                  >
                    Get In Touch
                  </a>
                </div>



                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[var(--surface-border)]">
                  {[
                    { num: '12+', label: 'Projects' },
                    { num: '6+', label: 'Years' },
                    { num: '5+', label: 'Companies' },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="text-3xl font-bold text-[var(--brand-text)]">{stat.num}</div>
                      <div className="text-sm text-[var(--muted)] mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 rounded-3xl blur-3xl" />
                <div className="relative rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] p-8 backdrop-blur-xl">
                  <div className="space-y-8">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)] mb-3">Current Focus</p>
                      <h3 className="text-2xl font-bold text-[var(--foreground)] mb-2">Dashboard Visualization</h3>
                      <p className="text-[var(--muted)]">Data-driven insights for enterprise clients using MotionBoard and InfluxQL.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Frontend', value: 'React, Next.js, Vue.js' },
                        { label: 'Backend', value: 'Node.js, Laravel, Express' },
                        { label: 'Data', value: 'BI, Dashboards, SQL' },
                        { label: 'Mobile', value: 'React Native, Kotlin' },
                      ].map((item) => (
                        <div key={item.label} className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-4">
                          <p className="text-[0.7rem] uppercase tracking-[0.18em] text-[var(--muted)]">{item.label}</p>
                          <p className="text-sm font-semibold text-[var(--foreground)] mt-2">{item.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-[var(--surface-border)]">
                      <p className="text-xs text-[var(--muted)] mb-3">Recent Clients</p>
                      <div className="flex flex-wrap gap-2">
                        {['PT. Astra Honda Motor', 'Ogloba Ltd.', 'Zegen Solusi Mandiri'].map((client) => (
                          <span key={client} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-[var(--brand-text)] border border-cyan-500/20">
                            {client}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10 rounded-[2rem] border border-[var(--surface-border)] bg-[var(--surface)] p-6 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.75)] backdrop-blur-xl">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Resume</p>
                  <h3 className="text-2xl font-bold text-[var(--foreground)]">Download & Preview</h3>
                  <p className="text-[var(--muted)] max-w-xl">
                    Download the latest resume PDF now. Live preview will be enabled after you upload the PDF.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="/Ilham_Resume.pdf"
                    download="Ilham_Resume.pdf"
                    className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:from-cyan-400 hover:to-indigo-400 hover:shadow-cyan-400/40 hover:scale-105"
                  >
                    Download PDF
                  </a>

                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--surface)]/90 transition-all duration-300"
                    onClick={() => {
                      const el = document.getElementById('resume-preview');
                      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                  >
                    Live Preview
                  </button>
                </div>
              </div>

              <div id="resume-preview" className="mt-6 overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--background)]/30">
                <div className="flex flex-col gap-3 border-b border-[var(--surface-border)] p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--brand-text)]">Live preview</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">You can scroll the PDF inside this page.</p>
                  </div>

                  <a
                    href="/Ilham_Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface)]/90 transition-all duration-300"
                  >
                    Open in new tab
                  </a>
                </div>

                <div className="h-[70vh] min-h-[520px] max-h-[760px]">
                  <iframe
                    src="/Ilham_Resume.pdf"
                    title="Ilham_Resume.pdf live preview"
                    className="h-full w-full"
                    loading="lazy"
                  />
                </div>

                <div className="p-4">
                  <p className="text-xs text-[var(--muted)]">
                    If the preview doesn’t load in your browser, use the download button above.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="pt-10 pb-20 px-4">
          <div className="mx-auto max-w-6xl rounded-[2rem] border border-[var(--surface-border)] bg-[var(--surface)] p-10 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.75)] backdrop-blur-xl">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_0.9fr] items-center">
              <div>
                <h2 className="text-4xl font-bold mb-8 text-[var(--foreground)]">About Me</h2>
                <p className="text-[var(--muted)] mb-6 leading-relaxed">
                  I'm a passionate software engineer with 6+ years of experience building web and mobile applications, enterprise dashboards, and data visualization solutions that solve real business challenges.
                </p>
                <p className="text-[var(--muted)] mb-6 leading-relaxed">
                  I hold a Bachelor of Computer Science from Mikroskil University with Magna Cum Laude honors, and I am certified in MotionBoard, JavaScript, REST API, problem solving, and network security.
                </p>
                <p className="text-[var(--muted)] leading-relaxed">
                  My work combines frontend design, backend architecture, mobile development, and BI visualization to deliver polished products for clients in manufacturing, finance, and enterprise operations.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Projects Completed', value: '50+' },
                  { label: 'Years Experience', value: '6+' },
                  { label: 'Happy Clients', value: '30+' },
                  { label: 'Tech Stack', value: '15+' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] p-6">
                    <div className="text-sm text-[var(--muted)]">{stat.label}</div>
                    <div className="mt-2 text-3xl font-semibold text-[var(--brand-text)]">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="py-20 px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-4xl font-bold mb-12 text-center text-[var(--foreground)]">Skills & Expertise</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {skills.map((skillGroup) => (
                <div key={skillGroup.category} className="rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 transition hover:border-cyan-400/50">
                  <h3 className="mb-4 text-xl font-semibold text-[var(--brand-text)]">{skillGroup.category}</h3>
                  <div className="space-y-3">
                    {skillGroup.items.map((item) => (
                      <div key={item} className="flex items-center gap-3 text-[var(--muted)]">
                        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="credentials" className="py-20 px-4 bg-[var(--surface)]">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[2rem] border border-[var(--surface-border)] bg-[var(--background)] p-8 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.75)]">
                <h2 className="text-3xl font-bold mb-6 text-[var(--foreground)]">Verified Credentials</h2>
                <ul className="space-y-4 text-[var(--muted)]">
                  <li className="rounded-2xl bg-[var(--surface)] p-4 border border-[var(--surface-border)]">
                    <p className="font-semibold text-[var(--foreground)]">MotionBoard Expert Certified</p>
                    <p className="text-sm">Certified by WingArc1st for advanced BI visualization and dashboard delivery.</p>
                  </li>
                  <li className="rounded-2xl bg-[var(--surface)] p-4 border border-[var(--surface-border)]">
                    <p className="font-semibold text-[var(--foreground)]">MotionBoard Professional Certified</p>
                    <p className="text-sm">Validated expertise in enterprise MotionBoard dashboard creation and analytics solutions.</p>
                  </li>
                  <li className="rounded-2xl bg-[var(--surface)] p-4 border border-[var(--surface-border)]">
                    <p className="font-semibold text-[var(--foreground)]">Web & Mobile Development Certifications</p>
                    <p className="text-sm">JavaScript, CSS, REST API and Android technology certifications that support production-ready delivery.</p>
                  </li>
                </ul>
              </div>
              <div className="rounded-[2rem] border border-[var(--surface-border)] bg-[var(--background)] p-8 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.75)]">
                <h2 className="text-3xl font-bold mb-6 text-[var(--foreground)]">Profiles & References</h2>
                <p className="text-[var(--muted)] mb-6">
                  Verified professional profile and portfolio links for Ilham Maulana Habibie. These references support the public record of experience, projects, and certifications.
                </p>
                <div className="space-y-4">
                  <a href="https://www.linkedin.com/in/imaha7" target="_blank" rel="noopener noreferrer" className="block rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5 text-[var(--foreground)] hover:border-cyan-400/40 hover:bg-cyan-500/10 transition">
                    <p className="font-semibold">LinkedIn Profile</p>
                    <p className="text-sm text-[var(--muted)]">linkedin.com/in/imaha7</p>
                  </a>
                  <a href="https://github.com/imaha7" target="_blank" rel="noopener noreferrer" className="block rounded-2xl border border-slate-500/10 bg-[var(--surface)] p-5 text-[var(--foreground)] hover:border-cyan-400/40 hover:bg-[var(--surface)]/90 transition">
                    <p className="font-semibold">GitHub Portfolio</p>
                    <p className="text-sm text-[var(--muted)]">github.com/imaha7</p>
                  </a>
                  <a href="/Ilham_Resume.pdf" target="_blank" rel="noopener noreferrer" className="block rounded-2xl border border-slate-500/10 bg-[var(--surface)] p-5 text-[var(--foreground)] hover:border-cyan-400/40 hover:bg-[var(--surface)]/90 transition">
                    <p className="font-semibold">Resume / CV</p>
                    <p className="text-sm text-[var(--muted)]">Download or preview the latest resume.</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="clients" className="py-20 px-4">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-4xl font-bold mb-10 text-center text-[var(--foreground)]">Clients</h2>
            {/* Auto-scrolling client logos */}
            <ClientLogoMarquee />
          </div>
        </section>

        <section id="projects" className="py-20 px-4 bg-[var(--surface)]">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-4xl font-bold mb-12 text-center text-[var(--foreground)]">Featured Projects</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (

                <div
                  key={project.id}
                  className="group overflow-hidden rounded-[1.5rem] border border-[var(--surface-border)] bg-[var(--surface)] shadow-[0_20px_80px_-45px_rgba(14,165,233,0.5)] transition hover:-translate-y-1 hover:border-cyan-400/30"
                >
                  <div className="flex h-36 items-center justify-center bg-gradient-to-br from-blue-500/10 to-cyan-500/8 transition group-hover:from-blue-500/20 group-hover:to-cyan-500/16">
                    <div className="text-center">
                      <div className="text-sm font-medium text-[var(--muted)]">{project.client}</div>
                      <div className="mt-2 text-4xl font-semibold text-[var(--muted)] opacity-20 group-hover:opacity-30">→</div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[var(--foreground)]">{project.title}</h3>
                    <div className="mt-2 text-xs text-[var(--muted)]">{project.period}</div>
                    <div className="text-xs text-[var(--muted)] mb-3">{project.relation}</div>
                    <p className="text-[var(--muted)] text-sm mb-3">{project.description}</p>
                    {project.skills && project.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.skills.map((s) => (
                          <span key={s} className="rounded-full bg-cyan-500/12 px-3 py-1 text-xs font-medium text-[var(--brand-text)]">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="experience" className="py-20 px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-4xl font-bold mb-12 text-center text-[var(--foreground)]">Experience</h2>
            <div className="space-y-8">
              {experience.map((exp) => (
                <div key={exp.role} className="relative overflow-hidden rounded-[1.5rem] border border-[var(--surface-border)] bg-[var(--surface)] p-6 shadow-[0_20px_80px_-45px_rgba(14,165,233,0.4)]">
                  <div className="absolute top-6 left-0 h-20 w-1 rounded-tr-full rounded-br-full bg-gradient-to-b from-cyan-400 to-transparent" />
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold text-[var(--brand-text)]">{exp.role}</h3>
                    <p className="text-sm text-[var(--muted)] mt-1">{exp.company}</p>
                    <p className="text-xs text-[var(--muted)] mt-2">{exp.period}</p>
                    {exp.details ? (
                      <ul className="mt-4 list-disc list-inside text-[var(--muted)] space-y-2">
                        {exp.details.map((d, i) => (
                          <li key={i} className="text-sm">
                            {d}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[var(--muted)] mt-4">{exp.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-20 px-4 bg-[var(--surface)]">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold mb-6 text-[var(--foreground)]">Get In Touch</h2>
            <p className="text-xl text-[var(--muted)] mb-12">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <a
                href="mailto:ilham.maulana.07.0698@gmail.com"
                className="rounded-full bg-cyan-500 px-8 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 hover:shadow-cyan-400/40"
              >
                Email Me
              </a>
              <a
                href="https://www.linkedin.com/in/imaha7"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-cyan-400/50 px-8 py-3 text-sm font-semibold text-[var(--brand-text)] transition hover:bg-cyan-400/10"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/imaha7"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-cyan-400/50 px-8 py-3 text-sm font-semibold text-[var(--brand-text)] transition hover:bg-cyan-400/10"
              >
                GitHub
              </a>
            </div>
          </div>
        </section>
        <section id="news" className="py-20 px-4 bg-[var(--surface)]">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold mb-6 text-[var(--foreground)]">Latest Tech News</h2>
              <button
                type="button"
                onClick={() => fetchNews()}
                className="rounded-md border border-[var(--surface-border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--surface)]/90 transition"
              >
                Refresh
              </button>
            </div>

            <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-4">
              {loadingNews ? (
                <div className="text-[var(--muted)]">Loading news...</div>
              ) : newsError ? (
                <div className="text-sm text-red-400">{newsError}</div>
              ) : news.length === 0 ? (
                <div className="text-[var(--muted)]">No news available.</div>
              ) : (
                <div className="relative">
                  <div className="absolute left-2 top-1/2 z-20 -translate-y-1/2">
                    <button
                      type="button"
                      onClick={() => prevPage()}
                      className="rounded-full bg-[var(--surface)]/80 p-2 text-[var(--foreground)] shadow-sm hover:bg-[var(--surface)]"
                      aria-label="Previous"
                    >
                      ‹
                    </button>
                  </div>
                  <div className="absolute right-2 top-1/2 z-20 -translate-y-1/2">
                    <button
                      type="button"
                      onClick={() => nextPage()}
                      className="rounded-full bg-[var(--surface)]/80 p-2 text-[var(--foreground)] shadow-sm hover:bg-[var(--surface)]"
                      aria-label="Next"
                    >
                      ›
                    </button>
                  </div>

                  <div
                    ref={carouselRef}
                    className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 px-2"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                  >
                    {news.map((item, index) => {
                      let domain = '';
                      try {
                        domain = item.url ? new URL(item.url).hostname.replace('www.', '') : '';
                      } catch (e) {
                        domain = '';
                      }
                      const iconUrl = domain ? `https://icons.duckduckgo.com/ip3/${domain}.ico` : undefined;

                      return (
                        <div key={item.id} data-card-index={index} className="shrink-0 w-[320px] snap-start">
                          <article className="flex h-full flex-col justify-between gap-3 rounded-xl border border-[var(--surface-border)] bg-[var(--background)] p-0 overflow-hidden shadow-sm">
                            <div className="h-36 bg-gradient-to-br from-blue-500/8 to-cyan-500/6 flex items-end p-3">
                              {iconUrl ? (
                                <img
                                  src={iconUrl}
                                  alt={domain}
                                  className="h-10 w-10 rounded-md border border-[var(--surface-border)] bg-white/5"
                                  onError={(e: any) => (e.currentTarget.style.display = 'none')}
                                />
                              ) : null}
                              <div className="ml-3 text-xs text-[var(--muted)]">{domain}</div>
                            </div>

                            <div className="p-4">
                              <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[var(--brand-text)] font-semibold hover:underline">
                                {item.title}
                              </a>
                              <div className="mt-2 flex items-center gap-3 text-xs text-[var(--muted)]">
                                <span>by {item.by ?? 'unknown'}</span>
                                <span className="text-[var(--muted)]">•</span>
                                <span>{item.time ? new Date(item.time * 1000).toLocaleString() : ''}</span>
                              </div>
                            </div>
                          </article>
                        </div>
                      );
                    })}
                  </div>

                  {/* pagination dots removed per user request */}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--surface-border)] mt-12 bg-[var(--surface)]/90">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_0.9fr] items-start">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-[var(--brand-text)]">Let's collaborate</p>
              <h2 className="mt-4 text-3xl font-semibold text-[var(--foreground)]">Powerful solutions with premium delivery.</h2>
              <p className="mt-4 max-w-xl text-[var(--muted)]">Available for BI, dashboard, and web application projects. Send an email to start a clear, fast conversation about your next digital product.</p>
            </div>
            <div className="rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Email</p>
              <a href="mailto:ilham.maulana.07.0698@gmail.com" className="mt-3 block text-lg font-semibold text-[var(--foreground)] hover:text-[var(--brand-text)]">ilham.maulana.07.0698@gmail.com</a>
              <p className="mt-4 text-sm text-[var(--muted)]">Jakarta, Indonesia</p>
            </div>
          </div>
          <div className="mt-10 border-t border-[var(--surface-border)] pt-6 text-center text-sm text-[var(--muted)]">© {currentYear} Ilham Maulana Habibie. All rights reserved.</div>
        </div>
      </footer>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <button
          type="button"
          onClick={() => setChatOpen((open) => !open)}
          className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:bg-cyan-400"
        >
          <span>{chatOpen ? "Close" : "Ask"}</span>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-white">?</span>
        </button>

        <div className={`${chatOpen ? "block" : "hidden"} w-[320px] max-w-full rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] p-4 shadow-[0_25px_60px_-30px_rgba(0,0,0,0.6)] backdrop-blur-xl`}>
          <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-3">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--brand-text)]">AI Assistant</p>
              <h3 className="mt-1 text-lg font-semibold text-[var(--foreground)]">Ask about Ilham</h3>
            </div>
            <button
              type="button"
              onClick={() => setChatOpen(false)}
              className="text-[var(--muted)] hover:text-[var(--foreground)]"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-2">
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={`rounded-2xl px-3 py-2 ${message.sender === "bot" ? "bg-slate-900/80 text-slate-100" : "ml-auto bg-cyan-500/15 text-[var(--foreground)]"}`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
              placeholder="Type your question..."
              className="flex-1 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] outline-none transition focus:border-cyan-400/80 focus:ring-2 focus:ring-cyan-500/20"
            />
            <button
              type="button"
              onClick={sendChatMessage}
              className="inline-flex items-center rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
