import { useState, useEffect, useRef } from "react";

// API Base URL (uses VITE_API_URL in production or localhost:5000 in development)
const API_BASE: string =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_URL)
    ? (import.meta as any).env.VITE_API_URL
    : "http://localhost:5000";
import {
  LayoutDashboard, Users, BookOpen, Building2, Award, FileText,
  Settings, LogOut, Bell, Search, ChevronDown, Menu, X, TrendingUp,
  UserCheck, Calendar, ClipboardList, MessageSquare, BarChart2,
  CheckCircle, XCircle, AlertCircle, Download, Filter, Plus,
  Edit2, Trash2, Eye, ChevronLeft, ChevronRight, Send, Star,
  Shield, Lock, Palette, GraduationCap, Home, Clock, FileCheck,
  Upload, Phone, Mail, MapPin, Hash, Layers, Target, Zap,
  BookMarked, UserPlus, RefreshCw, ExternalLink, MoreVertical,
  ArrowUp, ArrowDown, Activity, PieChart, TrendingDown, Check
} from "lucide-react";
import {
  AreaChart, Area, PieChart as RechartsPieChart,
  Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────────────
type Role = "admin" | "tutor" | "student" | "parent";
type Page =
  | "login" | "dashboard" | "students" | "tutors" | "departments"
  | "subjects" | "scholarships" | "reports" | "settings" | "attendance"
  | "grades" | "grade-verify" | "leave" | "tutor-assistance" | "notifications"
  | "student-profile" | "leave-mgmt" | "scholarship-module";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const studentData: any[] = [];

const attendanceData = [
  { month: "Aug", present: 22, absent: 2 }, { month: "Sep", present: 20, absent: 4 },
  { month: "Oct", present: 23, absent: 1 }, { month: "Nov", present: 19, absent: 5 },
  { month: "Dec", present: 21, absent: 3 }, { month: "Jan", present: 24, absent: 0 },
];

const deptStudentData = [
  { name: "Sem 1", students: 80, fill: "#2563EB" }, { name: "Sem 2", students: 78, fill: "#10B981" },
  { name: "Sem 3", students: 75, fill: "#f59e0b" }, { name: "Sem 4", students: 72, fill: "#8b5cf6" },
  { name: "Sem 5", students: 68, fill: "#ef4444" }, { name: "Sem 6", students: 65, fill: "#2563EB" },
  { name: "Sem 7", students: 40, fill: "#10B981" }, { name: "Sem 8", students: 38, fill: "#f59e0b" },
];

const cgpaData = [
  { range: "9-10", count: 42 }, { range: "8-9", count: 118 },
  { range: "7-8", count: 203 }, { range: "6-7", count: 89 }, { range: "<6", count: 24 },
];

const scholarshipData = [
  { name: "Merit", value: 45 }, { name: "Need-based", value: 30 },
  { name: "Sports", value: 15 }, { name: "Other", value: 10 },
];
const PIE_COLORS = ["#2563EB", "#10B981", "#f59e0b", "#8b5cf6"];

const leaveRequests: any[] = [];

const gradeVerifications: any[] = [];

const notifications: any[] = [];

const tutorAssistanceRecords: any[] = [];

const grades: any[] = [];

const scholarships: any[] = [];

// ─── Utility components ───────────────────────────────────────────────────────
const cn = (...cls: (string | undefined | false | null)[]) => cls.filter(Boolean).join(" ");

function GlassCard({ children, className = "", ...props }: { children: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl shadow-lg shadow-blue-100/40",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function StatCard({ icon, label, value, sub, color, trend }: {
  icon: React.ReactNode; label: string; value: string | number; sub?: string; color: string; trend?: "up" | "down";
}) {
  return (
    <GlassCard className="p-5 flex items-start gap-4 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-0.5">
      <div className={cn("p-3 rounded-xl flex-shrink-0", color)}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-800 mt-0.5">{value}</p>
        {sub && (
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            {trend === "up" && <ArrowUp className="w-3 h-3 text-emerald-500" />}
            {trend === "down" && <ArrowDown className="w-3 h-3 text-red-500" />}
            {sub}
          </p>
        )}
      </div>
    </GlassCard>
  );
}

function Badge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    pending: "bg-blue-100 text-blue-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
    eligible: "bg-emerald-100 text-emerald-700",
    "not-eligible": "bg-slate-100 text-slate-500",
    applied: "bg-purple-100 text-purple-700",
  };
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize", map[status] || "bg-slate-100 text-slate-600")}>
      {status}
    </span>
  );
}

function PrimaryBtn({ children, onClick, className = "", icon, disabled }: { children: React.ReactNode; onClick?: () => void; className?: string; icon?: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 active:scale-95 text-sm",
        className
      )}
    >
      {icon}{children}
    </button>
  );
}

function SecondaryBtn({ children, onClick, className = "", disabled }: { children: React.ReactNode; onClick?: () => void; className?: string; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center gap-2 px-4 py-2 bg-white hover:bg-blue-50 text-blue-600 font-semibold rounded-xl border border-blue-200 transition-all duration-200 text-sm hover:border-blue-400 active:scale-95",
        className
      )}
    >
      {children}
    </button>
  );
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <GlassCard className="relative z-10 w-full max-w-lg mx-4 p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>
        {children}
      </GlassCard>
    </div>
  );
}

