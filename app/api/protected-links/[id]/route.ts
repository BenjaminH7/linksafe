import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const docRef = doc(db, "protectedLinks", id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Lien introuvable." }, { status: 404 });
    }

    const data = snapshot.data();

    const now = new Date();
    const expiresAt = data.expiresAt?.toDate ? data.expiresAt.toDate() : null;

    if (!expiresAt || expiresAt < now) {
      return NextResponse.json(
        { error: "Ce lien a expiré ou est invalide." },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { originalLink: data.originalLink },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur GET /api/protected-links/[id]:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
