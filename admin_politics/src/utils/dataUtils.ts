// src/utils/dataUtils.ts
import { Party } from "../types";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig"; // Firebaseの設定をインポート

// キャッシング用のグローバル変数
let cachedParties: Party[] | null = null;

// 政党ごとの色を設定する関数
export const getPartyColor = (affiliation: string): string => {
  switch (affiliation) {
    case "自由民主党":
      return "#555555"; // 青
    case "立憲民主党":
      return "#4361EE"; // 赤
    case "公明党":
      return "#7209B7"; // 紫
    case "日本維新の会":
      return "#228B22"; // オレンジ
    case "国民民主党":
      return "#000080"; // 水色
    case "日本共産党":
      return "#E63946"; // 赤
    case "れいわ新選組":
      return "#F72585"; // 緑
    case "社民党":
      return "#118AB2"; // 青緑
    case "参政党":
      return "#FF4500"; // 黄色
    default:
      return "#808080"; // グレー
  }
};

// ローカル画像パスを取得する関数
const getPartyImagePath = (partyName: string): string => {
  try {
    // 政党画像のパスを返す
    return `/cm_parly_images/${encodeURIComponent(partyName)}.jpg`;
  } catch (error) {
    // 画像が見つからない場合はプレースホルダー画像を返す
    console.warn(`政党画像が見つかりません: ${partyName}.jpg`);
    return "/api/placeholder/80/80";
  }
};

/**
 * Firestoreから政党データを取得して処理する関数
 * この関数はgetPartyByIdから呼び出される
 * @returns 処理された政党データの配列
 */
export const processPartiesData = async (): Promise<Party[]> => {
  // キャッシュがあれば、それを返す（処理の重複を避ける）
  if (cachedParties !== null) {
    return cachedParties;
  }

  try {
    // Firestoreのpartiesコレクションからデータを取得
    const partiesCollection = collection(db, "parties");
    const partiesSnapshot = await getDocs(partiesCollection);

    // 取得したデータを処理
    const parties = partiesSnapshot.docs.map((doc) => {
      const data = doc.data();
      const partyName = data.name;
      const totalVotes = (data.supportCount || 0) + (data.oppositionCount || 0);
      const supportRate =
        totalVotes > 0
          ? Math.round(((data.supportCount || 0) / totalVotes) * 100)
          : 50; // Default to 50% if no votes

      return {
        id: doc.id,
        name: partyName,
        color: getPartyColor(partyName),
        supportRate: supportRate,
        opposeRate: 100 - supportRate,
        totalVotes: totalVotes || 0,
        members: data.memberCount || 0, // 政治家データは必要ないため、直接カウントを使用
        keyPolicies: data.majorPolicies || [],
        description:
          data.overview || `${partyName}の政策と理念に基づいた政党です。`,
        image: getPartyImagePath(partyName), // 画像パスフィールド
      };
    });

    // 結果をキャッシュして今後の呼び出しで再利用できるようにする
    cachedParties = parties;

    return parties;
  } catch (error) {
    console.error("Firestoreからの政党データ取得に失敗しました:", error);
    return [];
  }
};

/**
 * 特定のIDの政党を取得する関数（キャッシュ利用）
 * @param id 取得したい政党のID
 * @returns IDに一致する政党オブジェクト、見つからない場合はundefined
 */
export const getPartyById = async (id: string): Promise<Party | undefined> => {
  // まずキャッシュをチェック
  if (!cachedParties) {
    await processPartiesData(); // キャッシュがなければデータを処理
  }

  // キャッシュから直接検索
  return (cachedParties || []).find((party) => party.id === id);
};
