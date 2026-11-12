"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ROUTES } from "@/constants";

export interface TourStep {
  stepIndex: number;
  route: string;
  selector: string;
  fallbackSelector: string;
  title: string;
  description: string;
  tip?: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    stepIndex: 1,
    route: ROUTES.HOME,
    selector: '[data-tour="nav-create"]',
    fallbackSelector:
      'nav a[href*="create"], nav button:has(svg.lucide-plus), nav a:has(svg.lucide-plus), nav button:nth-child(3), nav a:nth-child(3)',
    title: "1. Tạo hóa đơn mới",
    description:
      "Chạm vào nút '+' ở giữa thanh điều hướng để bắt đầu tạo bill từ bất kỳ màn hình nào.",
    tip: "Mọi thao tác chia tiền đều bắt đầu tại đây.",
  },
  {
    stepIndex: 2,
    route: ROUTES.CREATE,
    selector: '[data-tour="tour-title"]',
    fallbackSelector: 'input[name="title"]',
    title: "2. Nhập tiêu đề hóa đơn",
    description:
      "Đặt tên cho bữa ăn hoặc chuyến đi (ví dụ: 'Ăn trưa công ty') để dễ dàng tra cứu lại trong sổ nợ.",
    tip: "Tiêu đề rõ ràng giúp phân biệt nhanh khi nhóm có nhiều hóa đơn.",
  },
  {
    stepIndex: 3,
    route: ROUTES.CREATE,
    selector: '[data-tour="tour-members"]',
    fallbackSelector: "main > div:nth-child(2)",
    title: "3. Chọn & Thêm thành viên",
    description:
      "Tích chọn những người tham gia bữa ăn hoặc bấm '+ Thêm' để tạo nhanh thành viên mới ngay tại chỗ.",
    tip: "Chỉ những người được chọn ở đây mới hiển thị ở danh sách chia từng món.",
  },
  {
    stepIndex: 4,
    route: ROUTES.CREATE,
    selector: '[data-tour="tour-item-row"]',
    fallbackSelector: "main div.space-y-2\\.5 > div:first-of-type",
    title: "4. Gõ giá tắt & Enter nhảy dòng",
    description:
      "Nhập giá tắt như '45k' hoặc '1m' để tự quy đổi chuẩn VND, sau đó tích chọn người ăn cho riêng món đó.",
    tip: "Nhấn phím Enter ở ô giá tiền để tự động tạo dòng món tiếp theo.",
  },
  {
    stepIndex: 5,
    route: ROUTES.CREATE,
    selector: '[data-tour="tour-live-preview"]',
    fallbackSelector: "main div.border-dashed",
    title: "5. Xem trước hóa đơn trực tiếp",
    description:
      "Theo dõi tổng tiền và phần chia chi tiết của từng thành viên cập nhật theo thời gian thực.",
    tip: "Kiểm tra nhanh tránh sai sót trước khi lưu.",
  },
  {
    stepIndex: 6,
    route: ROUTES.CREATE,
    selector: '[data-tour="tour-submit"]',
    fallbackSelector: "footer button",
    title: "6. Lưu hóa đơn",
    description:
      "Bấm 'Tạo hóa đơn' để hoàn tất. Hệ thống sẽ tự động phân bổ công nợ cho từng người.",
  },
  {
    stepIndex: 7,
    route: ROUTES.LEDGER,
    selector: '[data-tour="tour-ledger"]',
    fallbackSelector: ".border-l-primary, main > div:first-child, main",
    title: "7. Sổ nợ & Tự động làm tròn",
    description:
      "Xem tổng hợp công nợ và bấm vào từng thẻ thành viên để mở chi tiết các khoản cần thu/chi.",
    tip: "Số tiền cá nhân của Host và thành viên luôn tự động làm tròn chuẩn mốc 1.000 ₫.",
  },
];

interface DemoContextType {
  isRunning: boolean;
  currentStep: TourStep | null;
  currentStepIndex: number;
  totalSteps: number;
  startDemo: () => void;
  stopDemo: () => void;
  nextStep: () => void;
  prevStep: () => void;
}

const DemoContext = createContext<DemoContextType | null>(null);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const goToStep = useCallback(
    (index: number) => {
      const step = TOUR_STEPS[index];
      if (!step) return;

      setCurrentStepIndex(index);
      if (pathname !== step.route) {
        router.push(step.route);
      }
    },
    [pathname, router],
  );

  const startDemo = useCallback(() => {
    setIsRunning(true);
    goToStep(0);
  }, [goToStep]);

  const stopDemo = useCallback(() => {
    setIsRunning(false);
    setCurrentStepIndex(0);
    router.push(ROUTES.HOME);
  }, [router]);

  const nextStep = useCallback(() => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      goToStep(currentStepIndex + 1);
    } else {
      stopDemo();
    }
  }, [currentStepIndex, goToStep, stopDemo]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      goToStep(currentStepIndex - 1);
    }
  }, [currentStepIndex, goToStep]);

  const currentStep = isRunning ? TOUR_STEPS[currentStepIndex] : null;

  return (
    <DemoContext.Provider
      value={{
        isRunning,
        currentStep,
        currentStepIndex,
        totalSteps: TOUR_STEPS.length,
        startDemo,
        stopDemo,
        nextStep,
        prevStep,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) throw new Error("useDemo must be used within DemoProvider");
  return context;
};
