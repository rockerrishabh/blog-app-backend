import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["Admin", "User", "Author"]);
export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).notNull(),
  password: text("password"),
  role: roleEnum("role").default("User").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }),
});

export const verificationTokens = pgTable("verificationTokens", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: varchar("email", { length: 256 }),
  verificationToken: text("verificationToken"),
  expires: timestamp("popularity", { mode: "date" }).notNull(),
});

export const passwordResetTokens = pgTable("passwordResetTokens", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: varchar("email", { length: 256 }),
  passwordResetToken: text("passwordResetToken"),
  expires: timestamp("popularity", { mode: "date" }).notNull(),
});
