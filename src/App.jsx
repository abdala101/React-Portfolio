import React, { useState, useEffect } from 'react';
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
  Wand2
} from 'lucide-react';

// --- Constants ---
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// --- API Helper ---
const callGemini = async (prompt) => {
  if (!apiKey) {
    // We log a warning instead of alert to not disrupt the UI flow in preview
    console.warn("API Key missing! Make sure VITE_GEMINI_API_KEY is set in your .env file and uncommented in the code.");
    return null;
  }
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!response.ok) throw new Error('API Call failed');

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Couldn't generate content.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

// --- Components ---

const Navbar = ({ darkMode, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      setIsOpen(false);
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'py-2' : 'py-4'
    } ${
      scrolled
      ? (darkMode
          ? 'bg-slate-900 shadow-sm shadow-black/20'
          : 'bg-white shadow-sm shadow-black/10')
      : 'bg-transparent'
    }`}>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className={`text-2xl font-bold tracking-tighter ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Abdala<span className="text-indigo-500"> . Farah</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className={`text-sm font-medium transition-colors hover:text-indigo-500 ${
                  darkMode ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${
                darkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
              }`}
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
             <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${
                darkMode ? 'bg-slate-800 text-yellow-400' : 'bg-gray-100 text-slate-700'
              }`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md ${
                darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-gray-100'
              }`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className={`md:hidden absolute w-full px-4 pt-2 pb-6 shadow-lg border-b ${
           darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'
        }`}>
          <div className="flex flex-col space-y-4 mt-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className={`text-base font-medium py-2 ${
                  darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = ({ darkMode }) => {
  return (
    // Added 'relative' here so the absolute positioned arrow is relative to the Section, not the viewport
    <section className={`min-h-screen flex items-center pt-36 relative ${
      darkMode ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">

          <div className="flex-1 text-center md:text-left space-y-6">
            <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-4 ${
              darkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
            }`}>
              Full Stack Developer
            </div>
            <h1 className={`text-5xl md:text-7xl font-bold tracking-tight leading-tight ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Building digital <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                experiences
              </span> that matter.
            </h1>
            <p className={`text-lg md:text-xl max-w-2xl mx-auto md:mx-0 ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              I craft responsive websites and robust applications with modern technologies.
              Focused on clean code, pixel-perfect design, and seamless user interaction.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-4">
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#projects').scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-3.5 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 w-full sm:w-auto text-center"
              >
                View My Work
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-8 py-3.5 rounded-full font-semibold border transition-all w-full sm:w-auto text-center ${
                  darkMode
                    ? 'border-slate-700 text-white hover:bg-slate-800'
                    : 'border-slate-300 text-slate-700 hover:bg-white'
                }`}
              >
                Contact Me
              </a>
            </div>

            <div className={`flex items-center justify-center md:justify-start gap-6 pt-8 ${
              darkMode ? 'text-slate-500' : 'text-slate-400'
            }`}>
              <a href="#" className="hover:text-indigo-500 transition-colors"><Github size={24} /></a>
              <a href="#" className="hover:text-indigo-500 transition-colors"><Linkedin size={24} /></a>
              <a href="#" className="hover:text-indigo-500 transition-colors"><Mail size={24} /></a>
            </div>
          </div>

          <div className="flex-1 relative hidden md:block">
            <div className={`relative z-10 w-full aspect-square rounded-2xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 ${
              darkMode ? 'bg-slate-800' : 'bg-white'
            }`}>
              {/* Abstract decorative code/design element instead of an image to prevent broken links */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20" />
              <div className="p-8 h-full flex flex-col justify-center">
                <div className="space-y-4 opacity-80">
                   <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                   </div>
                   <div className={`font-mono text-sm p-4 rounded-lg ${
                     darkMode ? 'bg-slate-900 text-indigo-300' : 'bg-slate-100 text-indigo-700'
                   }`}>
                     <p>const developer = &#123;</p>
                     <p className="pl-4">name: 'Abdala',</p>
                     <p className="pl-4">role: 'Full Stack Engineer',</p>
                     <p className="pl-4">passion: 'Building awesome stuff'</p>
                     <p>&#125;;</p>
                   </div>
                   <div className={`h-2 rounded w-3/4 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
                   <div className={`h-2 rounded w-1/2 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
                   <div className={`h-2 rounded w-5/6 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
                </div>
              </div>
            </div>
            {/* Background blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/20 blur-[100px] -z-10 rounded-full" />
          </div>

        </div>
      </div>

      {/* Moved arrow outside the inner container so it is centered relative to the Section */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
        <ChevronDown className={darkMode ? 'text-slate-600' : 'text-slate-400'} size={32} />
      </div>
    </section>
  );
};

const SkillCard = ({ icon: Icon, title, skills, darkMode }) => (
  <div className={`p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 ${
    darkMode ? 'bg-slate-800 hover:bg-slate-750' : 'bg-white shadow-lg shadow-slate-200/50'
  }`}>
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
      darkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
    }`}>
      <Icon size={24} />
    </div>
    <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <span key={skill} className={`text-sm px-3 py-1 rounded-full ${
          darkMode
            ? 'bg-slate-700 text-slate-300 border border-slate-600'
            : 'bg-slate-100 text-slate-600 border border-slate-200'
        }`}>
          {skill}
        </span>
      ))}
    </div>
  </div>
);

const ProjectCard = ({ title, description, tags, color, darkMode }) => {
  const [insight, setInsight] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showInsight, setShowInsight] = useState(false);

  const handleGenerateInsight = async () => {
    if (insight) {
      setShowInsight(!showInsight);
      return;
    }

    setIsLoading(true);
    const prompt = `You are a senior developer reviewing a portfolio.
    Write a short, exciting 50-word "Technical Deep Dive" for a project named "${title}".
    The project is described as: "${description}".
    The tech stack is: ${tags.join(', ')}.
    Focus on WHY this stack was chosen or the engineering value provided.`;

    const text = await callGemini(prompt);
    if (text) {
      setInsight(text);
      setShowInsight(true);
    }
    setIsLoading(false);
  };

  return (
    <div className={`group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 flex flex-col ${
      darkMode ? 'bg-slate-800' : 'bg-white shadow-xl shadow-slate-200/50'
    }`}>
      {/* Image Placeholder */}
      <div className={`h-48 w-full ${color} relative overflow-hidden flex-shrink-0`}>
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
        <div className="absolute bottom-4 left-4">
          <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
            <Globe className="text-white" size={20} />
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
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
            <span key={tag} className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
              darkMode ? 'bg-slate-700 text-indigo-300' : 'bg-indigo-50 text-indigo-700'
            }`}>
              {tag}
            </span>
          ))}
        </div>

        {/* AI Insight Section */}
        {showInsight && (
          <div className={`mb-6 p-4 rounded-xl text-sm animate-in fade-in slide-in-from-top-2 duration-300 ${
            darkMode ? 'bg-indigo-900/30 text-indigo-200 border border-indigo-500/30' : 'bg-indigo-50 text-indigo-800 border border-indigo-100'
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
            <a href="#" className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-black'
            }`}>
              <Github size={18} /> Code
            </a>
            <a href="#" className={`flex items-center gap-2 text-sm font-medium transition-colors ${
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
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [darkMode, setDarkMode] = useState(true);

  // Contact Form State
  const [message, setMessage] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handlePolishMessage = async () => {
    if (!message.trim()) return;
    setIsPolishing(true);

    const prompt = `Rewrite the following message to be more professional, polite, and concise.
    It is intended for a developer named Abdala via a contact form.
    Original message: "${message}"`;

    const polished = await callGemini(prompt);
    if (polished) {
      setMessage(polished.replace(/^"|"$/g, '')); // Remove quotes if present
    }
    setIsPolishing(false);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />

      <Hero darkMode={darkMode} />

      {/* About Section */}
      <section id="about" className={`py-20 ${darkMode ? 'bg-slate-800/50' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              About Me
            </h2>
            <div className="w-20 h-1.5 bg-indigo-500 mx-auto rounded-full" />
          </div>
          <div className={`text-lg leading-relaxed text-center ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            <p className="mb-6">
              Hi there! I'm Abdala, a passionate developer based in San Francisco. I specialize in building
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

      {/* Skills Section */}
      <section id="skills" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Technical Skills
            </h2>
            <div className="w-20 h-1.5 bg-indigo-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SkillCard
              darkMode={darkMode}
              icon={Globe}
              title="Frontend"
              skills={['React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Redux', 'HTML5/CSS3']}
            />
            <SkillCard
              darkMode={darkMode}
              icon={Terminal}
              title="Backend"
              skills={['Node.js', 'Express', 'Python', 'PostgreSQL', 'MongoDB', 'REST APIs']}
            />
            <SkillCard
              darkMode={darkMode}
              icon={Cpu}
              title="Tools & DevOps"
              skills={['Git', 'Docker', 'AWS', 'Vercel', 'Figma', 'Jest']}
            />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className={`py-20 ${darkMode ? 'bg-slate-800/50' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Featured Projects
            </h2>
            <div className="w-20 h-1.5 bg-indigo-500 mx-auto rounded-full" />
            <p className={`mt-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Tap "AI Insight" to generate a technical breakdown of each project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProjectCard
              darkMode={darkMode}
              title="E-Commerce Dashboard"
              description="A comprehensive admin dashboard for managing products, orders, and analytics with real-time data visualization."
              tags={['React', 'Chart.js', 'Node.js']}
              color="bg-gradient-to-br from-blue-500 to-cyan-400"
            />
            <ProjectCard
              darkMode={darkMode}
              title="AI Task Manager"
              description="Smart productivity app that uses AI to categorize and prioritize tasks automatically for teams."
              tags={['Next.js', 'OpenAI API', 'Tailwind']}
              color="bg-gradient-to-br from-purple-500 to-indigo-500"
            />
            <ProjectCard
              darkMode={darkMode}
              title="Social Media App"
              description="A real-time social platform featuring stories, posts, and instant messaging capabilities."
              tags={['TypeScript', 'Firebase', 'Redux']}
              color="bg-gradient-to-br from-orange-400 to-pink-500"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`rounded-3xl p-8 md:p-16 text-center ${
            darkMode ? 'bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700' : 'bg-gradient-to-b from-indigo-600 to-purple-700 text-white shadow-2xl'
          }`}>
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-white'}`}>
              Let's Work Together
            </h2>
            <p className={`text-lg mb-10 max-w-2xl mx-auto ${darkMode ? 'text-slate-300' : 'text-indigo-100'}`}>
              Have a project in mind or want to discuss modern tech? I'm currently open for new opportunities.
            </p>

            <form className="max-w-md mx-auto space-y-4 text-left" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-indigo-100'}`}>Name</label>
                <input
                  type="text"
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
                    darkMode
                      ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                      : 'bg-white/10 border-white/20 text-white placeholder-indigo-200 focus:bg-white/20'
                  }`}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-indigo-100'}`}>Email</label>
                <input
                  type="email"
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
                    darkMode
                      ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                      : 'bg-white/10 border-white/20 text-white placeholder-indigo-200 focus:bg-white/20'
                  }`}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className={`block text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-indigo-100'}`}>Message</label>
                  <button
                    type="button"
                    onClick={handlePolishMessage}
                    disabled={isPolishing || !message.trim()}
                    className={`text-xs flex items-center gap-1.5 px-2 py-1 rounded-md transition-all ${
                       !message.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10 cursor-pointer'
                    } ${darkMode ? 'text-indigo-400' : 'text-indigo-100'}`}
                    title="Use AI to make your message more professional"
                  >
                    {isPolishing ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                    {isPolishing ? 'Polishing...' : 'Auto-Polish ✨'}
                  </button>
                </div>
                <textarea
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
                    darkMode
                      ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                      : 'bg-white/10 border-white/20 text-white placeholder-indigo-200 focus:bg-white/20'
                  }`}
                  placeholder="Tell me about your project... (Type a rough draft and click Auto-Polish!)"
                ></textarea>
              </div>
              <button className={`w-full py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 ${
                darkMode
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-white text-indigo-600 hover:bg-indigo-50'
              }`}>
                Send Message <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 text-center border-t ${
        darkMode ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-gray-50 border-gray-200 text-slate-500'
      }`}>
        <p className="flex items-center justify-center gap-1">
          Made with <Code2 size={16} /> and React. © {new Date().getFullYear()} Abdala . Farah
        </p>
      </footer>
    </div>
  );
}
