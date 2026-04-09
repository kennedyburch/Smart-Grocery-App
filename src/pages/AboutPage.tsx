export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-slate-800 mb-2">Pantry Pal 🛒</h1>
      <p className="text-lg text-teal-600 font-medium mb-8">Your Smart Grocery Companion for Household Coordination</p>

      <p className="text-slate-600 mb-8">
        Pantry Pal is a collaborative grocery management app designed for households. It lets multiple
        household members coordinate shopping lists in real time, track recent purchases, and streamline
        the grocery run from planning to checkout.
      </p>

      <hr className="border-slate-200 mb-8" />

      <h2 className="text-2xl font-semibold text-slate-800 mb-4">Features</h2>
      <ul className="space-y-2 text-slate-600 mb-8 list-disc list-inside">
        <li><strong>Shared Grocery Lists</strong> — Add, edit, and remove items from a shared household list</li>
        <li><strong>Smart Shop Mode</strong> — Walk through the store aisle by aisle with a live checklist</li>
        <li><strong>Recent Purchases</strong> — Track what you've bought and when, to spot patterns and avoid duplicates</li>
        <li><strong>Household Management</strong> — Invite members and shop as a team</li>
        <li><strong>Intelligent Suggestions</strong> — Get item suggestions based on your household's purchase history</li>
      </ul>

      <h2 className="text-2xl font-semibold text-slate-800 mb-4">Demo Login</h2>
      <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left px-4 py-2 font-semibold text-slate-700">Email</th>
              <th className="text-left px-4 py-2 font-semibold text-slate-700">Password</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-200">
              <td className="px-4 py-2 font-mono text-teal-700">sarah@pantrypal.com</td>
              <td className="px-4 py-2 font-mono text-slate-600">sarah123</td>
            </tr>
            <tr className="border-t border-slate-200">
              <td className="px-4 py-2 font-mono text-teal-700">jamie@pantrypal.com</td>
              <td className="px-4 py-2 font-mono text-slate-600">jamie123</td>
            </tr>
            <tr className="border-t border-slate-200">
              <td className="px-4 py-2 font-mono text-teal-700">alex@pantrypal.com</td>
              <td className="px-4 py-2 font-mono text-slate-600">alex123</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-semibold text-slate-800 mb-4">Tech Stack</h2>
      <ul className="space-y-1 text-slate-600 mb-8 list-disc list-inside">
        <li><strong>Frontend:</strong> React 18, TypeScript, Tailwind CSS, Vite</li>
        <li><strong>State Management:</strong> Zustand</li>
        <li><strong>Routing:</strong> React Router v6</li>
        <li><strong>UI Components:</strong> Radix UI, Lucide React</li>
        <li><strong>Forms:</strong> React Hook Form + Zod</li>
      </ul>

      <hr className="border-slate-200 mb-6" />
      <p className="text-sm text-slate-400">Licensed under the MIT License &copy; 2026 Pantry Pal</p>
    </div>
  );
}
