// src/components/admin/AdminSidebar.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Building,
  FileText,
  Settings,
  ChevronRight,
  ArrowLeft,
  X,
  LogOut,
} from "lucide-react";

interface AdminSidebarProps {
  partyData: any;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

// Custom hook to detect mobile screen size
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Standard MD breakpoint
    };

    // Initial check
    checkMobile();

    // Add event listener for resize
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  partyData,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const navigate = useNavigate();
  const { partyId } = useParams<{ partyId: string }>();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/admin/login");
    } catch (error) {
      console.error("ログアウトエラー:", error);
    }
  };

  // Get current active tab
  const getActiveTab = () => {
    if (location.pathname.includes("/policies")) return "policies";
    if (location.pathname.includes("/settings")) return "settings";
    return "details"; // Default is party details
  };

  const activeTab = getActiveTab();

  // Navigate to specific tab
  const navigateToTab = (tab: string) => {
    navigate(`/admin/party/${partyId}/${tab}`);
    if (isMobile) {
      setSidebarOpen(false); // Close sidebar on mobile after navigation
    }
  };

  // If sidebar is open on mobile, add a class to prevent body scrolling
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMobile, sidebarOpen]);

  // Different sidebar styling based on device and state
  const sidebarClasses = isMobile
    ? `fixed inset-y-0 left-0 z-50 transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out bg-white shadow-xl w-64`
    : `${
        sidebarOpen ? "w-64" : "w-16"
      } bg-white shadow-md transition-all duration-300 flex-shrink-0 z-10 h-screen`;

  // Backdrop for mobile
  const renderBackdrop = () => {
    if (isMobile && sidebarOpen) {
      return (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      );
    }
    return null;
  };

  return (
    <>
      {renderBackdrop()}

      <div className={sidebarClasses}>
        <div className="h-full flex flex-col p-3">
          <div className="flex items-center justify-between mb-6">
            {(sidebarOpen || isMobile) && (
              <div className="text-lg font-bold text-gray-800">
                政党管理パネル
              </div>
            )}
            <button
              className="p-1 rounded-md hover:bg-gray-100 transition"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {isMobile ? (
                <X size={24} />
              ) : sidebarOpen ? (
                <ChevronLeft size={24} />
              ) : (
                <ChevronRight size={20} />
              )}
            </button>
          </div>

          <div className="flex flex-col space-y-1">
            <button
              className={`flex items-center px-3 py-2 rounded-md ${
                activeTab === "details"
                  ? "bg-indigo-50 text-indigo-600"
                  : "hover:bg-gray-100"
              } transition`}
              onClick={() => navigateToTab("details")}
            >
              <Building
                size={sidebarOpen || isMobile ? 18 : 20}
                className={sidebarOpen || isMobile ? "mr-3" : ""}
              />
              {(sidebarOpen || isMobile) && <span>政党詳細</span>}
            </button>

            <button
              className={`flex items-center px-3 py-2 rounded-md ${
                activeTab === "policies"
                  ? "bg-indigo-50 text-indigo-600"
                  : "hover:bg-gray-100"
              } transition`}
              onClick={() => navigateToTab("policies")}
            >
              <FileText
                size={sidebarOpen || isMobile ? 18 : 20}
                className={sidebarOpen || isMobile ? "mr-3" : ""}
              />
              {(sidebarOpen || isMobile) && <span>政策管理</span>}
            </button>

            <button
              className={`flex items-center px-3 py-2 rounded-md ${
                activeTab === "settings"
                  ? "bg-indigo-50 text-indigo-600"
                  : "hover:bg-gray-100"
              } transition`}
              onClick={() => navigateToTab("settings")}
            >
              <Settings
                size={sidebarOpen || isMobile ? 18 : 20}
                className={sidebarOpen || isMobile ? "mr-3" : ""}
              />
              {(sidebarOpen || isMobile) && <span>設定</span>}
            </button>
          </div>
          <div className="mt-auto">
            <button
              className="w-full flex items-center px-3 py-2 rounded-md hover:bg-gray-100 text-gray-600 transition"
              onClick={handleLogout}
            >
              <LogOut
                size={sidebarOpen ? 18 : 20}
                className={sidebarOpen ? "mr-3" : ""}
              />
              {sidebarOpen && <span>ログアウト</span>}
            </button>
          </div>

          <div className="mt-auto">
            <button
              className="w-full flex items-center px-3 py-2 rounded-md hover:bg-gray-100 text-gray-600 transition"
              onClick={() => navigate("/")}
            >
              <ArrowLeft
                size={sidebarOpen || isMobile ? 18 : 20}
                className={sidebarOpen || isMobile ? "mr-3" : ""}
              />
              {(sidebarOpen || isMobile) && <span>サイトに戻る</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Chevron Left icon component
const ChevronLeft = (props: { size?: number; [x: string]: any }) => {
  const { size = 24, ...rest } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  );
};

export default AdminSidebar;
