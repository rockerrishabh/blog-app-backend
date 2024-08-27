import { eq } from "drizzle-orm";
import { db } from "../db";
import { users, verificationTokens } from "../db/schemas/user.schema";
import { mail } from "../mail";
import jwt from "jsonwebtoken";
import { verificationEmailTemplate } from "../mail/templates/verificationEmail.template";
import { generateVerificationToken } from "../utils/generateVerificationToken";

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

    const verificationToken = await generateVerificationToken(newUser[0].email);

    if (!verificationToken[0].verificationToken) {
      return {
        success: false,
        message: "Error while generating verification token!",
        status: 400,
      };
    }

    const { to, subject, html } = verificationEmailTemplate(
      name,
      email,
      verificationToken[0].verificationToken
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
      status: 201,
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

export const login = async (email: string, password: string) => {
  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!existingUser) {
      return {
        success: false,
        message: "User not found!",
        status: 404,
      };
    }

    if (!existingUser.password) {
      return {
        success: false,
        message: "You used a different provider to register!",
        status: 400,
      };
    }

    const verifyPassword = await Bun.password.verify(
      password,
      existingUser.password,
      "bcrypt"
    );

    if (!verifyPassword) {
      return {
        success: false,
        message: "Wrong password!",
        status: 400,
      };
    }

    if (!existingUser.emailVerified) {
      const verificationToken = await generateVerificationToken(email);

      if (!verificationToken[0].verificationToken) {
        return {
          success: false,
          message: "Error while generating verification token!",
          status: 400,
        };
      }
      const { to, subject, html } = verificationEmailTemplate(
        existingUser.name,
        existingUser.email,
        verificationToken[0].verificationToken
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
        status: 200,
        message: "Please verify your email!",
      };
    }

    const cookieToken = await jwt.sign(
      { id: existingUser.id },
      Bun.env.SECRET || "mysecret",
      {
        algorithm: "HS512",
        expiresIn: "24h",
      }
    );

    return {
      success: true,
      message: "Successfully logged in!",
      status: 200,
      cookieToken,
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
