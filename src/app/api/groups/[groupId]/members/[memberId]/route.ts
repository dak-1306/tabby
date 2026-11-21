import { NextRequest, NextResponse } from "next/server";
import {
  getAuthenticatedUserId,
  getGroupsCollection,
  sanitizeGroup,
} from "@/lib/groupDb";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string; memberId: string }> },
) {
  try {
    const { groupId, memberId } = await params;
    const body = (await req.json()) as {
      name?: string;
      linkCurrentUser?: boolean;
    };

    const setFields: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (typeof body.name === "string" && body.name.trim()) {
      const cleanName = body.name.trim();
      setFields["members.$.name"] = cleanName;
      setFields["members.$.avatar"] = cleanName.charAt(0).toUpperCase() || "?";
    }

    if (body.linkCurrentUser) {
      const linkedUserId = await getAuthenticatedUserId();
      if (linkedUserId) {
        setFields["members.$.linkedUserId"] = linkedUserId;
      }
    }

    const collection = await getGroupsCollection();
    const updated = await collection.findOneAndUpdate(
      { id: groupId, "members.id": memberId },
      { $set: setFields },
      { returnDocument: "after" },
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Không tìm thấy nhóm hoặc thành viên." },
        { status: 404 },
      );
    }

    return NextResponse.json({ group: sanitizeGroup(updated) });
  } catch (error) {
    console.error("[PATCH /api/groups/[groupId]/members/[memberId]]", error);
    return NextResponse.json(
      { error: "Không thể cập nhật thông tin thành viên." },
      { status: 500 },
    );
  }
}
