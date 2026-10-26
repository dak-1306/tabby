export interface DraftItem {
  id: string;
  name: string;
  price: number;
  assignedMemberIds: string[];
}

export interface MemberSplitBreakdown {
  memberId: string;
  memberName: string;
  memberAvatar: string;
  amountOwed: number;
  assignedItemsCount: number;
}
