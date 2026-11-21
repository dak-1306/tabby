import { Collection, MongoClient, WithId } from "mongodb";
import { auth } from "@/auth";
import { Group } from "@/types/group";

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
  var _tabbyGroupMongoPromise: Promise<MongoClient> | undefined;
  var _tabbyGroupIndexesReady: boolean | undefined;
}

const getMongoClient = (): Promise<MongoClient> => {
  if (!MONGODB_URI) {
    throw new Error("Thiếu biến môi trường MONGODB_URI.");
  }

  if (!globalThis._tabbyGroupMongoPromise) {
    const client = new MongoClient(MONGODB_URI);
    globalThis._tabbyGroupMongoPromise = client.connect();
  }

  return globalThis._tabbyGroupMongoPromise;
};

export const getGroupsCollection = async (): Promise<Collection<Group>> => {
  const client = await getMongoClient();
  const db = client.db();
  const collection = db.collection<Group>("groups");

  if (!globalThis._tabbyGroupIndexesReady) {
    await Promise.all([
      collection.createIndex({ id: 1 }, { unique: true }),
      collection.createIndex({ code: 1 }, { unique: true }),
      collection.createIndex({ "members.linkedUserId": 1 }),
    ]);
    globalThis._tabbyGroupIndexesReady = true;
  }

  return collection;
};

export const getAuthenticatedUserId = async (): Promise<string | null> => {
  try {
    const session = await auth();
    const email = session?.user?.email?.trim().toLowerCase();
    return email ? `usr_${email}` : null;
  } catch {
    return null;
  }
};

export const sanitizeGroup = (
  doc: WithId<Group> | Group | null,
): Group | null => {
  if (!doc) return null;
  const { _id, ...rest } = doc as WithId<Group>;
  void _id;

  return {
    ...rest,
    members: rest.members ?? [],
    invoices: rest.invoices ?? [],
    settlements: rest.settlements ?? [],
  };
};
