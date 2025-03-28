// src/context/AuthContext.tsx の拡張
import React, { createContext, useState, useEffect, useContext } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

// 認証コンテキストの型定義
interface AuthContextType {
  currentUser: any;
  partyId: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [partyId, setPartyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Firestoreからユーザーに関連付けられた政党IDを取得
        const userDoc = await getDoc(doc(db, "admin_user", user.uid));
        if (userDoc.exists()) {
          setPartyId(userDoc.data().party_id);
        }
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setPartyId(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ログイン機能
  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Firestoreからユーザーデータを取得して状態を更新
    const userDoc = await getDoc(
      doc(db, "admin_user", userCredential.user.uid)
    );
    if (userDoc.exists()) {
      // 明示的に状態を更新
      const userData = userDoc.data();
      setPartyId(userData.party_id);
      console.log("取得した政党ID:", userData.party_id);
    } else {
      console.error("ユーザーデータが存在しません:", userCredential.user.uid);
    }

    // 最後にユーザー状態を更新
    setCurrentUser(userCredential.user);

    // 状態が確実に更新されるまで少し待機
    await new Promise((resolve) => setTimeout(resolve, 100));
    return;
  };

  // ログアウト機能
  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    currentUser,
    partyId,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
