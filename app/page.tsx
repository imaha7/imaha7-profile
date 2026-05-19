"use client";

import React, { useState } from "react";

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const currentYear = new Date().getFullYear();

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
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
    { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vue.js"] },
    { category: "Backend", items: ["Node.js", "Express", "PostgreSQL", "MongoDB", "Firebase"] },
    { category: "Tools", items: ["Git", "Docker", "AWS", "Vercel", "CI/CD"] },
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

  const navItems = ["home", "about", "projects", "experience", "contact"];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020817] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),transparent_30%),radial-gradient(circle_at_80%_10%,_rgba(14,165,233,0.14),transparent_22%)] blur-3xl" />

      <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/95 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-cyan-500/5' : 'bg-transparent'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <a href="#home" onClick={() => { setActiveSection('home'); document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }); }} className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold uppercase tracking-[0.24em] text-slate-100 shadow-sm shadow-white/5">
                I
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-semibold tracking-tight text-white">IMAHA</span>
                <span className="text-[0.65rem] uppercase tracking-[0.24em] text-slate-400">Profile</span>
              </div>
            </a>
            <div className="hidden lg:flex items-center gap-8 ml-6">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => { setActiveSection(item); document.getElementById(item)?.scrollIntoView({ behavior: 'smooth' }); }}
                  className={`relative capitalize text-sm font-medium transition-all duration-300 py-1 ${activeSection === item ? 'text-cyan-300' : 'text-slate-300 hover:text-white'}`}
                >
                  {item}
                  <span className={`absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-300 ${activeSection === item ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a href="#projects" className="hidden md:inline-flex items-center rounded-md bg-gradient-to-r from-cyan-500 to-indigo-500 px-5 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105">
              View Projects
            </a>
            <a href="mailto:ilham.maulana.07.0698@gmail.com" className="inline-flex items-center rounded-md border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/5 hover:border-white/20 transition-all duration-300">
              Contact
            </a>
            <button className="ml-2 inline-flex items-center rounded-md bg-white/6 p-2 text-slate-200 hover:bg-white/10 hover:scale-110 transition-all duration-300 md:hidden" aria-label="Open email">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
        <div className={`absolute inset-x-0 top-full h-1 bg-gradient-to-r from-cyan-500 to-indigo-500 transition-opacity duration-500 ${scrolled ? 'opacity-30' : 'opacity-20'}`} />
      </nav>

      <main className="relative pt-32">
        <section id="home" className="pb-32 px-4 pt-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-16 lg:grid-cols-2 items-center">
              <div className="space-y-10">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-cyan-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    Full Stack Developer & BI Specialist
                  </div>
                  <h1 className="text-6xl sm:text-7xl font-bold leading-tight text-white">
                    Hi, I’m Ilham Maulana Habibie.
                  </h1>
                  <p className="text-xl text-slate-300 leading-relaxed max-w-lg">
                    Bachelor of Computer Science from Mikroskil University. I create premium web applications, intelligent dashboards, and scalable BI solutions for enterprise clients.
                  </p>
                  <p className="text-base text-cyan-200 leading-relaxed max-w-lg">
                    Contact Number: +62 831 9431 0725
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
                    className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                  >
                    Get In Touch
                  </a>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                  {[
                    { num: '12+', label: 'Projects' },
                    { num: '6+', label: 'Years' },
                    { num: '5+', label: 'Companies' },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="text-3xl font-bold text-cyan-400">{stat.num}</div>
                      <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 rounded-3xl blur-3xl" />
                <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl border border-white/10 p-8 backdrop-blur-xl">
                  <div className="space-y-8">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-3">Current Focus</p>
                      <h3 className="text-2xl font-bold text-white mb-2">Dashboard Visualization</h3>
                      <p className="text-slate-300">Data-driven insights for enterprise clients using MotionBoard and InfluxQL.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Frontend', value: 'React, Next.js, Vue.js' },
                        { label: 'Backend', value: 'Node.js, Laravel, Express' },
                        { label: 'Data', value: 'BI, Dashboards, SQL' },
                        { label: 'Mobile', value: 'React Native, Kotlin' },
                      ].map((item) => (
                        <div key={item.label} className="rounded-2xl border border-white/10 bg-white/3 p-4">
                          <p className="text-[0.7rem] uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                          <p className="text-sm font-semibold text-slate-100 mt-2">{item.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-xs text-slate-400 mb-3">Recent Clients</p>
                      <div className="flex flex-wrap gap-2">
                        {['PT. Astra Honda Motor', 'Ogloba Ltd.', 'Zegen Solusi Mandiri'].map((client) => (
                          <span key={client} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-200 border border-cyan-500/20">
                            {client}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-20 px-4">
          <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.75)] backdrop-blur-xl">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_0.9fr] items-center">
              <div>
                <h2 className="text-4xl font-bold mb-8 text-white">About Me</h2>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  I'm a passionate full-stack developer with 6+ years of experience building web applications that solve real-world problems. I love combining clean code with intuitive user experiences.
                </p>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  My journey in tech started with curiosity about how things work. Today, I specialize in building scalable, performant applications using modern technologies like React, Next.js, and Node.js.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  When I'm not coding, you can find me contributing to open source, writing technical blogs, or exploring new technologies.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Projects Completed', value: '50+' },
                  { label: 'Years Experience', value: '6+' },
                  { label: 'Happy Clients', value: '30+' },
                  { label: 'Tech Stack', value: '15+' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
                    <div className="text-sm text-slate-400">{stat.label}</div>
                    <div className="mt-2 text-3xl font-semibold text-cyan-300">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="py-20 px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-4xl font-bold mb-12 text-center text-white">Skills & Expertise</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {skills.map((skillGroup) => (
                <div key={skillGroup.category} className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 transition hover:border-cyan-400/50">
                  <h3 className="mb-4 text-xl font-semibold text-cyan-300">{skillGroup.category}</h3>
                  <div className="space-y-3">
                    {skillGroup.items.map((item) => (
                      <div key={item} className="flex items-center gap-3 text-slate-300">
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

        <section id="projects" className="py-20 px-4 bg-slate-900/50">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-4xl font-bold mb-12 text-center text-white">Featured Projects</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/80 shadow-[0_20px_80px_-45px_rgba(14,165,233,0.5)] transition hover:-translate-y-1 hover:border-cyan-400/30"
                >
                  <div className="flex h-36 items-center justify-center bg-gradient-to-br from-blue-500/10 to-cyan-500/8 transition group-hover:from-blue-500/20 group-hover:to-cyan-500/16">
                    <div className="text-center">
                      <div className="text-sm font-medium text-slate-300">{project.client}</div>
                      <div className="mt-2 text-4xl font-semibold text-slate-500 opacity-20 group-hover:opacity-30">→</div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                    <div className="mt-2 text-xs text-slate-400">{project.period}</div>
                    <div className="text-xs text-slate-400 mb-3">{project.relation}</div>
                    <p className="text-slate-300 text-sm mb-3">{project.description}</p>
                    {project.skills && project.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.skills.map((s) => (
                          <span key={s} className="rounded-full bg-cyan-500/12 px-3 py-1 text-xs font-medium text-cyan-200">
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
            <h2 className="text-4xl font-bold mb-12 text-center text-white">Experience</h2>
            <div className="space-y-8">
              {experience.map((exp) => (
                <div key={exp.role} className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-6 shadow-[0_20px_80px_-45px_rgba(14,165,233,0.4)]">
                  <div className="absolute top-6 left-0 h-20 w-1 rounded-tr-full rounded-br-full bg-gradient-to-b from-cyan-400 to-transparent" />
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold text-cyan-300">{exp.role}</h3>
                    <p className="text-sm text-slate-400 mt-1">{exp.company}</p>
                    <p className="text-xs text-slate-500 mt-2">{exp.period}</p>
                    {exp.details ? (
                      <ul className="mt-4 list-disc list-inside text-slate-300 space-y-2">
                        {exp.details.map((d, i) => (
                          <li key={i} className="text-sm">
                            {d}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-slate-300 mt-4">{exp.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-20 px-4 bg-slate-900/50">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold mb-6 text-white">Get In Touch</h2>
            <p className="text-xl text-slate-300 mb-12">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <a
                href="mailto:ilham.maulana.07.0698@gmail.com"
                className="rounded-full bg-cyan-500 px-8 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Email Me
              </a>
              <a
                href="https://www.linkedin.com/in/imaha7"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-cyan-400/50 px-8 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/10"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/8 mt-12 bg-slate-950/90">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_0.9fr] items-start">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-cyan-400">Let's collaborate</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">Powerful solutions with premium delivery.</h2>
              <p className="mt-4 max-w-xl text-slate-400">Available for BI, dashboard, and web application projects. Send an email to start a clear, fast conversation about your next digital product.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Email</p>
              <a href="mailto:ilham.maulana.07.0698@gmail.com" className="mt-3 block text-lg font-semibold text-white hover:text-cyan-300">ilham.maulana.07.0698@gmail.com</a>
              <p className="mt-4 text-sm text-slate-400">Jakarta, Indonesia</p>
            </div>
          </div>
          <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-slate-500">© {currentYear} Ilham Maulana Habibie. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
