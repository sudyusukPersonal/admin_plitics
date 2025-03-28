// src/components/auth/LoginPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { auth } from "../../config/firebaseConfig";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, partyId, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (currentUser && partyId) {
      console.log("既にログイン中、リダイレクト:", partyId);
      navigate(`/admin/party/${partyId}/details`, { replace: true });
    }
  }, [currentUser, partyId, navigate]);

  useEffect(() => {
    if (currentUser && partyId) {
      console.log("政党ID取得完了、リダイレクト:", partyId);
      navigate(`/admin/party/${partyId}/details`, { replace: true });
    }
  }, [partyId]);

  useEffect(() => {
    if (currentUser && partyId) {
      console.log("ログイン完了、正しい政党IDでリダイレクト:", partyId);
      const redirectPath =
        location.state?.from?.pathname || `/admin/party/${partyId}/details`;
      console.log("リダイレクト先:", redirectPath);
      navigate(redirectPath, { replace: true });
    }
  }, [currentUser, partyId, navigate, location]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    console.log("ログイン処理開始:", email);

    try {
      await login(email, password);
      console.log("ログイン成功、現在のユーザー:", auth.currentUser);
      // リダイレクト処理はuseEffectで行うので、ここでは行わない
    } catch (error) {
      console.error("ログインエラー詳細:", error);
      setError(
        "ログインに失敗しました。メールアドレスとパスワードを確認してください。"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          政党管理システム
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
            disabled={loading}
          >
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
