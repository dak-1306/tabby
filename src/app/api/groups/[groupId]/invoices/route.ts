import { NextRequest, NextResponse } from "next/server";
import { getGroupsCollection, sanitizeGroup } from "@/lib/groupDb";
import { Invoice } from "@/types";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> },
) {
  try {
    const { groupId } = await params;
    const body = (await req.json()) as { invoice?: Invoice };

    if (!body.invoice || !body.invoice.id) {
      return NextResponse.json(
        { error: "Dữ liệu hóa đơn không hợp lệ." },
        { status: 400 },
      );
    }

    const collection = await getGroupsCollection();
    const updated = await collection.findOneAndUpdate(
      { id: groupId },
      {
        $push: {
          invoices: {
            $each: [body.invoice],
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
    console.error("[POST /api/groups/[groupId]/invoices]", error);
    return NextResponse.json(
      { error: "Không thể lưu hóa đơn nhóm." },
      { status: 500 },
    );
  }
}
