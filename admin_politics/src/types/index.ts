// src/types/index.ts
// アプリケーションの基本型定義

export interface Party {
  id: string;
  name: string;
  color: string;
  supportRate: number;
  opposeRate: number;
  totalVotes: number;
  members: number;
  keyPolicies: string[];
  description: string;
  image: string; // 追加: 政党のアイコン画像パス
}

export interface Politician {
  region: any;
  id: string;
  name: string;
  furigana?: string; // ふりがなフィールドを追加（オプション）
  position: string;
  age: number;
  party: {
    id: string;
    name: string;
    color: string;
  };
  supportRate: number;
  opposeRate: number;
  totalVotes: number;
  activity: number;
  image: string;
  trending: string;
  recentActivity: string;
}

// export interface Comment {
//   replies: any;
//   id: string;
//   text: string;
//   user: string;
//   likes: number;
//   date: string;
//   // フラット構造のための新しいプロパティ
//   isParentComment: boolean; // 親コメントかどうかを示す
//   parentId?: string; // 親コメントのID（親コメントの場合はnull）
//   replyToId?: string; // 返信先コメントのID（親コメントまたは別の返信）
//   replyToUser?: string; // 返信先のユーザー名
// }

export interface ReasonsData {
  support: Comment[];
  oppose: Comment[];
}
// Updated Reply types to match Firebase structure
export interface ReplyTo {
  reply_id: string;
  reply_to_user_id: string;
  reply_to_username: string;
}

export interface Reply {
  id: string;
  text: string;
  userID?: string; // クライアント側の命名規則
  user_id?: string; // Firestore側の命名規則
  userName?: string; // クライアント側の命名規則
  user_name?: string; // Firestore側の命名規則
  createdAt: string | Date;
  created_at?: string | Date; // Firestore側の命名規則
  likes: number;
  reply_to?: ReplyTo; // Firestore側の構造
  replyTo?: {
    // クライアント側向けの構造
    replyID: string;
    replyToUserID: string;
    replyToUserName: string;
  };
}

export interface Comment {
  id: string;
  text: string;
  userID: string;
  userName: string;
  politicianID: string;
  createdAt: string | Date;
  likes: number;
  replies: Reply[];
  entityType?: "politician" | "policy" | "party"; // 新しく追加
  repliesCount: number;
  type: "support" | "oppose";
}
