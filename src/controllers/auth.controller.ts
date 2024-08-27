import { eq } from "drizzle-orm";
import { db } from "../db";
import { users, verificationTokens } from "../db/schemas/user.schema";
import { mail } from "../mail";
import jwt from "jsonwebtoken";
import { verificationEmailTemplate } from "../mail/templates/verificationEmail.template";

export const register = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return {
        success: false,
        message: "User already exists!",
        status: 400,
      };
    }

    const hashedPassword = await Bun.password.hash(password, "bcrypt");

    const newUser = await db
      .insert(users)
      .values({
        email,
        name,
        password: hashedPassword,
      })
      .returning();

    if (!newUser[0].id) {
      return {
        success: false,
        message: "Error while registering!",
        status: 400,
      };
    }

    const verificationToken = await jwt.sign(
      { id: newUser[0].id },
      Bun.env.SECRET || "mysecret",
      {
        algorithm: "HS512",
        expiresIn: "24h",
      }
    );

    const updateVerificationToken = await db
      .insert(verificationTokens)
      .values({
        verificationToken,
        email,
        expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      })
      .returning();

    if (!updateVerificationToken[0].id) {
      return {
        success: false,
        message: "Error while generating verification token!",
        status: 400,
      };
    }

    const { to, subject, html } = verificationEmailTemplate(
      name,
      email,
      verificationToken
    );

    const res = await mail(to, subject, html);

    if (!res.messageId) {
      return {
        success: false,
        message: "Error while sebnding verification email!",
        status: 400,
      };
    }

    return {
      success: true,
      message: "Successfully registered!",
      status: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Server Error!, Please try again",
      status: 500,
    };
  }
};
