import { NextRequest, NextResponse } from "next/server";
import {
  getAuthenticatedUserId,
  getGroupsCollection,
  sanitizeGroup,
} from "@/lib/groupDb";
import { Group, GroupMember } from "@/types/group";

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

export async function GET(req: NextRequest) {
  try {
    const idsParam = req.nextUrl.searchParams.get("ids") || "";
    const ids = idsParam
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const linkedUserId = await getAuthenticatedUserId();

    const orFilters: Record<string, unknown>[] = [];
    if (ids.length > 0) {
      orFilters.push({ id: { $in: ids } });
    }
    if (linkedUserId) {
      orFilters.push({ "members.linkedUserId": linkedUserId });
    }

    if (orFilters.length === 0) {
      return NextResponse.json({ groups: [] });
    }

    const collection = await getGroupsCollection();
    const docs = await collection
      .find({ $or: orFilters })
      .sort({ updatedAt: -1 })
      .toArray();

    const groups = docs
      .map((doc) => sanitizeGroup(doc))
      .filter((g): g is Group => g !== null);

    return NextResponse.json({ groups });
  } catch (error) {
    console.error("[GET /api/groups]", error);
    return NextResponse.json(
      { error: "Không thể tải danh sách nhóm." },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      name?: string;
      creatorName?: string;
      memberNames?: string[];
    };

    const groupName = body.name?.trim() || "";
    const creatorName = body.creatorName?.trim() || "";

    if (!groupName || !creatorName) {
      return NextResponse.json(
        { error: "Thiếu tên nhóm hoặc tên người tạo." },
        { status: 400 },
      );
    }

    const linkedUserId = await getAuthenticatedUserId();
    const now = new Date().toISOString();

    const creatorMember: GroupMember = {
      id: generateId("m"),
      name: creatorName,
      avatar: creatorName.charAt(0).toUpperCase() || "?",
      isCreator: true,
      ...(linkedUserId ? { linkedUserId } : {}),
      joinedAt: now,
    };

    const seenNames = new Set<string>([creatorName.toLowerCase()]);
    const otherMembers: GroupMember[] = [];

    for (const rawName of body.memberNames ?? []) {
      const cleanName = rawName.trim();
      const lower = cleanName.toLowerCase();
      if (!cleanName || seenNames.has(lower)) continue;
      seenNames.add(lower);

      otherMembers.push({
        id: generateId("m"),
        name: cleanName,
        avatar: cleanName.charAt(0).toUpperCase() || "?",
        isCreator: false,
        joinedAt: now,
      });
    }

    const collection = await getGroupsCollection();
    const groupId = generateId("grp");

    // Thử tối đa 10 lần nếu mã 6 ký tự bị trùng unique index trên MongoDB
    for (let attempt = 0; attempt < 10; attempt++) {
      const code = generateGroupCode();
      const newGroup: Group = {
        id: groupId,
        code,
        name: groupName,
        createdAt: now,
        updatedAt: now,
        members: [creatorMember, ...otherMembers],
        invoices: [],
        settlements: [],
      };

      try {
        await collection.insertOne(newGroup);
        return NextResponse.json(
          { group: newGroup, creatorMember },
          { status: 201 },
        );
      } catch (err: unknown) {
        const mongoErr = err as { code?: number };
        if (mongoErr?.code === 11000 && attempt < 9) {
          continue;
        }
        throw err;
      }
    }

    return NextResponse.json(
      { error: "Không thể khởi tạo mã nhóm, vui lòng thử lại." },
      { status: 500 },
    );
  } catch (error) {
    console.error("[POST /api/groups]", error);
    return NextResponse.json(
      { error: "Lỗi máy chủ khi tạo nhóm." },
      { status: 500 },
    );
  }
}
