import {
  FiLayers,
  FiUsers,
  FiFileText,
  FiFilePlus,
  FiFile,
} from "react-icons/fi";

export type NavItem = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  active?: boolean;
  role?: string[];
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    label: "Dashboard",
    items: [
      {
        icon: FiLayers,
        label: "Dashboard",
        path: "/",
        role: ["SUPER_ADMIN", "APPROVER", "ADMIN", "STAFF"],
      },
    ],
  },
  {
    label: "Data Master",
    items: [
      {
        icon: FiLayers,
        label: "Layanan",
        path: "/masters/services",
        role: ["SUPER_ADMIN"],
      },
      {
        icon: FiUsers,
        label: "Pengguna",
        path: "/masters/users",
        role: ["SUPER_ADMIN"],
      },
    ],
  },
  {
    label: "System Pengajuan",
    items: [
      {
        icon: FiFilePlus,
        label: "Pengajuan Kegiatan",
        path: "/submissions/requests",
        role: ["SUPER_ADMIN", "APPROVER", "ADMIN", "STAFF"],
      },
      {
        icon: FiFile,
        label: "Jadwal Kegiatan",
        path: "/submissions/schedules",
        role: ["SUPER_ADMIN", "APPROVER", "ADMIN"],
      },
    ],
  },
  {
    label: "Laporan",
    items: [
      {
        icon: FiFileText,
        label: "Laporan Pengajuan",
        path: "/reports/request-reports",
        role: ["SUPER_ADMIN", "APPROVER", "ADMIN"],
      },
      {
        icon: FiFileText,
        label: "Laporan Jadwal Kegiatan",
        path: "/reports/schedule-reports",
        role: ["SUPER_ADMIN", "APPROVER", "ADMIN"],
      },
    ],
  },
];
