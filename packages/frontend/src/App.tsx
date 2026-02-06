import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ShoppingCart, Users, Settings } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="border-b bg-card">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">SmartCart</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Users className="h-5 w-5" />
                <Settings className="h-5 w-5" />
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/household" element={<HouseholdPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// Placeholder components
function HomePage() {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-4">Welcome to SmartCart</h2>
      <p className="text-muted-foreground mb-8">
        Smart grocery list sharing with AI-powered suggestions
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <FeatureCard 
          title="Real-time Collaboration"
          description="Share lists with household members and see changes instantly"
          icon={<Users className="h-8 w-8 text-primary" />}
        />
        <FeatureCard 
          title="Smart Suggestions"
          description="AI-powered recommendations based on your shopping patterns"
          icon={<ShoppingCart className="h-8 w-8 text-primary" />}
        />
        <FeatureCard 
          title="Mobile First"
          description="Optimized for mobile use while shopping in stores"
          icon={<Settings className="h-8 w-8 text-primary" />}
        />
      </div>
    </div>
  );
}

function FeatureCard({ title, description, icon }: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="p-6 border rounded-lg bg-card">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function LoginPage() {
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input 
            type="email" 
            className="w-full p-3 border rounded-lg"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <input 
            type="password" 
            className="w-full p-3 border rounded-lg"
            placeholder="Enter your password"
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90"
        >
          Login
        </button>
      </form>
    </div>
  );
}

function SignupPage() {
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <input 
            type="text" 
            className="w-full p-3 border rounded-lg"
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input 
            type="email" 
            className="w-full p-3 border rounded-lg"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <input 
            type="password" 
            className="w-full p-3 border rounded-lg"
            placeholder="Create a password"
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

function HouseholdPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Household Management</h2>
      <p className="text-muted-foreground">
        Household management features coming soon...
      </p>
    </div>
  );
}

export default App;
