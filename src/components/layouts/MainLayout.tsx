"use client";
import { useEffect, useState } from "react";
import Header from "./Header";
import { DesktopSidebar, MobileDrawer } from "./SideBar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // close with ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        openMobile={() => setMobileOpen(true)}
      />

      {/* Mobile Drawer */}
      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="mx-auto w-full flex  gap-4 px-4 py-4 ">
        {/* Desktop Sidebar */}
        <DesktopSidebar collapsed={collapsed} />

        {/* Main content */}
        <main
          className={`${
            collapsed ? "w-[100%] md:w-[100%]" : "w-[100%] md:w-[100%]"
          }`}
        >
          {/* Mobile breadcrumb */}
          {/* <div className="mb-3 mt-2 flex items-center gap-2 md:hidden">
            <span className="text-xs text-slate-500">
              {titleData[currentPath as keyof typeof titleData] || "Dashboard"}
            </span>
            <span className="text-slate-400">/</span>
            <span className="text-sm font-semibold">Ringkasan Informasi</span>
          </div> */}

          <div className="rounded-2xl border border-slate-200 bg-white">
            {/* <div className="border-b border-slate-100 px-5 py-4">
              <h1 className="text-lg font-semibold">
                {titleData[currentPath as keyof typeof titleData] ||
                  "Dashboard"}
              </h1>
              <p className="text-sm text-slate-500">Ringkasan Informasi</p>
            </div> */}

            {children}
          </div>
        </main>
      </div>

      {/* Optional mobile bottom bar */}
      <div className="fixed inset-x-0 bottom-3 z-30 mx-auto w-[90%] rounded-2xl border border-slate-200 bg-white/80 p-2 shadow-md backdrop-blur md:hidden">
        <div className="flex items-center justify-around text-sm text-slate-600">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex flex-col items-center gap-1"
          >
            ☰ <span className="text-[11px]">Menu</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            🔎 <span className="text-[11px]">Cari</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            🔔 <span className="text-[11px]">Notifikasi</span>
          </button>
        </div>
      </div>
    </div>
  );
}
