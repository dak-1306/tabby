import { Group, GroupMember } from "@/types/group";
import { Invoice } from "@/types";
import { calculateItemShare, roundToThousand } from "@/utils/calculations";
import { CURRENCY_SYMBOL, LOCALE_VI } from "@/constants";

export interface PairBillItemDetail {
  name: string;
  totalPrice: number;
  splitCount: number;
  memberShare: number;
}

export interface PairLedgerEntry {
  id: string;
  type: "bill" | "settlement";
  title: string;
  date: string;
  fromMemberId: string;
  toMemberId: string;
  amount: number;
  items?: PairBillItemDetail[];
}

export interface PairwiseDebt {
  pairKey: string;
  fromMember: GroupMember;
  toMember: GroupMember;
  netAmount: number;
  entries: PairLedgerEntry[];
}

export const getMemberShareInInvoice = (
  invoice: Invoice,
  memberId: string,
): number => {
  return (invoice.items ?? [])
    .filter((item) => item.assignedMemberIds.includes(memberId))
    .reduce(
      (sum, item) =>
        sum + calculateItemShare(item.price, item.assignedMemberIds.length),
      0,
    );
};

export const calculateGroupPairwiseDebts = (group: Group): PairwiseDebt[] => {
  const members = group.members ?? [];
  const invoices = group.invoices ?? [];
  const settlements = group.settlements ?? [];

  const memberMap = new Map<string, GroupMember>(members.map((m) => [m.id, m]));

  const pairEntriesMap = new Map<string, PairLedgerEntry[]>();
  const getPairKey = (a: string, b: string) =>
    a < b ? `${a}__${b}` : `${b}__${a}`;

  const pushEntry = (a: string, b: string, entry: PairLedgerEntry) => {
    const key = getPairKey(a, b);
    const list = pairEntriesMap.get(key) || [];
    list.push(entry);
    pairEntriesMap.set(key, list);
  };

  // 1. Duyệt toàn bộ hóa đơn (danh sách chia món luôn giữ nguyên cố định)
  for (const inv of invoices) {
    const payerId = inv.paidByMemberId;
    if (!memberMap.has(payerId)) continue;

    const consumerItemsMap = new Map<string, PairBillItemDetail[]>();

    for (const item of inv.items ?? []) {
      if (item.price <= 0 || item.assignedMemberIds.length === 0) continue;
      const share = calculateItemShare(
        item.price,
        item.assignedMemberIds.length,
      );

      for (const consumerId of item.assignedMemberIds) {
        if (consumerId === payerId || !memberMap.has(consumerId)) continue;
        const arr = consumerItemsMap.get(consumerId) || [];
        arr.push({
          name: item.name,
          totalPrice: item.price,
          splitCount: item.assignedMemberIds.length,
          memberShare: share,
        });
        consumerItemsMap.set(consumerId, arr);
      }
    }

    consumerItemsMap.forEach((items, consumerId) => {
      const amount = items.reduce((s, it) => s + it.memberShare, 0);
      if (amount > 0) {
        pushEntry(consumerId, payerId, {
          id: `${inv.id}_${consumerId}`,
          type: "bill",
          title: inv.title,
          date: inv.createdAt,
          fromMemberId: consumerId,
          toMemberId: payerId,
          amount,
          items,
        });
      }
    });
  }

  // 2. Duyệt các giao dịch đã chốt nợ (Settlements) độc lập theo từng cặp
  for (const stl of settlements) {
    if (!memberMap.has(stl.fromMemberId) || !memberMap.has(stl.toMemberId)) {
      continue;
    }
    pushEntry(stl.fromMemberId, stl.toMemberId, {
      id: stl.id,
      type: "settlement",
      title: "Đã thanh toán chốt nợ",
      date: stl.settledAt,
      fromMemberId: stl.fromMemberId,
      toMemberId: stl.toMemberId,
      amount: stl.amount,
    });
  }

  // 3. Bù trừ chéo cho từng cặp thành viên
  const results: PairwiseDebt[] = [];

  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      const mA = members[i];
      const mB = members[j];
      const key = getPairKey(mA.id, mB.id);
      const entries = pairEntriesMap.get(key) || [];
      if (entries.length === 0) continue;

      let netBtoA = 0;
      for (const e of entries) {
        if (e.type === "bill") {
          if (e.fromMemberId === mB.id && e.toMemberId === mA.id) {
            netBtoA += e.amount;
          } else if (e.fromMemberId === mA.id && e.toMemberId === mB.id) {
            netBtoA -= e.amount;
          }
        } else {
          if (e.fromMemberId === mB.id && e.toMemberId === mA.id) {
            netBtoA -= e.amount;
          } else if (e.fromMemberId === mA.id && e.toMemberId === mB.id) {
            netBtoA += e.amount;
          }
        }
      }

      const roundedAbs = roundToThousand(Math.abs(netBtoA));
      if (roundedAbs <= 0) continue;

      const sortedEntries = [...entries].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );

      if (netBtoA > 0) {
        results.push({
          pairKey: key,
          fromMember: mB,
          toMember: mA,
          netAmount: roundedAbs,
          entries: sortedEntries,
        });
      } else {
        results.push({
          pairKey: key,
          fromMember: mA,
          toMember: mB,
          netAmount: roundedAbs,
          entries: sortedEntries,
        });
      }
    }
  }

  return results.sort((a, b) => b.netAmount - a.netAmount);
};

// Format tin nhắn đối soát gửi qua Zalo/Messenger (Hỗ trợ cả bản Chi tiết từng món & Tóm tắt)
export const formatPairSettlementShareText = (
  groupName: string,
  pair: PairwiseDebt,
  isDetailed = true,
): string => {
  const bankInfoText = pair.toMember.accountNumber
    ? `\n\nThông tin chuyển khoản:\n- STK: ${pair.toMember.accountNumber}\n- Ngân hàng: ${pair.toMember.bankName || "Chưa cập nhật"}\n- Chủ TK: ${pair.toMember.name}`
    : "";

  const lines = pair.entries.map((e) => {
    const dateStr = new Date(e.date).toLocaleDateString(LOCALE_VI);

    if (e.type === "settlement") {
      return `• [Đã trả] ${dateStr}: -${e.amount.toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL}`;
    }

    const isPositive = e.fromMemberId === pair.fromMember.id;
    const sign = isPositive ? "+" : "-";
    const payerNote = isPositive
      ? `${pair.toMember.name} trả hộ`
      : `${pair.fromMember.name} trả hộ`;

    const headerLine = `• ${e.title} (${dateStr} - ${payerNote}): ${sign}${e.amount.toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL}`;

    if (!isDetailed || !e.items || e.items.length === 0) {
      return headerLine;
    }

    const itemsText = e.items
      .map(
        (item) =>
          `  + ${item.name}: ${item.totalPrice.toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL} (chia ${item.splitCount} -> ${sign}${item.memberShare.toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL})`,
      )
      .join("\n");

    return `${headerLine}\n${itemsText}`;
  });

  const separator = isDetailed ? "\n\n" : "\n";

  return `Đối soát nhóm "${groupName}" (${pair.fromMember.name} ↔ ${pair.toMember.name}):\n\n${lines.join(separator)}\n\nCHỐT LẠI: ${pair.fromMember.name} gửi ${pair.toMember.name} ${pair.netAmount.toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL}${bankInfoText}`;
};
