// src/components/admin/adminPartyService.ts
import {
  doc,
  getDoc,
  collection,
  query,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { getPartyById } from "../../utils/dataUtils";
import { fetchPoliciesWithFilterAndSort } from "../../services/policyService";
import { Party } from "../../types";

/**
 * 管理画面で使用する政党データと関連する政策を取得する
 * @param partyId 政党ID
 * @returns 政党データと政策データ
 */
export const getPartyAdminData = async (partyId: string) => {
  try {
    // 1. 政党データを取得
    const party = await getPartyById(partyId);

    if (!party) {
      throw new Error("指定された政党が見つかりません");
    }

    // 2. この政党に関連する政策を取得
    const { policies } = await fetchPoliciesWithFilterAndSort(
      "all", // カテゴリフィルター - 全カテゴリ
      party.name, // 政党名でフィルター
      "supportDesc", // 支持率の高い順
      "", // 検索語なし
      undefined, // 最後のドキュメントID（ページネーション用）
      100 // 最大取得件数
    );

    console.log("政党管理データ取得:", party, policies);

    return {
      party,
      policies,
    };
  } catch (error) {
    console.error("政党管理データ取得エラー:", error);
    throw error;
  }
};

/**
 * 政党データを更新する
 * @param partyId 政党ID
 * @param partyData 更新する政党データ
 */
export const updatePartyData = async (
  partyId: string,
  partyData: Partial<Party>
) => {
  try {
    // TODO: Firestoreの政党データを更新する処理
    console.log("政党データ更新:", partyId, partyData);
    // 実際の実装ではFirestoreのupdateDocなどを使用
    return { success: true };
  } catch (error) {
    console.error("政党データ更新エラー:", error);
    throw error;
  }
};

/**
 * 政策データを保存する（新規作成または更新）
 * @param policyData 保存する政策データ
 */
export const savePolicyData = async (policyData: any) => {
  try {
    // TODO: Firestoreの政策データを保存する処理
    console.log("政策データ保存:", policyData);
    // 実際の実装ではFirestoreのaddDocやupdateDocを使用
    return { success: true, id: policyData.id || "new-policy-id" };
  } catch (error) {
    console.error("政策データ保存エラー:", error);
    throw error;
  }
};
