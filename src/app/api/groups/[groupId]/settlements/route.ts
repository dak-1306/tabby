import { NextRequest, NextResponse } from "next/server";
import { getGroupsCollection, sanitizeGroup } from "@/lib/groupDb";
import { GroupSettlement } from "@/types/group";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> },
) {
  try {
    const { groupId } = await params;
    const body = (await req.json()) as { settlement?: GroupSettlement };

    if (!body.settlement || !body.settlement.id) {
      return NextResponse.json(
        { error: "Dữ liệu chốt nợ không hợp lệ." },
        { status: 400 },
      );
    }

    const collection = await getGroupsCollection();
    const updated = await collection.findOneAndUpdate(
      { id: groupId },
      {
        $push: {
          settlements: {
            $each: [body.settlement],
            $position: 0,
          },
        },
        $set: { updatedAt: new Date().toISOString() },
      },
      { returnDocument: "after" },
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Không tìm thấy nhóm." },
        { status: 404 },
      );
    }

    return NextResponse.json({ group: sanitizeGroup(updated) });
  } catch (error) {
    console.error("[POST /api/groups/[groupId]/settlements]", error);
    return NextResponse.json(
      { error: "Không thể ghi nhận giao dịch chốt nợ." },
      { status: 500 },
    );
  }
}
