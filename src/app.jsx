import React, { useState, useEffect, useContext, createContext } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Code2,
  Terminal,
  Cpu,
  Globe,
  Moon,
  Sun,
  Menu,
  X,
  ChevronDown,
  Send,
  Sparkles,
  Loader2,
  Wand2,
  CheckCircle2,
  AlertCircle,
  FileText,
  MapPin,
  Heart
} from 'lucide-react';

// --- Global Constants (Data) ---

const NAV_LINKS = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

const SKILLS_DATA = [
  {
    icon: Globe,
    title: "Frontend",
    skills: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Redux', 'HTML5/CSS3']
  },
  {
    icon: Terminal,
    title: "Backend",
    skills: ['Node.js', 'Express', 'Python', 'PostgreSQL', 'MongoDB', 'REST APIs']
  },
  {
    icon: Cpu,
    title: "Tools & DevOps",
    skills: ['Git', 'Docker', 'AWS', 'Vercel', 'Figma', 'Jest']
  }
];

const PROJECTS_DATA = [
  {
    title: "E-Commerce Dashboard",
    description: "A comprehensive admin dashboard for managing products, orders, and analytics with real-time data visualization.",
    tags: ['React', 'Chart.js', 'Node.js'],
    color: "bg-gradient-to-br from-blue-600 to-cyan-500"
  },
  {
    title: "AI Task Manager",
    description: "Smart productivity app that uses AI to categorize and prioritize tasks automatically for teams.",
    tags: ['Next.js', 'OpenAI API', 'Tailwind'],
    color: "bg-gradient-to-br from-purple-600 to-indigo-600"
  },
  {
    title: "Social Media App",
    description: "A real-time social platform featuring stories, posts, and instant messaging capabilities.",
    tags: ['TypeScript', 'Firebase', 'Redux'],
    color: "bg-gradient-to-br from-orange-500 to-pink-600"
  }
];

// --- Configuration & Services ---

// --- Configuration & Services ---

// 1. Get the key from your .env file for local testing
const LOCAL_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const AIService = {
  getMockResponse: (prompt) => {
    if (prompt.includes("Technical Deep Dive")) {
      return "Built with a microservices architecture to ensure high availability. Utilized server-side caching and edge functions to reduce latency by 40%, ensuring a seamless user experience under high load.";
    }
    if (prompt.includes("rewrite") || prompt.includes("polite")) {
      return "Thank you for your interest. I would love to hear more about this and discuss how we can collaborate.";
    }
    return "System Note: AI service temporarily unavailable. Displaying demo content.";
  },

  generate: async (prompt, systemContext = '') => {
    // 2. LOGIC: Determine if we should use Local Key or Server Route
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    // METHOD A: Local Direct Call (Uses your .env file)
    if (isLocal && LOCAL_API_KEY) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${LOCAL_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: `${systemContext}\n\n${prompt}` }] }]
            })
          }
        );
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text?.replace(/^"|"$/g, '').trim() || null;
      } catch (error) {
        console.warn("Local AI Failed, falling back to mock.", error);
        return AIService.getMockResponse(prompt);
      }
    }

    // METHOD B: Production Server Call (Uses api/generate.js)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${systemContext}\n\n${prompt}`
        })
      });

      if (!response.ok) throw new Error('API Error');

      const data = await response.json();
      let text = data.candidates?.[0]?.content?.parts?.[0]?.text || null;

      if (text) text = text.replace(/^"|"$/g, '').trim();
      return text;

    } catch (error) {
      console.warn("Production AI Service Failed (using mock):", error);
      return AIService.getMockResponse(prompt);
    }
  }
};

// --- Contexts ---

const ThemeContext = createContext();
const ToastContext = createContext();

const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true);
  const toggleTheme = () => setDarkMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <div className={darkMode ? 'dark' : ''}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transform transition-all animate-in slide-in-from-right fade-in duration-300 pointer-events-auto ${
              toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// --- Custom Hooks ---

const useTheme = () => useContext(ThemeContext);
const useToast = () => useContext(ToastContext);

const useScroll = (threshold = 20) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let tick = false;
    const handleScroll = () => {
      if (!tick) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > threshold);
          tick = false;
        });
        tick = true;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return scrolled;
};

