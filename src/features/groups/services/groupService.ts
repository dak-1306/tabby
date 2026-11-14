import { Group, GroupMember, GroupSettlement } from "@/types/group";
import { GROUP_STORAGE_KEY } from "@/constants";
import { Invoice } from "@/types";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const generateGroupCode = (): string => {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += CODE_CHARS.charAt(Math.floor(Math.random() * CODE_CHARS.length));
  }
  return code;
};

const generateId = (prefix: string): string =>
  `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

const createMemberObj = (name: string, isCreator = false): GroupMember => {
  const cleanName = name.trim();
  return {
    id: generateId("m"),
    name: cleanName,
    avatar: cleanName.charAt(0).toUpperCase() || "?",
    isCreator,
    joinedAt: new Date().toISOString(),
  };
};

const readAllGroups = (): Group[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GROUP_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Group[]) : [];
  } catch {
    return [];
  }
};

const writeAllGroups = (groups: Group[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(GROUP_STORAGE_KEY, JSON.stringify(groups));
};

export const groupService = {

  async getAllGroups(): Promise<Group[]> {
  return readAllGroups();
},

  async createGroup(params: {
    name: string;
    creatorName: string;
    memberNames: string[];
  }): Promise<{ group: Group; creatorMember: GroupMember }> {
    const groups = readAllGroups();
    const creatorMember = createMemberObj(params.creatorName, true);

    const otherMembers = params.memberNames
      .map((n) => n.trim())
      .filter(
        (n) =>
          n.length > 0 && n.toLowerCase() !== creatorMember.name.toLowerCase(),
      )
      .map((n) => createMemberObj(n, false));

    let code = generateGroupCode();
    while (groups.some((g) => g.code === code)) {
      code = generateGroupCode();
    }

    const now = new Date().toISOString();
    const newGroup: Group = {
      id: generateId("grp"),
      code,
      name: params.name.trim(),
      createdAt: now,
      updatedAt: now,
      members: [creatorMember, ...otherMembers],
      invoices: [],
      settlements: [],
    };

    writeAllGroups([newGroup, ...groups]);
    return { group: newGroup, creatorMember };
  },

  async getGroupById(groupId: string): Promise<Group | null> {
    const groups = readAllGroups();
    return groups.find((g) => g.id === groupId) || null;
  },

  async getGroupByCode(code: string): Promise<Group | null> {
    const normalized = code.trim().toUpperCase();
    const groups = readAllGroups();
    return groups.find((g) => g.code === normalized) || null;
  },

  async getGroupsByIds(groupIds: string[]): Promise<Group[]> {
    const groups = readAllGroups();
    const idSet = new Set(groupIds);
    return groups.filter((g) => idSet.has(g.id));
  },

  async addMemberToGroup(
    groupId: string,
    memberName: string,
  ): Promise<{ group: Group; member: GroupMember } | null> {
    const groups = readAllGroups();
    const idx = groups.findIndex((g) => g.id === groupId);
    if (idx === -1) return null;

    const cleanName = memberName.trim();
    if (!cleanName) return null;

    const existing = groups[idx].members.find(
      (m) => m.name.toLowerCase() === cleanName.toLowerCase(),
    );
    if (existing) {
      return { group: groups[idx], member: existing };
    }

    const newMember = createMemberObj(cleanName, false);
    const updatedGroup: Group = {
      ...groups[idx],
      updatedAt: new Date().toISOString(),
      members: [...groups[idx].members, newMember],
    };

    groups[idx] = updatedGroup;
    writeAllGroups(groups);
    return { group: updatedGroup, member: newMember };
  },

  async updateMemberInGroup(
    groupId: string,
    memberId: string,
    name: string,
  ): Promise<Group | null> {
    const groups = readAllGroups();
    const idx = groups.findIndex((g) => g.id === groupId);
    if (idx === -1) return null;

    const cleanName = name.trim();
    if (!cleanName) return groups[idx];

    const updatedGroup: Group = {
      ...groups[idx],
      updatedAt: new Date().toISOString(),
      members: groups[idx].members.map((m) =>
        m.id === memberId
          ? { ...m, name: cleanName, avatar: cleanName.charAt(0).toUpperCase() }
          : m,
      ),
    };
    groups[idx] = updatedGroup;
    writeAllGroups(groups);
    return updatedGroup;
  },

  async addInvoiceToGroup(
    groupId: string,
    invoice: Invoice,
  ): Promise<Group | null> {
    const groups = readAllGroups();
    const idx = groups.findIndex((g) => g.id === groupId);
    if (idx === -1) return null;

    const updatedGroup: Group = {
      ...groups[idx],
      updatedAt: new Date().toISOString(),
      invoices: [invoice, ...groups[idx].invoices],
    };
    groups[idx] = updatedGroup;
    writeAllGroups(groups);
    return updatedGroup;
  },

  async updateInvoiceInGroup(
    groupId: string,
    invoice: Invoice,
  ): Promise<Group | null> {
    const groups = readAllGroups();
    const idx = groups.findIndex((g) => g.id === groupId);
    if (idx === -1) return null;

    const updatedGroup: Group = {
      ...groups[idx],
      updatedAt: new Date().toISOString(),
      invoices: groups[idx].invoices.map((inv) =>
        inv.id === invoice.id ? invoice : inv,
      ),
    };
    groups[idx] = updatedGroup;
    writeAllGroups(groups);
    return updatedGroup;
  },

  async deleteInvoiceFromGroup(
    groupId: string,
    invoiceId: string,
  ): Promise<Group | null> {
    const groups = readAllGroups();
    const idx = groups.findIndex((g) => g.id === groupId);
    if (idx === -1) return null;

    const updatedGroup: Group = {
      ...groups[idx],
      updatedAt: new Date().toISOString(),
      invoices: groups[idx].invoices.filter((inv) => inv.id !== invoiceId),
    };
    groups[idx] = updatedGroup;
    writeAllGroups(groups);
    return updatedGroup;
  },

  async addSettlementToGroup(
    groupId: string,
    settlement: GroupSettlement,
  ): Promise<Group | null> {
    const groups = readAllGroups();
    const idx = groups.findIndex((g) => g.id === groupId);
    if (idx === -1) return null;

    const updatedGroup: Group = {
      ...groups[idx],
      updatedAt: new Date().toISOString(),
      settlements: [settlement, ...groups[idx].settlements],
    };
    groups[idx] = updatedGroup;
    writeAllGroups(groups);
    return updatedGroup;
  },
};
