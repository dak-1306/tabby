import { NextRequest, NextResponse } from "next/server";
import { getGroupsCollection, sanitizeGroup } from "@/lib/groupDb";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  try {
    const { code } = await params;
    const normalized = code.trim().toUpperCase();

    const collection = await getGroupsCollection();
    const doc = await collection.findOne({ code: normalized });

    if (!doc) {
      return NextResponse.json(
        { error: "Không tìm thấy nhóm với mã này." },
        { status: 404 },
      );
    }

    return NextResponse.json({ group: sanitizeGroup(doc) });
  } catch (error) {
    console.error("[GET /api/groups/code/[code]]", error);
    return NextResponse.json(
      { error: "Lỗi máy chủ khi tìm nhóm theo mã." },
      { status: 500 },
    );
  }
}
