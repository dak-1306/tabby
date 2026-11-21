import { NextRequest, NextResponse } from "next/server";
import { getGroupsCollection, sanitizeGroup } from "@/lib/groupDb";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> },
) {
  try {
    const { groupId } = await params;
    const collection = await getGroupsCollection();
    const doc = await collection.findOne({ id: groupId });

    if (!doc) {
      return NextResponse.json(
        { error: "Không tìm thấy nhóm." },
        { status: 404 },
      );
    }

    return NextResponse.json({ group: sanitizeGroup(doc) });
  } catch (error) {
    console.error("[GET /api/groups/[groupId]]", error);
    return NextResponse.json(
      { error: "Lỗi máy chủ khi tải dữ liệu nhóm." },
      { status: 500 },
    );
  }
}
