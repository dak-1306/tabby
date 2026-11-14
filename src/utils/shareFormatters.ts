import { Invoice, Member, MemberDebtSummary } from "@/types";
import { CURRENCY_SYMBOL, LOCALE_VI } from "@/constants";
import { roundToThousand } from "@/utils/calculations";

export interface DetailedUnpaidItem {
  name: string;
  totalPrice: number;
  splitCount: number;
  memberShare: number;
}

export interface DetailedUnpaidBill {
  id: string;
  title: string;
  createdAt: string;
  amountOwedForBill: number;
  items: DetailedUnpaidItem[];
}

// 1. Chia bill cho CẢ NHÓM
export const formatInvoiceGroupShareText = (
  invoice: Invoice,
  members: Member[],
  currentUser?: Member,
): string => {
  const totalAmount = invoice.items.reduce((sum, item) => sum + item.price, 0);
  const dateStr = new Date(invoice.createdAt).toLocaleDateString(LOCALE_VI);

  const memberTotals = new Map<string, number>();
  invoice.items.forEach((item) => {
    if (item.assignedMemberIds.length === 0) return;
    const share = roundToThousand(item.price / item.assignedMemberIds.length);
    item.assignedMemberIds.forEach((mId) => {
      memberTotals.set(mId, (memberTotals.get(mId) || 0) + share);
    });
  });

  const itemsListText = invoice.items
    .map((item) => {
      const names = item.assignedMemberIds
        .map((mId) => members.find((m) => m.id === mId)?.name || "Thành viên")
        .join(", ");
      const sharePrice = roundToThousand(
        item.price / item.assignedMemberIds.length,
      );
      return `- ${item.name}: ${item.price.toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL} (chia ${item.assignedMemberIds.length} -> ${sharePrice.toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL}/người: ${names})`;
    })
    .join("\n");

  const splitBreakdownText = Array.from(memberTotals.entries())
    .map(([mId, amount]) => {
      const mName = members.find((m) => m.id === mId)?.name || "Thành viên";
      return `- ${mName}: ${amount.toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL}`;
    })
    .join("\n");

  const bankInfoText = currentUser?.accountNumber
    ? `\n\nThông tin chuyển khoản (${currentUser.name}):\n- STK: ${currentUser.accountNumber}\n- Ngân hàng: ${currentUser.bankName || "Chưa cập nhật"}`
    : "";

  return `Chi tiết hóa đơn: ${invoice.title}\nNgày: ${dateStr}\nTổng tiền: ${totalAmount.toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL}\n\nDanh sách món:\n${itemsListText}\n\nPhần tiền từng người:\n${splitBreakdownText}${bankInfoText}`;
};

// 2. Đòi nợ CÁ NHÂN (Thành viên khác)
export const formatMemberDemandShareText = (
  member: MemberDebtSummary,
  unpaidBills: DetailedUnpaidBill[],
  currentUser?: Member,
  isDetailed = true,
): string => {
  const bankInfoText = currentUser?.accountNumber
    ? `\n\nThông tin chuyển khoản:\n- STK: ${currentUser.accountNumber}\n- Ngân hàng: ${currentUser.bankName || "Chưa cập nhật"}\n- Chủ TK: ${currentUser.name}`
    : "";

  if (!isDetailed) {
    const summaryList = unpaidBills
      .map(
        (b) =>
          `- ${b.title} (${new Date(b.createdAt).toLocaleDateString(LOCALE_VI)}): ${b.amountOwedForBill.toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL}`,
      )
      .join("\n");

    return `Gửi ${member.memberName} tiền các bill chưa thanh toán:\n\n${summaryList}\n\nTỔNG CỘNG: ${member.totalOwed.toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL}${bankInfoText}`;
  }

  const detailedList = unpaidBills
    .map((b) => {
      const dateStr = new Date(b.createdAt).toLocaleDateString(LOCALE_VI);
      const itemsText = b.items
        .map(
          (item) =>
            `  + ${item.name}: ${item.totalPrice.toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL} (chia ${item.splitCount} -> ${item.memberShare.toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL})`,
        )
        .join("\n");

      return `- ${b.title} (${dateStr}): ${b.amountOwedForBill.toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL}\n${itemsText}`;
    })
    .join("\n\n");

  return `Gửi ${member.memberName} chi tiết các bill nhóm:\n\n${detailedList}\n\nTỔNG CỘNG CẦN CHUYỂN: ${member.totalOwed.toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL}${bankInfoText}`;
};

// 3. Tóm tắt Chi tiêu cá nhân của HOST (Mới)
export const formatHostExpenseShareText = (
  hostName: string,
  hostUnpaidBills: DetailedUnpaidBill[],
  totalHostExpense: number,
): string => {
  const detailedList = hostUnpaidBills
    .map((b) => {
      const dateStr = new Date(b.createdAt).toLocaleDateString(LOCALE_VI);
      const itemsText = b.items
        .map(
          (item) =>
            `  + ${item.name}: ${item.totalPrice.toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL} (chia ${item.splitCount} -> ${item.memberShare.toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL})`,
        )
        .join("\n");

      return `- ${b.title} (${dateStr}): ${b.amountOwedForBill.toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL}\n${itemsText}`;
    })
    .join("\n\n");

  return `Chi tiêu cá nhân của ${hostName}:\n\n${detailedList}\n\nTỔNG CÁ NHÂN THỰC CHI: ${totalHostExpense.toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL}`;
};
