import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/lib/mongodb";
import { Invoice, Member } from "@/types";

interface PersonalWorkspaceDoc {
  userEmail: string;
  currentUserId: string;
  members: Member[];
  invoices: Invoice[];
  updatedAt: string;
}

// GET: Tải dữ liệu cá nhân từ MongoDB theo tài khoản Google
export async function GET() {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const doc = await db
    .collection<PersonalWorkspaceDoc>("personal_workspaces")
    .findOne({ userEmail: email });

  if (!doc) {
    return NextResponse.json({ data: null });
  }

  return NextResponse.json({
    data: {
      currentUserId: doc.currentUserId,
      members: doc.members,
      invoices: doc.invoices,
      updatedAt: doc.updatedAt,
    },
  });
}

// PUT: Lưu đồng bộ toàn bộ trạng thái cá nhân lên MongoDB
export async function PUT(request: Request) {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    currentUserId: string;
    members: Member[];
    invoices: Invoice[];
  };

  const now = new Date().toISOString();
  const db = await getDb();

  await db.collection<PersonalWorkspaceDoc>("personal_workspaces").updateOne(
    { userEmail: email },
    {
      $set: {
        userEmail: email,
        currentUserId: body.currentUserId,
        members: body.members,
        invoices: body.invoices,
        updatedAt: now,
      },
    },
    { upsert: true },
  );

  return NextResponse.json({ ok: true, updatedAt: now });
}
