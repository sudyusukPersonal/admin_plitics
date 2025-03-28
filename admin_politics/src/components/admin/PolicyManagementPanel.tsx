// src/components/admin/PolicyManagementPanel.tsx
import React, { useState, useCallback, useEffect } from "react";
import {
  Plus,
  PenSquare,
  Trash2,
  Eye,
  FileText,
  HelpCircle,
  Save,
  X,
  Info,
  Menu as MenuIcon,
} from "lucide-react";

// Interface definitions
interface PolicyType {
  id?: string;
  title?: string;
  description?: string;
  economicImpact?: string;
  lifeImpact?: string;
  keyPoints?: string[];
  affectedFields?: string[];
  supportRate?: number;
  opposeRate?: number;
  politicalParties?: {
    partyName: any;
    claims: string;
  }[];
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

interface PolicyManagementPanelProps {
  policiesData: PolicyType[];
  partyData: any;
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

// Sidebar Overlay Component
const SidebarOverlay: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
      onClick={onClose}
    >
      <div
        className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

// Main component
const PolicyManagementPanel: React.FC<PolicyManagementPanelProps> = ({
  policiesData,
  partyData,
  sidebarOpen = false,
  setSidebarOpen = () => {},
}) => {
  // UI state
  const [isAddingPolicy, setIsAddingPolicy] = useState(false);
  const [activePolicyId, setActivePolicyId] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const isMobile = useIsMobile();

  // Get active policy for editing
  const activePolicy = activePolicyId
    ? policiesData.find((p) => p.id === activePolicyId)
    : null;

  // Handler functions
  const handleCancel = useCallback(() => {
    setIsAddingPolicy(false);
    setActivePolicyId(null);
  }, []);

  const handleSave = useCallback((policyData: PolicyType) => {
    console.log("Saving policy data:", policyData);
    // Actual implementation would save to Firestore here
    setIsAddingPolicy(false);
    setActivePolicyId(null);
  }, []);

  // If in edit mode or adding a policy, show the editor
  if (isAddingPolicy || activePolicyId) {
    return (
      <>
        {/* Mobile sidebar overlay */}
        {isMobile && (
          <SidebarOverlay
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          >
            {/* This is where your AdminSidebar content would go */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-800">政党管理パネル</h3>
                <button
                  className="p-1 rounded-md hover:bg-gray-100"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            {/* Sidebar navigation items would go here */}
          </SidebarOverlay>
        )}

        <PolicyEditor
          policy={activePolicy || {}}
          onCancel={handleCancel}
          onSave={handleSave}
        />
      </>
    );
  }

  // Otherwise show the policy list
  return (
    <div className="animate-fadeIn p-4">
      {/* Mobile sidebar overlay */}
      {isMobile && (
        <SidebarOverlay
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        >
          {/* This is where your AdminSidebar content would go */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-800">政党管理パネル</h3>
              <button
                className="p-1 rounded-md hover:bg-gray-100"
                onClick={() => setSidebarOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
          </div>
          {/* Sidebar navigation items would go here */}
        </SidebarOverlay>
      )}

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b border-gray-100 flex flex-wrap justify-between items-center">
          {/* Mobile menu toggle button */}
          {isMobile && (
            <button
              className="mr-2 p-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setSidebarOpen(true)}
            >
              <MenuIcon size={20} />
            </button>
          )}

          <h3 className="text-lg font-bold text-gray-800">政策管理</h3>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <button
              className="px-2 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md flex items-center transition"
              onClick={() => setShowHelp(true)}
            >
              <HelpCircle size={14} className="mr-1" />
              <span className="hidden sm:inline">ヘルプ</span>
            </button>
            <button
              className="px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center transition shadow-sm"
              onClick={() => setIsAddingPolicy(true)}
            >
              <Plus size={14} className="mr-1" />
              <span className="hidden sm:inline">新規政策を追加</span>
              <span className="sm:hidden">追加</span>
            </button>
          </div>
        </div>

        {policiesData.length > 0 ? (
          // Policy list - table view for desktop, card view for mobile
          <div className="overflow-x-auto">
            {/* Desktop table view - hidden on small screens */}
            <div className="hidden sm:block">
              <div className="p-4">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          政策タイトル
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                          支持率
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                          不支持率
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
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
                            <div className="flex flex-wrap gap-1 mt-1">
                              {policy.affectedFields?.map((field, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                                >
                                  {field}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <RatingBar
                              value={policy.supportRate}
                              color="green"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <RatingBar value={policy.opposeRate} color="red" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <ActionButtons
                              policyId={policy.id}
                              policyTitle={policy.title}
                              onEdit={() =>
                                setActivePolicyId(policy.id ?? null)
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Mobile card view - only visible on small screens */}
            <div className="sm:hidden p-4 space-y-4">
              {policiesData.map((policy) => (
                <div
                  key={policy.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div className="font-medium text-gray-900">
                      {policy.title}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 transition"
                        onClick={() =>
                          window.open(`/policy/${policy.id}`, "_blank")
                        }
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="text-indigo-600 hover:text-indigo-900 transition"
                        onClick={() => setActivePolicyId(policy.id ?? null)}
                      >
                        <PenSquare size={18} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 transition"
                        onClick={() => confirmDelete(policy.id, policy.title)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2 mb-3">
                    {policy.description}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {policy.affectedFields?.map((field, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-gray-500">支持率</div>
                      <RatingBar value={policy.supportRate} color="green" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">不支持率</div>
                      <RatingBar value={policy.opposeRate} color="red" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Empty state
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

      {/* Help modal */}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
};

// Reusable Components

// Rating bar for displaying support/oppose rates
const RatingBar: React.FC<{ value?: number; color: "green" | "red" }> = ({
  value = 0,
  color,
}) => {
  const colorClass =
    color === "green"
      ? "text-green-700 bg-green-500"
      : "text-red-700 bg-red-500";

  return (
    <div className="flex items-center">
      <div
        className={`text-sm ${
          color === "green" ? "text-green-700" : "text-red-700"
        } font-medium mr-2`}
      >
        {value}%
      </div>
      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClass} rounded-full`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

// Action buttons for policy list items
const ActionButtons: React.FC<{
  policyId?: string;
  policyTitle?: string;
  onEdit: () => void;
}> = ({ policyId, policyTitle, onEdit }) => {
  const confirmDelete = (id?: string, title?: string) => {
    if (window.confirm(`政策「${title}」を削除しますか？`)) {
      console.log(`政策 ${id} を削除します`);
      // Actual delete implementation would go here
    }
  };

  return (
    <div className="flex justify-end space-x-3">
      <button
        className="text-indigo-600 hover:text-indigo-900 transition"
        onClick={() => window.open(`/policy/${policyId}`, "_blank")}
        title="公開ページを表示"
      >
        <Eye size={18} />
      </button>
      <button
        className="text-indigo-600 hover:text-indigo-900 transition"
        onClick={onEdit}
        title="編集する"
      >
        <PenSquare size={18} />
      </button>
      <button
        className="text-red-600 hover:text-red-900 transition"
        title="削除する"
        onClick={() => confirmDelete(policyId, policyTitle)}
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

// Help modal component
const HelpModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    onClick={onClose}
  >
    <div
      className="bg-white rounded-lg shadow-xl p-4 sm:p-6 max-w-2xl max-h-[80vh] overflow-y-auto w-full"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">政策管理パネルヘルプ</h3>
        <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-indigo-700 mb-2">政策管理</h4>
          <p>
            政党の政策を追加・編集できます。作成した政策は支持率・不支持率と共に表示されます。有権者から評価を得ることで、支持率が変動します。
          </p>
        </div>

        <div>
          <h4 className="font-medium text-indigo-700 mb-2">政策の作成のコツ</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>明確な政策タイトルをつけましょう</li>
            <li>政策の効果や影響を具体的に説明しましょう</li>
            <li>主要ポイントは簡潔に、わかりやすく記述しましょう</li>
            <li>自党の立場を明確に示しましょう</li>
            <li>対立政党の立場も公平に記載することで信頼性が高まります</li>
          </ul>
        </div>

        <div className="bg-indigo-50 p-3 rounded-md border-l-4 border-indigo-500">
          <h4 className="font-medium text-indigo-700">ヒント</h4>
          <p className="text-sm">
            政策の編集中でも「プレビュー」ボタンで一般向け表示を確認できます。公開前に内容を確認しましょう。
          </p>
        </div>
      </div>
    </div>
  </div>
);

// PolicyEditor component - for adding or editing policies
const PolicyEditor: React.FC<{
  policy?: PolicyType;
  onCancel: () => void;
  onSave: (policyData: PolicyType) => void;
}> = ({ policy = {}, onCancel, onSave }) => {
  // Form state
  const [title, setTitle] = useState(policy.title || "");
  const [description, setDescription] = useState(policy.description || "");
  const [economicImpact, setEconomicImpact] = useState(
    policy.economicImpact || ""
  );
  const [lifeImpact, setLifeImpact] = useState(policy.lifeImpact || "");

  // Initialize key points - always ensure 4 elements
  const [keyPoints, setKeyPoints] = useState(() => {
    const existing = policy.keyPoints || [];
    return [...existing, ...Array(4 - existing.length).fill("")].slice(0, 4);
  });

  // Initialize affected fields - max 5 elements
  const [affectedFields, setAffectedFields] = useState(() => {
    const existingFields = policy.affectedFields || [];
    return [
      ...existingFields,
      ...Array(5 - existingFields.length).fill(""),
    ].slice(0, 5);
  });

  // Get own position from the first party in politicalParties
  const [ownPosition, setOwnPosition] = useState(() => {
    if (policy.politicalParties && policy.politicalParties.length > 0) {
      return policy.politicalParties[0].claims || "";
    }
    return "";
  });

  // Get opposing positions from the rest of the parties
  const [opposingPositions, setOpposingPositions] = useState(() => {
    if (policy.politicalParties && policy.politicalParties.length > 1) {
      return policy.politicalParties.slice(1).map((party) => ({
        party: party.partyName,
        position: party.claims || "",
      }));
    }
    return [{ party: "", position: "" }];
  });

  // Helper functions for form management
  const updateKeyPoint = (index: number, value: string) => {
    const newPoints = [...keyPoints];
    newPoints[index] = value;
    setKeyPoints(newPoints);
  };

  const updateAffectedField = (index: number, value: string) => {
    const newFields = [...affectedFields];
    newFields[index] = value;
    setAffectedFields(newFields);
  };

  const removeAffectedField = (index: number) => {
    const newFields = [...affectedFields];
    newFields.splice(index, 1);
    newFields.push(""); // Add empty field at the end to maintain 5 fields
    setAffectedFields(newFields);
  };

  const addOpposingPosition = () => {
    setOpposingPositions([
      ...opposingPositions,
      { party: "立憲民主党", position: "" },
    ]);
  };

  const removeOpposingPosition = (index: number) => {
    const newPositions = [...opposingPositions];
    newPositions.splice(index, 1);
    setOpposingPositions(newPositions);
  };

  const updateOpposingParty = (index: number, partyName: string) => {
    const newPositions = [...opposingPositions];
    newPositions[index].party = partyName;
    setOpposingPositions(newPositions);
  };

  const updateOpposingPosition = (index: number, position: string) => {
    const newPositions = [...opposingPositions];
    newPositions[index].position = position;
    setOpposingPositions(newPositions);
  };

  // Handle form submission
  const handleSave = () => {
    const policyData = {
      id: policy.id,
      title,
      description,
      affectedFields: affectedFields.filter(Boolean), // Remove empty fields
      economicImpact,
      lifeImpact,
      keyPoints: keyPoints.filter(Boolean), // Remove empty points
      ownPosition,
      opposingPositions,
    };
    onSave(policyData);
  };

  // Render policy editor form
  return (
    <div className="bg-white rounded-lg shadow-md animate-fadeIn">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800">
            {policy.id ? "政策を編集" : "新しい政策を作成"}
          </h3>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <button
              className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-md flex items-center transition"
              onClick={onCancel}
            >
              <X size={14} className="mr-1" />
              キャンセル
            </button>
            <button
              className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-md flex items-center transition"
              onClick={() => {
                if (policy.id) window.open(`/policy/${policy.id}`, "_blank");
              }}
            >
              <Eye size={14} className="mr-1" />
              プレビュー
            </button>
            <button
              className="px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center transition shadow-sm"
              onClick={handleSave}
            >
              <Save size={14} className="mr-1" />
              保存する
            </button>
          </div>
        </div>

        {/* Form Layout */}
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            {/* Left Column: Basic Information */}
            <div className="space-y-6">
              {/* Policy Title */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    政策タイトル
                  </label>
                  <div className="text-xs text-gray-500">必須</div>
                </div>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-1 transition"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例：教育改革法案"
                />
                <p className="mt-1 text-xs text-gray-500">
                  簡潔で明確なタイトルをつけてください
                </p>
              </div>

              {/* Policy Description */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    政策の説明
                  </label>
                  <div className="text-xs text-gray-500">必須</div>
                </div>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32 mt-1 transition"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="政策の目的と概要を説明してください"
                />
                <p className="mt-1 text-xs text-gray-500">
                  政策の目的とその意義を明確に説明してください
                </p>
              </div>

              {/* Affected Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  影響を受ける分野
                  <span className="ml-1 text-xs text-gray-500">
                    （最大5つまで）
                  </span>
                </label>
                <div className="space-y-2">
                  {affectedFields.map((field, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-6 h-6 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-sm">
                        {index + 1}
                      </div>
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        value={field}
                        onChange={(e) =>
                          updateAffectedField(index, e.target.value)
                        }
                        placeholder={`分野 ${
                          index + 1
                        }（例: 経済、教育、環境など）`}
                        disabled={index > 0 && !affectedFields[index - 1]} // Disable if previous field is empty
                      />
                      {field && (
                        <button
                          type="button"
                          className="p-2 text-gray-400 hover:text-red-500 transition"
                          onClick={() => removeAffectedField(index)}
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  この政策が影響を与える主要な分野を入力してください
                </p>
              </div>

              {/* Economic Impact */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  経済的影響
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-20 mt-1 transition"
                  value={economicImpact}
                  onChange={(e) => setEconomicImpact(e.target.value)}
                  placeholder="この政策が経済に与える影響について説明してください"
                />
              </div>

              {/* Life Impact */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  生活への影響
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-20 mt-1 transition"
                  value={lifeImpact}
                  onChange={(e) => setLifeImpact(e.target.value)}
                  placeholder="この政策が市民の生活に与える影響について説明してください"
                />
              </div>
            </div>

            {/* Right Column: Detailed Information */}
            <div className="space-y-6">
              {/* Key Points */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    主要ポイント
                  </label>
                  <div className="text-xs text-gray-500">必須（4項目）</div>
                </div>
                <div className="space-y-2 mt-1">
                  {keyPoints.map((point, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm">
                        {index + 1}
                      </div>
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        value={point}
                        onChange={(e) => updateKeyPoint(index, e.target.value)}
                        placeholder={`ポイント ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  政策の重要なポイント4つを簡潔に入力してください
                </p>
              </div>

              {/* Own Position */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    自党の立場
                  </label>
                  <div className="text-xs text-gray-500">必須</div>
                </div>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-20 mt-1 transition"
                  value={ownPosition}
                  onChange={(e) => setOwnPosition(e.target.value)}
                  placeholder="この政策に対する自党の基本的な立場や主張を説明してください"
                />
              </div>

              {/* Opposing Positions */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  対立政党の立場（オプション）
                </label>
                <div className="space-y-3 mt-1">
                  {opposingPositions.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 border border-gray-200 rounded-md bg-gray-50"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <select
                          className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white transition"
                          value={item.party}
                          onChange={(e) =>
                            updateOpposingParty(index, e.target.value)
                          }
                        >
                          <option value="">政党を選択</option>
                          <option value="自由民主党">自由民主党</option>
                          <option value="立憲民主党">立憲民主党</option>
                          <option value="公明党">公明党</option>
                          <option value="日本維新の会">日本維新の会</option>
                          <option value="国民民主党">国民民主党</option>
                          <option value="日本共産党">日本共産党</option>
                          <option value="れいわ新選組">れいわ新選組</option>
                          <option value="社民党">社民党</option>
                          <option value="参政党">参政党</option>
                        </select>
                        <button
                          type="button"
                          className="text-gray-400 hover:text-red-500 transition p-1 ml-auto"
                          onClick={() => removeOpposingPosition(index)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white transition"
                        value={item.position}
                        onChange={(e) =>
                          updateOpposingPosition(index, e.target.value)
                        }
                        placeholder="この政党の立場や主張"
                        rows={2}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 flex items-center transition"
                    onClick={addOpposingPosition}
                  >
                    <Plus size={14} className="mr-1" />
                    政党を追加
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  他政党の立場を追加すると、より公平で信頼性の高い政策提案になります
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 rounded-b-lg border-t border-gray-100 flex flex-wrap justify-between items-center">
        <div className="text-sm text-gray-500 flex items-center mb-3 sm:mb-0">
          <Info size={14} className="mr-1 text-indigo-500" />
          <span className="text-xs sm:text-sm">
            入力内容はすべて保存され、一般公開前にプレビューで確認できます
          </span>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            className="w-1/2 sm:w-auto px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium text-gray-700 transition flex items-center justify-center"
            onClick={onCancel}
          >
            <X size={16} className="mr-1.5" />
            キャンセル
          </button>
          <button
            className="w-1/2 sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition flex items-center justify-center shadow-sm"
            onClick={handleSave}
          >
            <Save size={16} className="mr-1.5" />
            保存して公開
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to confirm deletion
const confirmDelete = (id?: string, title?: string) => {
  if (window.confirm(`政策「${title}」を削除しますか？`)) {
    console.log(`政策 ${id} を削除します`);
    // Actual implementation would delete from Firestore
  }
};

export default PolicyManagementPanel;
