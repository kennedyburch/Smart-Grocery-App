import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockGroceryAPI } from '../lib/mockGroceryAPI';

export default function DesignDNAPage() {
  const [activeSection, setActiveSection] = useState('executive-summary');
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const sections = [
    { id: 'executive-summary', title: 'Executive Summary' },
    { id: 'guiding-principles', title: 'Guiding Principles' },
    { id: 'brand-identity', title: 'Brand & Identity' },
    { id: 'color-palette', title: 'Color Palette' },
    { id: 'component-library', title: 'Component Library' }
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetExperience = async () => {
    setIsResetting(true);
    setResetSuccess(false);
    
    try {
      await mockGroceryAPI.resetExperience();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to reset experience:', error);
    } finally {
      setIsResetting(false);
    }
  };

  const principles = [
    {
      title: "Simplicity First",
      description: "Every interface element serves a clear purpose. We eliminate cognitive overhead by prioritizing essential features and using familiar patterns.",
      example: "Single-action buttons, clear navigation labels, minimal form fields"
    },
    {
      title: "Trust & Transparency", 
      description: "Users always know what's happening and feel confident in their actions. Clear feedback, honest communication, and predictable interactions.",
      example: "Loading states, success confirmations, clear error messages"
    },
    {
      title: "Mobile-First Experience",
      description: "Designed primarily for smartphone users who shop on-the-go. Touch-friendly interactions and thumb-accessible navigation.",
      example: "Large tap targets, bottom navigation, swipe gestures"
    },
    {
      title: "Household Harmony",
      description: "Facilitates seamless coordination between family members. Shared context and collaborative features feel natural.",
      example: "Shared lists, member status indicators, unified household view"
    },
    {
      title: "Contextual Intelligence",
      description: "The app learns and adapts to user patterns, providing smart suggestions without being intrusive.",
      example: "Recent items, seasonal suggestions, usage-based recommendations"
    }
  ];

  const colorPalette = {
    primary: [
      { name: 'Teal 50', hex: '#f0fdfa', rgb: 'rgb(240, 253, 250)', usage: 'Light backgrounds, active states' },
      { name: 'Teal 100', hex: '#ccfbf1', rgb: 'rgb(204, 251, 241)', usage: 'Active navigation states, selected items' },
      { name: 'Teal 500', hex: '#14b8a6', rgb: 'rgb(20, 184, 166)', usage: 'Primary actions, brand accents, call-to-action buttons' },
      { name: 'Teal 600', hex: '#0d9488', rgb: 'rgb(13, 148, 136)', usage: 'Hover states, pressed buttons, secondary actions' },
      { name: 'Teal 700', hex: '#0f766e', rgb: 'rgb(15, 118, 110)', usage: 'Dark mode primary, emphasis, focus states' }
    ],
    secondary: [
      { name: 'Blue 50', hex: '#eff6ff', rgb: 'rgb(239, 246, 255)', usage: 'Info backgrounds, light highlights' },
      { name: 'Blue 100', hex: '#dbeafe', rgb: 'rgb(219, 234, 254)', usage: 'Info backgrounds, status indicators' },
      { name: 'Blue 500', hex: '#3b82f6', rgb: 'rgb(59, 130, 246)', usage: 'Secondary actions, info states' },
      { name: 'Blue 600', hex: '#2563eb', rgb: 'rgb(37, 99, 235)', usage: 'Login buttons, primary form actions' },
      { name: 'Blue 700', hex: '#1d4ed8', rgb: 'rgb(29, 78, 216)', usage: 'Hover states for blue buttons' }
    ],
    accent: [
      { name: 'Purple 100', hex: '#ede9fe', rgb: 'rgb(237, 233, 254)', usage: 'Design DNA highlight, premium features' },
      { name: 'Purple 500', hex: '#8b5cf6', rgb: 'rgb(139, 92, 246)', usage: 'Special features, premium indicators' },
      { name: 'Purple 700', hex: '#7c3aed', rgb: 'rgb(124, 58, 237)', usage: 'Design DNA active states' },
      { name: 'Green 500', hex: '#22c55e', rgb: 'rgb(34, 197, 94)', usage: 'Success states, positive actions' },
      { name: 'Green 600', hex: '#16a34a', rgb: 'rgb(22, 163, 74)', usage: 'Success hover states' },
      { name: 'Red 500', hex: '#ef4444', rgb: 'rgb(239, 68, 68)', usage: 'Error states, danger actions' },
      { name: 'Red 600', hex: '#dc2626', rgb: 'rgb(220, 38, 38)', usage: 'Error hover states' }
    ],
    neutrals: [
      { name: 'Slate 50', hex: '#f8fafc', rgb: 'rgb(248, 250, 252)', usage: 'App backgrounds' },
      { name: 'Slate 100', hex: '#f1f5f9', rgb: 'rgb(241, 245, 249)', usage: 'Card backgrounds, dividers' },
      { name: 'Slate 300', hex: '#cbd5e1', rgb: 'rgb(203, 213, 225)', usage: 'Borders, disabled states' },
      { name: 'Slate 600', hex: '#475569', rgb: 'rgb(71, 85, 105)', usage: 'Secondary text' },
      { name: 'Slate 800', hex: '#1e293b', rgb: 'rgb(30, 41, 59)', usage: 'Primary text, headings' },
      { name: 'Slate 900', hex: '#0f172a', rgb: 'rgb(15, 23, 42)', usage: 'High emphasis text' }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sticky Navigation */}
      <nav className="sticky top-16 z-40 bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-slate-600 hover:text-slate-800 text-sm font-medium">
                ← Back to App
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? 'text-teal-600 border-b-2 border-teal-600'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Behind the Design
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            The complete design foundation, principles, and systematic approach behind Pantry Pal's interface
          </p>
        </div>

        {/* Executive Summary */}
        <section id="executive-summary" className="mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Executive Summary</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Pantry Pal is a smart grocery companion designed to revolutionize how households coordinate their shopping and pantry management. 
                Our target audience consists of busy families, roommates, and couples who struggle with grocery coordination, duplicate purchases, 
                and pantry organization. The app bridges the gap between household members through intelligent list sharing, real-time updates, 
                and contextual suggestions.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Key features include collaborative shopping lists, household member coordination, smart pantry tracking, and AI-powered 
                suggestions based on usage patterns. The design approach emphasizes simplicity, trust, and mobile-first usability, 
                ensuring that the app feels intuitive even during the hurried moments of grocery shopping.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                Our design philosophy centers on reducing cognitive overhead while providing powerful coordination tools. Every interface 
                element serves the core mission: making grocery shopping and household coordination effortless, efficient, and collaborative.
              </p>
            </div>
          </div>
        </section>

        {/* Guiding Principles */}
        <section id="guiding-principles" className="mb-20">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Guiding Principles</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {principles.map((principle, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">{principle.title}</h3>
                    <p className="text-slate-700 mb-4">{principle.description}</p>
                    <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                      <p className="text-sm text-teal-800"><strong>Applied:</strong> {principle.example}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Brand & Identity */}
        <section id="brand-identity" className="mb-20">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Brand & Identity</h2>
          
          {/* Voice & Tone */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-semibold text-slate-900 mb-6">Voice & Tone Guidelines</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-slate-800 mb-3">Our Personality</h4>
                <p className="text-slate-700 mb-4">
                  Pantry Pal speaks like a helpful, organized friend who genuinely cares about making your life easier. 
                  We're approachable but efficient, friendly but focused, and always respectful of your time and effort.
                </p>
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h5 className="font-semibold text-green-800 mb-2">✓ Do</h5>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Use encouraging, supportive language</li>
                      <li>• Keep instructions clear and concise</li>
                      <li>• Celebrate small wins and completions</li>
                      <li>• Acknowledge when things go wrong</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h5 className="font-semibold text-red-800 mb-2">✗ Don't</h5>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Use technical jargon or complex terms</li>
                      <li>• Be overly casual or use slang</li>
                      <li>• Make assumptions about user situations</li>
                      <li>• Create anxiety with urgent language</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-800 mb-3">Contextual Adaptation</h4>
                <div className="space-y-4">
                  <div className="border border-slate-200 rounded-lg p-4">
                    <h5 className="font-semibold text-slate-800 mb-2">Onboarding</h5>
                    <p className="text-sm text-slate-600 italic">"Welcome! Let's get your household set up so everyone can start coordinating effortlessly."</p>
                  </div>
                  <div className="border border-slate-200 rounded-lg p-4">
                    <h5 className="font-semibold text-slate-800 mb-2">Success Messages</h5>
                    <p className="text-sm text-slate-600 italic">"Great! Your list has been shared with the household."</p>
                  </div>
                  <div className="border border-slate-200 rounded-lg p-4">
                    <h5 className="font-semibold text-slate-800 mb-2">Error Messages</h5>
                    <p className="text-sm text-slate-600 italic">"Something went wrong while saving your list. Let's try that again."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Logo & Visual Identity */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-semibold text-slate-900 mb-6">Logo & Visual Identity</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-slate-800 mb-4">Primary Logo</h4>
                <div className="bg-slate-50 rounded-lg p-8 text-center mb-4">
                  <img 
                    src="/pantry-pal-logo.svg" 
                    alt="Pantry Pal Logo" 
                    className="h-16 w-auto mx-auto"
                  />
                </div>
                <p className="text-sm text-slate-600">
                  The logo combines a shopping list icon with modern typography, representing organization and collaboration.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-800 mb-4">Usage Guidelines</h4>
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h5 className="text-sm font-semibold text-green-800">Minimum Size</h5>
                    <p className="text-xs text-green-700">24px height minimum for digital use</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h5 className="text-sm font-semibold text-blue-800">Clear Space</h5>
                    <p className="text-xs text-blue-700">Maintain 16px minimum clearance around logo</p>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <h5 className="text-sm font-semibold text-red-800">Don't</h5>
                    <p className="text-xs text-red-700">Stretch, rotate, or change colors</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Typography System */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-semibold text-slate-900 mb-6">Typography System</h3>
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Heading 1 - System Font Bold</h1>
                <p className="text-sm text-slate-600">36px, line-height 1.1, font-weight 700, font-family: system-ui</p>
              </div>
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-3xl font-semibold text-slate-900 mb-2">Heading 2 - System Font Semibold</h2>
                <p className="text-sm text-slate-600">30px, line-height 1.2, font-weight 600, font-family: system-ui</p>
              </div>
              <div className="border-b border-slate-200 pb-4">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Heading 3 - System Font Semibold</h3>
                <p className="text-sm text-slate-600">20px, line-height 1.3, font-weight 600, font-family: system-ui</p>
              </div>
              <div className="border-b border-slate-200 pb-4">
                <p className="text-base text-slate-800 mb-2">Body Text - System Font Regular</p>
                <p className="text-sm text-slate-600">16px, line-height 1.5, font-weight 400, font-family: system-ui</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-2">Small Text - System Font Regular</p>
                <p className="text-xs text-slate-500">14px, line-height 1.4, font-weight 400, font-family: system-ui</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <h5 className="text-sm font-semibold text-blue-800 mb-2">Font Stack</h5>
                <p className="text-xs text-blue-700 font-mono">font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif</p>
                <p className="text-xs text-blue-600 mt-2">Uses the system's native font for optimal performance and familiarity across different operating systems.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Color Palette */}
        <section id="color-palette" className="mb-20">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Color Palette</h2>
          
          {Object.entries(colorPalette).map(([category, colors]) => (
            <div key={category} className="mb-8">
              <h3 className="text-xl font-semibold text-slate-800 mb-4 capitalize">{category.replace(/([A-Z])/g, ' $1')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {colors.map((color, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div 
                      className="h-20 w-full" 
                      style={{ backgroundColor: color.hex }}
                    ></div>
                    <div className="p-4">
                      <h4 className="font-semibold text-slate-900">{color.name}</h4>
                      <p className="text-sm text-slate-600">{color.hex}</p>
                      <p className="text-sm text-slate-600">{color.rgb}</p>
                      <p className="text-xs text-slate-500 mt-2">{color.usage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Component Library */}
        <section id="component-library" className="mb-20">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Component Library</h2>
          
          {/* Buttons */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-semibold text-slate-900 mb-6">Buttons</h3>
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-semibold text-teal-800 mb-2">Button System Strategy</h4>
              <p className="text-sm text-teal-700">
                The app uses a dual primary button system: <strong>Teal</strong> for main app actions (shopping, lists, household features) and <strong>Blue</strong> for authentication and system actions (login, signup, form submissions).
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Primary (Teal)</h4>
                <div className="space-y-2">
                  <button className="w-full bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md font-medium transition-colors">
                    Default
                  </button>
                  <button className="w-full bg-teal-600 text-white px-4 py-2 rounded-md font-medium">
                    Active
                  </button>
                  <button className="w-full bg-teal-300 text-white px-4 py-2 rounded-md font-medium cursor-not-allowed" disabled>
                    Disabled
                  </button>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Primary (Blue)</h4>
                <div className="space-y-2">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
                    Default
                  </button>
                  <button className="w-full bg-blue-700 text-white px-4 py-2 rounded-md font-medium">
                    Active
                  </button>
                  <button className="w-full bg-blue-300 text-white px-4 py-2 rounded-md font-medium cursor-not-allowed" disabled>
                    Disabled
                  </button>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Secondary</h4>
                <div className="space-y-2">
                  <button className="w-full bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-md font-medium border border-slate-300 transition-colors">
                    Default
                  </button>
                  <button className="w-full bg-slate-50 text-slate-700 px-4 py-2 rounded-md font-medium border border-slate-400">
                    Active
                  </button>
                  <button className="w-full bg-slate-100 text-slate-400 px-4 py-2 rounded-md font-medium border border-slate-200 cursor-not-allowed" disabled>
                    Disabled
                  </button>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Success</h4>
                <div className="space-y-2">
                  <button className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium transition-colors">
                    Default
                  </button>
                  <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md font-medium">
                    Active
                  </button>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Danger</h4>
                <div className="space-y-2">
                  <button className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium transition-colors">
                    Default
                  </button>
                  <button className="w-full bg-red-600 text-white px-4 py-2 rounded-md font-medium">
                    Active
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Form Elements */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-semibold text-slate-900 mb-6">Form Elements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Input Fields</h4>
                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Default input" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                  <input 
                    type="text" 
                    value="Focused state" 
                    className="w-full px-3 py-2 border border-teal-500 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    readOnly
                  />
                  <input 
                    type="text" 
                    value="Error state" 
                    className="w-full px-3 py-2 border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    readOnly
                  />
                  <input 
                    type="text" 
                    placeholder="Disabled input" 
                    disabled
                    className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-50 text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Select & Checkboxes</h4>
                <div className="space-y-4">
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                    <option>Select an option</option>
                    <option>Option 1</option>
                    <option>Option 2</option>
                  </select>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                      <span className="text-slate-700">Checkbox option</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" checked className="rounded border-slate-300 text-teal-600 focus:ring-teal-500" readOnly />
                      <span className="text-slate-700">Checked option</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cards & Alerts */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-semibold text-slate-900 mb-6">Cards & Alerts</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Card Components</h4>
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <h5 className="font-semibold text-slate-900 mb-2">Basic Card</h5>
                    <p className="text-slate-600 text-sm">Simple card with border and subtle background.</p>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
                    <h5 className="font-semibold text-slate-900 mb-2">Elevated Card</h5>
                    <p className="text-slate-600 text-sm">Card with drop shadow for more emphasis.</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Alert Messages</h4>
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                    <strong>Success:</strong> Your list has been saved successfully.
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                    <strong>Warning:</strong> Some items may be out of stock.
                  </div>
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                    <strong>Error:</strong> Failed to connect to the server.
                  </div>
                  <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg">
                    <strong>Info:</strong> New features are now available.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reset Experience Section */}
        <section className="text-center py-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Reset Experience</h2>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Want to start fresh? This will reset the app back to its initial state with all 7 items in the shopping list and clear all purchase history.
            </p>
            
            {resetSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4 max-w-md mx-auto">
                ✅ Experience reset successfully! Visit the List or Shop tabs to see the changes.
              </div>
            )}
            
            <button
              onClick={handleResetExperience}
              disabled={isResetting}
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center justify-center mx-auto"
            >
              {isResetting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Resetting...
                </>
              ) : (
                '🔄 Reset the Experience'
              )}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
