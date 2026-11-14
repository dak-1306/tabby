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
  fromMemberId: string; // Người phát sinh nợ / người đã trả
  toMemberId: string; // Người trả hộ / người nhận
  amount: number;
  items?: PairBillItemDetail[];
}

export interface PairwiseDebt {
  pairKey: string;
  fromMember: GroupMember; // Người đang thiếu tiền
  toMember: GroupMember; // Người được nhận tiền
  netAmount: number; // Đã bù trừ chéo và làm tròn 1.000đ
  entries: PairLedgerEntry[];
}

// Tính phần tiền 1 thành viên phải chịu trong 1 bill cụ thể
export const getMemberShareInInvoice = (
  invoice: Invoice,
  memberId: string,
): number => {
  return invoice.items
    .filter((item) => item.assignedMemberIds.includes(memberId))
    .reduce(
      (sum, item) =>
        sum + calculateItemShare(item.price, item.assignedMemberIds.length),
      0,
    );
};

// Tính toàn bộ các cặp nợ sau khi bù trừ chéo (Pairwise Netting) & trừ các lần đã chốt nợ
export const calculateGroupPairwiseDebts = (group: Group): PairwiseDebt[] => {
  const memberMap = new Map<string, GroupMember>(
    group.members.map((m) => [m.id, m]),
  );

  // Lưu lịch sử phát sinh theo từng cặp không phân biệt thứ tự (idA < idB)
  const pairEntriesMap = new Map<string, PairLedgerEntry[]>();
  const getPairKey = (a: string, b: string) =>
    a < b ? `${a}__${b}` : `${b}__${a}`;

  const pushEntry = (a: string, b: string, entry: PairLedgerEntry) => {
    const key = getPairKey(a, b);
    const list = pairEntriesMap.get(key) || [];
    list.push(entry);
    pairEntriesMap.set(key, list);
  };

  // 1. Duyệt toàn bộ hóa đơn để ghi nhận từng khoản trả hộ
  for (const inv of group.invoices) {
    const payerId = inv.paidByMemberId;
    if (!memberMap.has(payerId)) continue;

    // Gom theo từng người ăn trong hóa đơn này
    const consumerItemsMap = new Map<string, PairBillItemDetail[]>();

    for (const item of inv.items) {
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

  // 2. Duyệt các giao dịch đã chốt nợ (Settlements)
  for (const stl of group.settlements) {
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

  for (let i = 0; i < group.members.length; i++) {
    for (let j = i + 1; j < group.members.length; j++) {
      const mA = group.members[i];
      const mB = group.members[j];
      const key = getPairKey(mA.id, mB.id);
      const entries = pairEntriesMap.get(key) || [];
      if (entries.length === 0) continue;

      // Tính số dư ròng chiều B nợ A:
      // + (Bill A trả hộ B) - (Bill B trả hộ A) - (B đã chốt nợ cho A) + (A đã chốt nợ cho B)
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

// Format tin nhắn đối soát gửi qua Zalo/Messenger
export const formatPairSettlementShareText = (
  groupName: string,
  pair: PairwiseDebt,
): string => {
  const lines = pair.entries.map((e) => {
    const dateStr = new Date(e.date).toLocaleDateString(LOCALE_VI);
    if (e.type === "settlement") {
      return `• [Đã trả] ${dateStr}: -${e.amount.toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL}`;
    }
    const sign = e.fromMemberId === pair.fromMember.id ? "+" : "-";
    return `• ${e.title} (${dateStr}): ${sign}${e.amount.toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL}`;
  });

  return `Đối soát nhóm "${groupName}" (${pair.fromMember.name} ↔ ${pair.toMember.name}):\n\n${lines.join("\n")}\n\nCHỐT LẠI: ${pair.fromMember.name} gửi ${pair.toMember.name} ${pair.netAmount.toLocaleString(LOCALE_VI)} ${CURRENCY_SYMBOL}`;
};
