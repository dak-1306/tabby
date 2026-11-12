"use client";

import React, { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Sparkles, X, ChevronRight, ChevronLeft, Info, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/contexts/DemoContext";

interface RectBox {
  top: number;
  left: number;
  width: number;
  height: number;
}

const queryValidElement = (selectorList: string): HTMLElement | null => {
  const selectors = selectorList
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const sel of selectors) {
    try {
      const matches = Array.from(
        document.querySelectorAll(sel)
      ) as HTMLElement[];
      const valid = matches.find((el) => {
        if (el.closest("#demo-overlay")) return false;
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
      if (valid) return valid;
    } catch {
      // Bỏ qua nếu trình duyệt không hỗ trợ selector (ví dụ :has)
    }
  }
  return null;
};

export const DemoOverlay: React.FC = () => {
  const pathname = usePathname();
  const {
    isRunning,
    currentStep,
    currentStepIndex,
    totalSteps,
    stopDemo,
    nextStep,
    prevStep,
  } = useDemo();

  const [targetRect, setTargetRect] = useState<RectBox | null>(null);

  const findTargetElement = useCallback((): HTMLElement | null => {
    if (!currentStep) return null;
    return (
      queryValidElement(currentStep.selector) ||
      queryValidElement(currentStep.fallbackSelector)
    );
  }, [currentStep]);

  const updatePosition = useCallback(() => {
    const el = findTargetElement();
    if (!el) {
      setTargetRect(null);
      return;
    }

    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      setTargetRect(null);
      return;
    }

    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const padding = 6;

    // Giới hạn chiều cao khung sáng tối đa 38% màn hình nếu phần tử quá lớn (như <main> ở trang trống)
    // để luôn chừa đủ không gian cho hộp chú thích, không gây vỡ layout
    const cappedHeight =
      rect.height > viewportHeight * 0.55
        ? Math.min(rect.height, viewportHeight * 0.36)
        : rect.height;

    setTargetRect({
      top: Math.max(4, rect.top - padding),
      left: Math.max(4, rect.left - padding),
      width: Math.min(viewportWidth - 8, rect.width + padding * 2),
      height: cappedHeight + padding * 2,
    });
  }, [findTargetElement]);

  useEffect(() => {
    if (!isRunning || !currentStep) return;

    let attempts = 0;
    const pollTimer = setInterval(() => {
      const el = findTargetElement();
      if (el) {
        // Không gọi scrollIntoView với thanh điều hướng cố định (nav, header, footer)
        const isFixedChrome = Boolean(el.closest("nav, header, footer"));
        if (!isFixedChrome) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        updatePosition();
        clearInterval(pollTimer);
      }
      attempts++;
      if (attempts > 25) {
        setTargetRect(null);
        clearInterval(pollTimer);
      }
    }, 100);

    // Cập nhật lại tọa độ sau khi hiệu ứng scroll mượt kết thúc
    const settleTimer = setTimeout(updatePosition, 350);

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      clearInterval(pollTimer);
      clearTimeout(settleTimer);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isRunning, currentStep, pathname, findTargetElement, updatePosition]);

  if (!isRunning || !currentStep) return null;

  const isLastStep = currentStepIndex === totalSteps - 1;
  const viewportHeight =
    typeof window !== "undefined" ? window.innerHeight : 800;

  // Tính toán vị trí hộp chú thích dựa trên khoảng trống thực tế (không bao giờ tràn mép trên/dưới)
  const getTooltipPosition = (): React.CSSProperties => {
    if (!targetRect) {
      return {
        top: "50%",
        transform: "translateY(-50%)",
      };
    }

    const spaceBelow = viewportHeight - (targetRect.top + targetRect.height);
    const spaceAbove = targetRect.top;
    const minNeededSpace = 240;

    if (spaceBelow >= minNeededSpace) {
      return {
        top: `${targetRect.top + targetRect.height + 12}px`,
      };
    }

    if (spaceAbove >= minNeededSpace) {
      return {
        bottom: `${viewportHeight - targetRect.top + 12}px`,
      };
    }

    // Dự phòng nếu cả trên và dưới đều hẹp: neo gọn ở mép dưới an toàn
    return {
      bottom: "calc(16px + env(safe-area-inset-bottom, 0px))",
    };
  };

  return (
    <div
      id="demo-overlay"
      className="fixed inset-0 z-[9999] select-none overflow-hidden"
    >
      {/* 1. LỚP PHỦ TỐI + KHUNG KHOÉT SÁNG SPOTLIGHT */}
      {targetRect ? (
        <div
          className="fixed rounded-2xl border-2 border-primary pointer-events-none transition-all duration-300 ease-out"
          style={{
            top: `${targetRect.top}px`,
            left: `${targetRect.left}px`,
            width: `${targetRect.width}px`,
            height: `${targetRect.height}px`,
            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.72)",
          }}
        />
      ) : (
        <div className="fixed inset-0 bg-black/75 transition-opacity duration-300" />
      )}

      {/* 2. HỘP CHÚ THÍCH TƯƠNG TÁC */}
      <div
        className="fixed left-3 right-3 max-w-md mx-auto max-h-[calc(100dvh-32px)] overflow-y-auto bg-card border border-primary/50 rounded-2xl p-4 shadow-2xl space-y-3 transition-all duration-300 z-10"
        style={getTooltipPosition()}
      >
        {/* Header Tiến trình & Nút Thoát */}
        <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2">
          <div className="flex items-center gap-1.5 text-primary">
            <Sparkles className="size-4 shrink-0" />
            <span className="text-[11px] font-black uppercase tracking-wider">
              Hướng dẫn • Bước {currentStepIndex + 1}/{totalSteps}
            </span>
          </div>

          <button
            type="button"
            onClick={stopDemo}
            className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground hover:text-destructive px-2 py-1 rounded-lg hover:bg-destructive/10 transition-colors"
          >
            <X className="size-3.5" />
            <span>Thoát</span>
          </button>
        </div>

        {/* Nội dung giải thích */}
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-foreground">
            {currentStep.title}
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {currentStep.description}
          </p>
        </div>

        {/* Mẹo sử dụng (nếu có) */}
        {currentStep.tip && (
          <div className="flex items-start gap-2 bg-primary/10 border border-primary/20 rounded-xl p-2.5 text-[11px] text-primary">
            <Info className="size-4 shrink-0 mt-0.5" />
            <span className="font-semibold leading-snug">
              {currentStep.tip}
            </span>
          </div>
        )}

        {/* Thanh điều hướng Quay lại / Tiếp theo */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className="h-9 px-3 text-xs font-bold gap-1 rounded-xl"
          >
            <ChevronLeft className="size-4" />
            Quay lại
          </Button>

          {/* Chấm tiến độ */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentStepIndex
                    ? "w-4 bg-primary"
                    : "w-1.5 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          <Button
            type="button"
            size="sm"
            onClick={nextStep}
            className="h-9 px-4 text-xs font-bold gap-1 rounded-xl shadow-sm"
          >
            {isLastStep ? (
              <>
                <Check className="size-4" />
                <span>Hoàn tất</span>
              </>
            ) : (
              <>
                <span>Tiếp theo</span>
                <ChevronRight className="size-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};