function SimpleBarChart({ data, dataKey, nameKey, color = "#2563EB", height = 220 }: {
  data: Record<string, string | number>[]; dataKey: string; nameKey: string; color?: string; height?: number;
}) {
  const max = Math.max(...data.map(d => Number(d[dataKey])), 1);
  const ySteps = [0, 0.25, 0.5, 0.75, 1].map(p => Math.round(max * p));
  return (
    <div style={{ height }} className="flex flex-col">
      <div className="flex flex-1 gap-1 items-end relative">
        {/* Y-axis labels */}
        <div className="flex flex-col-reverse justify-between text-[10px] text-slate-400 pr-1 w-8 flex-shrink-0 h-full">
          {ySteps.map(v => <span key={v} className="leading-none">{v}</span>)}
        </div>
        {/* Grid + bars */}
        <div className="flex-1 flex flex-col h-full">
          <div className="flex-1 relative">
            {/* Grid lines */}
            {ySteps.map(v => (
              <div key={`grid-${v}`} className="absolute w-full border-t border-slate-100" style={{ bottom: `${(v / max) * 100}%` }} />
            ))}
            {/* Bars */}
            <div className="absolute inset-0 flex items-end gap-1 px-1">
              {data.map((d) => {
                const pct = (Number(d[dataKey]) / max) * 100;
                return (
                  <div key={String(d[nameKey])} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                    <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded-md whitespace-nowrap pointer-events-none z-10">
                      {d[nameKey]}: {d[dataKey]}
                    </div>
                    <div className="w-full rounded-t-md transition-all duration-500" style={{ height: `${pct}%`, background: color, minHeight: pct > 0 ? 2 : 0 }} />
                  </div>
                );
              })}
            </div>
          </div>
          {/* X-axis labels */}
          <div className="flex gap-1 px-1 mt-1">
            {data.map((d) => (
              <div key={String(d[nameKey])} className="flex-1 text-center text-[10px] text-slate-500 truncate">{d[nameKey]}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-800 text-white px-4 py-3 rounded-xl shadow-2xl animate-slide-up">
      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
      <span className="text-sm font-medium">{msg}</span>
      <button onClick={onClose}><X className="w-4 h-4 opacity-60 hover:opacity-100" /></button>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const adminNav = [
  { icon: <LayoutDashboard className="w-4 h-4" />, label: "Dashboard", page: "dashboard" as Page },
  { icon: <Users className="w-4 h-4" />, label: "Students", page: "students" as Page },
  { icon: <UserCheck className="w-4 h-4" />, label: "Tutors", page: "tutors" as Page },
  { icon: <BookOpen className="w-4 h-4" />, label: "Subjects", page: "subjects" as Page },
  { icon: <Award className="w-4 h-4" />, label: "Scholarships", page: "scholarship-module" as Page },
  { icon: <BarChart2 className="w-4 h-4" />, label: "Reports", page: "reports" as Page },
  { icon: <Settings className="w-4 h-4" />, label: "Settings", page: "settings" as Page },
];

const tutorNav = [
  { icon: <LayoutDashboard className="w-4 h-4" />, label: "Dashboard", page: "dashboard" as Page },
  { icon: <Users className="w-4 h-4" />, label: "My Students", page: "students" as Page },
  { icon: <Calendar className="w-4 h-4" />, label: "Attendance", page: "attendance" as Page },
  { icon: <FileCheck className="w-4 h-4" />, label: "Grade Verification", page: "grade-verify" as Page },
  { icon: <Award className="w-4 h-4" />, label: "Scholarships", page: "scholarship-module" as Page },
  { icon: <ClipboardList className="w-4 h-4" />, label: "Leave Requests", page: "leave-mgmt" as Page },
  { icon: <MessageSquare className="w-4 h-4" />, label: "Tutor Assistance", page: "tutor-assistance" as Page },
  { icon: <BarChart2 className="w-4 h-4" />, label: "Reports", page: "reports" as Page },
  { icon: <Bell className="w-4 h-4" />, label: "Notifications", page: "notifications" as Page },
  { icon: <Settings className="w-4 h-4" />, label: "Settings", page: "settings" as Page },
];

const studentNav = [
  { icon: <LayoutDashboard className="w-4 h-4" />, label: "Dashboard", page: "dashboard" as Page },
  { icon: <Calendar className="w-4 h-4" />, label: "Attendance", page: "attendance" as Page },
  { icon: <BookMarked className="w-4 h-4" />, label: "Enter Grades", page: "grades" as Page },
  { icon: <Award className="w-4 h-4" />, label: "Scholarships", page: "scholarship-module" as Page },
  { icon: <ClipboardList className="w-4 h-4" />, label: "Leave Request", page: "leave" as Page },
  { icon: <BarChart2 className="w-4 h-4" />, label: "Reports", page: "reports" as Page },
  { icon: <Bell className="w-4 h-4" />, label: "Notifications", page: "notifications" as Page },
  { icon: <Settings className="w-4 h-4" />, label: "Settings", page: "settings" as Page },
];

const parentNav = [
  { icon: <LayoutDashboard className="w-4 h-4" />, label: "Dashboard", page: "dashboard" as Page },
  { icon: <Calendar className="w-4 h-4" />, label: "Attendance", page: "attendance" as Page },
  { icon: <Bell className="w-4 h-4" />, label: "Notifications", page: "notifications" as Page },
  { icon: <Settings className="w-4 h-4" />, label: "Settings", page: "settings" as Page },
];

function Sidebar({ role, currentPage, onNavigate, collapsed, onToggle }: {
  role: Role; currentPage: Page; onNavigate: (p: Page) => void; collapsed: boolean; onToggle: () => void;
}) {
  const navItems = role === "admin" ? adminNav : role === "tutor" ? tutorNav : role === "student" ? studentNav : parentNav;
  return (
    <aside className={cn(
      "h-screen fixed left-0 top-0 z-30 flex flex-col transition-all duration-300",
      "bg-white/90 backdrop-blur-xl border-r border-blue-100/60 shadow-xl shadow-blue-100/20",
      collapsed ? "w-16" : "w-60"
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-blue-100/60 min-h-[64px]">
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-md">
          <GraduationCap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-800 leading-tight truncate">TutorVerse</p>
            <p className="text-[10px] text-blue-500 font-semibold tracking-wide uppercase truncate">AI Platform</p>
          </div>
        )}
        <button onClick={onToggle} className="ml-auto p-1 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0">
          {collapsed ? <ChevronRight className="w-4 h-4 text-slate-400" /> : <ChevronLeft className="w-4 h-4 text-slate-400" />}
        </button>
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div className="px-4 py-3">
          <span className={cn(
            "text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider",
            role === "admin" ? "bg-blue-100 text-blue-700" :
              role === "tutor" ? "bg-purple-100 text-purple-700" :
                role === "student" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
          )}>
            {role} Portal
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto scrollbar-none">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onNavigate(item.page)}
            title={collapsed ? item.label : undefined}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              currentPage === item.page
                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
            )}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && <span className="truncate">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-blue-100/60">
        <button
          onClick={() => onNavigate("login" as Page)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ role, unread, onNotifClick, onNavigate, currentUser }: {
  role: Role; unread: number; onNotifClick: () => void; onNavigate: (p: Page) => void; currentUser?: any;
}) {
  const roleInfo: Record<Role, { name: string; avatar: string; dept: string }> = {
    admin: { name: "Dr. Meera Krishnan", avatar: "MK", dept: "University Administration" },
    tutor: { name: "Prof. Amit Verma", avatar: "AV", dept: "Computer Science Dept." },
    student: { name: "Arjun Sharma", avatar: "AS", dept: "CS, Semester 6" },
    parent: { name: "Rajesh Sharma", avatar: "RS", dept: "Parent of Arjun Sharma" },
  };
  const name = currentUser?.name || roleInfo[role].name;
  const dept = currentUser?.dept || roleInfo[role].dept;
  const avatar = name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <header className="h-16 flex items-center gap-4 px-6 bg-white/80 backdrop-blur-xl border-b border-blue-100/60 sticky top-0 z-20 shadow-sm">
      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search students, subjects, reports..."
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
        />
      </div>
      <div className="flex items-center gap-3 ml-auto">
        {/* Notif */}
        <button onClick={onNotifClick} className="relative p-2 hover:bg-blue-50 rounded-xl transition-colors">
          <Bell className="w-5 h-5 text-slate-600" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {unread}
            </span>
          )}
        </button>
        {/* Profile */}
        <button onClick={() => onNavigate("settings")} className="flex items-center gap-2.5 pl-3 pr-1 py-1 hover:bg-blue-50 rounded-xl transition-colors group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800 leading-tight">{name}</p>
            <p className="text-xs text-slate-400 truncate max-w-[140px]">{dept}</p>
          </div>
          <div className={cn(
            "w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-md flex-shrink-0",
            role === "admin" ? "bg-gradient-to-br from-blue-500 to-blue-700" :
              role === "tutor" ? "bg-gradient-to-br from-purple-500 to-purple-700" :
                role === "student" ? "bg-gradient-to-br from-emerald-500 to-emerald-700" : "bg-gradient-to-br from-amber-500 to-amber-700"
          )}>
            {avatar}
          </div>
        </button>
      </div>
    </header>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage({ onLogin }: { onLogin: (user: any) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const roleCredentials: Record<Role, { email: string; label: string; color: string }> = {
    admin: { email: "admin@tutorverse.edu", label: "Admin", color: "bg-blue-600" },
    tutor: { email: "tutor@tutorverse.edu", label: "Tutor", color: "bg-purple-600" },
    student: { email: "student@tutorverse.edu", label: "Student", color: "bg-emerald-600" },
    parent: { email: "parent@tutorverse.edu", label: "Parent", color: "bg-amber-600" },
  };

  const handleLogin = async () => {
    setLoading(true);
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    try {
      const res = await fetch(`${API_BASE}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword })
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data);
      } else {
        alert(data.error || "Invalid credentials");
      }
    } catch (err) {
      // Fallback for mock if backend is not running
      let foundRole: Role | undefined = (Object.keys(roleCredentials) as Role[]).find(
        r => roleCredentials[r].email.toLowerCase() === trimmedEmail
      );
      if (!foundRole) {
        if (trimmedEmail.includes('nec.edu')) foundRole = 'tutor';
        else if (trimmedEmail.includes('student')) foundRole = 'student';
        else if (trimmedEmail.includes('parent')) foundRole = 'parent';
      }
      const isPasswordValid = ['tech@123', 'password', 'nec@123'].includes(trimmedPassword);
      if (!foundRole || !isPasswordValid) {
        alert("Invalid credentials. Please check your email and ensure you use the default password.");
        setLoading(false);
        return;
      }
      setTimeout(() => { onLogin({ role: foundRole, email: trimmedEmail, name: "User" }); }, 1200);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-emerald-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-200/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left illustration */}
        <div className="hidden lg:block">
          <div className="relative">
            <img
              src="/university_students.png"
              alt="University students studying"
              className="rounded-3xl w-full object-cover h-[520px] shadow-2xl"
            />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-blue-900/70 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold opacity-90">TutorVerse AI</span>
              </div>
              <h2 className="text-2xl font-bold leading-tight">Tutor Management System</h2>
              <p className="text-sm opacity-75 mt-2">Empowering education with intelligent insights and seamless management.</p>
            </div>
          </div>
        </div>

        {/* Login card */}
        <GlassCard className="p-8 w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-200">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>
            <p className="text-sm text-slate-500 mt-1">Sign in to TutorVerse AI Platform</p>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  placeholder="admin@tutorverse.edu"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 rounded accent-blue-600" />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors">Forgot password?</button>
            </div>
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all duration-200 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> Signing In...</>
              ) : (
                <><Zap className="w-4 h-4" /> Sign In to TutorVerse</>
              )}
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Or continue with</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            <button
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  onLogin({ role: "student", email: "student@gmail.com", name: "Google Student" });
                }, 800);
              }}
              disabled={loading}
              type="button"
              className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl shadow-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign in with Google
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            Protected by enterprise-grade security &bull; © 2025 TutorVerse AI
          </p>
        </GlassCard>
      </div>
    </div>
  );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function AdminDashboard({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Welcome back, Dr. Meera Krishnan &bull; {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users className="w-5 h-5 text-blue-600" />} label="Total Students" value="516" sub="↑ 48 this semester" color="bg-blue-50" trend="up" />
        <StatCard icon={<UserCheck className="w-5 h-5 text-purple-600" />} label="Total Tutors" value="18" sub="↑ 1 this month" color="bg-purple-50" trend="up" />
        <StatCard icon={<BookOpen className="w-5 h-5 text-emerald-600" />} label="Total Subjects" value="12" sub="CSE Department" color="bg-emerald-50" />
        <StatCard icon={<Award className="w-5 h-5 text-amber-600" />} label="Scholarships" value="48" sub="Active this year" color="bg-amber-50" trend="up" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 p-5">
          <h3 className="font-bold text-slate-800 mb-4">Semester-wise Student Enrollment — CSE</h3>
          <SimpleBarChart data={deptStudentData} dataKey="students" nameKey="name" color="#2563EB" height={240} />
        </GlassCard>
        <GlassCard className="p-5">
          <h3 className="font-bold text-slate-800 mb-4">Scholarship Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPieChart>
              <Pie data={scholarshipData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {scholarshipData.map((d, i) => <Cell key={`schol-pie-${d.name}`} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", fontSize: "12px" }} />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {scholarshipData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-slate-600">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                {d.name}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <GlassCard className="lg:col-span-2 p-5">
          <h3 className="font-bold text-slate-800 mb-4">Recent Activities</h3>
          <div className="space-y-3">
            {[
              { icon: <UserPlus className="w-4 h-4 text-blue-600" />, bg: "bg-blue-50", text: "New student Aditya Kumar enrolled in Computer Science", time: "10 min ago" },
              { icon: <FileCheck className="w-4 h-4 text-emerald-600" />, bg: "bg-emerald-50", text: "Grade verification completed for Semester 5 batch", time: "45 min ago" },
              { icon: <Award className="w-4 h-4 text-amber-600" />, bg: "bg-amber-50", text: "Merit Scholarship awarded to 12 students", time: "2 hr ago" },
              { icon: <AlertCircle className="w-4 h-4 text-red-500" />, bg: "bg-red-50", text: "Low attendance alert sent to 8 students", time: "3 hr ago" },
              { icon: <BarChart2 className="w-4 h-4 text-purple-600" />, bg: "bg-purple-50", text: "Monthly report generated for January 2025", time: "Yesterday" },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                <div className={cn("p-2 rounded-lg flex-shrink-0", a.bg)}>{a.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700">{a.text}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Quick Actions */}
        <GlassCard className="p-5">
          <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: "Add New Student", icon: <UserPlus className="w-4 h-4" />, color: "bg-blue-600 hover:bg-blue-700", page: "students" as Page },
              { label: "View Reports", icon: <BarChart2 className="w-4 h-4" />, color: "bg-purple-600 hover:bg-purple-700", page: "reports" as Page },
              { label: "Manage Scholarships", icon: <Award className="w-4 h-4" />, color: "bg-emerald-600 hover:bg-emerald-700", page: "scholarship-module" as Page },
              { label: "Manage Subjects", icon: <BookOpen className="w-4 h-4" />, color: "bg-amber-600 hover:bg-amber-700", page: "subjects" as Page },
              { label: "System Settings", icon: <Settings className="w-4 h-4" />, color: "bg-slate-600 hover:bg-slate-700", page: "settings" as Page },
            ].map((a) => (
              <button key={a.label} onClick={() => onNavigate(a.page)} className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white text-sm font-semibold transition-all duration-200 active:scale-[0.98]", a.color)}>
                {a.icon}{a.label}
              </button>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

// ─── TUTOR DASHBOARD ──────────────────────────────────────────────────────────
function TutorDashboard({ onNavigate, currentUser }: { onNavigate: (p: Page) => void, currentUser?: any }) {
  const name = currentUser?.name || "Prof. Amit Verma";
  const dept = currentUser?.dept || "Computer Science Department";
  const studentsCount = (currentUser && currentUser.studentsCount !== undefined) ? currentUser.studentsCount : 62;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Tutor Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">{name} &bull; {dept}</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={<Users className="w-5 h-5 text-blue-600" />} label="My Students" value={studentsCount.toString()} color="bg-blue-50" sub="Across 3 batches" />
        <StatCard icon={<FileCheck className="w-5 h-5 text-amber-600" />} label="Pending Grades" value="8" color="bg-amber-50" sub="Awaiting review" />
        <StatCard icon={<ClipboardList className="w-5 h-5 text-purple-600" />} label="Leave Requests" value="4" color="bg-purple-50" sub="2 pending approval" />
        <StatCard icon={<Award className="w-5 h-5 text-emerald-600" />} label="Scholarship Eligible" value="19" color="bg-emerald-50" sub="This semester" />
        <StatCard icon={<Calendar className="w-5 h-5 text-blue-600" />} label="Attendance Today" value="94%" color="bg-blue-50" sub="58/62 present" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-5">
          <h3 className="font-bold text-slate-800 mb-4">Monthly Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={attendanceData}>
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", fontSize: "13px" }} />
              <Area type="monotone" dataKey="present" stroke="#2563EB" fill="url(#blueGrad)" strokeWidth={2} name="Present" />
              <Area type="monotone" dataKey="absent" stroke="#ef4444" fill="none" strokeWidth={2} name="Absent" strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
        <GlassCard className="p-5">
          <h3 className="font-bold text-slate-800 mb-4">CGPA Distribution</h3>
          <SimpleBarChart data={cgpaData} dataKey="count" nameKey="range" color="#10B981" height={220} />
        </GlassCard>
      </div>
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800">Recent Student Activity</h3>
          <SecondaryBtn onClick={() => onNavigate("students")}>View All</SecondaryBtn>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {["Student", "Roll No.", "CGPA", "Attendance", "Status", "Action"].map(h => (
                  <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {studentData.slice(0, 4).map((s) => (
                <tr key={s.id} className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors">
                  <td className="py-3 px-3"><div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white text-xs font-bold">{s.name[0]}</div>
                    <span className="font-medium text-slate-800">{s.name}</span>
                  </div></td>
                  <td className="py-3 px-3 text-slate-500 font-mono text-xs">{s.roll}</td>
                  <td className="py-3 px-3 font-semibold text-slate-700">{s.cgpa}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5 w-16"><div className="h-1.5 rounded-full" style={{ width: `${s.attendance}%`, background: s.attendance < 75 ? "#ef4444" : "#10B981" }} /></div>
                      <span className="text-xs text-slate-600">{s.attendance}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3"><Badge status={s.status} /></td>
                  <td className="py-3 px-3"><button className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors"><Eye className="w-3.5 h-3.5 text-blue-600" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

// ─── STUDENT DASHBOARD ────────────────────────────────────────────────────────
function StudentDashboard({ onNavigate, currentUser }: { onNavigate: (p: Page) => void, currentUser?: any }) {
  const deadlines = [
    { label: "Grade Submission Deadline", date: "Feb 15, 2025", urgent: true },
    { label: "Scholarship Application — Merit Award", date: "Mar 15, 2025", urgent: false },
    { label: "Leave Request for Symposium", date: "Feb 18, 2025", urgent: true },
    { label: "Project Report Submission", date: "Mar 1, 2025", urgent: false },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Student Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">{currentUser?.name || "Student"} &bull; {currentUser?.roll || "ID"} &bull; {currentUser?.dept || "Department"}, Semester {currentUser?.sem || 1}</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={<TrendingUp className="w-5 h-5 text-blue-600" />} label="Current CGPA" value="8.7" sub="↑ 0.2 from last sem" color="bg-blue-50" trend="up" />
        <StatCard icon={<Activity className="w-5 h-5 text-emerald-600" />} label="Current SGPA" value="9.1" sub="Semester 6" color="bg-emerald-50" trend="up" />
        <StatCard icon={<Calendar className="w-5 h-5 text-purple-600" />} label="Attendance" value="89%" sub="Above threshold" color="bg-purple-50" />
        <StatCard icon={<Award className="w-5 h-5 text-amber-600" />} label="Scholarship Status" value="Eligible" sub="Merit Award" color="bg-amber-50" />
        <StatCard icon={<AlertCircle className="w-5 h-5 text-red-500" />} label="Backlogs" value="0" sub="All cleared" color="bg-red-50" />
        <StatCard icon={<Clock className="w-5 h-5 text-slate-500" />} label="Upcoming Deadlines" value="4" sub="2 urgent" color="bg-slate-50" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 p-5">
          <h3 className="font-bold text-slate-800 mb-4">Semester Performance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={[
              { sem: "Sem 1", cgpa: 7.8 }, { sem: "Sem 2", cgpa: 8.1 }, { sem: "Sem 3", cgpa: 8.3 },
              { sem: "Sem 4", cgpa: 8.5 }, { sem: "Sem 5", cgpa: 8.5 }, { sem: "Sem 6", cgpa: 8.7 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="sem" tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis domain={[7, 10]} tick={{ fontSize: 12, fill: "#64748b" }} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", fontSize: "13px" }} />
              <Line type="monotone" dataKey="cgpa" stroke="#2563EB" strokeWidth={2.5} dot={{ fill: "#2563EB", r: 4 }} name="CGPA" />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
        <GlassCard className="p-5">
          <h3 className="font-bold text-slate-800 mb-4">Upcoming Deadlines</h3>
          <div className="space-y-3">
            {deadlines.map((d, i) => (
              <div key={i} className={cn("p-3 rounded-xl border", d.urgent ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-200")}>
                <p className="text-xs font-semibold text-slate-700 leading-tight">{d.label}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className={cn("w-3 h-3", d.urgent ? "text-red-500" : "text-slate-400")} />
                  <span className={cn("text-xs font-medium", d.urgent ? "text-red-600" : "text-slate-500")}>{d.date}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
      {/* Quick actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Enter Grades", icon: <BookMarked className="w-5 h-5" />, page: "grades" as Page, color: "from-blue-500 to-blue-700" },
          { label: "Apply Leave", icon: <ClipboardList className="w-5 h-5" />, page: "leave" as Page, color: "from-purple-500 to-purple-700" },
          { label: "View Reports", icon: <BarChart2 className="w-5 h-5" />, page: "reports" as Page, color: "from-emerald-500 to-emerald-700" },
          { label: "Scholarships", icon: <Award className="w-5 h-5" />, page: "scholarship-module" as Page, color: "from-amber-500 to-amber-700" },
        ].map((a) => (
          <button key={a.label} onClick={() => onNavigate(a.page)} className={cn(
            "p-5 rounded-2xl text-white font-semibold flex flex-col items-center gap-3 bg-gradient-to-br shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95",
            a.color
          )}>
            {a.icon}
            <span className="text-sm">{a.label}</span>
          </button>
        ))}
      </div>
      {/* Recent notifications */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800">Recent Notifications</h3>
          <SecondaryBtn onClick={() => onNavigate("notifications")}>View All</SecondaryBtn>
        </div>
        <div className="space-y-2">
          {notifications.slice(0, 4).map((n) => (
            <div key={n.id} className={cn("flex items-start gap-3 p-3 rounded-xl transition-colors", n.read ? "bg-slate-50" : "bg-blue-50")}>
              <div className={cn("w-2 h-2 rounded-full mt-1.5 flex-shrink-0", n.read ? "bg-slate-300" : "bg-blue-500")} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700">{n.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

// ─── PARENT DASHBOARD ─────────────────────────────────────────────────────────
function ParentDashboard({ currentUser }: { currentUser?: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Parent Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">{currentUser?.name || "Parent Name"} &bull; {currentUser?.dept || "Parent of Student"}</p>
      </div>
      <GlassCard className="p-5 bg-gradient-to-r from-blue-600 to-blue-800 border-0">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">AS</div>
          <div className="text-white">
            <h2 className="text-xl font-bold">Arjun Sharma</h2>
            <p className="text-blue-100 text-sm">CS2021001 &bull; Computer Science &bull; Semester 6</p>
            <div className="flex gap-4 mt-2">
              <span className="text-sm bg-white/20 px-2.5 py-1 rounded-lg">CGPA: <strong>8.7</strong></span>
              <span className="text-sm bg-white/20 px-2.5 py-1 rounded-lg">Attendance: <strong>89%</strong></span>
            </div>
          </div>
        </div>
      </GlassCard>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<TrendingUp className="w-5 h-5 text-blue-600" />} label="CGPA" value="8.7" color="bg-blue-50" sub="Good standing" />
        <StatCard icon={<Calendar className="w-5 h-5 text-emerald-600" />} label="Attendance" value="89%" color="bg-emerald-50" sub="Above 75% threshold" />
        <StatCard icon={<Award className="w-5 h-5 text-amber-600" />} label="Scholarship" value="Eligible" color="bg-amber-50" sub="Merit Award" />
        <StatCard icon={<ClipboardList className="w-5 h-5 text-purple-600" />} label="Leave Status" value="0 Pending" color="bg-purple-50" sub="All resolved" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-5">
          <h3 className="font-bold text-slate-800 mb-4">Attendance History</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={attendanceData}>
              <defs>
                <linearGradient id="parentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", fontSize: "13px" }} />
              <Area type="monotone" dataKey="present" stroke="#10B981" fill="url(#parentGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
        <GlassCard className="p-5">
          <h3 className="font-bold text-slate-800 mb-3">Tutor Remarks</h3>
          <div className="space-y-3">
            {[
              { tutor: "Prof. Amit Verma", remark: "Arjun shows excellent problem-solving skills. Consistent performance in data structures.", date: "Feb 5, 2025", positive: true },
              { tutor: "Dr. Lakshmi Iyer", remark: "Good participation in class. Recommend focusing more on practical lab sessions.", date: "Jan 28, 2025", positive: true },
              { tutor: "Prof. Suresh Kumar", remark: "Attendance improved significantly. Keep maintaining the momentum.", date: "Jan 20, 2025", positive: true },
            ].map((r, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-blue-700">{r.tutor}</span>
                  <span className="text-xs text-slate-400">{r.date}</span>
                </div>
                <p className="text-sm text-slate-600">{r.remark}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
      <GlassCard className="p-5">
        <h3 className="font-bold text-slate-800 mb-4">Notifications for Parents</h3>
        <div className="space-y-2">
          {notifications.slice(0, 4).map((n) => (
            <div key={n.id} className={cn("flex items-start gap-3 p-3 rounded-xl", n.read ? "bg-slate-50" : "bg-blue-50")}>
              <Bell className={cn("w-4 h-4 mt-0.5 flex-shrink-0", n.read ? "text-slate-400" : "text-blue-500")} />
              <div>
                <p className="text-sm text-slate-700">{n.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

// ─── STUDENT MANAGEMENT ───────────────────────────────────────────────────────
function StudentManagement({ onViewProfile, currentUser, role }: { onViewProfile: () => void, currentUser?: any, role?: any }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState("");
  const [students, setStudents] = useState<any[]>(studentData || []);
  const perPage = 5;

  useEffect(() => {
    if (role === 'tutor' && currentUser?._id) {
      fetch(`${API_BASE}/api/users/tutor/${currentUser._id}/students`)
        .then(res => res.json())
        .then(data => setStudents(Array.isArray(data) ? data : []))
        .catch(console.error);
    } else if (role === 'admin') {
      fetch(`${API_BASE}/api/users/students`)
        .then(res => res.json())
        .then(data => setStudents(Array.isArray(data) ? data : []))
        .catch(console.error);
    }
  }, [currentUser, role]);

  const filtered = students.filter(s =>
    (filter === "all" || s.status === filter) &&
    (s.name?.toLowerCase().includes(search.toLowerCase()) || s.dept?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {toast && <Toast msg={toast} onClose={() => setToast("")} />}
      <Modal open={modal} onClose={() => setModal(false)} title="Add New Student">
        <div className="space-y-4">
          {[["Full Name", "text", "Aditya Kumar"], ["Email", "email", "aditya@tutorverse.edu"], ["Roll Number", "text", "CS2024007"], ["Semester", "number", "1"]].map(([label, type, ph]) => (
            <div key={label as string}>
              <label className="text-sm font-semibold text-slate-700 block mb-1">{label as string}</label>
              <input type={type as string} placeholder={ph as string} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
            </div>
          ))}
          <div className="p-3 bg-blue-50 rounded-xl">
            <p className="text-xs font-semibold text-blue-700">Department: Computer Science Engineering (CSE)</p>
          </div>
          <div className="flex gap-3 pt-2">
            <PrimaryBtn onClick={() => { setModal(false); setToast("Student added successfully!"); }} className="flex-1 justify-center" icon={<Plus className="w-4 h-4" />}>Add Student</PrimaryBtn>
            <SecondaryBtn onClick={() => setModal(false)} className="flex-1 justify-center">Cancel</SecondaryBtn>
          </div>
        </div>
      </Modal>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Student Management</h1>
          <p className="text-sm text-slate-500">Total {filtered.length} students found</p>
        </div>
        <PrimaryBtn onClick={() => setModal(true)} icon={<Plus className="w-4 h-4" />}>Add Student</PrimaryBtn>
      </div>

      <GlassCard className="p-5">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search by name or department..." className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div className="flex gap-2">
            {["all", "active", "warning"].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={cn("px-4 py-2.5 rounded-xl text-sm font-semibold transition-all capitalize", filter === f ? "bg-blue-600 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}>
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {["Student", "Roll No.", "Semester", "CGPA", "Attendance", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice((page - 1) * perPage, page * perPage).map((s) => (
                <tr key={s._id || s.id} className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{s.name ? s.name[0] : "?"}</div>
                      <div>
                        <p className="font-semibold text-slate-800">{s.name}</p>
                        <p className="text-xs text-slate-400">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-500">{s.roll}</td>
                  <td className="py-3.5 px-4 text-slate-600">Sem {s.sem || 1}</td>
                  <td className="py-3.5 px-4">
                    <span className={cn("font-bold", (s.cgpa || 0) >= 9 ? "text-emerald-600" : (s.cgpa || 0) >= 7.5 ? "text-blue-600" : "text-amber-600")}>{s.cgpa || 0}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2 min-w-[80px]">
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full transition-all" style={{ width: `${s.attendance || 0}%`, background: (s.attendance || 0) < 75 ? "#ef4444" : "#10B981" }} />
                      </div>
                      <span className="text-xs font-medium text-slate-600 w-8">{s.attendance || 0}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4"><Badge status={s.status || "active"} /></td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1">
                      <button onClick={onViewProfile} className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors" title="View Profile"><Eye className="w-3.5 h-3.5 text-blue-600" /></button>
                      <button className="p-1.5 hover:bg-amber-100 rounded-lg transition-colors" title="Edit"><Edit2 className="w-3.5 h-3.5 text-amber-600" /></button>
                      <button onClick={() => setToast("Student removed.")} className="p-1.5 hover:bg-red-100 rounded-lg transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
          <p className="text-sm text-slate-500">Showing {Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(page * perPage, filtered.length)} of {filtered.length} students</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-40 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
            {Array.from({ length: Math.ceil(filtered.length / perPage) }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} className={cn("w-8 h-8 rounded-lg text-sm font-semibold transition-all", page === i + 1 ? "bg-blue-600 text-white" : "hover:bg-slate-100 text-slate-600")}>{i + 1}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(Math.ceil(filtered.length / perPage), p + 1))} disabled={page === Math.ceil(filtered.length / perPage)} className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-40 transition-colors"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

// ─── STUDENT PROFILE ──────────────────────────────────────────────────────────
function StudentProfile({ onBack }: { onBack: () => void }) {
  const s = studentData[0];
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-blue-50 rounded-xl transition-colors"><ChevronLeft className="w-5 h-5 text-slate-600" /></button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Student Profile</h1>
          <p className="text-sm text-slate-500">{s.roll}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="p-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl mb-4">{s.name[0]}</div>
          <h2 className="text-xl font-bold text-slate-800">{s.name}</h2>
          <p className="text-sm text-slate-500 mt-1">{s.dept}</p>
          <Badge status={s.status} />
          <div className="w-full mt-4 space-y-2 text-sm">
            {[[Mail, s.email], [Phone, s.phone], [Hash, s.roll]].map(([Icon, val], i) => (
              <div key={i} className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
                <Icon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate text-xs">{val as string}</span>
              </div>
            ))}
          </div>
          <div className="w-full mt-4 p-3 bg-blue-50 rounded-xl">
            <p className="text-xs font-bold text-blue-800 mb-1">Parent / Guardian</p>
            <p className="text-sm text-blue-700">{s.parentName}</p>
          </div>
        </GlassCard>
        <div className="lg:col-span-2 space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: "CGPA", value: s.cgpa, icon: <TrendingUp className="w-4 h-4 text-blue-600" />, color: "bg-blue-50" },
              { label: "Attendance", value: `${s.attendance}%`, icon: <Calendar className="w-4 h-4 text-emerald-600" />, color: "bg-emerald-50" },
              { label: "Semester", value: `Sem ${s.sem}`, icon: <BookOpen className="w-4 h-4 text-purple-600" />, color: "bg-purple-50" },
              { label: "Backlogs", value: 0, icon: <AlertCircle className="w-4 h-4 text-red-500" />, color: "bg-red-50" },
              { label: "Credits Earned", value: 148, icon: <Star className="w-4 h-4 text-amber-600" />, color: "bg-amber-50" },
              { label: "Rank", value: "#12", icon: <Award className="w-4 h-4 text-blue-600" />, color: "bg-blue-50" },
            ].map((item) => (
              <div key={item.label} className={cn("p-4 rounded-xl flex items-center gap-3", item.color)}>
                {item.icon}
                <div>
                  <p className="text-xs text-slate-500">{item.label}</p>
                  <p className="font-bold text-slate-800">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
          <GlassCard className="p-5">
            <h3 className="font-bold text-slate-800 mb-3">Semester-wise Grades</h3>
            <div className="space-y-2">
              {[
                { sem: "Semester 5", sgpa: 8.5, credits: 24 }, { sem: "Semester 4", sgpa: 8.3, credits: 22 },
                { sem: "Semester 3", sgpa: 8.1, credits: 24 }, { sem: "Semester 2", sgpa: 7.9, credits: 22 },
              ].map((sem) => (
                <div key={sem.sem} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">{sem.sem}</span>
                      <span className="text-sm font-bold text-blue-600">SGPA: {sem.sgpa}</span>
                    </div>
                    <div className="bg-slate-200 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(sem.sgpa / 10) * 100}%` }} />
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 w-16 text-right">{sem.credits} credits</span>
                </div>
              ))}
            </div>
          </GlassCard>
          <GlassCard className="p-5">
            <h3 className="font-bold text-slate-800 mb-3">Achievements</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: "Academic Excellence Award 2024", icon: "🏆", color: "bg-amber-50 border-amber-200" },
                { title: "Best Project — Data Structures", icon: "🥇", color: "bg-blue-50 border-blue-200" },
                { title: "National Coding Hackathon — Top 10", icon: "💻", color: "bg-emerald-50 border-emerald-200" },
                { title: "Student Council Secretary 2023–24", icon: "🎖️", color: "bg-purple-50 border-purple-200" },
              ].map((a) => (
                <div key={a.title} className={cn("flex items-center gap-3 p-3 rounded-xl border", a.color)}>
                  <span className="text-2xl">{a.icon}</span>
                  <span className="text-sm font-medium text-slate-700">{a.title}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

// ─── ATTENDANCE MODULE ────────────────────────────────────────────────────────
function AttendanceModule() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const calData: Record<string, "present" | "absent" | "holiday"> = {
    "1": "present", "2": "present", "3": "absent", "4": "present", "5": "present",
    "6": "holiday", "7": "holiday", "8": "present", "9": "present", "10": "present",
    "11": "present", "12": "absent", "13": "present", "14": "present", "15": "present",
    "17": "present", "18": "present", "19": "absent", "20": "present", "21": "absent",
  };
  const subjects = [
    { name: "Data Structures", conducted: 42, attended: 38, pct: 90 },
    { name: "Computer Networks", conducted: 38, attended: 32, pct: 84 },
    { name: "Operating Systems", conducted: 36, attended: 30, pct: 83 },
    { name: "Software Engineering", conducted: 40, attended: 33, pct: 82 },
    { name: "Database Management", conducted: 44, attended: 35, pct: 79 },
  ];
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-slate-800">Attendance</h1>
        <p className="text-sm text-slate-500">Semester 6 — February 2025</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<CheckCircle className="w-5 h-5 text-emerald-600" />} label="Overall Attendance" value="89%" color="bg-emerald-50" sub="Above threshold" />
        <StatCard icon={<Calendar className="w-5 h-5 text-blue-600" />} label="Total Classes" value="200" color="bg-blue-50" sub="This semester" />
        <StatCard icon={<CheckCircle className="w-5 h-5 text-emerald-600" />} label="Present" value="178" color="bg-emerald-50" />
        <StatCard icon={<XCircle className="w-5 h-5 text-red-500" />} label="Absent" value="22" color="bg-red-50" sub="Within limit" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <GlassCard className="p-5">
          <h3 className="font-bold text-slate-800 mb-4">February 2025</h3>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div key={i} className="text-center text-xs font-bold text-slate-400 py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {/* Offset for Feb 2025 starting on Saturday */}
            {Array.from({ length: 6 }, (_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: 28 }, (_, i) => {
              const day = String(i + 1);
              const status = calData[day];
              return (
                <div key={day} className={cn(
                  "aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all cursor-default",
                  status === "present" ? "bg-emerald-100 text-emerald-700" :
                    status === "absent" ? "bg-red-100 text-red-600" :
                      status === "holiday" ? "bg-slate-100 text-slate-400" :
                        "text-slate-600 hover:bg-slate-50"
                )}>{day}</div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-4">
            {[["bg-emerald-100", "text-emerald-700", "Present"], ["bg-red-100", "text-red-600", "Absent"], ["bg-slate-100", "text-slate-400", "Holiday"]].map(([bg, tc, label]) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={cn("w-3 h-3 rounded", bg)} />
                <span className={cn("text-xs", tc)}>{label}</span>
              </div>
            ))}
          </div>
        </GlassCard>
        {/* Subject-wise */}
        <GlassCard className="p-5">
          <h3 className="font-bold text-slate-800 mb-4">Subject-wise Attendance</h3>
          <div className="space-y-4">
            {subjects.map((s) => (
              <div key={s.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-slate-700">{s.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{s.attended}/{s.conducted}</span>
                    <span className={cn("text-sm font-bold", s.pct < 75 ? "text-red-600" : s.pct < 85 ? "text-amber-600" : "text-emerald-600")}>{s.pct}%</span>
                  </div>
                </div>
                <div className="bg-slate-100 rounded-full h-2">
                  <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${s.pct}%`, background: s.pct < 75 ? "#ef4444" : s.pct < 85 ? "#f59e0b" : "#10B981" }} />
                </div>
                {s.pct < 80 && <p className="text-xs text-amber-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Borderline — attend more classes</p>}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

// ─── GRADE ENTRY ──────────────────────────────────────────────────────────────
// Full curriculum subjects by semester (same as SubjectsPage)
const allSemSubjects: Record<number, { subject: string; credits: number; internal: number }[]> = {
  1: [
    { subject: "Heritage of Tamils", credits: 1, internal: 0 },
    { subject: "Mathematical Foundations for Engineers", credits: 4, internal: 0 },
    { subject: "Introduction to Engineering", credits: 1, internal: 0 },
    { subject: "Technical English", credits: 2, internal: 0 },
    { subject: "Engineering Physics", credits: 3, internal: 0 },
    { subject: "Engineering Chemistry", credits: 3, internal: 0 },
    { subject: "Problem Solving Techniques", credits: 4, internal: 0 },
    { subject: "Basic Electrical and Electronics Engineering", credits: 4, internal: 0 },
  ],
  2: [
    { subject: "Tamils & Technology", credits: 1, internal: 0 },
    { subject: "Aptitude Essentials", credits: 1, internal: 0 },
    { subject: "Digital Principles and System Design", credits: 3, internal: 0 },
    { subject: "Discrete Mathematics", credits: 4, internal: 0 },
    { subject: "Professional English", credits: 2, internal: 0 },
    { subject: "Semiconductor and Quantum Physics", credits: 3, internal: 0 },
    { subject: "Engineering Graphics", credits: 4, internal: 0 },
    { subject: "Object Oriented Programming using C++", credits: 4, internal: 0 },
    { subject: "Innovation through Design Thinking", credits: 2, internal: 0 },
  ],
  3: [
    { subject: "Computer Organization and Architecture", credits: 3, internal: 0 },
    { subject: "Data Structures", credits: 3, internal: 0 },
    { subject: "Operating Systems", credits: 3, internal: 0 },
    { subject: "Professional Ethics and Human Values", credits: 2, internal: 0 },
    { subject: "Probability and Statistics", credits: 4, internal: 0 },
    { subject: "Computer Networks", credits: 4, internal: 0 },
    { subject: "Data Structures Laboratory", credits: 2, internal: 0 },
    { subject: "Linux System Administration", credits: 1, internal: 0 },
    { subject: "Intellectual Property Rights Study", credits: 2, internal: 0 },
    { subject: "Aptitude Excellence", credits: 1, internal: 0 },
  ],
  4: [
    { subject: "Java for Developers", credits: 3, internal: 0 },
    { subject: "Cryptography and Cyber Security", credits: 3, internal: 0 },
    { subject: "Embedded Systems", credits: 3, internal: 0 },
    { subject: "Elective – Science Stream", credits: 3, internal: 0 },
    { subject: "Design and Analysis of Algorithm", credits: 4, internal: 0 },
    { subject: "Database Management Systems", credits: 4, internal: 0 },
    { subject: "Java Programming Laboratory", credits: 2, internal: 0 },
    { subject: "System Modeling Projects", credits: 2, internal: 0 },
  ],
  5: [
    { subject: "Theory of Computation", credits: 4, internal: 0 },
    { subject: "Object Oriented Analysis and Design", credits: 3, internal: 0 },
    { subject: "Program Elective Course - I", credits: 3, internal: 0 },
    { subject: "Devops and Agile Methodologies", credits: 2, internal: 0 },
    { subject: "Modern Web Technologies", credits: 4, internal: 0 },
    { subject: "Artificial Intelligence", credits: 4, internal: 0 },
    { subject: "Program Elective Course - II", credits: 3, internal: 0 },
    { subject: "Simulation using Modern Tools", credits: 2, internal: 0 },
  ],
  6: [
    { subject: "Project Management and Finance", credits: 2, internal: 18 },
    { subject: "Business Process Management", credits: 3, internal: 27 },
    { subject: "Compiler Design", credits: 4, internal: 35 },
    { subject: "Program Elective Course - III", credits: 3, internal: 25 },
    { subject: "Open Elective Course - I", credits: 3, internal: 22 },
    { subject: "Data Science", credits: 4, internal: 32 },
    { subject: "Program Elective Course - IV", credits: 3, internal: 28 },
    { subject: "Product Development Practice", credits: 2, internal: 18 },
  ],
  7: [
    { subject: "Program Elective Course - V", credits: 3, internal: 0 },
    { subject: "Open Elective Course - II", credits: 3, internal: 0 },
    { subject: "Open Elective Course - III", credits: 3, internal: 0 },
    { subject: "Program Elective Course - VI", credits: 3, internal: 0 },
    { subject: "Mini Project", credits: 3, internal: 0 },
    { subject: "Internship / In-Plant Training", credits: 2, internal: 0 },
  ],
  8: [
    { subject: "Capstone Project / Industry Practices", credits: 6, internal: 0 },
  ],
};

function GradeEntry({ currentUser }: { currentUser?: any }) {
  const [selectedSem, setSelectedSem] = useState<number>(6);
  const [gradesBySem, setGradesBySem] = useState<Record<number, { subject: string; credits: number; internal: number; grade: string }[]>>(
    Object.fromEntries(
      Object.entries(allSemSubjects).map(([sem, subs]) => [
        Number(sem),
        subs.map(s => ({ ...s, grade: "" }))
      ])
    )
  );
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});
  const [toast, setToast] = useState("");
  const gradeOptions = ["O", "A+", "A", "B+", "B", "C", "U"];
  const gradePoints: Record<string, number> = { O: 10, "A+": 9, A: 8, "B+": 7, B: 6, C: 5, U: 0 };

  const gradeData = gradesBySem[selectedSem] || [];
  const filled = gradeData.filter(g => g.grade).length;
  const progress = gradeData.length > 0 ? Math.round((filled / gradeData.length) * 100) : 0;
  const isSubmitted = submitted[selectedSem] || false;

  const semCredits: Record<number, number> = { 1: 22, 2: 24, 3: 25, 4: 24, 5: 25, 6: 24, 7: 17, 8: 6 };

  const handleSubmit = () => {
    if (filled < gradeData.length) { setToast("Please fill all grades before submitting."); return; }
    setSubmitted(prev => ({ ...prev, [selectedSem]: true }));
    setToast(`Semester ${selectedSem} grades submitted for verification!`);
  };

  const creditSubjects = gradeData.filter(g => g.credits > 0);

  return (
    <div className="space-y-6">
      {toast && <Toast msg={toast} onClose={() => setToast("")} />}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Grade Entry</h1>
        <p className="text-sm text-slate-500">{currentUser?.name || "Student"} &bull; {currentUser?.roll || "ID"} &bull; {currentUser?.dept || "Department"}</p>
      </div>

      {/* Semester Selector */}
      <GlassCard className="p-5">
        <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-600" /> Select Semester
        </h3>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
            <button
              key={s}
              onClick={() => setSelectedSem(s)}
              className={cn(
                "flex flex-col items-center py-3 rounded-xl border-2 transition-all duration-200 font-semibold text-sm",
                selectedSem === s
                  ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200"
                  : submitted[s]
                    ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50"
              )}
            >
              <span>Sem {s}</span>
              <span className="text-xs opacity-70 mt-0.5">{semCredits[s]} cr</span>
              {submitted[s] && <CheckCircle className="w-3 h-3 mt-1 text-emerald-500" />}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Progress */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-800">Semester {selectedSem} — Entry Progress</h3>
          <span className="text-sm font-bold text-blue-600">{filled}/{gradeData.length} subjects</span>
        </div>
        <div className="bg-slate-100 rounded-full h-3">
          <div className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs text-slate-500 mt-2">{progress}% complete &bull; Total Credits: {semCredits[selectedSem]}</p>
      </GlassCard>

      {/* Grade Table */}
      <GlassCard className="p-5">
        <h3 className="font-bold text-slate-800 mb-4">Semester {selectedSem} — Subject Grades</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {["Subject", "Credits", "Internal (40)", "Grade", "Grade Points"].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gradeData.map((g, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4 font-medium text-slate-800">{g.subject}</td>
                  <td className="py-4 px-4 text-slate-600">{g.credits}</td>
                  <td className="py-4 px-4 text-slate-600 font-mono">{g.internal > 0 ? `${g.internal}/40` : "—"}</td>
                  <td className="py-4 px-4">
                    <select
                      value={g.grade}
                      disabled={isSubmitted}
                      onChange={(e) => {
                        setGradesBySem(prev => ({
                          ...prev,
                          [selectedSem]: prev[selectedSem].map((x, idx) => idx === i ? { ...x, grade: e.target.value } : x)
                        }));
                      }}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                    >
                      <option value="">Select grade</option>
                      {gradeOptions.map(gr => <option key={gr} value={gr}>{gr}</option>)}
                    </select>
                  </td>
                  <td className="py-4 px-4">
                    {g.grade ? (
                      <span className={cn("font-bold text-lg", g.grade === "U" ? "text-red-600" : gradePoints[g.grade] >= 8 ? "text-emerald-600" : "text-blue-600")}>
                        {gradePoints[g.grade]}
                      </span>
                    ) : <span className="text-slate-300">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-blue-50/50">
                <td className="py-3 px-4 font-bold text-slate-800" colSpan={2}>Estimated SGPA</td>
                <td className="py-3 px-4" colSpan={3}>
                  <span className="text-lg font-bold text-blue-600">
                    {creditSubjects.every(g => g.grade) && creditSubjects.length > 0
                      ? (creditSubjects.reduce((acc, g) => acc + gradePoints[g.grade] * g.credits, 0) / creditSubjects.reduce((acc, g) => acc + g.credits, 0)).toFixed(2)
                      : "—"}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="mt-5 flex gap-3">
          <PrimaryBtn onClick={handleSubmit} disabled={isSubmitted} className="disabled:opacity-60 disabled:cursor-not-allowed" icon={<Send className="w-4 h-4" />}>
            {isSubmitted ? "Submitted for Verification" : `Submit Semester ${selectedSem} Grades`}
          </PrimaryBtn>
          {isSubmitted && <span className="flex items-center gap-2 text-sm text-emerald-600 font-semibold"><CheckCircle className="w-4 h-4" /> Awaiting tutor verification</span>}
        </div>
      </GlassCard>
    </div>
  );
}

// ─── GRADE VERIFICATION ───────────────────────────────────────────────────────
function GradeVerification() {
  const [items, setItems] = useState(gradeVerifications.map(g => ({ ...g, comment: "" })));
  const [toast, setToast] = useState("");

  const handleAction = (id: number, action: "approved" | "rejected") => {
    setItems(prev => prev.map(g => g.id === id ? { ...g, status: action } : g));
    setToast(`Grade ${action} successfully.`);
  };

  const gradeColor: Record<string, string> = { O: "bg-emerald-100 text-emerald-700", "A+": "bg-blue-100 text-blue-700", A: "bg-blue-100 text-blue-700", "B+": "bg-amber-100 text-amber-700", B: "bg-amber-100 text-amber-700" };

  return (
    <div className="space-y-6">
      {toast && <Toast msg={toast} onClose={() => setToast("")} />}
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-800">Grade Verification</h1>
          <p className="text-sm text-slate-500">{items.filter(g => g.status === "pending").length} pending reviews</p></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pending", value: items.filter(g => g.status === "pending").length, color: "bg-amber-50", icon: <Clock className="w-5 h-5 text-amber-600" /> },
          { label: "Approved", value: items.filter(g => g.status === "approved").length, color: "bg-emerald-50", icon: <CheckCircle className="w-5 h-5 text-emerald-600" /> },
          { label: "Rejected", value: items.filter(g => g.status === "rejected").length, color: "bg-red-50", icon: <XCircle className="w-5 h-5 text-red-500" /> },
        ].map(({ label, value, color, icon }) => (
          <GlassCard key={label} className={cn("p-4 flex items-center gap-3", color)}>
            {icon}
            <div><p className="text-xs font-semibold text-slate-500">{label}</p><p className="text-2xl font-bold text-slate-800">{value}</p></div>
          </GlassCard>
        ))}
      </div>
      <div className="space-y-4">
        {items.map((g) => (
          <GlassCard key={g.id} className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                  {g.student[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-800">{g.student}</h3>
                    <span className="text-xs text-slate-400 font-mono">{g.roll}</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">{g.subject} &bull; {g.credits} credits</p>
                  <p className="text-xs text-slate-400">Submitted: {g.submitted}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn("text-2xl font-bold px-3 py-1 rounded-xl", gradeColor[g.grade] || "bg-slate-100 text-slate-700")}>{g.grade}</span>
                <Badge status={g.status} />
              </div>
            </div>
            {g.status === "pending" && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <textarea
                  value={g.comment}
                  onChange={(e) => setItems(prev => prev.map(x => x.id === g.id ? { ...x, comment: e.target.value } : x))}
                  placeholder="Add verification comment (optional)..."
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none mb-3"
                />
                <div className="flex gap-3">
                  <PrimaryBtn onClick={() => handleAction(g.id, "approved")} icon={<CheckCircle className="w-4 h-4" />} className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200">Approve</PrimaryBtn>
                  <button onClick={() => handleAction(g.id, "rejected")} className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl border border-red-200 transition-all text-sm">
                    <XCircle className="w-4 h-4" />Reject
                  </button>
                </div>
              </div>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

// ─── SCHOLARSHIP MODULE ───────────────────────────────────────────────────────
function ScholarshipModule({ currentUser, role }: { currentUser?: any, role: string }) {
  const [toast, setToast] = useState("");
  const [scholarshipsData, setScholarshipsData] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", amount: "", cgpaReq: 0, attendanceReq: 0, deadline: "", docs: "" });

  const fetchData = async () => {
    try {
      const schRes = await fetch(`${API_BASE}/api/scholarships`);
      const schData = await schRes.json();
      setScholarshipsData(Array.isArray(schData) ? schData : []);

      if (currentUser?._id) {
        if (role === 'student') {
          const appRes = await fetch(`${API_BASE}/api/scholarships/student/${currentUser._id}/applications`);
          const appData = await appRes.json();
          setApplications(Array.isArray(appData) ? appData : []);
        } else if (role === 'tutor') {
          const appRes = await fetch(`${API_BASE}/api/scholarships/tutor/${currentUser._id}/applications`);
          const appData = await appRes.json();
          setApplications(Array.isArray(appData) ? appData : []);
        }
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, [currentUser, role]);

  const handleApply = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/scholarships/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentUserId: currentUser?._id, scholarshipId: id })
      });
      if (res.ok) {
        setToast("Applied successfully!");
        fetchData();
      } else setToast("Failed to apply");
    } catch (e) { setToast("Error applying"); }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/scholarships/applications/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, tutorUserId: currentUser?._id })
      });
      if (res.ok) {
        setToast(`Application ${status}`);
        fetchData();
      } else setToast("Failed to update status");
    } catch (e) { setToast("Error updating"); }
  };

  const handleAddScholarship = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/scholarships`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tutorUserId: currentUser?._id,
          ...form,
          docs: form.docs.split(',').map(d => d.trim())
        })
      });
      if (res.ok) {
        setToast("Scholarship added!");
        setForm({ name: "", amount: "", cgpaReq: 0, attendanceReq: 0, deadline: "", docs: "" });
        fetchData();
      } else {
        setToast("Failed to add scholarship (API error). Is the backend running?");
      }
    } catch (e) { setToast("Error adding scholarship"); }
  };

  return (
    <div className="space-y-6">
      {toast && <Toast msg={toast} onClose={() => setToast("")} />}
      <div><h1 className="text-2xl font-bold text-slate-800">Scholarships</h1>
        <p className="text-sm text-slate-500">Academic Year 2024–25</p></div>

      {role === 'tutor' && (
        <GlassCard className="p-5 mb-6">
          <h3 className="font-bold text-slate-800 mb-4">Add New Scholarship</h3>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Scholarship Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
            <input type="text" placeholder="Amount (e.g., $1000)" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
            <input type="number" placeholder="Min CGPA" value={form.cgpaReq || ''} onChange={e => setForm({ ...form, cgpaReq: Number(e.target.value) })} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
            <input type="number" placeholder="Min Attendance %" value={form.attendanceReq || ''} onChange={e => setForm({ ...form, attendanceReq: Number(e.target.value) })} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
            <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
            <input type="text" placeholder="Docs required (comma separated)" value={form.docs} onChange={e => setForm({ ...form, docs: e.target.value })} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
            <PrimaryBtn onClick={handleAddScholarship} className="col-span-2 justify-center">Create Scholarship</PrimaryBtn>
          </div>
        </GlassCard>
      )}

      {role === 'tutor' && applications.length > 0 && (
        <GlassCard className="p-5 mb-6">
          <h3 className="font-bold text-slate-800 mb-4">Pending Applications</h3>
          <div className="space-y-3">
            {applications.map(app => (
              <div key={app._id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-bold text-slate-700">{app.studentId?.name} ({app.studentId?.roll})</p>
                  <p className="text-sm text-slate-500">Applied for: {app.scholarshipId?.name}</p>
                </div>
                {app.status === 'applied' ? (
                  <div className="flex gap-2">
                    <button onClick={() => handleStatusUpdate(app._id, 'selected')} className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-semibold">Select</button>
                    <button onClick={() => handleStatusUpdate(app._id, 'rejected')} className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-semibold">Reject</button>
                  </div>
                ) : (
                  <Badge status={app.status === 'selected' ? 'approved' : 'rejected'} />
                )}
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {scholarshipsData.map((s) => {
          const app = applications.find(a => a.scholarshipId?._id === s._id || a.scholarshipId === s._id);
          const hasApplied = !!app;
          const status = app?.status; // applied, selected, rejected

          return (
            <GlassCard key={s._id} className="p-5 hover:shadow-xl hover:shadow-blue-100/50 transition-all">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-bold text-slate-800 leading-tight">{s.name}</h3>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{s.amount}</p>
                </div>
                {hasApplied && role === 'student' && <Badge status={status === 'selected' ? 'approved' : status === 'rejected' ? 'rejected' : 'pending'} />}
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 font-medium">Min. CGPA</p>
                  <p className="font-bold text-slate-700 mt-0.5">{s.cgpaReq}</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 font-medium">Min. Attendance</p>
                  <p className="font-bold text-slate-700 mt-0.5">{s.attendanceReq}%</p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-500 mb-1.5">Documents Required:</p>
                <div className="flex flex-wrap gap-1.5">
                  {(s.docs || []).map((d: string) => <span key={d} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{d}</span>)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-red-400" />
                  Deadline: <strong className="text-red-500">{new Date(s.deadline).toLocaleDateString()}</strong>
                </div>
                {role === 'student' && !hasApplied && (
                  <PrimaryBtn onClick={() => handleApply(s._id)} icon={<Upload className="w-4 h-4" />} className="text-xs px-3 py-1.5">Apply Now</PrimaryBtn>
                )}
                {role === 'student' && hasApplied && <span className="text-xs text-purple-600 font-semibold flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />{status}</span>}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

// ─── LEAVE MANAGEMENT ─────────────────────────────────────────────────────────
function LeaveManagement({ currentUser }: { currentUser?: any }) {
  const [items, setItems] = useState<any[]>([]);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (currentUser?._id) {
      fetch(`${API_BASE}/api/leaves/tutor/${currentUser._id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setItems(data.map(l => ({
              id: l._id,
              student: l.studentId?.name || 'Unknown',
              roll: l.studentId?.roll || 'N/A',
              reason: l.reason,
              from: new Date(l.startDate).toLocaleDateString(),
              to: new Date(l.endDate).toLocaleDateString(),
              days: Math.ceil((new Date(l.endDate).getTime() - new Date(l.startDate).getTime()) / (1000 * 3600 * 24)) + 1,
              status: l.status,
              remark: ""
            })));
          }
        })
        .catch(err => console.error("Error fetching leaves:", err));
    } else {
      setItems(leaveRequests.map(l => ({ ...l, remark: "" })));
    }
  }, [currentUser]);

  const handleAction = async (id: string, action: "approved" | "rejected") => {
    try {
      const res = await fetch(`${API_BASE}/api/leaves/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action, tutorUserId: currentUser?._id })
      });
      if (res.ok) {
        setItems(prev => prev.map(l => l.id === id ? { ...l, status: action } : l));
        setToast(`Leave ${action}.`);
      } else {
        setToast(`Failed to update leave status.`);
      }
    } catch (err) {
      setToast(`Leave ${action} (mock)`);
      setItems(prev => prev.map(l => l.id === id ? { ...l, status: action } : l));
    }
  };

  return (
    <div className="space-y-6">
      {toast && <Toast msg={toast} onClose={() => setToast("")} />}
      <div><h1 className="text-2xl font-bold text-slate-800">Leave Management</h1>
        <p className="text-sm text-slate-500">{items.filter(l => l.status === "pending").length} requests pending</p></div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pending", count: items.filter(l => l.status === "pending").length, color: "bg-amber-50", iconColor: "text-amber-600" },
          { label: "Approved", count: items.filter(l => l.status === "approved").length, color: "bg-emerald-50", iconColor: "text-emerald-600" },
          { label: "Rejected", count: items.filter(l => l.status === "rejected").length, color: "bg-red-50", iconColor: "text-red-500" },
        ].map(({ label, count, color, iconColor }) => (
          <GlassCard key={label} className={cn("p-4 flex items-center gap-3", color)}>
            <ClipboardList className={cn("w-5 h-5", iconColor)} />
            <div><p className="text-xs font-semibold text-slate-500">{label}</p><p className="text-2xl font-bold text-slate-800">{count}</p></div>
          </GlassCard>
        ))}
      </div>
      <div className="space-y-4">
        {items.map((l) => (
          <GlassCard key={l.id} className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">{l.student[0]}</div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-800">{l.student}</h3>
                    <span className="text-xs text-slate-400 font-mono">{l.roll}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{l.reason}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-400 flex items-center gap-1"><Calendar className="w-3 h-3" />{l.from} → {l.to}</span>
                    <span className="text-xs font-semibold text-blue-600">{l.days} days</span>
                  </div>
                </div>
              </div>
              <Badge status={l.status} />
            </div>
            {l.status === "pending" && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <textarea
                  value={l.remark}
                  onChange={(e) => setItems(prev => prev.map(x => x.id === l.id ? { ...x, remark: e.target.value } : x))}
                  placeholder="Add remarks (optional)..."
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none mb-3"
                />
                <div className="flex gap-3">
                  <PrimaryBtn onClick={() => handleAction(l.id, "approved")} icon={<CheckCircle className="w-4 h-4" />} className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200">Approve</PrimaryBtn>
                  <button onClick={() => handleAction(l.id, "rejected")} className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl border border-red-200 transition-all text-sm">
                    <XCircle className="w-4 h-4" />Reject
                  </button>
                </div>
              </div>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

// ─── LEAVE REQUEST (Student) ──────────────────────────────────────────────────
function LeaveRequest({ currentUser }: { currentUser?: any }) {
  const [form, setForm] = useState({ reason: "", from: "", to: "", type: "medical" });
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState("");
  const [myLeaves, setMyLeaves] = useState<any[]>([]);

  const fetchMyLeaves = () => {
    if (currentUser?._id) {
      fetch(`${API_BASE}/api/leaves/student/${currentUser._id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setMyLeaves(data);
          }
        })
        .catch(err => console.error(err));
    } else {
      setMyLeaves(leaveRequests);
    }
  };

  useEffect(() => {
    fetchMyLeaves();
  }, [currentUser]);

  const handleSubmit = async () => {
    if (!form.reason || !form.from || !form.to) { setToast("Please fill all fields."); return; }
    setSubmitted(true);
    try {
      if (currentUser?._id) {
        const res = await fetch(`${API_BASE}/api/leaves`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentUserId: currentUser._id,
            reason: `${form.type}: ${form.reason}`,
            startDate: form.from,
            endDate: form.to
          })
        });
        if (res.ok) {
          setToast("Leave request submitted successfully!");
          fetchMyLeaves();
          setForm({ reason: "", from: "", to: "", type: "medical" });
        } else {
          setToast("Failed to submit request.");
        }
      } else {
        setToast("Leave request submitted (mock)!");
      }
    } catch (error) {
      setToast("Error submitting leave request.");
    }
    setSubmitted(false);
  };

  return (
    <div className="space-y-6">
      {toast && <Toast msg={toast} onClose={() => setToast("")} />}
      <div><h1 className="text-2xl font-bold text-slate-800">Apply for Leave</h1>
        <p className="text-sm text-slate-500">{currentUser?.name || "Student"} &bull; {currentUser?.roll || "ID"}</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="font-bold text-slate-800 mb-4">Leave Application Form</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">Leave Type</label>
              <select value={form.type} onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
                {["medical", "personal", "academic-event", "family"].map(t => <option key={t} value={t} className="capitalize">{t.replace("-", " ")}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">From Date</label>
                <input type="date" value={form.from} onChange={(e) => setForm(f => ({ ...f, from: e.target.value }))} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">To Date</label>
                <input type="date" value={form.to} onChange={(e) => setForm(f => ({ ...f, to: e.target.value }))} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">Reason</label>
              <textarea value={form.reason} onChange={(e) => setForm(f => ({ ...f, reason: e.target.value }))} rows={4} placeholder="Describe the reason for your leave request..." className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">Supporting Document (optional)</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-blue-300 transition-colors cursor-pointer">
                <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                <p className="text-xs text-slate-500">Click to upload or drag & drop</p>
                <p className="text-xs text-slate-400">PDF, JPG, PNG up to 5MB</p>
              </div>
            </div>
            <PrimaryBtn onClick={handleSubmit} disabled={submitted} className="w-full justify-center disabled:opacity-60" icon={<Send className="w-4 h-4" />}>
              {submitted ? "Submitting..." : "Submit Leave Request"}
            </PrimaryBtn>
          </div>
        </GlassCard>
        <div className="space-y-5">
          <GlassCard className="p-5">
            <h3 className="font-bold text-slate-800 mb-3">Leave Balance</h3>
            {[{ type: "Medical Leave", used: 2, total: 10, color: "bg-blue-500" }, { type: "Personal Leave", used: 1, total: 5, color: "bg-purple-500" }, { type: "Academic Event", used: 3, total: 8, color: "bg-emerald-500" }].map((lb) => (
              <div key={lb.type} className="mb-4">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-slate-700">{lb.type}</span>
                  <span className="text-slate-500">{lb.used}/{lb.total} used</span>
                </div>
                <div className="bg-slate-100 rounded-full h-2">
                  <div className={cn("h-2 rounded-full", lb.color)} style={{ width: `${(lb.used / lb.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </GlassCard>
          <GlassCard className="p-5">
            <h3 className="font-bold text-slate-800 mb-3">Recent Requests</h3>
            <div className="space-y-3">
              {myLeaves.length > 0 ? myLeaves.slice(0, 5).map((l, i) => (
                <div key={l._id || i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700">{l.reason}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{l.startDate ? new Date(l.startDate).toLocaleDateString() : l.from} → {l.endDate ? new Date(l.endDate).toLocaleDateString() : l.to}</p>
                  </div>
                  <Badge status={l.status} />
                </div>
              )) : (
                <p className="text-sm text-slate-500">No recent requests.</p>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

// ─── TUTOR ASSISTANCE ─────────────────────────────────────────────────────────
function TutorAssistanceModule() {
  const [selected, setSelected] = useState<null | typeof tutorAssistanceRecords[0]>(null);
  const [notes, setNotes] = useState("");
  const [toast, setToast] = useState("");

  return (
    <div className="space-y-6">
      {toast && <Toast msg={toast} onClose={() => setToast("")} />}
      <div><h1 className="text-2xl font-bold text-slate-800">Tutor Assistance</h1>
        <p className="text-sm text-slate-500">{tutorAssistanceRecords.length} active cases</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {tutorAssistanceRecords.map((c) => (
            <GlassCard key={c.id} className={cn("p-5 cursor-pointer hover:shadow-xl transition-all", selected?.id === c.id ? "border-blue-400 ring-2 ring-blue-200" : "")} onClick={() => setSelected(c)}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">{c.student[0]}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-800">{c.student}</h3>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{c.sessions} sessions</span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">{c.roll}</p>
                  <p className="text-sm text-slate-600 mt-2 line-clamp-2">{c.notes}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-slate-400 flex items-center gap-1"><Calendar className="w-3 h-3" />Last: {c.date}</span>
                    <span className="text-xs text-blue-600 font-semibold flex items-center gap-1"><Clock className="w-3 h-3" />Follow-up: {c.followUp}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
        {selected ? (
          <GlassCard className="p-5 h-fit sticky top-24">
            <h3 className="font-bold text-slate-800 mb-4">Session Details — {selected.student}</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-xs font-bold text-blue-600 mb-1">Tutor Assistance Notes</p>
                <p className="text-sm text-slate-700">{selected.notes}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500">Meeting Date</p>
                  <p className="text-sm font-semibold text-slate-800">{selected.date}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500">Next Follow-up</p>
                  <p className="text-sm font-semibold text-blue-600">{selected.followUp}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-2">Session History</h4>
                <div className="space-y-2">
                  {Array.from({ length: selected.sessions }, (_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                      <div className="flex-1 h-px bg-slate-200" />
                      <span className="text-xs text-slate-500">Session {i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">Add Session Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Enter tutor assistance notes for this session..." className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none" />
              </div>
              <PrimaryBtn onClick={() => { setNotes(""); setToast("Session notes saved!"); }} icon={<Send className="w-4 h-4" />} className="w-full justify-center">Save Notes</PrimaryBtn>
            </div>
          </GlassCard>
        ) : (
          <GlassCard className="p-10 flex flex-col items-center justify-center text-center">
            <MessageSquare className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">Select a student to view tutor assistance details</p>
          </GlassCard>
        )}
      </div>
    </div>
  );
}

// ─── REPORTS ──────────────────────────────────────────────────────────────────
function Reports() {
  const [toast, setToast] = useState("");
  return (
    <div className="space-y-6">
      {toast && <Toast msg={toast} onClose={() => setToast("")} />}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div><h1 className="text-2xl font-bold text-slate-800">Reports</h1>
          <p className="text-sm text-slate-500">Academic Year 2024–25</p></div>
        <div className="flex gap-2">
          <PrimaryBtn onClick={() => setToast("Exporting PDF report...")} icon={<Download className="w-4 h-4" />}>Export PDF</PrimaryBtn>
          <SecondaryBtn onClick={() => setToast("Exporting Excel report...")}>
            <FileText className="w-4 h-4" />Export Excel
          </SecondaryBtn>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-5">
          <h3 className="font-bold text-slate-800 mb-4">Attendance Report</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={attendanceData}>
              <defs>
                <linearGradient id="repPresent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="repAbsent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", fontSize: "13px" }} />
              <Area type="monotone" dataKey="present" name="Present" stroke="#10B981" fill="url(#repPresent)" strokeWidth={2} />
              <Area type="monotone" dataKey="absent" name="Absent" stroke="#ef4444" fill="url(#repAbsent)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500"><div className="w-3 h-3 rounded bg-emerald-500" />Present</div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500"><div className="w-3 h-3 rounded bg-red-500" />Absent</div>
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <h3 className="font-bold text-slate-800 mb-4">CGPA Distribution Report</h3>
          <SimpleBarChart data={cgpaData} dataKey="count" nameKey="range" color="#2563EB" height={220} />
        </GlassCard>
        <GlassCard className="p-5">
          <h3 className="font-bold text-slate-800 mb-4">Scholarship Report</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RechartsPieChart>
              <Pie data={scholarshipData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {scholarshipData.map((d, i) => <Cell key={`schol-pie-${d.name}`} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", fontSize: "12px" }} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </GlassCard>
        <GlassCard className="p-5">
          <h3 className="font-bold text-slate-800 mb-4">CSE Semester-wise Enrollment</h3>
          <div className="space-y-3">
            {deptStudentData.map((d) => (
              <div key={d.name} className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-700 w-12">{d.name}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-3">
                  <div className="h-3 rounded-full transition-all" style={{ width: `${(d.students / 100) * 100}%`, background: d.fill }} />
                </div>
                <span className="text-sm font-bold text-slate-700 w-10 text-right">{d.students}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
function NotificationsPage({ onMarkRead }: { onMarkRead: () => void }) {
  const [items, setItems] = useState(notifications);
  const typeIcon: Record<string, React.ReactNode> = {
    grade: <BookMarked className="w-4 h-4 text-blue-600" />,
    leave: <ClipboardList className="w-4 h-4 text-purple-600" />,
    scholarship: <Award className="w-4 h-4 text-amber-600" />,
    warning: <AlertCircle className="w-4 h-4 text-red-500" />,
    "tutor-assistance": <MessageSquare className="w-4 h-4 text-emerald-600" />,
    announcement: <Bell className="w-4 h-4 text-slate-500" />,
  };
  const typeColor: Record<string, string> = {
    grade: "bg-blue-50", leave: "bg-purple-50", scholarship: "bg-amber-50",
    warning: "bg-red-50", "tutor-assistance": "bg-emerald-50", announcement: "bg-slate-50",
  };
  const markAll = () => { setItems(prev => prev.map(n => ({ ...n, read: true }))); onMarkRead(); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
          <p className="text-sm text-slate-500">{items.filter(n => !n.read).length} unread</p></div>
        <SecondaryBtn onClick={markAll}><Check className="w-4 h-4" />Mark all read</SecondaryBtn>
      </div>
      <div className="space-y-3">
        {items.map((n) => (
          <GlassCard key={n.id} className={cn("p-4 flex items-start gap-4 hover:shadow-lg transition-all cursor-pointer", !n.read ? "border-blue-200 bg-blue-50/50" : "")}
            onClick={() => setItems(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}>
            <div className={cn("p-2.5 rounded-xl flex-shrink-0", typeColor[n.type])}>{typeIcon[n.type]}</div>
            <div className="flex-1">
              <p className={cn("text-sm", n.read ? "text-slate-600" : "text-slate-800 font-semibold")}>{n.title}</p>
              <p className="text-xs text-slate-400 mt-1">{n.time}</p>
            </div>
            {!n.read && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />}
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
function SettingsPage({ role, currentUser }: { role: Role, currentUser?: any }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [toast, setToast] = useState("");
  const tabs = ["profile", "password", "notifications", "security"];
  const roleInfo: Record<Role, { name: string; email: string; dept: string }> = {
    admin: { name: "Dr. Meera Krishnan", email: "admin@tutorverse.edu", dept: "University Administration" },
    tutor: { name: "Prof. Amit Verma", email: "tutor@tutorverse.edu", dept: "Computer Science" },
    student: { name: "Arjun Sharma", email: "student@tutorverse.edu", dept: "Computer Science, Sem 6" },
    parent: { name: "Rajesh Sharma", email: "parent@tutorverse.edu", dept: "Parent of Arjun Sharma" },
  };
  const info = {
    name: currentUser?.name || roleInfo[role].name,
    email: currentUser?.email || roleInfo[role].email,
    dept: currentUser?.dept || roleInfo[role].dept,
    phone: "+91 9876543000"
  };
  const [editInfo, setEditInfo] = useState(info);

  const handleProfileUpdate = async () => {
    if (currentUser?._id) {
      try {
        const res = await fetch(`${API_BASE}/api/users/${currentUser._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: editInfo.name, email: editInfo.email, phone: editInfo.phone })
        });
        if (res.ok) {
          setToast("Profile updated successfully in DB!");
        } else {
          setToast("Failed to update profile.");
        }
      } catch (err) {
        setToast("Error updating profile.");
      }
    } else {
      setToast("Profile updated (mock)!");
    }
  };

  return (
    <div className="space-y-6">
      {toast && <Toast msg={toast} onClose={() => setToast("")} />}
      <div><h1 className="text-2xl font-bold text-slate-800">Settings</h1></div>
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={cn("px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all", activeTab === t ? "bg-blue-600 text-white shadow-md" : "bg-white text-slate-600 hover:bg-blue-50 border border-slate-200")}>
            {t}
          </button>
        ))}
      </div>
      {activeTab === "profile" && (
        <GlassCard className="p-6 max-w-xl">
          <h3 className="font-bold text-slate-800 mb-5">Profile Information</h3>
          <div className="flex items-center gap-4 mb-6">
            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg",
              role === "admin" ? "bg-gradient-to-br from-blue-500 to-blue-700" :
                role === "tutor" ? "bg-gradient-to-br from-purple-500 to-purple-700" :
                  role === "student" ? "bg-gradient-to-br from-emerald-500 to-emerald-700" : "bg-gradient-to-br from-amber-500 to-amber-700"
            )}>{info.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}</div>
            <div>
              <p className="font-bold text-slate-800">{info.name}</p>
              <p className="text-sm text-slate-500">{info.dept}</p>
              <button className="text-xs text-blue-600 hover:text-blue-800 font-semibold mt-1 flex items-center gap-1"><Upload className="w-3 h-3" />Change Avatar</button>
            </div>
          </div>
          <div className="space-y-4">
            {[["Full Name", "name"], ["Email", "email"], ["Department", "dept"], ["Phone", "phone"]].map(([label, key]) => (
              <div key={label}>
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">{label}</label>
                <input
                  value={(editInfo as any)[key] || ""}
                  onChange={(e) => setEditInfo({ ...editInfo, [key]: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            ))}
            <PrimaryBtn onClick={handleProfileUpdate} icon={<Check className="w-4 h-4" />}>Save Changes</PrimaryBtn>
          </div>
        </GlassCard>
      )}
      {activeTab === "password" && (
        <GlassCard className="p-6 max-w-xl">
          <h3 className="font-bold text-slate-800 mb-5">Change Password</h3>
          <div className="space-y-4">
            {["Current Password", "New Password", "Confirm New Password"].map((label) => (
              <div key={label}>
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">{label}</label>
                <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="password" placeholder="••••••••" className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>
              </div>
            ))}
            <PrimaryBtn onClick={() => setToast("Password updated!")} icon={<Shield className="w-4 h-4" />}>Update Password</PrimaryBtn>
          </div>
        </GlassCard>
      )}
      {activeTab === "notifications" && (
        <GlassCard className="p-6 max-w-xl">
          <h3 className="font-bold text-slate-800 mb-5">Notification Preferences</h3>
          <div className="space-y-4">
            {[["Grade Updates", true], ["Attendance Alerts", true], ["Leave Status", true], ["Scholarship Deadlines", true], ["Announcements", false], ["Tutor Assistance Reminders", true]].map(([label, def]) => (
              <div key={label as string} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-sm font-medium text-slate-700">{label as string}</span>
                <button className={cn("w-12 h-6 rounded-full transition-all duration-200 relative", def ? "bg-blue-600" : "bg-slate-300")}>
                  <div className={cn("absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200", def ? "left-6" : "left-0.5")} />
                </button>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
      {activeTab === "security" && (
        <GlassCard className="p-6 max-w-xl">
          <h3 className="font-bold text-slate-800 mb-5">Security Settings</h3>
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
              <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-800">Two-Factor Authentication</p>
                <p className="text-xs text-emerald-600">Add an extra layer of security to your account</p>
              </div>
              <PrimaryBtn className="ml-auto text-xs px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 whitespace-nowrap">Enable 2FA</PrimaryBtn>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-sm font-semibold text-slate-700 mb-1">Active Sessions</p>
              <p className="text-xs text-slate-500 mb-3">You are currently logged in from 1 device</p>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><Shield className="w-4 h-4 text-blue-600" /></div>
                <div><p className="text-xs font-semibold text-slate-700">Chrome on Windows</p>
                  <p className="text-xs text-slate-400">Last active: Just now &bull; Mumbai, India</p></div>
                <span className="ml-auto text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Current</span>
              </div>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}

// ─── TUTORS PAGE ──────────────────────────────────────────────────────────────
function TutorsPage() {
  const [tutors, setTutors] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/users/tutors`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTutors(data.map(t => ({
            id: t._id,
            name: t.name,
            dept: t.dept || "Computer Science",
            students: t.students ? t.students.length : 0,
            exp: "N/A", // Not stored in DB yet
            rating: 4.5, // Not stored in DB yet
            email: t.email
          })));
        }
      })
      .catch(console.error);
  }, []);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-800">Tutors</h1>
          <p className="text-sm text-slate-500">{tutors.length} faculty members</p></div>
        <PrimaryBtn icon={<Plus className="w-4 h-4" />}>Add Tutor</PrimaryBtn>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tutors.map((t) => (
          <GlassCard key={t.name} className="p-5 hover:shadow-xl hover:shadow-blue-100/50 transition-all hover:-translate-y-0.5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">{t.name.split(" ").map(n => n[0]).filter(Boolean).slice(0, 2).join("")}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 truncate">{t.name}</h3>
                <p className="text-xs text-slate-500">{t.dept}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-bold text-amber-600">{t.rating}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="p-2 bg-slate-50 rounded-lg text-center">
                <p className="text-xs text-slate-500">Students</p>
                <p className="font-bold text-slate-800">{t.students}</p>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg text-center">
                <p className="text-xs text-slate-500">Experience</p>
                <p className="font-bold text-slate-800">{t.exp}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1 mb-3"><Mail className="w-3 h-3" />{t.email}</p>
            <div className="flex gap-2">
              <SecondaryBtn className="flex-1 justify-center text-xs py-1.5">View Profile</SecondaryBtn>
              <button className="p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-red-400" /></button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

// ─── DEPARTMENTS PAGE ─────────────────────────────────────────────────────────
// ─── SUBJECTS PAGE ────────────────────────────────────────────────────────────
function SubjectsPage() {
  const [semFilter, setSemFilter] = useState<number | "all">("all");
  const subjects = [
    { code: "23SH11C", name: "Heritage of Tamils", credits: 1, sem: 1, category: "HSMC", type: "Theory" },
    { code: "23SH12C", name: "Mathematical Foundations for Engineers", credits: 4, sem: 1, category: "BSC", type: "Theory" },
    { code: "23SH13C", name: "Introduction to Engineering", credits: 1, sem: 1, category: "ESC", type: "Theory" },
    { code: "23SH14C", name: "Technical English", credits: 2, sem: 1, category: "HSMC", type: "Integrated" },
    { code: "23SH15C", name: "Engineering Physics", credits: 3, sem: 1, category: "BSC", type: "Integrated" },
    { code: "23SH16C", name: "Engineering Chemistry", credits: 3, sem: 1, category: "BSC", type: "Integrated" },
    { code: "23CS11C", name: "Problem Solving Techniques", credits: 4, sem: 1, category: "ESC", type: "Integrated" },
    { code: "23EE11C", name: "Basic Electrical and Electronics Engineering", credits: 4, sem: 1, category: "ESC", type: "Integrated" },
    { code: "23SH21C", name: "Tamils & Technology", credits: 1, sem: 2, category: "HSMC", type: "Theory" },
    { code: "23GN01C", name: "Aptitude Essentials", credits: 1, sem: 2, category: "EEC", type: "Theory" },
    { code: "23CS21C", name: "Digital Principles and System Design", credits: 3, sem: 2, category: "ESC", type: "Theory" },
    { code: "23CS22C", name: "Discrete Mathematics", credits: 4, sem: 2, category: "BSC", type: "Theory" },
    { code: "23SH22C", name: "Professional English", credits: 2, sem: 2, category: "HSMC", type: "Integrated" },
    { code: "23CS23C", name: "Semiconductor and Quantum Physics", credits: 3, sem: 2, category: "ESC", type: "Integrated" },
    { code: "23ME11C", name: "Engineering Graphics", credits: 4, sem: 2, category: "ESC", type: "Integrated" },
    { code: "23CS24C", name: "Object Oriented Programming using C++", credits: 4, sem: 2, category: "PCC", type: "Integrated" },
    { code: "23GN02C", name: "Innovation through Design Thinking", credits: 2, sem: 2, category: "EEC", type: "Practical" },
    { code: "23CS31C", name: "Computer Organization and Architecture", credits: 3, sem: 3, category: "PCC", type: "Theory" },
    { code: "23CS32C", name: "Data Structures", credits: 3, sem: 3, category: "PCC", type: "Theory" },
    { code: "23CS33C", name: "Operating Systems", credits: 3, sem: 3, category: "PCC", type: "Theory" },
    { code: "23GN05C", name: "Professional Ethics and Human Values", credits: 2, sem: 3, category: "HSMC", type: "Theory" },
    { code: "23CS34C", name: "Probability and Statistics", credits: 4, sem: 3, category: "BSC", type: "Theory" },
    { code: "23CS35C", name: "Computer Networks", credits: 4, sem: 3, category: "PCC", type: "Integrated" },
    { code: "23CS36C", name: "Data Structures Laboratory", credits: 2, sem: 3, category: "PCC", type: "Practical" },
    { code: "23CS37C", name: "Linux System Administration", credits: 1, sem: 3, category: "PCC", type: "Practical" },
    { code: "23GN03C", name: "Intellectual Property Rights Study", credits: 2, sem: 3, category: "EEC", type: "Practical" },
    { code: "23GN04C", name: "Aptitude Excellence", credits: 1, sem: 3, category: "EEC", type: "Practical" },
    { code: "23CS41C", name: "Java for Developers", credits: 3, sem: 4, category: "PCC", type: "Theory" },
    { code: "23CS42C", name: "Cryptography and Cyber Security", credits: 3, sem: 4, category: "PCC", type: "Theory" },
    { code: "23CS43C", name: "Embedded Systems", credits: 3, sem: 4, category: "ESC", type: "Theory" },
    { code: "23SHXXE", name: "Elective – Science Stream", credits: 3, sem: 4, category: "BSC", type: "Theory" },
    { code: "23MC02C", name: "Environmental Science and Engineering", credits: 0, sem: 4, category: "MC", type: "Theory" },
    { code: "23CS44C", name: "Design and Analysis of Algorithm", credits: 4, sem: 4, category: "PCC", type: "Integrated" },
    { code: "23CS45C", name: "Database Management Systems", credits: 4, sem: 4, category: "PCC", type: "Integrated" },
    { code: "23CS46C", name: "Java Programming Laboratory", credits: 2, sem: 4, category: "PCC", type: "Practical" },
    { code: "23CS47C", name: "System Modeling Projects", credits: 2, sem: 4, category: "EEC", type: "Practical" },
    { code: "23CS51C", name: "Theory of Computation", credits: 4, sem: 5, category: "PCC", type: "Theory" },
    { code: "23CS52C", name: "Object Oriented Analysis and Design", credits: 3, sem: 5, category: "PCC", type: "Theory" },
    { code: "23CSCSE", name: "Program Elective Course - I", credits: 3, sem: 5, category: "PEC", type: "Theory" },
    { code: "23CS53C", name: "Devops and Agile Methodologies", credits: 2, sem: 5, category: "PCC", type: "Integrated" },
    { code: "23CS54C", name: "Modern Web Technologies", credits: 4, sem: 5, category: "PCC", type: "Integrated" },
    { code: "23CS55C", name: "Artificial Intelligence", credits: 4, sem: 5, category: "PCC", type: "Integrated" },
    { code: "23CSCSE", name: "Program Elective Course - II", credits: 3, sem: 5, category: "PEC", type: "Integrated" },
    { code: "23CS56C", name: "Simulation using Modern Tools", credits: 2, sem: 5, category: "EEC", type: "Practical" },
    { code: "23GN06C", name: "Project Management and Finance", credits: 2, sem: 6, category: "HSMC", type: "Theory" },
    { code: "23CS61C", name: "Business Process Management", credits: 3, sem: 6, category: "PCC", type: "Theory" },
    { code: "23CS62C", name: "Compiler Design", credits: 4, sem: 6, category: "PCC", type: "Theory" },
    { code: "23CSCSE", name: "Program Elective Course - III", credits: 3, sem: 6, category: "PEC", type: "Theory" },
    { code: "23YYXXN", name: "Open Elective Course - I", credits: 3, sem: 6, category: "OEC", type: "Theory" },
    { code: "23MC01C", name: "Constitution of India", credits: 0, sem: 6, category: "MC", type: "Theory" },
    { code: "23CS63C", name: "Data Science", credits: 4, sem: 6, category: "PCC", type: "Integrated" },
    { code: "23CSXXE", name: "Program Elective Course - IV", credits: 3, sem: 6, category: "PEC", type: "Integrated" },
    { code: "23CS64C", name: "Product Development Practice", credits: 2, sem: 6, category: "EEC", type: "Practical" },
    { code: "23CSCSE", name: "Program Elective Course - V", credits: 3, sem: 7, category: "PEC", type: "Theory" },
    { code: "23YYXXE", name: "Open Elective Course - II", credits: 3, sem: 7, category: "OEC", type: "Theory" },
    { code: "23YYXXE", name: "Open Elective Course - III", credits: 3, sem: 7, category: "OEC", type: "Theory" },
    { code: "23CSXXE", name: "Program Elective Course - VI", credits: 3, sem: 7, category: "PEC", type: "Practical" },
    { code: "23CS71C", name: "Mini Project", credits: 3, sem: 7, category: "EEC", type: "Practical" },
    { code: "23CS72C", name: "Internship / In-Plant Training", credits: 2, sem: 7, category: "EEC", type: "Practical" },
    { code: "23CS81C", name: "Capstone Project / Industry Practices", credits: 6, sem: 8, category: "EEC", type: "Practical" },
  ];
  const semCredits: Record<number, number> = { 1: 22, 2: 24, 3: 25, 4: 24, 5: 25, 6: 24, 7: 17, 8: 6 };
  const filtered = semFilter === "all" ? subjects : subjects.filter(s => s.sem === semFilter);
  const catColor: Record<string, string> = {
    PCC: "bg-blue-100 text-blue-700", BSC: "bg-purple-100 text-purple-700",
    ESC: "bg-emerald-100 text-emerald-700", HSMC: "bg-amber-100 text-amber-700",
    PEC: "bg-indigo-100 text-indigo-700", OEC: "bg-teal-100 text-teal-700",
    EEC: "bg-pink-100 text-pink-700", MC: "bg-slate-100 text-slate-500",
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-800">Subjects — CSE</h1>
          <p className="text-sm text-slate-500">{filtered.length} subjects · Total Credits: 167</p></div>
        <PrimaryBtn icon={<Plus className="w-4 h-4" />}>Add Subject</PrimaryBtn>
      </div>
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setSemFilter("all")} className={cn("px-3 py-1.5 rounded-xl text-xs font-semibold transition-all", semFilter === "all" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}>All Sems</button>
        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
          <button key={s} onClick={() => setSemFilter(s)} className={cn("px-3 py-1.5 rounded-xl text-xs font-semibold transition-all", semFilter === s ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}>
            Sem {s} <span className="ml-1 opacity-70">({semCredits[s]} cr)</span>
          </button>
        ))}
      </div>
      <GlassCard className="p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {["Code", "Subject Name", "Category", "Credits", "Semester", "Type", "Actions"].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={`${s.code}-${i}`} className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-blue-600 font-bold">{s.code}</td>
                  <td className="py-3 px-4 font-medium text-slate-800">{s.name}</td>
                  <td className="py-3 px-4"><span className={cn("text-xs px-2 py-0.5 rounded-full font-semibold", catColor[s.category] || "bg-slate-100 text-slate-600")}>{s.category}</span></td>
                  <td className="py-3 px-4"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">{s.credits}</span></td>
                  <td className="py-3 px-4 text-slate-600">Sem {s.sem}</td>
                  <td className="py-3 px-4"><span className={cn("text-xs px-2 py-0.5 rounded-full font-semibold", s.type === "Theory" ? "bg-emerald-100 text-emerald-700" : s.type === "Integrated" ? "bg-sky-100 text-sky-700" : "bg-amber-100 text-amber-700")}>{s.type}</span></td>
                  <td className="py-3 px-4"><div className="flex gap-1">
                    <button className="p-1.5 hover:bg-amber-100 rounded-lg"><Edit2 className="w-3.5 h-3.5 text-amber-600" /></button>
                    <button className="p-1.5 hover:bg-red-100 rounded-lg"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [role, setRole] = useState<Role>("admin");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [page, setPage] = useState<Page>("login");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(3);

  const isLogin = page === "login";
  const SIDEBAR_W = sidebarCollapsed ? "pl-16" : "pl-60";

  const navigate = (p: Page) => {
    if (p === "login") { setPage("login"); return; }
    setPage(p);
  };

  const handleLogin = (user: any) => {
    setRole(user.role);
    setCurrentUser(user);
    setPage("dashboard");
  };

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        if (role === "admin") return <AdminDashboard onNavigate={navigate} />;
        if (role === "tutor") return <TutorDashboard onNavigate={navigate} currentUser={currentUser} />;
        if (role === "student") return <StudentDashboard onNavigate={navigate} currentUser={currentUser} />;
        if (role === "parent") return <ParentDashboard currentUser={currentUser} />;
        return null;
      case "students": return <StudentManagement onViewProfile={() => navigate("student-profile")} currentUser={currentUser} role={role} />;
      case "student-profile": return <StudentProfile onBack={() => navigate("students")} />;
      case "tutors": return <TutorsPage />;
      case "subjects": return <SubjectsPage />;
      case "attendance": return <AttendanceModule />;
      case "grades": return <GradeEntry currentUser={currentUser} />;
      case "grade-verify": return <GradeVerification />;
      case "scholarship-module": return <ScholarshipModule currentUser={currentUser} role={role} />;
      case "leave": return <LeaveRequest currentUser={currentUser} />;
      case "leave-mgmt": return <LeaveManagement currentUser={currentUser} />;
      case "tutor-assistance": return <TutorAssistanceModule />;
      case "reports": return <Reports />;
      case "notifications": return <NotificationsPage onMarkRead={() => setUnreadNotifs(0)} />;
      case "settings": return <SettingsPage role={role} currentUser={currentUser} />;
      default: return <AdminDashboard onNavigate={navigate} />;
    }
  };

  if (isLogin) return <LoginPage onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 font-['Inter',sans-serif]">
      <Sidebar role={role} currentPage={page} onNavigate={navigate} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(v => !v)} />
      <div className={cn("transition-all duration-300", SIDEBAR_W)}>
        <Navbar role={role} unread={unreadNotifs} onNotifClick={() => navigate("notifications")} onNavigate={navigate} currentUser={currentUser} />
        <main className="p-6 min-h-[calc(100vh-64px)]">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
