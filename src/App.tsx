import { Outlet } from "react-router-dom";

export function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b px-4 py-3 font-semibold">Smart Procurement</header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
