import { NextRequest, NextResponse } from "next/server";
import {
  getAuthenticatedUserId,
  getGroupsCollection,
  sanitizeGroup,
} from "@/lib/groupDb";
import { GroupMember } from "@/types/group";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> },
) {
  try {
    const { groupId } = await params;
    const body = (await req.json()) as {
      name?: string;
      linkCurrentUser?: boolean;
    };

    const cleanName = body.name?.trim() || "";
    if (!cleanName) {
      return NextResponse.json(
        { error: "Tên thành viên không hợp lệ." },
        { status: 400 },
      );
    }

    const linkedUserId = body.linkCurrentUser
      ? await getAuthenticatedUserId()
      : null;

    const collection = await getGroupsCollection();
    const existingGroup = await collection.findOne({ id: groupId });

    if (!existingGroup) {
      return NextResponse.json(
        { error: "Không tìm thấy nhóm." },
        { status: 404 },
      );
    }

    // Nếu tên đã tồn tại trong nhóm -> trả về thành viên đó thay vì tạo trùng
    const matched = existingGroup.members.find(
      (m) => m.name.toLowerCase() === cleanName.toLowerCase(),
    );

    if (matched) {
      if (linkedUserId && !matched.linkedUserId) {
        const updated = await collection.findOneAndUpdate(
          { id: groupId, "members.id": matched.id },
          {
            $set: {
              "members.$.linkedUserId": linkedUserId,
              updatedAt: new Date().toISOString(),
            },
          },
          { returnDocument: "after" },
        );
        return NextResponse.json({
          group: sanitizeGroup(updated || existingGroup),
          member: { ...matched, linkedUserId },
        });
      }

      return NextResponse.json({
        group: sanitizeGroup(existingGroup),
        member: matched,
      });
    }

    const newMember: GroupMember = {
      id: `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      name: cleanName,
      avatar: cleanName.charAt(0).toUpperCase() || "?",
      isCreator: false,
      ...(linkedUserId ? { linkedUserId } : {}),
      joinedAt: new Date().toISOString(),
    };

    const updated = await collection.findOneAndUpdate(
      { id: groupId },
      {
        $push: { members: newMember },
        $set: { updatedAt: new Date().toISOString() },
      },
      { returnDocument: "after" },
    );

    return NextResponse.json({
      group: sanitizeGroup(updated),
      member: newMember,
    });
  } catch (error) {
    console.error("[POST /api/groups/[groupId]/members]", error);
    return NextResponse.json(
      { error: "Không thể thêm thành viên vào nhóm." },
      { status: 500 },
    );
  }
}
