import Brand from "./Brand";
import SidebarContent from "./SidaBarContent";

export function DesktopSidebar({ collapsed }: { collapsed: boolean }) {
  return (
    <aside
      className={`${
        collapsed ? "w-[5%]" : "w-[100%] lg:w-[20%]"
      } hidden md:block`}
    >
      <div className="sticky top-20  overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4">
        <SidebarContent collapsed={collapsed} />
      </div>
    </aside>
  );
}

export function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={`fixed inset-0 z-50 md:hidden transition-opacity ${
        open
          ? "pointer-events-auto opacity-100 visible"
          : "pointer-events-none opacity-0 invisible"
      }`}
      aria-hidden={!open}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      {/* drawer */}
      <aside
        className={`absolute left-0 top-0 h-dvh w-80 max-w-[85vw] transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-dvh flex-col border-r border-slate-200 bg-white">
          {/* header */}
          <div className="flex items-center justify-between p-4 shrink-0">
            <Brand />
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-3 py-2"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
          {/* scrollable content */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 [-webkit-overflow-scrolling:touch] touch-pan-y">
            <SidebarContent collapsed={false} />
          </div>
        </div>
      </aside>
    </div>
  );
}
