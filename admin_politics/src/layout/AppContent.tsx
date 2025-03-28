// src/components/layout/AppContent.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../components/auth/LoginPage";
import PartyAdminLayout from "../components/admin/PartyAdminLayout";
import ProtectedAdminRoute from "../components/auth/ProtectedAdminRoute";

const AppContent: React.FC = () => {
  return (
    <div className="flex flex-col w-full min-h-screen font-sans bg-slate-50">
      {/* メインコンテンツ */}
      <main className="flex-1 pb-16 sm:p-4 px-0 container mx-auto max-w-7xl">
        <div className="mx-auto sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl w-full">
          <Routes>
            {/* デフォルトルートはログインページにリダイレクト */}
            <Route path="/" element={<Navigate to="/admin/login" replace />} />

            {/* 認証ページ */}
            <Route path="/admin/login" element={<LoginPage />} />

            {/* 管理パネルのルート - 認証で保護 */}
            <Route
              path="/admin/party/:partyId/*"
              element={
                <ProtectedAdminRoute>
                  <PartyAdminLayout />
                </ProtectedAdminRoute>
              }
            />

            {/* 管理ルートはデフォルトでログインにリダイレクト */}
            <Route
              path="/admin"
              element={<Navigate to="/admin/login" replace />}
            />

            {/* その他のルートはすべてホームにリダイレクト */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>

      {/* CSS アニメーション */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }

        @keyframes slide-in-left {
          0% {
            transform: translateX(-100%);
            opacity: 0.5;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default AppContent;
