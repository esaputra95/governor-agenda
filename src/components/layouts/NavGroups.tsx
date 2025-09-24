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
      },
      {
        icon: FiUsers,
        label: "Pengguna",
        path: "/masters/users",
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
      },
      {
        icon: FiFile,
        label: "Jadwal Kegiatan",
        path: "/submissions/schedules",
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
      },
      {
        icon: FiFileText,
        label: "Laporan Jadwal Kegiatan",
        path: "/reports/schedule-reports",
      },
    ],
  },
];
