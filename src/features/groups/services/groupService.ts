import { toast } from "sonner";
import { Group, GroupMember, GroupSettlement } from "@/types/group";
import { Invoice } from "@/types";

async function requestApi<T>(
  url: string,
  options?: RequestInit,
  silentError = false,
): Promise<T | null> {
  try {
    const res = await fetch(url, {
      ...options,
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });

    const data = (await res.json()) as T & { error?: string };

    if (!res.ok) {
      if (!silentError) {
        toast.error(data.error || "Có lỗi xảy ra khi đồng bộ dữ liệu nhóm.");
      }
      return null;
    }

    return data;
  } catch (error) {
    console.error(`[groupService] ${url}`, error);
    if (!silentError) {
      toast.error("Mất kết nối mạng, vui lòng kiểm tra lại.");
    }
    return null;
  }
}

export const groupService = {
  async createGroup(params: {
    name: string;
    creatorName: string;
    memberNames: string[];
  }): Promise<{ group: Group; creatorMember: GroupMember }> {
    const data = await requestApi<{ group: Group; creatorMember: GroupMember }>(
      "/api/groups",
      {
        method: "POST",
        body: JSON.stringify(params),
      },
    );

    if (!data) {
      throw new Error("Không thể tạo nhóm mới.");
    }
    return data;
  },

  async getGroupById(groupId: string): Promise<Group | null> {
    const data = await requestApi<{ group: Group }>(
      `/api/groups/${encodeURIComponent(groupId)}`,
      { method: "GET" },
      true,
    );
    return data?.group ?? null;
  },

  async getGroupByCode(code: string): Promise<Group | null> {
    const normalized = code.trim().toUpperCase();
    const data = await requestApi<{ group: Group }>(
      `/api/groups/code/${encodeURIComponent(normalized)}`,
      { method: "GET" },
      true,
    );
    return data?.group ?? null;
  },

  async getGroupsByIds(groupIds: string[]): Promise<Group[]> {
    const query =
      groupIds.length > 0
        ? `?ids=${encodeURIComponent(groupIds.join(","))}`
        : "";
    const data = await requestApi<{ groups: Group[] }>(
      `/api/groups${query}`,
      { method: "GET" },
      true,
    );
    return data?.groups ?? [];
  },

  async addMemberToGroup(
    groupId: string,
    memberName: string,
    linkCurrentUser = false,
  ): Promise<{ group: Group; member: GroupMember } | null> {
    return requestApi<{ group: Group; member: GroupMember }>(
      `/api/groups/${encodeURIComponent(groupId)}/members`,
      {
        method: "POST",
        body: JSON.stringify({ name: memberName, linkCurrentUser }),
      },
    );
  },

  async updateMemberInGroup(
    groupId: string,
    memberId: string,
    name: string,
  ): Promise<Group | null> {
    const data = await requestApi<{ group: Group }>(
      `/api/groups/${encodeURIComponent(groupId)}/members/${encodeURIComponent(memberId)}`,
      {
        method: "PATCH",
        body: JSON.stringify({ name }),
      },
    );
    return data?.group ?? null;
  },

  async linkMemberToCurrentUser(
    groupId: string,
    memberId: string,
  ): Promise<Group | null> {
    const data = await requestApi<{ group: Group }>(
      `/api/groups/${encodeURIComponent(groupId)}/members/${encodeURIComponent(memberId)}`,
      {
        method: "PATCH",
        body: JSON.stringify({ linkCurrentUser: true }),
      },
      true,
    );
    return data?.group ?? null;
  },

  async addInvoiceToGroup(
    groupId: string,
    invoice: Invoice,
  ): Promise<Group | null> {
    const data = await requestApi<{ group: Group }>(
      `/api/groups/${encodeURIComponent(groupId)}/invoices`,
      {
        method: "POST",
        body: JSON.stringify({ invoice }),
      },
    );
    return data?.group ?? null;
  },

  async updateInvoiceInGroup(
    groupId: string,
    invoice: Invoice,
  ): Promise<Group | null> {
    const data = await requestApi<{ group: Group }>(
      `/api/groups/${encodeURIComponent(groupId)}/invoices/${encodeURIComponent(invoice.id)}`,
      {
        method: "PATCH",
        body: JSON.stringify({ invoice }),
      },
    );
    return data?.group ?? null;
  },

  async deleteInvoiceFromGroup(
    groupId: string,
    invoiceId: string,
  ): Promise<Group | null> {
    const data = await requestApi<{ group: Group }>(
      `/api/groups/${encodeURIComponent(groupId)}/invoices/${encodeURIComponent(invoiceId)}`,
      {
        method: "DELETE",
      },
    );
    return data?.group ?? null;
  },

  async addSettlementToGroup(
    groupId: string,
    settlement: GroupSettlement,
  ): Promise<Group | null> {
    const data = await requestApi<{ group: Group }>(
      `/api/groups/${encodeURIComponent(groupId)}/settlements`,
      {
        method: "POST",
        body: JSON.stringify({ settlement }),
      },
    );
    return data?.group ?? null;
  },
};
