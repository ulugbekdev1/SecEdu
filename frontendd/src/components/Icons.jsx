const d = (path, opts = {}) => (
  <svg
    width={opts.size || 20}
    height={opts.size || 20}
    viewBox="0 0 24 24"
    fill={opts.fill || "none"}
    stroke={opts.fill ? "none" : "currentColor"}
    strokeWidth={opts.sw || 2}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={opts.style}
  >
    {path}
  </svg>
);

export const IcoPlay = ({ size = 20, style }) =>
  d(<polygon points="5 3 19 12 5 21 5 3" />, { size, style });

export const IcoClock = ({ size = 20, style }) =>
  d(<><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>, { size, style });

export const IcoLayers = ({ size = 20, style }) =>
  d(<><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></>, { size, style });

export const IcoTrendUp = ({ size = 20, style }) =>
  d(<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>, { size, style });

export const IcoTarget = ({ size = 20, style }) =>
  d(<><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>, { size, style });

export const IcoAward = ({ size = 20, style }) =>
  d(<><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" /></>, { size, style });

export const IcoStar = ({ size = 20, style }) =>
  d(<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />, { size, style });

export const IcoShield = ({ size = 20, style }) =>
  d(<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />, { size, style });

export const IcoBook = ({ size = 20, style }) =>
  d(<><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>, { size, style });

export const IcoLock = ({ size = 20, style }) =>
  d(<><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>, { size, style });

export const IcoUnlock = ({ size = 20, style }) =>
  d(<><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" /></>, { size, style });

export const IcoFlame = ({ size = 20, style }) =>
  d(<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />, { size, style });

export const IcoInbox = ({ size = 20, style }) =>
  d(<><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></>, { size, style });

export const IcoUsers = ({ size = 20, style }) =>
  d(<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>, { size, style });

export const IcoUser = ({ size = 20, style }) =>
  d(<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>, { size, style });

export const IcoCheckCircle = ({ size = 20, style }) =>
  d(<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>, { size, style });

export const IcoBarChart = ({ size = 20, style }) =>
  d(<><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>, { size, style });

export const IcoPlus = ({ size = 20, style }) =>
  d(<><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>, { size, style });

export const IcoSettings = ({ size = 20, style }) =>
  d(<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>, { size, style });

export const IcoCheck = ({ size = 16, style }) =>
  d(<polyline points="20 6 9 17 4 12" />, { size, sw: 2.5, style });

export const IcoX = ({ size = 16, style }) =>
  d(<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>, { size, sw: 2.5, style });

export const IcoAlertTriangle = ({ size = 16, style }) =>
  d(<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>, { size, style });

export const IcoInfo = ({ size = 16, style }) =>
  d(<><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></>, { size, style });

export const IcoWave = ({ size = 20, style }) =>
  d(<><path d="M7 11.5c2-2 5-2 7 0s5 2 7 0" /><path d="M3 7.5c2-2 5-2 7 0s5 2 7 0" /><path d="M3 15.5c2-2 5-2 7 0s5 2 7 0" /></>, { size, style });

export const IcoActivity = ({ size = 20, style }) =>
  d(<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />, { size, style });

export const IcoEye = ({ size = 16, style }) =>
  d(<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>, { size, style });

export const IcoEyeOff = ({ size = 16, style }) =>
  d(<><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></>, { size, style });

export const IcoHash = ({ size = 16, style }) =>
  d(<><line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" /></>, { size, style });

export const IcoType = ({ size = 16, style }) =>
  d(<><polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" /></>, { size, style });

export const IcoZap = ({ size = 16, style }) =>
  d(<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />, { size, style });

export const IcoGrid = ({ size = 16, style }) =>
  d(<><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></>, { size, style });

export const IcoRefresh = ({ size = 16, style }) =>
  d(<><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.1" /></>, { size, style });

export const IcoChevronRight = ({ size = 14, style }) =>
  d(<polyline points="9 18 15 12 9 6" />, { size, sw: 2.5, style });

export const IcoLogOut = ({ size = 15, style }) =>
  d(<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>, { size, style });

export const IcoDownload = ({ size = 16, style }) =>
  d(<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>, { size, style });

export const IcoUpload = ({ size = 16, style }) =>
  d(<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></>, { size, style });

export const IcoFile = ({ size = 16, style }) =>
  d(<><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /></>, { size, style });
