"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/footer/Footer";
import { getProfile } from "@/lib/profiles";
import { useProfile } from "@/contexts/ProfileContext";
import {
  User,
  MapPin,
  Heart,
  Plus,
  Settings,
  Globe,
  Moon,
  Home,
  Users,
  X,
  Menu,
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function DashboardLayout({
  children,
  title = "Dashboard",
  subtitle = "Manage your travel journal",
}: DashboardLayoutProps) {
  const [user, setUser] = useState<any>(null);
  const [localProfile, setLocalProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { profile: contextProfile, updateProfile: updateContextProfile } =
    useProfile();

  // Close sidebar when clicking outside
  const closeSidebar = () => setSidebarOpen(false);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setUser(session.user);

      // Load user profile to get display name
      const userProfile = await getProfile(session.user.id);
      console.log("DashboardLayout - User profile loaded:", userProfile);
      if (userProfile) {
        setLocalProfile(userProfile);
        updateContextProfile(userProfile);
        console.log("DashboardLayout - Profile set to state:", userProfile);
      } else {
        console.log("DashboardLayout - No profile found for user");
      }

      setLoading(false);
    };

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex min-h-screen">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 backdrop-blur-sm bg-white/30 z-30 lg:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Left Sidebar */}
        <div
          className={`
            fixed lg:static inset-y-0 left-0 z-40 w-80 bg-white border-r border-gray-200 flex flex-col
            transform transition-transform duration-300 ease-in-out shadow-lg lg:shadow-none
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
          `}
        >
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Menu</h3>
            <button
              onClick={closeSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* User Profile Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {(() => {
                    const displayName =
                      contextProfile?.["display-name"] ||
                      localProfile?.["display-name"] ||
                      user?.user_metadata?.full_name ||
                      user?.email?.split("@")[0] ||
                      "User";
                    console.log("DashboardLayout - Rendering display name:", {
                      contextProfileDisplayName:
                        contextProfile?.["display-name"],
                      localProfileDisplayName: localProfile?.["display-name"],
                      userFullName: user?.user_metadata?.full_name,
                      emailFirstPart: user?.email?.split("@")[0],
                      finalDisplayName: displayName,
                    });
                    return displayName;
                  })()}
                </h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigate Section */}
          <div className="flex-1 p-6">
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Navigate
              </h3>
              <nav className="space-y-2">
                <a
                  href="/dashboard"
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive("/dashboard")
                      ? "text-blue-600 bg-blue-50 font-medium"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span>Dashboard</span>
                </a>
                <a
                  href="#"
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    pathname.includes("/dashboard") && pathname !== "/dashboard"
                      ? "text-blue-600 bg-blue-50 font-medium"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </a>
                <a
                  href="/dashboard/edit-profile"
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ml-6 ${
                    isActive("/dashboard/edit-profile")
                      ? "text-blue-600 bg-blue-50 font-medium"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <span className="text-sm">Edit Profile</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Users className="w-5 h-5" />
                  <span>Friends</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <MapPin className="w-5 h-5" />
                  <span>My Trips</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  <span>Saved</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create a Trip</span>
                </a>
              </nav>
            </div>
          </div>

          {/* Settings Section */}
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Settings
            </h3>
            <nav className="space-y-2">
              <a
                href="#"
                className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </a>
              <a
                href="#"
                className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Globe className="w-5 h-5" />
                <span>Language</span>
              </a>
              <a
                href="#"
                className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Moon className="w-5 h-5" />
                <span>Dark Mode</span>
              </a>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Mobile Menu Button */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                <Menu className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Menu</span>
              </button>
            </div>

            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
            </div>

            {/* Page Content */}
            {children}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
