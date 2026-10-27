import { Invoice, Member, MemberDebtSummary } from "@/types";
import { CURRENCY_SYMBOL, LOCALE_VI } from "@/constants";

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

export const formatInvoiceGroupShareText = (
  invoice: Invoice,
  members: Member[],
  currentUser?: Member
): string => {
  const totalAmount = invoice.items.reduce((sum, item) => sum + item.price, 0);
  const dateStr = new Date(invoice.createdAt).toLocaleDateString(LOCALE_VI);

  const memberTotals = new Map<string, number>();
  invoice.items.forEach((item) => {
    if (item.assignedMemberIds.length === 0) return;
    const share = item.price / item.assignedMemberIds.length;
    item.assignedMemberIds.forEach((mId) => {
      memberTotals.set(mId, (memberTotals.get(mId) || 0) + share);
    });
  });

  const itemsListText = invoice.items
    .map((item) => {
      const names = item.assignedMemberIds
        .map((mId) => members.find((m) => m.id === mId)?.name || "Thành viên")
        .join(", ");
      const sharePrice = Math.round(item.price / item.assignedMemberIds.length);
      return ` • ${item.name}: ${item.price.toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL} (Chia ${item.assignedMemberIds.length} -> ${sharePrice.toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL}/người: ${names})`;
    })
    .join("\n");

  const splitBreakdownText = Array.from(memberTotals.entries())
    .map(([mId, amount]) => {
      const mName = members.find((m) => m.id === mId)?.name || "Thành viên";
      return ` • ${mName}: ${Math.round(amount).toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL}`;
    })
    .join("\n");

  const bankInfoText = currentUser?.accountNumber
    ? `\n💳 Thông tin chuyển khoản (${currentUser.name}):\n • Ngân hàng: ${currentUser.bankName || "Chưa cập nhật"}\n • STK: ${currentUser.accountNumber}`
    : "";

  return `🧾 TÓM TẮT HÓA ĐƠN: ${invoice.title}\n📅 Ngày: ${dateStr}\n💰 Tổng bill: ${totalAmount.toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL}\n\n📋 Chi tiết từng món:\n${itemsListText}\n\n📊 Chia tiền từng người:\n${splitBreakdownText}${bankInfoText}\n\nMọi người check chuyển khoản giúp mình nhé, cảm ơn cả nhà! 🙏`;
};

export const formatMemberDemandShareText = (
  member: MemberDebtSummary,
  unpaidBills: DetailedUnpaidBill[],
  currentUser?: Member,
  isDetailed = true
): string => {
  const bankInfoText = currentUser?.accountNumber
    ? `\n💳 Thông tin tài khoản nhận:\n • Ngân hàng: ${currentUser.bankName || "Chưa cập nhật"}\n • STK: ${currentUser.accountNumber}\n • Chủ TK: ${currentUser.name}`
    : "";

  if (!isDetailed) {
    const summaryList = unpaidBills
      .map(
        (b) =>
          ` 📌 ${b.title} (${new Date(b.createdAt).toLocaleDateString(LOCALE_VI)}): ${Math.round(b.amountOwedForBill).toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL}`
      )
      .join("\n");

    return `Alo ${member.memberName} ơi! 👋\nDưới đây là tóm tắt các khoản bill nhóm của bạn nè:\n\n${summaryList}\n\n💵 TỔNG CẦN CHUYỂN: ${member.totalOwed.toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL}${bankInfoText}\n\nChuyển xong nhắn mình gạch nợ nha, cảm ơn bạn! ✨`;
  }

  const detailedList = unpaidBills
    .map((b) => {
      const dateStr = new Date(b.createdAt).toLocaleDateString(LOCALE_VI);
      const itemsText = b.items
        .map(
          (item) =>
            `  • ${item.name}: ${item.totalPrice.toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL} (Chia ${item.splitCount} -> ${Math.round(item.memberShare).toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL})`
        )
        .join("\n");

      return `📌 ${b.title} (${dateStr}):\n${itemsText}\n  => Tiền bill này: ${Math.round(b.amountOwedForBill).toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL}`;
    })
    .join("\n\n");

  return `Alo ${member.memberName} ơi! 👋\nDưới đây là chi tiết các khoản bill nhóm của bạn nè:\n\n${detailedList}\n\n💵 TỔNG CẦN CHUYỂN: ${member.totalOwed.toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL}${bankInfoText}\n\nChuyển xong nhắn mình gạch nợ nha, cảm ơn bạn! ✨`;
};