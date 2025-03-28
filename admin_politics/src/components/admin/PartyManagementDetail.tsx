import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPartyById } from "../../utils/dataUtils";
import { fetchPoliciesWithFilterAndSort } from "../../services/policyService";
import {
  Building,
  FileText,
  Settings,
  Users,
  ChevronDown,
  ChevronRight,
  Plus,
  PenSquare,
  Trash2,
  Save,
  X,
  ArrowLeft,
  Eye,
  Info,
  HelpCircle,
} from "lucide-react";
import LoadingAnimation from "../common/LoadingAnimation";
import { Party } from "../../types";

const PartyAdminPage = () => {
  const { partyId } = useParams<{ partyId: string }>();
  const navigate = useNavigate();

  // 状態の定義
  const [activeTab, setActiveTab] = useState("party-details");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePolicyId, setActivePolicyId] = useState<string | null>(null);
  const [isEditingParty, setIsEditingParty] = useState(false);
  const [isAddingPolicy, setIsAddingPolicy] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // データ取得状態
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [partyData, setPartyData] = useState<Party | null>(null);
  const [policiesData, setPoliciesData] = useState<any[]>([]);

  // 政党データとポリシーデータを取得する
  useEffect(() => {
    const fetchData = async () => {
      if (!partyId) return;

      try {
        setLoading(true);
        setError(null);

        // 1. 政党データを取得
        const party = await getPartyById(partyId);

        if (!party) {
          setError("指定された政党が見つかりません");
          setLoading(false);
          return;
        }

        setPartyData(party);

        // 2. この政党に関連する政策を取得
        const { policies } = await fetchPoliciesWithFilterAndSort(
          "all", // カテゴリフィルター - 全カテゴリ
          party.name, // 政党名でフィルター
          "supportDesc", // 支持率の高い順
          "", // 検索語なし
          undefined, // 最後のドキュメントID（ページネーション用）
          100 // 最大取得件数
        );

        setPoliciesData(policies);
      } catch (error) {
        console.error("データ取得エラー:", error);
        setError("データの取得中にエラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [partyId]);

  // ローディング中の表示
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100 text-gray-800 justify-center items-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <LoadingAnimation type="dots" message="政党情報を読み込んでいます" />
        </div>
      </div>
    );
  }

  // エラー表示
  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100 text-gray-800 justify-center items-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-red-500 mb-4">
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
          <h3 className="text-lg font-medium text-gray-900">
            エラーが発生しました
          </h3>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => navigate("/admin")}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            管理ページに戻る
          </button>
        </div>
      </div>
    );
  }

  // 政党データがない場合のフォールバック表示
  if (!partyData) {
    return (
      <div className="flex min-h-screen bg-gray-100 text-gray-800 justify-center items-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-yellow-500 mb-4">
            <HelpCircle className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            政党が指定されていません
          </h3>
          <p className="mt-2 text-gray-600">URLに政党IDを指定してください</p>
          <button
            onClick={() => navigate("/parties")}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            政党一覧へ
          </button>
        </div>
      </div>
    );
  }

  // 以下、既存のrenderPartyDetailsTab関数などを使って表示する
  // ただし、ハードコードされたデータの代わりに、取得したpartyDataとpoliciesDataを使う

  const renderPartyDetailsTab = () => (
    <div className="animate-fadeIn p-4">
      {isEditingParty ? (
        // 編集モード - 既存のコード
        <div className="bg-white rounded-lg shadow-md">
          {/* 既存のフォームUI。ただしデフォルト値をpartyDataから取得 */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">
                政党情報の編集
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-md flex items-center transition"
                  onClick={() => setIsEditingParty(false)}
                >
                  <X size={14} className="mr-1" />
                  キャンセル
                </button>
                <button
                  className="px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center transition shadow-sm"
                  onClick={() => setIsEditingParty(false)}
                >
                  <Save size={14} className="mr-1" />
                  保存する
                </button>
              </div>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      政党名
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      defaultValue={partyData.name}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      政党カラー
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        className="h-9 w-20 border border-gray-300 rounded-md cursor-pointer"
                        defaultValue={partyData.color}
                      />
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        defaultValue={partyData.color}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      政党のテーマカラーです。ボタンや強調表示に使用されます。
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      主要政策キーワード
                      <span className="ml-1 text-xs text-gray-500">
                        （カンマ区切り）
                      </span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      defaultValue={partyData.keyPolicies.join(", ")}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      政党ページで表示される主要政策のキーワードです
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      政党ロゴ・画像
                    </label>
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-24 h-24 rounded-full overflow-hidden border-2 flex-shrink-0 bg-gray-50 flex items-center justify-center"
                        style={{ borderColor: partyData.color }}
                      >
                        <img
                          src={partyData.image}
                          alt={partyData.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          className="hidden"
                          id="party-logo-upload"
                        />
                        <label
                          htmlFor="party-logo-upload"
                          className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none cursor-pointer inline-block transition shadow-sm"
                        >
                          新しい画像をアップロード
                        </label>
                        <p className="mt-2 text-xs text-gray-500">
                          推奨サイズ: 400×400ピクセル以上の正方形画像
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      政党説明
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-28 transition"
                      defaultValue={partyData.description}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      政党ページに表示される説明文です
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="p-4 bg-gray-50 rounded-b-lg border-t border-gray-100 flex justify-end">
            <div className="flex gap-2">
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium text-gray-700 transition flex items-center"
                onClick={() => setIsEditingParty(false)}
              >
                <X size={16} className="mr-1.5" />
                キャンセル
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition flex items-center shadow-sm"
                onClick={() => setIsEditingParty(false)}
              >
                <Save size={16} className="mr-1.5" />
                変更を保存
              </button>
            </div>
          </div>
        </div>
      ) : (
        // 表示モード - 既存のコードにデータを渡す
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">政党情報</h3>
              <button
                className="px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center transition shadow-sm"
                onClick={() => setIsEditingParty(true)}
              >
                <PenSquare size={14} className="mr-1" />
                編集する
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex-shrink-0">
                <div
                  className="w-24 h-24 rounded-full overflow-hidden border-2 flex items-center justify-center"
                  style={{ borderColor: partyData.color }}
                >
                  <img
                    src={partyData.image}
                    alt={partyData.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1">
                <h2
                  className="text-2xl font-bold"
                  style={{ color: partyData.color }}
                >
                  {partyData.name}
                </h2>

                <div className="flex flex-wrap items-center text-sm text-gray-500 mt-1">
                  <span>所属議員: {partyData.members}名</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="bg-gray-50 rounded-md p-2">
                    <div className="text-xs text-gray-500 mb-1">支持率</div>
                    <div className="text-lg font-bold text-green-600">
                      {partyData.supportRate}%
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-md p-2">
                    <div className="text-xs text-gray-500 mb-1">不支持率</div>
                    <div className="text-lg font-bold text-red-600">
                      {partyData.opposeRate}%
                    </div>
                  </div>
                </div>

                <div className="mt-2 w-full h-3 bg-gray-200 rounded-full overflow-hidden flex">
                  <div
                    className="h-full rounded-l-full"
                    style={{
                      width: `${partyData.supportRate}%`,
                      backgroundColor: "#10B981",
                    }}
                  ></div>
                  <div
                    className="h-full rounded-r-full"
                    style={{
                      width: `${partyData.opposeRate}%`,
                      backgroundColor: "#EF4444",
                    }}
                  ></div>
                </div>

                <p className="text-sm text-gray-600 mt-3">
                  {partyData.description}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                主要政策
              </h4>
              <div className="flex flex-wrap gap-2">
                {partyData.keyPolicies.map((policy, i) => (
                  <span
                    key={i}
                    className="text-xs py-1 px-3 rounded-full border"
                    style={{
                      backgroundColor: `${partyData.color}15`,
                      borderColor: `${partyData.color}30`,
                      color: partyData.color,
                    }}
                  >
                    {policy}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6">
            <h4 className="text-sm font-medium text-gray-700 mb-4">管理統計</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 transition hover:shadow-sm">
                <div className="text-xs text-gray-500 mb-1">総投票数</div>
                <div className="text-xl font-bold">
                  {partyData.totalVotes.toLocaleString()}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 transition hover:shadow-sm">
                <div className="text-xs text-gray-500 mb-1">公開政策数</div>
                <div className="text-xl font-bold">{policiesData.length}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 transition hover:shadow-sm">
                <div className="text-xs text-gray-500 mb-1">所属議員数</div>
                <div className="text-xl font-bold">{partyData.members}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderPoliciesTab = () => (
    <div className="animate-fadeIn p-4">
      {isAddingPolicy || activePolicyId ? (
        renderPolicyEditor(
          activePolicyId
            ? policiesData.find((p) => p.id === activePolicyId)
            : null
        )
      ) : (
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">政策管理</h3>
            <div className="flex gap-2">
              <button
                className="px-2 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md flex items-center transition"
                onClick={() => setShowHelp(true)}
              >
                <HelpCircle size={14} className="mr-1" />
                ヘルプ
              </button>
              <button
                className="px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center transition shadow-sm"
                onClick={() => setIsAddingPolicy(true)}
              >
                <Plus size={14} className="mr-1" />
                新規政策を追加
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="p-4">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        政策タイトル
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32"
                      >
                        支持率
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32"
                      >
                        不支持率
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24"
                      >
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {policiesData.map((policy) => (
                      <tr
                        key={policy.id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">
                            {policy.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                            {policy.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm text-green-700 font-medium mr-2">
                              {policy.supportRate}%
                            </div>
                            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500 rounded-full"
                                style={{ width: `${policy.supportRate}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm text-red-700 font-medium mr-2">
                              {policy.opposeRate}%
                            </div>
                            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-red-500 rounded-full"
                                style={{ width: `${policy.opposeRate}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <button
                              className="text-indigo-600 hover:text-indigo-900 transition"
                              onClick={() =>
                                window.open("/policy/" + policy.id, "_blank")
                              }
                              title="公開ページを表示"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              className="text-indigo-600 hover:text-indigo-900 transition"
                              onClick={() => setActivePolicyId(policy.id)}
                              title="編集する"
                            >
                              <PenSquare size={18} />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900 transition"
                              title="削除する"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {policiesData.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-3">
                  <FileText size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  政策がまだありません
                </h3>
                <p className="text-gray-500 mb-4">
                  「新規政策を追加」ボタンをクリックして、最初の政策を作成しましょう。
                </p>
                <button
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition shadow-sm"
                  onClick={() => setIsAddingPolicy(true)}
                >
                  <Plus size={16} className="mr-1.5 inline-block" />
                  新規政策を追加
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // renderPolicyEditor関数はそのまま利用

  // 元のコードと同じく、サイドバーとメインコンテンツの表示
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* サイドバー */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-white shadow-md transition-all duration-300 flex flex-col p-3 z-10`}
      >
        {/* サイドバーの内容 - 既存コードと同様 */}
        <div className="flex items-center justify-between mb-6">
          {sidebarOpen && (
            <div className="text-lg font-bold text-gray-800">
              政党管理パネル
            </div>
          )}
          <button
            className="p-1 rounded-md hover:bg-gray-100 transition"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <ChevronLeft size={24} />
            ) : (
              <ChevronRight size={20} />
            )}
          </button>
        </div>

        <div className="flex flex-col space-y-1">
          <button
            className={`flex items-center px-3 py-2 rounded-md ${
              activeTab === "party-details"
                ? "bg-indigo-50 text-indigo-600"
                : "hover:bg-gray-100"
            } transition`}
            onClick={() => setActiveTab("party-details")}
          >
            <Building
              size={sidebarOpen ? 18 : 20}
              className={sidebarOpen ? "mr-3" : ""}
            />
            {sidebarOpen && <span>政党詳細</span>}
          </button>

          <button
            className={`flex items-center px-3 py-2 rounded-md ${
              activeTab === "policies"
                ? "bg-indigo-50 text-indigo-600"
                : "hover:bg-gray-100"
            } transition`}
            onClick={() => setActiveTab("policies")}
          >
            <FileText
              size={sidebarOpen ? 18 : 20}
              className={sidebarOpen ? "mr-3" : ""}
            />
            {sidebarOpen && <span>政策管理</span>}
          </button>

          <button
            className={`flex items-center px-3 py-2 rounded-md ${
              activeTab === "members"
                ? "bg-indigo-50 text-indigo-600"
                : "hover:bg-gray-100"
            } transition`}
            onClick={() => setActiveTab("members")}
          >
            <Users
              size={sidebarOpen ? 18 : 20}
              className={sidebarOpen ? "mr-3" : ""}
            />
            {sidebarOpen && <span>所属議員</span>}
          </button>

          <button
            className={`flex items-center px-3 py-2 rounded-md ${
              activeTab === "settings"
                ? "bg-indigo-50 text-indigo-600"
                : "hover:bg-gray-100"
            } transition`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings
              size={sidebarOpen ? 18 : 20}
              className={sidebarOpen ? "mr-3" : ""}
            />
            {sidebarOpen && <span>設定</span>}
          </button>
        </div>

        <div className="mt-auto">
          <button
            className="w-full flex items-center px-3 py-2 rounded-md hover:bg-gray-100 text-gray-600 transition"
            onClick={() => navigate("/")}
          >
            <ArrowLeft
              size={sidebarOpen ? 18 : 20}
              className={sidebarOpen ? "mr-3" : ""}
            />
            {sidebarOpen && <span>サイトに戻る</span>}
          </button>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 p-4 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <header className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">政党管理</h1>
              <p className="text-sm text-gray-500">
                {activeTab === "party-details"
                  ? "政党情報の編集・管理"
                  : activeTab === "policies"
                  ? "政策の追加・編集・管理"
                  : activeTab === "members"
                  ? "所属議員の管理"
                  : "設定"}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-white rounded-full px-3 py-1 shadow-sm border border-gray-200">
                <div
                  className="w-6 h-6 rounded-full flex-shrink-0 border-2"
                  style={{ borderColor: partyData.color }}
                >
                  <img
                    src={partyData.image}
                    alt={partyData.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <span className="ml-2 text-sm font-medium">
                  {partyData.name}
                </span>
              </div>
            </div>
          </header>

          {activeTab === "party-details" && renderPartyDetailsTab()}
          {activeTab === "policies" && renderPoliciesTab()}
          {activeTab === "members" && (
            <div className="bg-white rounded-lg shadow-md p-6 animate-fadeIn">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                所属議員管理
              </h3>
              <p className="text-gray-500">
                この機能は現在開発中です。近日公開予定。
              </p>
            </div>
          )}
          {activeTab === "settings" && (
            <div className="bg-white rounded-lg shadow-md p-6 animate-fadeIn">
              <h3 className="text-lg font-bold text-gray-800 mb-4">管理設定</h3>
              <p className="text-gray-500">
                この機能は現在開発中です。近日公開予定。
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ヘルプモーダル用コード */}
    </div>
  );
};

// ChevronLeft コンポーネント定義
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

export default PartyAdminPage;
function renderPolicyEditor(arg0: any): React.ReactNode {
  throw new Error("Function not implemented.");
}
