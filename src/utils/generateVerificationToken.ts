import jwt from "jsonwebtoken";
import { db } from "../db";
import { verificationTokens } from "../db/schemas/user.schema";
import { eq } from "drizzle-orm";

export const generateVerificationToken = async (email: string) => {
  const verificationToken = await jwt.sign(
    { email },
    Bun.env.SECRET || "mysecret",
    {
      algorithm: "HS512",
      expiresIn: "24h",
    }
  );

  const existingToken = await db.query.verificationTokens.findFirst({
    where: eq(verificationTokens.email, email),
  });

  if (existingToken) {
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.email, email));
  }

  const updateVerificationToken = await db
    .insert(verificationTokens)
    .values({
      verificationToken,
      email,
      expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    })
    .returning();

  return updateVerificationToken;
};