// --- Sub-Components ---

const Navbar = () => {
  const { darkMode, toggleTheme } = useTheme();
  const scrolled = useScroll();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      setIsOpen(false);
      setTimeout(() => {
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }, 300);
    }
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled
        ? (darkMode ? 'bg-slate-900/90 backdrop-blur-md shadow-md border-b border-slate-800' : 'bg-white/90 backdrop-blur-md shadow-sm')
        : 'bg-transparent py-4'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 cursor-pointer group z-50 relative" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className={`text-2xl font-bold tracking-tighter transition-colors ${
              darkMode ? 'text-white group-hover:text-indigo-400' : 'text-slate-900 group-hover:text-indigo-600'
            }`}>
              Abdala<span className="text-indigo-500">.Farah</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`text-sm font-medium transition-colors hover:text-indigo-500 ${
                  darkMode ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all hover:scale-110 ${
                darkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
              }`}
              aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-4 z-50 relative">
             <button onClick={toggleTheme} className={`transition-colors ${darkMode ? 'text-yellow-400' : 'text-slate-600'}`}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md transition-colors ${
                darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-gray-100'
              }`}
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className={`fixed inset-0 z-40 flex flex-col items-center justify-center md:hidden animate-in fade-in duration-200 ${
          darkMode ? 'bg-slate-900/95' : 'bg-white/95'
        } backdrop-blur-xl`}>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="flex flex-col space-y-8 text-center relative z-10">
            {NAV_LINKS.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                style={{ animationDelay: `${index * 50}ms` }}
                className={`text-3xl font-bold tracking-tight animate-in slide-in-from-bottom-5 duration-500 ${
                  darkMode ? 'text-white hover:text-indigo-400' : 'text-slate-900 hover:text-indigo-600'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="absolute bottom-12 flex gap-8 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
             <SocialLink href="https://github.com/abdala101" icon={Github} label="Github" darkMode={darkMode} />
             <SocialLink href="https://linkedin.com/in/abdala-farah/" icon={Linkedin} label="LinkedIn" darkMode={darkMode} />
             <SocialLink href="mailto:abdalafarah2000@gmail.com" icon={Mail} label="Email" darkMode={darkMode} />
          </div>
        </div>
      )}
    </header>
  );
};

const Hero = () => {
  const { darkMode } = useTheme();

  return (
    <section className={`min-h-screen flex items-center py-28 relative overflow-hidden ${
      darkMode ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      <div className={`absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none`}>
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center lg:text-left space-y-8 animate-in slide-in-from-bottom-10 duration-700 fade-in">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold tracking-wide ${
              darkMode ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
            }`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Available for Hire
            </div>

            <h1 className={`text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Building digital <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x">
                experiences
              </span> that matter.
            </h1>

            <p className={`text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              I craft responsive websites and robust applications with modern technologies.
              Focused on clean code, pixel-perfect design, and seamless user interaction.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a href="#projects" className="px-8 py-4 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all hover:scale-105 shadow-lg shadow-indigo-500/25 w-full sm:w-auto text-center">
                View My Work
              </a>
              <a
                href="/Abdala_Farah_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={`px-8 py-4 rounded-full font-semibold border transition-all hover:scale-105 w-full sm:w-auto text-center flex items-center justify-center gap-2 ${
                    darkMode ? 'border-slate-700 text-white hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-white'
                }`}
              >
                <FileText size={20} />
                <span>Resume</span>
              </a>
            </div>

            <div className={`flex items-center justify-center lg:justify-start gap-6 pt-4 ${
              darkMode ? 'text-slate-500' : 'text-slate-400'
            }`}>
              <SocialLink href="https://github.com/abdala101" icon={Github} label="GitHub Profile" darkMode={darkMode} />
              <SocialLink href="https://linkedin.com/in/abdala-farah/" icon={Linkedin} label="LinkedIn Profile" darkMode={darkMode} />
              <SocialLink href="mailto:abdalafarah2000@gmail.com" icon={Mail} label="Email Contact" darkMode={darkMode} />
            </div>
          </div>

          <div className="flex-1 relative hidden lg:block">
            <div className={`relative z-10 w-full aspect-square rounded-2xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 ${
              darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border-2 border-slate-200 shadow-slate-300/50'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
              <div className="p-8 h-full flex flex-col justify-center select-none">
                  {/* Window Controls */}
                  <div className="flex gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>

                  {/* --- FIXED: RESTORED CODE VISUALS --- */}
                  <div className={`font-mono text-sm leading-relaxed ${darkMode ? 'bg-transparent' : 'bg-transparent'}`}>
                    <div className={darkMode ? 'text-purple-400' : 'text-purple-600'}>
                      const <span className={darkMode ? 'text-blue-400' : 'text-blue-600'}>developer</span> = {'{'}
                    </div>
                    <div className={`pl-6 ml-1 border-l ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                      <div className={darkMode ? 'text-slate-300' : 'text-slate-700'}>name: <span className="text-green-500">'Abdala'</span>,</div>
                      <div className={darkMode ? 'text-slate-300' : 'text-slate-700'}>role: <span className="text-green-500">'Full Stack Engineer'</span>,</div>
                      <div className={darkMode ? 'text-slate-300' : 'text-slate-700'}>skills: [<span className="text-green-500">'React', 'Node', 'AI'</span>],</div>
                      <div className={darkMode ? 'text-slate-300' : 'text-slate-700'}>hardWorker: <span className="text-orange-500">true</span></div>
                    </div>
                    <div className={darkMode ? 'text-purple-400' : 'text-purple-600'}>{'}'};</div>

                    {/* Restored Ghost Lines and Init Function */}
                    <div className={`mt-6 opacity-30 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                        <div className={darkMode ? 'text-purple-400' : 'text-purple-600'}>
                            const <span className={darkMode ? 'text-blue-400' : 'text-blue-600'}>init</span> = () ={'>'} {'{'}
                        </div>
                        <div className={`pl-6 ml-1 border-l ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                              <div><span className="text-blue-400">return</span> developer.start();</div>
                        </div>
                        <div className={darkMode ? 'text-purple-400' : 'text-purple-600'}>
                            {'}'};
                        </div>
                    </div>

                    <div className="mt-4 space-y-2 opacity-60">
                        <div className={`h-2 rounded w-3/4 ${darkMode ? 'bg-slate-700' : 'bg-slate-400'}`} />
                        <div className={`h-2 rounded w-1/2 ${darkMode ? 'bg-slate-700' : 'bg-slate-400'}`} />
                        <div className={`h-2 rounded w-5/6 ${darkMode ? 'bg-slate-700' : 'bg-slate-400'}`} />
                    </div>
                  </div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/20 blur-[100px] -z-10 rounded-full" />
          </div>
        </div>
      </div>

      <a
        href="#about"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        }}
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer z-20 transition-colors duration-300 hidden md:block ${
          darkMode ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-indigo-600'
        }`}
        aria-label="Scroll to About section"
      >
        <ChevronDown size={32} />
      </a>
    </section>
  );
};

const SocialLink = ({ href, icon: Icon, label, darkMode }) => (
  <a
    href={href}
    aria-label={label}
    className={`hover:-translate-y-1 transition-all duration-300 ${darkMode ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-500 hover:text-indigo-600'}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    <Icon size={24} />
  </a>
);

const SkillCard = ({ icon: Icon, title, skills }) => {
  const { darkMode } = useTheme();
  return (
    <article className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
      darkMode
        ? 'bg-slate-800/50 border-slate-700 hover:border-indigo-500/50'
        : 'bg-white border-slate-100 hover:border-indigo-100 shadow-lg shadow-slate-200/50'
    }`}>
      {/* --- FIXED: RESTORED TEXTURE --- */}
      <div className={`absolute inset-0 opacity-[0.03] pointer-events-none ${
         darkMode ? 'bg-[url("https://www.transparenttextures.com/patterns/cubes.png")] invert' : 'bg-[url("https://www.transparenttextures.com/patterns/cubes.png")]'
      }`}></div>
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>

      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
          darkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
        }`}>
          <Icon size={24} />
        </div>
        <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span key={skill} className={`text-sm px-3 py-1 rounded-full border transition-colors ${
              darkMode
                ? 'bg-slate-900 text-slate-300 border-slate-700 hover:border-indigo-500/50'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-200'
            }`}>
              {skill}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};

const ProjectCard = ({ title, description, tags, color }) => {
  const { darkMode } = useTheme();
  const { addToast } = useToast();
  const [insight, setInsight] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showInsight, setShowInsight] = useState(false);

  const handleGenerateInsight = async () => {
    if (insight) {
      setShowInsight(!showInsight);
      return;
    }
    setIsLoading(true);
    try {
      const prompt = `Write a short, exciting 40-word "Technical Deep Dive" for a project named "${title}".
      Description: "${description}". Tech stack: ${tags.join(', ')}.
      Focus on architectural decisions.`;

      const text = await AIService.generate(prompt);

      if (text) {
        setInsight(text);
        setShowInsight(true);
        addToast("Insight generated successfully!", "success");
      } else {
        addToast("Could not generate insight. Check connection.", "error");
      }
    } catch (err) {
      addToast("Failed to connect to AI service.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article className={`group rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-2 flex flex-col h-full relative ${
      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50'
    }`}>
      {/* --- FIXED: RESTORED TEXTURE --- */}
      <div className={`absolute inset-0 opacity-[0.03] pointer-events-none ${
         darkMode ? 'bg-[url("https://www.transparenttextures.com/patterns/cubes.png")] invert' : 'bg-[url("https://www.transparenttextures.com/patterns/cubes.png")]'
      }`}></div>
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>

      <div className={`h-48 w-full ${color} relative overflow-hidden flex-shrink-0 z-10`}>
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
        <div className="absolute bottom-4 left-4">
          <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg border border-white/20">
            <Globe className="text-white" size={20} />
          </div>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow relative z-10">
        <h3 className={`text-2xl font-bold mb-2 group-hover:text-indigo-500 transition-colors ${
          darkMode ? 'text-white' : 'text-slate-900'
        }`}>
          {title}
        </h3>
        <p className={`mb-4 line-clamp-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          {description}
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map(tag => (
            <span key={tag} className={`text-xs font-semibold px-2.5 py-1 rounded ${
              darkMode ? 'bg-slate-700 text-indigo-300' : 'bg-indigo-50 text-indigo-700'
            }`}>
              {tag}
            </span>
          ))}
        </div>

        {showInsight && (
          <div className={`mb-6 p-4 rounded-xl text-sm animate-in fade-in slide-in-from-top-2 duration-300 ${
            darkMode ? 'bg-indigo-900/20 text-indigo-200 border border-indigo-500/30' : 'bg-indigo-50 text-indigo-800 border border-indigo-100'
          }`}>
             <div className="flex items-center gap-2 mb-2 font-semibold">
               <Sparkles size={14} className="text-indigo-400" />
               AI Technical Deep Dive
             </div>
             {insight}
          </div>
        )}

        <div className="mt-auto flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4">
            <a href="https://github.com/abdala101" aria-label="View Code" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-black'
            }`}>
              <Github size={18} /> Code
            </a>
            <a href="#" aria-label="View Demo" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-black'
            }`}>
              <ExternalLink size={18} /> Demo
            </a>
          </div>
          <button
            onClick={handleGenerateInsight}
            disabled={isLoading}
            className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
              darkMode
                ? 'bg-slate-700 hover:bg-indigo-600 text-white'
                : 'bg-slate-100 hover:bg-indigo-500 hover:text-white text-slate-700'
            }`}
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {showInsight ? 'Hide Insight' : 'AI Insight'}
          </button>
        </div>
      </div>
    </article>
  );
};

// --- Footer Component (NEWLY BEAUTIFIED) ---

const Footer = () => {
  const { darkMode } = useTheme();

  return (
    <footer className={`pt-20 pb-10 border-t transition-colors duration-300 ${
      darkMode ? 'bg-slate-900 border-slate-800' : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <Code2 size={24} />
              </div>
              <span className={`text-2xl font-bold tracking-tighter ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Abdala<span className="text-indigo-500">.Farah</span>
              </span>
            </div>
            <p className={`text-base leading-relaxed max-w-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Full-stack engineer dedicated to building accessible, pixel-perfect, and performant digital experiences.
            </p>
            <div className="flex gap-4 pt-4">
              <SocialLink href="https://github.com/abdala101" icon={Github} label="Github" darkMode={darkMode} />
              <SocialLink href="https://linkedin.com/in/abdala-farah/" icon={Linkedin} label="LinkedIn" darkMode={darkMode} />
              <SocialLink href="mailto:abdalafarah2000@gmail.com" icon={Mail} label="Email" darkMode={darkMode} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Navigation</h3>
            <ul className="space-y-4">
              {NAV_LINKS.map(link => (
                <li key={link.name}>
                  <a href={link.href} className={`text-sm transition-colors ${
                    darkMode ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-600 hover:text-indigo-600'
                  }`}>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Status / Contact */}
          <div>
            <h3 className={`font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Status</h3>
            <div className="flex items-center gap-3 mb-4">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Open to Opportunities
              </span>
            </div>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Based in Hargeisa<br/>
              UTC+3 (EAT)
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 ${
          darkMode ? 'border-slate-800 text-slate-500' : 'border-gray-200 text-slate-500'
        }`}>
          <p className="text-sm">
            © {new Date().getFullYear()} Abdala Farah. All rights reserved.
          </p>
          <p className="text-sm flex items-center gap-1">
            Built with React & Tailwind <Heart size={14} className="text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};

// --- Main Page Sections ---

const AppContent = () => {
  const { darkMode } = useTheme();
  const { addToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePolishMessage = async () => {
    if (!message.trim()) {
      addToast("Please type a message first!", "error");
      return;
    }
    setIsPolishing(true);
    try {
      const prompt = `You are an expert copywriter. Rewrite this contact message to be more professional, polite, and concise: "${message}". Output ONLY the polished text.`;
      const polished = await AIService.generate(prompt);
      if (polished) {
        setMessage(polished.replace(/^"|"$/g, '').trim());
        addToast("Message polished successfully!", "success");
      }
    } catch (err) {
      addToast("Failed to polish message.", "error");
    } finally {
      setIsPolishing(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      addToast("Please fill in all fields.", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("https://formspree.io/f/xbdllgwg", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      if (response.ok) {
        addToast("Message sent successfully!", "success");
        setName(''); setEmail(''); setMessage('');
      } else {
        addToast("Failed to send message.", "error");
      }
    } catch (error) {
      addToast("Network error.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>

      <Helmet>
        <title>Abdala Farah | Full Stack Software Engineer</title>
        <meta name="description" content="Portfolio of Abdala Farah, a Software Engineer specializing in React, Node.js, and AI integrations." />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Abdala Farah | Software Engineer" />
        <meta property="og:description" content="Building digital experiences that matter." />
        <meta property="og:url" content="https://abdalafarah.vercel.app/" />
        <meta property="og:image" content="https://abdalafarah.vercel.app/api/og" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:image" content="https://abdalafarah.vercel.app/api/og" />
      </Helmet>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideInBottom { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-in { animation-duration: 0.5s; animation-fill-mode: forwards; }
        .fade-in { animation-name: fadeIn; }
        .slide-in-from-right { animation-name: slideInRight; }
        .slide-in-from-bottom-10 { animation-name: slideInBottom; }
      `}</style>

      <Navbar />

      <main>
        <Hero />

        <section id="about" aria-label="About Me" className={`py-20 ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>About Me</h2>
              <div className="w-20 h-1.5 bg-indigo-500 mx-auto rounded-full" />
            </div>
            <div className={`text-lg leading-relaxed text-center ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              <p className="mb-6">
                Hi there! I'm Abdala, a passionate developer based in Hargeisa. I specialize in building
                exceptional digital experiences that are fast, accessible, and visually appealing.
              </p>
              <p>
                With over 5 years of experience in full-stack development, I enjoy solving complex problems
                with simple, scalable solutions. Whether I'm working on a small creative website or a
                large-scale enterprise application, my goal is always the same: to write clean code and
                ship products that users love.
              </p>
            </div>
          </div>
        </section>

        <section id="skills" aria-label="Technical Skills" className={`py-20 ${darkMode ? 'bg-slate-800/30' : 'bg-slate-50'}`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Technical Skills</h2>
              <div className="w-20 h-1.5 bg-indigo-500 mx-auto rounded-full" />
            </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {SKILLS_DATA.map((skillGroup, index) => (
               <SkillCard key={index} icon={skillGroup.icon} title={skillGroup.title} skills={skillGroup.skills} />
             ))}
            </div>
          </div>
        </section>

        <section id="projects" aria-label="Projects" className={`py-20 ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Featured Projects</h2>
              <div className="w-20 h-1.5 bg-indigo-500 mx-auto rounded-full" />
              <p className={`mt-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Tap "AI Insight" to generate a technical breakdown of each project.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {PROJECTS_DATA.map((project, index) => (
                <ProjectCard key={index} title={project.title} description={project.description} tags={project.tags} color={project.color} />
              ))}
            </div>
          </div>
        </section>

        <section id="contact" aria-label="Contact Form" className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`rounded-3xl p-8 md:p-16 text-center border overflow-hidden relative ${
              darkMode ? 'bg-slate-800 border-slate-700' : 'bg-indigo-600 text-white shadow-2xl border-indigo-500'
            }`}>
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
              <div className="relative z-10">
                <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-white'}`}>Let's Work Together</h2>
                <p className={`text-lg mb-10 max-w-2xl mx-auto ${darkMode ? 'text-slate-300' : 'text-indigo-100'}`}>
                  Have a project in mind? I'm currently open for new opportunities.
                </p>

                <form className="max-w-md mx-auto space-y-4 text-left" onSubmit={handleSend}>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-indigo-100'}`}>Name</label>
                    <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} disabled={isSubmitting} className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${darkMode ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-white/10 border-white/20 text-white placeholder-indigo-200 focus:bg-white/20'}`} placeholder="John Doe" />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-indigo-100'}`}>Email</label>
                    <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSubmitting} className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${darkMode ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-white/10 border-white/20 text-white placeholder-indigo-200 focus:bg-white/20'}`} placeholder="john@example.com" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className={`block text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-indigo-100'}`}>Message</label>
                      <button type="button" onClick={handlePolishMessage} disabled={isPolishing || isSubmitting} className={`text-xs flex items-center gap-1.5 px-2 py-1 rounded-md transition-all ${!message.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10 cursor-pointer'} ${darkMode ? 'text-indigo-400' : 'text-indigo-100'}`} title="Use AI to make your message more professional">
                        {isPolishing ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                        {isPolishing ? 'Polishing...' : 'Auto-Polish ✨'}
                      </button>
                    </div>
                    <textarea name="message" rows="4" value={message} onChange={(e) => setMessage(e.target.value)} disabled={isSubmitting} className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${darkMode ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-white/10 border-white/20 text-white placeholder-indigo-200 focus:bg-white/20'}`} placeholder="Tell me about your project..."></textarea>
                  </div>
                  <button type="submit" disabled={isSubmitting} className={`w-full py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 ${darkMode ? 'bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-indigo-600/50 disabled:cursor-not-allowed' : 'bg-white text-indigo-600 hover:bg-indigo-50 disabled:bg-white/50 disabled:cursor-not-allowed'}`}>
                    {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Sending</> : <>Send Message <Send size={18} /></>}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- REPLACED SIMPLE FOOTER WITH NEW COMPONENT --- */}
      <Footer />
    </div>
  );
};

// --- Entry Point ---

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}