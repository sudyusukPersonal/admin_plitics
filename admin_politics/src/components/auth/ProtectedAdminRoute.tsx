// src/components/auth/ProtectedAdminRoute.tsx の修正
import React, { useState, useEffect } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingAnimation from "../common/LoadingAnimation";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({
  children,
}) => {
  const { currentUser, partyId, loading } = useAuth();
  const location = useLocation();
  const { partyId: urlPartyId } = useParams<{ partyId: string }>();
  const [countdown, setCountdown] = useState(5);
  const [redirectInProgress, setRedirectInProgress] = useState(false);

  // カウントダウンの処理
  useEffect(() => {
    // 政党IDが一致しない場合のみカウントダウンを開始
    if (currentUser && urlPartyId && partyId !== urlPartyId) {
      setRedirectInProgress(true);

      // カウントダウンタイマーを設定
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // クリーンアップ関数
      return () => {
        clearInterval(timer);
      };
    }
  }, [currentUser, urlPartyId, partyId]);

  // 認証状態の読み込み中
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100 justify-center items-center">
        <LoadingAnimation type="dots" message="認証情報を確認中..." />
      </div>
    );
  }

  // 未ログインならログインページへリダイレクト
  if (!currentUser) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // URLに政党IDがある場合（例：/admin/party/:partyId/*）、アクセス権をチェック
  if (urlPartyId && partyId !== urlPartyId) {
    // カウントダウンが0になったらトップページへリダイレクト
    if (countdown === 0) {
      return <Navigate to="/" replace />;
    }

    return (
      <div className="flex min-h-screen bg-gray-100 justify-center items-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-yellow-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            アクセス権限がありません
          </h3>
          <p className="mb-4 text-gray-600">
            この政党の管理ページにはアクセスできません。
          </p>

          {/* カウントダウン表示 */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-blue-800">
              <span className="font-bold">{countdown}秒後</span>
              にホーム画面へ移動します。操作をしないでください。
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000"
                style={{ width: `${(countdown / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 認証済み＆アクセス権OK
  return <>{children}</>;
};

export default ProtectedAdminRoute;
