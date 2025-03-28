// src/components/common/LoadingAnimation.tsx
import React, { memo } from "react";

interface LoadingAnimationProps {
  message?: string;
  type?: "dots" | "spinner" | "pulse" | "bar";
  color?: string;
  size?: "small" | "medium" | "large";
}

// メモ化してパフォーマンスを向上
const LoadingAnimation: React.FC<LoadingAnimationProps> = memo(
  ({
    message = "データを読み込んでいます",
    type = "pulse",
    color = "#4361EE", // デフォルト色 (indigo-600に近い)
    size = "medium",
  }) => {
    // サイズに基づいたスタイル変数
    const getSizeStyles = () => {
      switch (size) {
        case "small":
          return {
            dotSize: "w-2 h-2",
            spinnerSize: "w-8 h-8",
            pulseSize: "w-12 h-12",
            barWidth: "w-48",
            fontSize: "text-xs",
            iconSize: "w-6 h-6",
            containerPadding: "p-3",
          };
        case "large":
          return {
            dotSize: "w-4 h-4",
            spinnerSize: "w-16 h-16",
            pulseSize: "w-20 h-20",
            barWidth: "w-80",
            fontSize: "text-base",
            iconSize: "w-10 h-10",
            containerPadding: "p-8",
          };
        default: // medium
          return {
            dotSize: "w-3 h-3",
            spinnerSize: "w-12 h-12",
            pulseSize: "w-16 h-16",
            barWidth: "w-64",
            fontSize: "text-sm",
            iconSize: "w-8 h-8",
            containerPadding: "p-6",
          };
      }
    };

    const sizeStyles = getSizeStyles();

    // モダンなドットアニメーション
    const DotsAnimation = () => (
      <div className="flex space-x-2 justify-center items-center mb-4">
        {[1, 2, 3].map((_, index) => (
          <div
            key={index}
            className={`${sizeStyles.dotSize} rounded-full`}
            style={{
              backgroundColor: color,
              animation: `bounce 1.4s infinite ease-in-out both`,
              animationDelay: `${index * 0.16}s`,
            }}
          ></div>
        ))}
      </div>
    );

    // モダンなスピナーアニメーション
    const SpinnerAnimation = () => (
      <div className="flex justify-center mb-4">
        <div
          className={`${sizeStyles.spinnerSize} rounded-full`}
          style={{
            borderWidth: "3px",
            borderStyle: "solid",
            borderColor: `${color} transparent ${color} transparent`,
            animation: "dual-ring 1.2s linear infinite",
          }}
        ></div>
      </div>
    );

    // モダンなパルスアニメーション（シャドウ付き）
    const PulseAnimation = () => (
      <div className="flex justify-center mb-4">
        <div className={`relative ${sizeStyles.pulseSize}`}>
          <div
            className="absolute inset-0 rounded-full"
            style={{
              backgroundColor: color,
              opacity: 0.3,
              animation: "pulse-shadow 1.5s ease-in-out infinite",
            }}
          ></div>
          <div
            className={`relative rounded-full ${sizeStyles.pulseSize} flex items-center justify-center`}
            style={{
              backgroundColor: color,
              animation: "pulse-scale 1.5s ease-in-out infinite",
            }}
          >
            <svg
              className={`${sizeStyles.iconSize} text-white`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
        </div>
      </div>
    );

    // モダンなバーアニメーション（シマーエフェクト付き）
    const BarAnimation = () => (
      <div className="flex justify-center items-center mb-4">
        <div
          className={`relative ${sizeStyles.barWidth} h-2 bg-gray-200 rounded-full overflow-hidden`}
        >
          <div
            className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white to-transparent"
            style={{ animation: "shimmer 1.5s infinite" }}
          ></div>
          <div
            className="absolute top-0 left-0 h-full rounded-full"
            style={{
              backgroundColor: color,
              width: "40%",
              animation: "indeterminate 1.5s infinite ease-in-out",
            }}
          ></div>
        </div>
      </div>
    );

    return (
      <div
        className={`w-full flex flex-col items-center justify-center ${sizeStyles.containerPadding} rounded-lg`}
      >
        {/* タイプに基づいたアニメーション */}
        {type === "dots" && <DotsAnimation />}
        {type === "spinner" && <SpinnerAnimation />}
        {type === "pulse" && <PulseAnimation />}
        {type === "bar" && <BarAnimation />}

        {/* メッセージセクション（固定幅を設定して動きを防止） */}
        <div className="text-center h-6 flex items-center justify-center">
          <p className={`text-gray-700 font-medium ${sizeStyles.fontSize}`}>
            {message}
          </p>
        </div>

        {/* アニメーション用CSS */}
        <style>{`
        @keyframes bounce {
          0%,
          80%,
          100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes dual-ring {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse-shadow {
          0% {
            transform: scale(0.95);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.3;
          }
          100% {
            transform: scale(0.95);
            opacity: 0.7;
          }
        }

        @keyframes pulse-scale {
          0% {
            transform: scale(0.85);
            opacity: 0.9;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(0.85);
            opacity: 0.9;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes indeterminate {
          0% {
            left: -40%;
          }
          100% {
            left: 100%;
          }
        }
      `}</style>
      </div>
    );
  }
);

// コンポーネント名を設定（デバッグ用）
LoadingAnimation.displayName = "LoadingAnimation";

export default LoadingAnimation;
