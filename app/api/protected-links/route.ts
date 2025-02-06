import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(request: NextRequest) {
  try {
    const { originalLink } = await request.json();

    if (!originalLink) {
      return NextResponse.json(
        { error: "Paramètre 'originalLink' manquant." },
        { status: 400 }
      );
    }

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const docRef = await addDoc(collection(db, "protectedLinks"), {
      originalLink,
      expiresAt,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (error) {
    console.error("Erreur POST /api/protected-links:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
