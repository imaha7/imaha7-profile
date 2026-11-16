"use client";

import React, { type ReactNode, useMemo, useState } from "react";
import DeferredSections from "./deferred-sections";
import VisitorCounter from "./visitor-counter";

function DashboardArtwork({ variant = "overview" }: { variant?: string }) {
  return (
    <div className={`dashboard-art dashboard-art--${variant}`} aria-hidden="true">
      <div className="dashboard-art__chrome">
        <span className="dashboard-art__mark">I</span>
        <span>IMAHA / INSIGHTS</span>
        <span className="dashboard-art__live"><i /> LIVE DATA</span>
      </div>
      <div className="dashboard-art__content">
        <div className="dashboard-art__rail"><i /><i /><i /><i /></div>
        <div className="dashboard-art__main">
          <div className="dashboard-art__heading">
            <span>BUSINESS OVERVIEW</span>
            <strong>Performance dashboard</strong>
          </div>
          <div className="dashboard-art__metrics">
            <div><span>Total revenue</span><strong>Rp 18.4B</strong><i>+12.8%</i></div>
            <div><span>Active projects</span><strong>12</strong><i>+3 this year</i></div>
            <div><span>Data coverage</span><strong>98.6%</strong><i>Healthy</i></div>
          </div>
          <div className="dashboard-art__chart">
            <div className="dashboard-art__chart-title"><span>Revenue insights</span><b>Last 12 months</b></div>
            <div className="dashboard-art__chart-grid">
              {[34, 48, 41, 58, 52, 72, 60, 83, 68, 91, 77, 100].map((height, index) => (
                <i key={index} style={{ height: `${height}%` }} />
              ))}
            </div>
            <div className="dashboard-art__chart-labels"><span>JAN</span><span>APR</span><span>JUL</span><span>OCT</span><span>DEC</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectArtwork({ id, title, client, skill }: { id: number; title: string; client: string; skill: string }) {
  const chartHeights = [
    [35, 54, 42, 69, 58, 84, 70, 96],
    [72, 48, 86, 61, 93, 52, 76, 64],
    [43, 82, 59, 96, 68, 51, 88, 72],
    [88, 55, 73, 46, 95, 62, 81, 57],
  ][id % 4];

  return (
    <div className={`project-artwork project-artwork--${id} project-artwork--type-${id % 6}`} aria-hidden="true">
      <div className="project-artwork__browser">
        <div className="project-artwork__top">
          <span /><span /><span />
          <b>{client}</b>
        </div>
        <div className="project-artwork__screen">
          <aside><i /><i /><i /><i /><i /></aside>
          <div className="project-artwork__canvas">
            <div className="project-artwork__heading"><i /><i /><i /></div>
            <span className="project-artwork__label">{skill}</span>
            <strong>{title}</strong>
            {id % 6 === 0 || id % 6 === 1 ? (
              <>
                <div className="project-artwork__stats"><i /><i /><i /></div>
                <div className="project-artwork__chart">
                  {chartHeights.map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
                </div>
              </>
            ) : id % 6 === 2 ? (
              <div className="project-artwork__kanban">
                {[0, 1, 2].map((column) => <div key={column}><i /><i /><i /></div>)}
              </div>
            ) : id % 6 === 3 ? (
              <div className="project-artwork__gift"><span>GIFT</span><strong>THANK<br />YOU</strong><i /></div>
            ) : id % 6 === 4 ? (
              <div className="project-artwork__mobile">
                <i /><b /><span /><span /><span />
              </div>
            ) : (
              <div className="project-artwork__table">
                {[0, 1, 2, 3].map((row) => <i key={row}><b /><b /><b /><b /></i>)}
              </div>
            )}
          </div>
        </div>
      </div>
      <span className="project-artwork__index">{String(id).padStart(2, "0")}</span>
    </div>
  );
}

function ClientLogoMarquee() {
  const clients = useMemo(
    () => [
      { name: "PT. Astra Honda Motor", url: "https://ik.imagekit.io/zlt25mb52fx/ahmcdn/assets/images/logo/ahm.svg" },
      { name: "Ogloba Ltd.", url: "https://i2.wp.com/www.ogloba.com/wp-content/uploads/2013/12/Logo-header.png?fit=188%2C75&ssl=1" },
      { name: "Sinotif", url: "https://campaign.sinotif.com/wp-content/uploads/2023/09/Logo-Sinotif.png" },
      { name: "CRM Track", url: "https://crmtrack.id/wp-content/uploads/2021/08/logo.png" },
      { name: "PT. Medan Jaya Pangan Mutu", url: "https://medanjayafood.com/wp-content/uploads/2024/10/79logo-biru.png" },
    ],
    []
  );

  const [paused, setPaused] = useState(false);

  const gradientMask =
    "[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]";

  return (
    <div
      className="relative rounded-[2rem] border border-[var(--surface-border)] bg-[var(--surface)] p-6 shadow-[0_20px_80px_-45px_rgba(14,165,233,0.35)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[var(--surface)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--surface)] to-transparent" />

      <div className={`client-marquee-viewport relative overflow-hidden ${gradientMask}`}>
        <div
          className={`client-marquee-track flex w-max ${paused ? "is-paused" : ""}`}
          aria-label="Client logos auto-scrolling"
        >
          {[0, 1].map((group) => (
            <div
              key={group}
              className="flex shrink-0 gap-5 px-2 py-3"
              aria-hidden={group === 1}
            >
              {clients.map((client) => (
                <div key={client.name} className="client-wordmark">
                  <img
                    src={client.url}
                    alt={group === 0 ? client.name : ""}
                    loading="lazy"
                    decoding="async"
                    onError={(event) => {
                      event.currentTarget.hidden = true;
                    }}
                  />
                  <span>{client.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home({ heroHeading }: { heroHeading: ReactNode }) {
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const resumeDialogRef = React.useRef<HTMLDialogElement | null>(null);
  const resumeCloseTimeoutRef = React.useRef<number | null>(null);
  const closeResumePreview = () => {
    const dialog = resumeDialogRef.current;
    if (!dialog?.open || resumeCloseTimeoutRef.current !== null) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      dialog.close();
      return;
    }

    dialog.classList.add("is-closing");
    resumeCloseTimeoutRef.current = window.setTimeout(() => {
      dialog.close();
      dialog.classList.remove("is-closing");
      resumeCloseTimeoutRef.current = null;
    }, 220);
  };
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([
    {
      sender: "bot",
      text: "Hello! Ask me anything about Ilham Maulana Habibie — education, experience, projects, skills, or contact.",
    },
  ]);
  const currentYear = new Date().getFullYear();

  const certifications = useMemo(
    () => [
      { title: "PL-300 certification prep: Microsoft Power BI Data Analyst", issuer: "Udemy", date: "Nov 2026 - Present", url: "https://www.udemy.com/certificate/UC-fb026002-91c4-40e3-aafb-706e55d53db9/" },
      { title: "Angular (Intermediate)", issuer: "HackerRank", date: "May 2026 - Present", url: "https://www.hackerrank.com/certificates/34732e6e6536" },
      { title: "Angular (Basic)", issuer: "HackerRank", date: "May 2026 - Present", url: "https://www.hackerrank.com/certificates/b25c52d459ec" },
      { title: "SQL (Advanced)", issuer: "HackerRank", date: "May 2026 - Present", url: "https://www.hackerrank.com/certificates/f655401e5792" },
      { title: "Node (Basic)", issuer: "HackerRank", date: "May 2026 - Present", url: "https://www.hackerrank.com/certificates/225a4c691fd0" },
      { title: "Node.js (Intermediate)", issuer: "HackerRank", date: "May 2026 - Present", url: "https://www.hackerrank.com/certificates/27505b0c54c5" },
      { title: "Software Engineer", issuer: "HackerRank", date: "May 2026 - Present", url: "https://www.hackerrank.com/certificates/da7fffd83916" },
      { title: "Frontend Developer (React)", issuer: "HackerRank", date: "May 2026 - Present", url: "https://www.hackerrank.com/certificates/3ed8b622b518" },
      { title: "Level 200: Building a Planning Solution in Board", issuer: "Board", date: "Apr 2025 - Present", url: "http://verify.skilljar.com/c/r4nnzmvz7i3k" },
      { title: "Level 100: Foundations of Building in Board", issuer: "Board", date: "Mar 2025 - Present", url: "http://verify.skilljar.com/c/u9rxb2czmur3" },
      { title: "MotionBoard Expert", issuer: "MotionBoard", date: "Aug 2024 - Aug 2027", url: "https://mycourse.app/LCpMq2f98M8cvxzp9" },
      { title: "MotionBoard Professional", issuer: "MotionBoard", date: "Nov 2023 - Nov 2026", url: "https://mycourse.app/4wQA5Df2Q6pVw9m2A" },
      { title: "CSS", issuer: "HackerRank", date: "Dec 2022 - Present", url: "https://www.hackerrank.com/certificates/571ab7ed3393" },
      { title: "Javascript (Intermediate)", issuer: "HackerRank", date: "Dec 2022 - Present", url: "https://www.hackerrank.com/certificates/2e24d95c62e0" },
      { title: "Javascript (Basic)", issuer: "HackerRank", date: "Dec 2022 - Present", url: "https://www.hackerrank.com/certificates/9f62694ff66a" },
      { title: "Problem Solving (Intermediate)", issuer: "HackerRank", date: "Oct 2022 - Present", url: "https://www.hackerrank.com/certificates/954b4c15ecaf" },
      { title: "Problem Solving (Basic)", issuer: "HackerRank", date: "Oct 2022 - Present", url: "https://www.hackerrank.com/certificates/6fae76fe8e78" },
      { title: "Rest API (Intermediate)", issuer: "HackerRank", date: "Oct 2022 - Present", url: "https://www.hackerrank.com/certificates/38d3ecdf88dd" },
      { title: "Teknologi Baru Android di Google I/O 2021 Certificate", issuer: "Dicoding Indonesia", date: "Jun 2021 - Present", url: "" },
      { title: "Sertifikasi Kompetensi Bahasa Inggris", issuer: "LSK-BIG", date: "Mar 2014 - Present", url: "" },
      { title: "Foresec Certified in Network Security", issuer: "ForeSec", date: "Jan 2019 - Present", url: "" },
    ],
    []
  );

  const certCarouselRef = React.useRef<HTMLDivElement | null>(null);
  const [certCurrentPage, setCertCurrentPage] = useState(0);
  const [certCardsPerPage, setCertCardsPerPage] = useState(1);
  const certCardWidth = 320;
  const certCardGap = 16;
  const certProgrammaticScrollRef = React.useRef(false);
  const certProgrammaticTimerRef = React.useRef<number | null>(null);
  const certAnimationFrameRef = React.useRef<number | null>(null);

  const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const computeCertPageOffsets = () => {
    const el = certCarouselRef.current;
    if (!el) return [] as number[];
    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-cert-card-index]"));
    const offsets: number[] = [];
    const pageCount = Math.max(1, Math.ceil(certifications.length / certCardsPerPage));
    for (let p = 0; p < pageCount; p++) {
      const firstIndex = p * certCardsPerPage;
      const card = cards[firstIndex];
      if (card) offsets.push(card.offsetLeft);
      else offsets.push(p * el.clientWidth);
    }
    return offsets;
  };

  const certSmoothScrollTo = (el: HTMLElement, targetLeft: number, duration = 500) => {
    if (certAnimationFrameRef.current) cancelAnimationFrame(certAnimationFrameRef.current);
    const startLeft = el.scrollLeft;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = easeInOutCubic(t);
      el.scrollLeft = Math.round(startLeft + (targetLeft - startLeft) * eased);
      if (t < 1) {
        certAnimationFrameRef.current = requestAnimationFrame(step);
      } else {
        certAnimationFrameRef.current = null;
        if (certProgrammaticTimerRef.current) {
          window.clearTimeout(certProgrammaticTimerRef.current);
          certProgrammaticTimerRef.current = null;
        }
        certProgrammaticScrollRef.current = false;
      }
    };
    certAnimationFrameRef.current = requestAnimationFrame(step);
  };

  React.useEffect(() => {
    const update = () => {
      const el = certCarouselRef.current;
      if (!el) return;
      const per = Math.max(1, Math.floor((el.clientWidth + certCardGap) / (certCardWidth + certCardGap)));
      setCertCardsPerPage(per);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  React.useEffect(() => {
    if (certCarouselRef.current) certCarouselRef.current.scrollTo({ left: 0 });
    setCertCurrentPage(0);
  }, [certifications.length]);

  const certPageCount = Math.max(1, Math.ceil(certifications.length / certCardsPerPage));

  const goToCertPage = (p: number) => {
    const el = certCarouselRef.current;
    if (!el) return;
    const page = ((p % certPageCount) + certPageCount) % certPageCount;
    const offsets = computeCertPageOffsets();
    const left = offsets[page] ?? page * el.clientWidth;
    certProgrammaticScrollRef.current = true;
    if (certProgrammaticTimerRef.current) window.clearTimeout(certProgrammaticTimerRef.current);
    certProgrammaticTimerRef.current = window.setTimeout(() => {
      certProgrammaticScrollRef.current = false;
      certProgrammaticTimerRef.current = null;
    }, 700);

    setCertCurrentPage(page);
    certSmoothScrollTo(el, left, 520);
  };

  const prevCertPage = () => goToCertPage(certCurrentPage - 1);
  const nextCertPage = () => goToCertPage(certCurrentPage + 1);

  React.useEffect(() => {
    const el = certCarouselRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      if (certProgrammaticScrollRef.current) return;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const center = el.scrollLeft + el.clientWidth / 2;
        const offsets = computeCertPageOffsets();
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
        const next = Math.max(0, Math.min(certPageCount - 1, closest));
        setCertCurrentPage(next);
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
      if (certProgrammaticTimerRef.current) {
        window.clearTimeout(certProgrammaticTimerRef.current);
        certProgrammaticTimerRef.current = null;
      }
    };
  }, [certifications.length, certPageCount]);

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

  const sectionIds = ["home", "clients", "projects", "products", "skills", "about", "experience", "certifications", "faq", "contact"];

  React.useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme") as "dark" | "light" | null;
    const initialTheme = savedTheme || "dark";
    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;

    let scrollFrame = 0;
    const updateScrollState = () => {
      scrollFrame = 0;
      const nextScrolled = window.scrollY > 50;
      setScrolled((current) => current === nextScrolled ? current : nextScrolled);
      let active = sectionIds[0];

      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (!section) continue;

        const { top } = section.getBoundingClientRect();
        if (top <= window.innerHeight * 0.3) {
          active = id;
        }
      }

      setActiveSection((current) => current === active ? current : active);
    };

    const handleScroll = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(updateScrollState);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
    };
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
      client: "PT. Zegen Solusi Mandiri",
      period: "Apr 2022–Nov 2022",
      relation: "Related with PT. Zegen Solusi Mandiri",
      description: "Developing UI Sales Management Apps Web Based using React.js & Next.js.",
      skills: ["REST APIs", "Agile Methodologies"],
    },
    {
      id: 8,
      title: "CRPRO NFT Stacking",
      client: "PT. Zegen Solusi Mandiri",
      period: "Jun 2022–Nov 2022",
      relation: "Related with PT. Zegen Solusi Mandiri",
      description: "Developed UI Cryptocurrency Investment Apps Web Based using React.js & Next.js.",
      skills: ["REST APIs", "Agile Methodologies"],
    },
    {
      id: 9,
      title: "SINOTIF",
      client: "PT. Zegen Solusi Mandiri",
      period: "Sep 2022–Nov 2022",
      relation: "Related with PT. Zegen Solusi Mandiri",
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

  const products = [
    {
      number: "01",
      name: "i-CashFlow",
      label: "FINANCE OPERATIONS",
      title: "One stop solution application for managing every outcome.",
      description:
        "A practical command center for keeping cash movement, business outcomes, and the decisions around them visible in one place.",
      url: "https://icashflow.ai.studio",
      visual: "cashflow",
      highlights: ["Cash visibility", "Outcome tracking"],
    },
    {
      number: "02",
      name: "Arakan",
      label: "MARKET INTELLIGENCE",
      title: "A clearer way to find your best entry, buy, and sell moments.",
      description:
        "A stock analysis workspace that turns market signals and price movement into focused context for more considered trading decisions.",
      url: "https://arakan.ai.studio",
      visual: "arakan",
      highlights: ["Stock analysis", "Entry signals"],
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
      company: "PT. Zegen Solusi Mandiri",
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

  const monthOrder: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  const careerStart = (period: string) => {
    const match = /^([A-Za-z]{3}) (\d{4})/.exec(period);
    if (!match || !(match[1] in monthOrder)) {
      throw new Error(`Invalid experience period: ${period}`);
    }
    return Number(match[2]) * 12 + monthOrder[match[1]];
  };
  const careerTimeline = [...experience].sort((a, b) => {
    const aIsFeatured = a.role === "Information Technology Developer";
    const bIsFeatured = b.role === "Information Technology Developer";
    if (aIsFeatured !== bIsFeatured) return aIsFeatured ? -1 : 1;
    return careerStart(b.period) - careerStart(a.period);
  });

  const navItems = [
    { id: "clients", label: "Clients" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Services" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),transparent_30%),radial-gradient(circle_at_80%_10%,_rgba(14,165,233,0.14),transparent_22%)] blur-3xl" />

      <nav className={`fixed inset-x-0 top-0 z-50 bg-transparent transition-all duration-300 ${scrolled ? 'backdrop-blur-xl border-b border-[var(--surface-border)] shadow-lg shadow-cyan-500/5' : ''}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <a href="#home" onClick={() => { setActiveSection('home'); setMobileNavOpen(false); document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }); }} className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface)] text-sm font-semibold uppercase tracking-[0.24em] text-[var(--foreground)] shadow-sm shadow-white/5">
                <img
                    className = "rounded-full"
                    src="/profile-photo.jpg"
                    alt="Ilham Maulana Habibie"
                    width={48}
                    height={48}
                    loading="lazy"
                    decoding="async"
                  />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-semibold tracking-tight text-[var(--foreground)]">IMAHA7</span>
              </div>
            </a>
            <div className="hidden lg:flex items-center gap-7 ml-6">
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
            <a
              href="https://api.whatsapp.com/send?phone=6283194310725&text=Hi%20Ilham%2C%20I%20would%20like%20to%20discuss%20a%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface)]/90 transition-all duration-300"
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
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface)]/90 transition-all duration-300"
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
              className="ml-2 inline-flex items-center rounded-md bg-[var(--surface)] p-2 text-[var(--foreground)] hover:bg-[var(--surface)] transition-all duration-300 lg:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileNavOpen}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>
        <div className={`absolute inset-x-0 top-full bg-[var(--surface)] border-t border-[var(--surface-border)] overflow-hidden transition-all duration-300 lg:hidden ${mobileNavOpen ? 'max-h-120 py-4 opacity-100' : 'max-h-0 py-0 opacity-0'}`}>
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

      <main className="relative">
        {/* SEO-only keywords block (kept visually hidden, still crawlable) */}
        <div className="sr-only" aria-hidden="false">
          imaha7 profile. Ilham Maulana Habibie. Ilham Software Engineer. Full Stack Developer.
          BI Specialist. React Next.js TypeScript Tailwind Node.js MotionBoard dashboards.
          Laravel Vue.js React Native Kotlin Android REST APIs SQL InfluxQL OracleQL.
          MotionBoard Expert Certified. JavaScript Intermediate. REST API Intermediate.
          Network Security. Project Management. English proficiency. Jakarta developer.
          GitHub: https://github.com/imaha7. LinkedIn: https://www.linkedin.com/in/imaha7.
        </div>

        <section id="home" className="px-4">
          <div className="hero-layout mx-auto max-w-7xl">
            <div className="hero-copy">
              <p className="hero-kicker"><span /> FULL STACK DEVELOPER <b>·</b> BI SPECIALIST</p>
              <div className="space-y-5">{heroHeading}</div>
              <div className="hero-intro">
                <span>Jakarta, Indonesia</span>
                <p>From the first sketch to the final dashboard, I turn complex ideas and data into digital products people love to use.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a href="#projects" className="hero-button hero-button--primary">
                  Explore my work <span aria-hidden="true">↗</span>
                </a>
                <a href="mailto:ilham.maulana.07.0698@gmail.com" className="hero-button hero-button--secondary">
                  Let’s connect
                </a>
              </div>
            </div>
            <div className="hero-visual">
              <DashboardArtwork />
              <div className="hero-stat hero-stat--hours"><strong>6+</strong><span>Years of<br />experience</span></div>
              <div className="hero-stat hero-stat--projects"><strong>12+</strong><span>Featured<br />projects</span></div>
              <div className="hero-stat hero-stat--clients"><strong>5</strong><span>Trusted<br />clients</span></div>
              <div className="hero-visual-caption"><span /> Turning data into direction</div>
            </div>
          </div>
        </section>

        <section id="about" className="pt-10 pb-20 px-4">
          <div className="mx-auto max-w-6xl rounded-[2rem] border border-[var(--surface-border)] bg-[var(--surface)] p-10 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.75)] backdrop-blur-xl">
            <div className="about-heading">
              <span className="section-eyebrow">A LITTLE ABOUT ME</span>
              <h2>About me</h2>
              <p>Building intuitive digital products through thoughtful engineering and collaboration.</p>
            </div>
            <div className="about-layout">
              <aside className="about-profile">
                <div className="about-profile__portrait">
                  <img
                    src="/profile-photo.jpg"
                    alt="Ilham Maulana Habibie"
                    width={400}
                    height={400}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <span className="about-availability text-lg font-medium"><i /> Jakarta, Indonesia</span>
                <h3>Ilham Maulana Habibie, B.Sc</h3>
                <p className="text-lg font-medium">Full Stack Developer<br />&amp; BI Specialist</p>
                <div className="about-socials">
                  <a href="https://github.com/imaha7" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.68-3.76-1.32-3.76-1.32-.5-1.3-1.24-1.65-1.24-1.65-1.01-.7.08-.69.08-.69 1.12.08 1.71 1.15 1.71 1.15 1 1.7 2.61 1.21 3.25.93.1-.72.39-1.21.71-1.49-2.47-.28-5.06-1.24-5.06-5.5 0-1.22.44-2.21 1.15-2.99-.12-.28-.5-1.42.11-2.95 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.05-1.14 3.05-1.14.61 1.53.23 2.67.11 2.95.72.78 1.15 1.77 1.15 2.99 0 4.27-2.6 5.22-5.08 5.49.4.35.76 1.02.76 2.06v3.07c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
                    </svg>
                  </a>
                  <a href="https://www.linkedin.com/in/imaha7" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a>
                  <a href="mailto:ilham.maulana.07.0698@gmail.com" aria-label="Email">✉</a>
                </div>
                <a href="mailto:ilham.maulana.07.0698@gmail.com" className="hero-button hero-button--primary">Let’s connect</a>
              </aside>
              <div className="about-details">
                <article className="about-panel">
                  <h3>Hi, I&apos;m Ilham.</h3>
                  <p className="text-lg font-medium">I&apos;m a software engineer with 6+ years of experience building web and mobile applications, enterprise dashboards, and data visualizations that solve real business challenges.</p>
                  <p className="text-lg font-medium">I hold a Bachelor of Computer Science from Mikroskil University with Magna Cum Laude honors. I combine frontend design, backend architecture, mobile development, and BI to deliver useful products for manufacturing, finance, and enterprise teams.</p>
                </article>
                <article className="about-panel about-stack">
                  <h3>My tech stack:</h3>
                  <div>
                    {["React", "Next.js", "TypeScript", "Node.js", "MotionBoard", "SQL", "React Native", "Kotlin"].map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </article>
                <article className="about-panel about-highlights text-lg font-medium">
                  <h3>Career highlights</h3>
                  <div><span>Information Technology Developer</span><b>PT. Sazanka Henig Solusi</b><time>2023 — Now</time></div>
                  <div><span>Frontend &amp; Mobile Engineer</span><b>Ogloba Ltd.</b><time>2022 — 2023</time></div>
                  <div><span>Frontend Developer</span><b>PT. Zegen Solusi Mandiri</b><time>2022</time></div>
                </article>
              </div>
            </div>
            <div className="resume-card">
              <div>
                <span className="section-eyebrow">ABOUT / RESUME</span>
                <h3>Want the full story?</h3>
                <p>Download my resume for a closer look at my work and experience.</p>
              </div>
              <div className="resume-card__actions">
                <button
                  type="button"
                  className="hero-button hero-button--secondary"
                  onClick={() => resumeDialogRef.current?.showModal()}
                >
                  Preview resume
                </button>
                <a href="/Ilham_Resume.pdf" download="Ilham_Resume.pdf" className="hero-button hero-button--primary">
                  Download resume <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>
            <dialog
              ref={resumeDialogRef}
              className="resume-preview-dialog"
              aria-labelledby="resume-preview-title"
              onCancel={(event) => {
                event.preventDefault();
                closeResumePreview();
              }}
              onClick={(event) => {
                if (event.target === event.currentTarget) closeResumePreview();
              }}
            >
              <div className="resume-preview-dialog__header">
                <h2 id="resume-preview-title">Resume Preview</h2>
                <button
                  type="button"
                  className="resume-preview-dialog__close"
                  aria-label="Close resume preview"
                  onClick={closeResumePreview}
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6 6l12 12M18 6 6 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
              <iframe src="/Ilham_Resume.pdf" title="Ilham Maulana Habibie resume" />
            </dialog>
          </div>
        </section>

        <section id="skills" className="py-20 px-4">
          <div className="mx-auto max-w-6xl">
            <div className="section-heading">
              <span className="section-eyebrow">WHAT I DO</span>
              <h2>Services & expertise</h2>
              <p>Thoughtful engineering across web, mobile, and business intelligence.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {skills.map((skillGroup, index) => (
                <div key={skillGroup.category} className="service-card rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 transition hover:border-cyan-400/50">
                  <span className="service-card__index">0{index + 1}</span>
                  <h3 className="mb-4 text-xl font-semibold text-[var(--foreground)]">{skillGroup.category}</h3>
                  <p className="service-card__description">
                    {skillGroup.category === "Frontend"
                      ? "Fast, accessible web experiences built around real user needs."
                      : skillGroup.category === "Backend & Data"
                        ? "Reliable systems and clear data products that support better decisions."
                        : "Connected mobile and cloud solutions that work wherever people do."}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items.map((item) => (
                      <span key={item} className="skill-tag">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="certifications" className="py-20 px-4">
          <div className="mx-auto max-w-6xl">
            <div className="section-heading">
              <span className="section-eyebrow">ALWAYS LEARNING</span>
              <h2>Selected certifications</h2>
              <p>Credentials and continued learning across data, software, and product development.</p>
            </div>

            <div className="rounded-[2rem] border border-[var(--surface-border)] bg-[var(--surface)] p-6 shadow-[0_20px_80px_-45px_rgba(14,165,233,0.35)]">
              <div className="relative">
                <div className="absolute left-2 top-1/2 z-20 -translate-y-1/2">
                  <button
                    type="button"
                    onClick={prevCertPage}
                    className="rounded-full bg-[var(--surface)]/90 p-2 text-[var(--foreground)] shadow-sm hover:bg-[var(--surface)]"
                    aria-label="Previous certifications"
                  >
                    ‹
                  </button>
                </div>
                <div className="absolute right-2 top-1/2 z-20 -translate-y-1/2">
                  <button
                    type="button"
                    onClick={nextCertPage}
                    className="rounded-full bg-[var(--surface)]/90 p-2 text-[var(--foreground)] shadow-sm hover:bg-[var(--surface)]"
                    aria-label="Next certifications"
                  >
                    ›
                  </button>
                </div>

                <div
                  ref={certCarouselRef}
                  className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 px-2"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  {certifications.map((cert, index) => (
                    <div key={`${cert.title}-${index}`} data-cert-card-index={index} className="shrink-0 w-[320px] snap-start">
                      <article className="flex h-full flex-col justify-between gap-3 rounded-xl border border-[var(--surface-border)] bg-[var(--background)] p-5 shadow-sm">
                        <div>
                          <h3 className="text-sm font-semibold text-[var(--foreground)]">{cert.title}</h3>
                          <div className="mt-2 flex items-center gap-5">
                            <p className="text-xs text-[var(--muted)]">{cert.issuer}</p>
                            <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[0.6rem] font-semibold text-[var(--brand-text)]">
                              {cert.date}
                            </div>
                          </div>
                        </div>
                        {cert.url ? (
                          <a
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center text-xs font-semibold text-[var(--brand-text)] hover:underline"
                          >
                            View certificate →
                          </a>
                        ) : (
                          <div className="mt-2 text-xs text-[var(--muted)]">Preview Not Available</div>
                        )}
                      </article>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="clients" className="py-20 px-4">
          <div className="mx-auto max-w-6xl">
            <div className="trust-heading">
              <span className="section-eyebrow">GOOD COMPANY</span>
              <h2>Trusted by teams at</h2>
            </div>
            {/* Auto-scrolling client logos */}
            <ClientLogoMarquee />
          </div>
        </section>

        <section id="projects" className="py-20 px-4 bg-[var(--surface)]">
          <div className="mx-auto max-w-6xl">
            <div className="section-heading">
              <span className="section-eyebrow">SELECTED WORK · 2019—{currentYear}</span>
              <h2>Recent projects</h2>
              <p>A selection of products, platforms, and data experiences built with ambitious teams.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="project-card group overflow-hidden rounded-[1.5rem] border border-[var(--surface-border)] bg-[var(--surface)] transition hover:-translate-y-1 hover:border-cyan-400/30"
                >
                  <ProjectArtwork id={project.id} title={project.title} client={project.client} skill={project.skills[0] ?? "PROJECT HIGHLIGHT"} />
                  <div className="project-card__body p-6">
                    <div className="project-meta"><span>{project.client}</span><span>{project.period}</span></div>
                    <h3 className="text-xl font-semibold text-[var(--foreground)]">{project.title}</h3>
                    <p className="text-[var(--muted)] text-sm">{project.description}</p>
                    {project.skills && project.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.skills.map((s) => (
                          <span key={s} className="skill-tag">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="products" className="overflow-hidden bg-[var(--surface)] px-4 py-24 text-[var(--foreground)] sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="section-heading section-heading--left">
              <span className="section-eyebrow">PRODUCTS IN THE WILD</span>
              <h2>Products I’m building</h2>
              <p>Independent products bringing useful, focused tools to finance and market research.</p>
            </div>

            <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-5 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0">
              {products.map((product) => (
                <article
                  key={product.name}
                  className="group relative flex min-h-[520px] w-[min(86vw,760px)] shrink-0 snap-start flex-col overflow-hidden border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--foreground)] transition duration-500 hover:border-white/50 sm:min-h-[540px] sm:flex-row"
                >
                  <div className="product-art relative min-h-[230px] overflow-hidden bg-[var(--product-preview)] sm:min-h-0 sm:w-[42%]">
                    <iframe
                      src={product.url}
                      title={`${product.name} product preview`}
                      loading="lazy"
                      tabIndex={-1}
                      className="product-preview-frame pointer-events-none h-full min-h-[230px] w-full border-0 sm:min-h-0"
                    />
                    <div className="product-preview-overlay" />
                    <span className="absolute bottom-6 left-8 text-[0.62rem] font-semibold uppercase tracking-[0.25em] text-white/80">Product preview</span>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-7 sm:p-10">
                    <div>
                      <div className="mb-10 flex items-center justify-between gap-4 text-[0.6rem] uppercase tracking-[0.3em] text-[var(--product-ink-soft)]">
                        <span>{product.label}</span>
                        <span className="border border-[var(--product-ink)]/20 px-2 py-1">Running</span>
                      </div>
                      <h3 className="max-w-md text-4xl font-semibold uppercase leading-[0.92] tracking-[-0.045em] sm:text-5xl">{product.name}</h3>
                      <p className="mt-5 max-w-md text-lg font-medium leading-tight text-[var(--product-ink)]/85">{product.title}</p>
                      <p className="mt-5 max-w-md text-sm leading-6 text-[var(--product-ink-soft)]">{product.description}</p>
                    </div>
                    <div className="mt-12">
                      <p className="mb-3 text-[0.6rem] uppercase tracking-[0.3em] text-[var(--product-ink)]/45">Focus areas</p>
                      <div className="grid grid-cols-2 border-y border-[var(--product-ink)]/15 py-4 text-[0.63rem] font-semibold uppercase tracking-[0.12em]">
                        {product.highlights.map((highlight, index) => <span key={highlight}>{String(index + 1).padStart(2, "0")} &nbsp; {highlight}</span>)}
                      </div>
                      <a href={product.url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] transition group-hover:gap-5">
                        Visit product <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </div>
                  <span className="absolute right-5 top-5 text-2xl font-semibold tracking-[-0.05em] text-[var(--product-ink)]/75">{product.number}</span>
                </article>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-[0.6rem] uppercase tracking-[0.3em] text-[var(--muted)]">
              <span>02 products / ongoing</span>
              <span>Scroll to explore</span>
            </div>
          </div>
        </section>

        <section id="experience" className="py-20 px-4">
          <div className="mx-auto max-w-5xl">
            <div className="section-heading">
              <span className="section-eyebrow">THE JOURNEY SO FAR</span>
              <h2>Experience</h2>
              <p>A few milestones that shaped the way I build and collaborate.</p>
            </div>
            <div className="career-timeline">
              {careerTimeline.map((exp, index) => (
                <article key={`${exp.company}-${exp.role}`} className="career-step">
                  <div className="career-step__marker"><span>{String(index + 1).padStart(2, "0")}</span></div>
                  <div className="career-step__card">
                    <div className="career-step__meta"><span>{exp.period}</span><span>{exp.company}</span></div>
                    <h3>{exp.role}</h3>
                    <p>{exp.description}</p>
                    <div className="career-step__skills">
                      {(exp.details?.[exp.details.length - 1]?.startsWith("Skills:")
                        ? exp.details[exp.details.length - 1]?.replace("Skills:", "").split(",").slice(0, 3)
                        : ["Product development", "Collaboration"]
                      )?.map((skill) => <span key={skill}>{skill.trim()}</span>)}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="px-4">
          <div className="faq-layout mx-auto max-w-5xl">
            <div className="section-heading">
              <span className="section-eyebrow">A FEW QUICK ANSWERS</span>
              <h2>Frequently asked</h2>
            </div>
            <div className="faq-list">
              <details>
                <summary>What kind of projects do you work on?<span>+</span></summary>
                <p>I build web and mobile applications, enterprise dashboards, and business intelligence solutions for teams that need clearer workflows and better data visibility.</p>
              </details>
              <details>
                <summary>Which technologies do you work with?<span>+</span></summary>
                <p>My toolkit includes React, Next.js, TypeScript, Node.js, Vue.js, Laravel, React Native, Kotlin, SQL, and MotionBoard.</p>
              </details>
              <details>
                <summary>Are you available for new opportunities?<span>+</span></summary>
                <p>I’m open to discussing web, dashboard, mobile, and BI projects. Send me a short note about what you’re planning.</p>
              </details>
              <details>
                <summary>How can we get started?<span>+</span></summary>
                <p>Email me with a little context about your goals, timeline, and team. I’ll get back to you to talk through next steps.</p>
              </details>
            </div>
          </div>
        </section>

        <section id="contact" className="px-4">
          <div className="contact-banner mx-auto max-w-6xl">
            <span className="section-eyebrow">HAVE A PROJECT IN MIND?</span>
            <h2>Your vision, my expertise.<br />Let’s build something <em>meaningful.</em></h2>
            <p>Let’s talk about the web, data, or product challenge you’re working through.</p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href="mailto:ilham.maulana.07.0698@gmail.com"
                className="hero-button hero-button--primary"
              >
                Start a conversation <span aria-hidden="true">↗</span>
              </a>
              <a
                href="https://www.linkedin.com/in/imaha7"
                target="_blank"
                rel="noopener noreferrer"
                className="hero-button hero-button--secondary"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/imaha7"
                target="_blank"
                rel="noopener noreferrer"
                className="hero-button hero-button--secondary"
              >
                GitHub
              </a>
            </div>
          </div>
        </section>
        <DeferredSections />
      </main>

      <footer className="border-t border-[var(--surface-border)] mt-12 bg-[var(--surface)]/90">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_0.9fr] items-start">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-[var(--brand-text)]">Let&apos;s collaborate</p>
              <h2 className="mt-4 text-3xl font-semibold text-[var(--foreground)]">ILHAM MAULANA HABIBIE</h2>
              <p className="mt-4 max-w-xl text-[var(--muted)]">Available for BI, dashboard, and web application projects. Send an email to start a clear, fast conversation about your next digital product.</p>
            </div>
            <div className="rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Email</p>
              <a href="mailto:ilham.maulana.07.0698@gmail.com" className="mt-3 block text-lg font-semibold text-[var(--foreground)] hover:text-[var(--brand-text)]">ilham.maulana.07.0698@gmail.com</a>
              <p className="mt-4 text-sm text-[var(--muted)]">Jakarta, Indonesia</p>
            </div>
          </div>
          <VisitorCounter />
          <div className="mt-6 border-t border-[var(--surface-border)] pt-6 text-center text-sm text-[var(--muted)]">© {currentYear} Ilham Maulana Habibie. All rights reserved.</div>
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
