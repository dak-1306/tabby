import { NextRequest, NextResponse } from "next/server";
import { getGroupsCollection, sanitizeGroup } from "@/lib/groupDb";
import { Invoice } from "@/types";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string; invoiceId: string }> },
) {
  try {
    const { groupId, invoiceId } = await params;
    const body = (await req.json()) as { invoice?: Invoice };

    if (!body.invoice) {
      return NextResponse.json(
        { error: "Thiếu dữ liệu hóa đơn cần cập nhật." },
        { status: 400 },
      );
    }

    const collection = await getGroupsCollection();
    const updated = await collection.findOneAndUpdate(
      { id: groupId, "invoices.id": invoiceId },
      {
        $set: {
          "invoices.$": { ...body.invoice, id: invoiceId },
          updatedAt: new Date().toISOString(),
        },
      },
      { returnDocument: "after" },
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Không tìm thấy hóa đơn trong nhóm." },
        { status: 404 },
      );
    }

    return NextResponse.json({ group: sanitizeGroup(updated) });
  } catch (error) {
    console.error("[PATCH /api/groups/[groupId]/invoices/[invoiceId]]", error);
    return NextResponse.json(
      { error: "Không thể cập nhật hóa đơn nhóm." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ groupId: string; invoiceId: string }> },
) {
  try {
    const { groupId, invoiceId } = await params;
    const collection = await getGroupsCollection();

    const updated = await collection.findOneAndUpdate(
      { id: groupId },
      {
        $pull: { invoices: { id: invoiceId } },
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
    console.error("[DELETE /api/groups/[groupId]/invoices/[invoiceId]]", error);
    return NextResponse.json(
      { error: "Không thể xóa hóa đơn nhóm." },
      { status: 500 },
    );
  }
}
