// src/components/admin/PartyDetailsPanel.tsx
import React, { useState } from "react";
import { PenSquare, Save, X } from "lucide-react";

interface PartyDetailsPanelProps {
  partyData: any;
}

const PartyDetailsPanel: React.FC<PartyDetailsPanelProps> = ({ partyData }) => {
  const [isEditing, setIsEditing] = useState(false);

  if (!partyData) {
    return <div>政党データが読み込まれていません</div>;
  }

  return (
    <div className="animate-fadeIn p-4">
      {isEditing ? (
        // 編集モード
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">
                政党情報の編集
              </h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-md flex items-center transition"
                  onClick={() => setIsEditing(false)}
                >
                  <X size={14} className="mr-1" />
                  キャンセル
                </button>
                <button
                  className="px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center transition shadow-sm"
                  onClick={() => setIsEditing(false)}
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
                onClick={() => setIsEditing(false)}
              >
                <X size={16} className="mr-1.5" />
                キャンセル
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition flex items-center shadow-sm"
                onClick={() => setIsEditing(false)}
              >
                <Save size={16} className="mr-1.5" />
                変更を保存
              </button>
            </div>
          </div>
        </div>
      ) : (
        // 表示モード
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">政党情報</h3>
              <button
                className="px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center transition shadow-sm"
                onClick={() => setIsEditing(true)}
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
                {partyData.keyPolicies.map((policy: string, i: number) => (
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
                <div className="text-xl font-bold">-</div>
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
};

export default PartyDetailsPanel;
