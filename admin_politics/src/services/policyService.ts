// src/services/policyService.ts
import {
  collection,
  getDocs,
  query,
  doc,
  getDoc,
  where,
  orderBy,
  limit,
  startAfter,
  OrderByDirection,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";

// 政策データの型定義
export interface Policy {
  totalCommentCount: number;
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  proposedDate: string;
  supportRate: number;
  opposeRate: number;
  totalVotes: number;
  trending: "up" | "down" | "none";
  proposingParty: {
    name: string;
    color: string;
  };
  affectedFields: string[];
  keyPoints: string[];
  economicImpact: string;
  lifeImpact: string;
  politicalParties: {
    partyName: string;
    claims: string;
  }[];
}

// Firestoreのデータを型に合わせて変換する関数
const convertToPolicyObject = (id: string, data: any): Policy => {
  // 支持率と不支持率の計算
  const supportRate = data.SupportRate || 50; // デフォルト値として50%を設定
  const opposeRate = data.NonSupportRate || 50;
  const totalVotes = supportRate + opposeRate;

  // SupportRateとNonSupportRateから正規化した割合を計算
  const normalizedSupportRate =
    totalVotes > 0 ? Math.round((supportRate / totalVotes) * 100) : 50;
  const normalizedOpposeRate =
    totalVotes > 0 ? Math.round((opposeRate / totalVotes) * 100) : 50;

  // トレンドの決定（実際のデータにない場合はランダムに設定）
  const trendOptions: Array<"up" | "down" | "none"> = ["up", "down", "none"];
  const trending =
    normalizedSupportRate > 60
      ? "up"
      : normalizedSupportRate < 40
      ? "down"
      : trendOptions[Math.floor(Math.random() * 3)];

  // 政党情報の処理
  const politicalParties =
    data.PoliticalParties?.map((party: any) => ({
      partyName: party.PartyName,
      claims: party.Claims,
    })) || [];

  // 提案政党（最初の政党を提案政党とする）
  const proposingParty =
    politicalParties.length > 0
      ? {
          name: politicalParties[0].partyName,
          color: getPartyColor(politicalParties[0].partyName),
        }
      : {
          name: "不明",
          color: "#808080",
        };

  return {
    id,
    title: data.Title || "不明なタイトル",
    description: data.Description || "説明なし",
    category: data.AffectedFields?.[0] || "その他", // 最初のカテゴリを主カテゴリとする
    status: data.Status || "審議中",
    proposedDate: data.ProposedDate || "2023年", // 適切なデフォルト値を設定
    supportRate: normalizedSupportRate,
    opposeRate: normalizedOpposeRate,
    totalVotes: totalVotes,
    trending,
    totalCommentCount: data.totalCommentCount,
    proposingParty,
    affectedFields: data.AffectedFields || [],
    keyPoints: data.KeyPoints || [],
    economicImpact: data.EconomicImpact || "",
    lifeImpact: data.LifeImpact || "",
    politicalParties,
  };
};

// 政党カラーを取得する簡易関数
const getPartyColor = (partyName: string): string => {
  // 政党名に基づいて色を返す簡易実装
  const partyColors: { [key: string]: string } = {
    自由民主党: "#E60012", // 赤
    立憲民主党: "#FFD900", // 黄
    日本維新の会: "#FF4500", // オレンジ
    公明党: "#00A0E9", // 青
    国民民主党: "#009944", // 緑
    日本共産党: "#A40000", // 深紅
    れいわ新選組: "#800080", // 紫
    社会民主党: "#800000", // 茶
  };

  return partyColors[partyName] || "#808080"; // 不明な政党はグレー
};

/**
 * フィルタリングとソートを適用して政策を取得する関数
 * @param categoryFilter カテゴリフィルター（"all"ですべてのカテゴリ）
 * @param partyFilter 政党フィルター（"all"ですべての政党）
 * @param sortMethod ソート方法（"supportDesc", "supportAsc", "opposeDesc"など）
 * @param searchTerm 検索語（空文字で検索なし）
 * @param lastDocumentId ページネーション用の最後のドキュメントID
 * @param limitCount 1回の取得数上限
 * @returns ポリシーのリスト、最後のドキュメントID、次ページの有無
 */
export const fetchPoliciesWithFilterAndSort = async (
  categoryFilter: string,
  partyFilter: string,
  sortMethod: string,
  searchTerm: string = "",
  lastDocumentId?: string,
  limitCount: number = 5
): Promise<{
  policies: Policy[];
  lastDocumentId?: string;
  hasMore: boolean;
}> => {
  try {
    const policiesRef = collection(db, "policy");
    let q;

    // ソートのフィールドと方向を定義
    let orderByField = "SupportRate";
    let orderDirection: OrderByDirection = "desc";

    switch (sortMethod) {
      case "supportDesc":
        orderByField = "SupportRate";
        orderDirection = "desc";
        break;
      case "supportAsc":
        orderByField = "SupportRate";
        orderDirection = "asc";
        break;
      case "opposeDesc":
        orderByField = "NonSupportRate";
        orderDirection = "desc";
        break;
    }

    // フィルタリングと検索の処理
    const conditions: any[] = [];

    if (categoryFilter !== "all") {
      conditions.push(
        where("AffectedFields", "array-contains", categoryFilter)
      );
    }

    if (partyFilter !== "all") {
      conditions.push(where("name", "==", partyFilter));
    }

    if (searchTerm.trim()) {
      // クライアントサイドでの絞り込みは別途実装する
    }

    conditions.push(orderBy(orderByField, orderDirection));

    // クエリ構築
    if (lastDocumentId) {
      try {
        const lastDoc = await getDoc(doc(db, "policy", lastDocumentId));

        if (lastDoc.exists()) {
          conditions.push(startAfter(lastDoc));
        } else {
          console.warn(
            `最後のドキュメントID ${lastDocumentId} が見つかりません`
          );
        }
      } catch (docError) {
        console.error("ドキュメント取得エラー:", docError);
      }
    }

    conditions.push(limit(limitCount));

    // クエリの実行
    q = query(policiesRef, ...conditions);

    const querySnapshot = await getDocs(q);

    // 検索語による追加のフィルタリング（クライアントサイド）
    let policies = querySnapshot.docs.map((doc) =>
      convertToPolicyObject(doc.id, doc.data())
    );

    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      policies = policies.filter(
        (policy) =>
          policy.title.toLowerCase().includes(lowerSearchTerm) ||
          policy.description.toLowerCase().includes(lowerSearchTerm)
      );
    }

    const hasMore = policies.length === limitCount;
    const lastVisibleDocument =
      querySnapshot.docs[querySnapshot.docs.length - 1];

    return {
      policies,
      lastDocumentId: lastVisibleDocument ? lastVisibleDocument.id : undefined,
      hasMore,
    };
  } catch (error) {
    console.error("政策データ取得エラー:", error);
    throw error;
  }
};
