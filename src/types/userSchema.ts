import { z } from "zod";

// batas sesuai schema Prisma
const NAME_MAX = 150;
const EMAIL_MAX = 150;
const ROLE_MAX = 50;
const PASSWORD_MAX = 255;

export type FormMode = "create" | "edit";

// ---- Skema dasar (sesuai kolom DB) ----
export const UserSchema = (mode: FormMode) =>
  z.object({
    id: z.string().uuid().optional(),
    name: z.string().trim().min(1, "Nama wajib diisi").max(NAME_MAX),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Email tidak valid")
      .max(EMAIL_MAX),
    // role String?  → boleh null/undefined
    role: z.string().trim().max(ROLE_MAX).nullable().optional(),
    password:
      mode === "create"
        ? z.string().min(6).max(255) // wajib saat create
        : z.string().min(6).max(255).optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  });

// Response publik (jangan kirim password ke FE)
export const UserPublicSchema = UserSchema("create").omit({ password: true });

// ---- Input: Create user ----
export const UserCreateSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1).max(NAME_MAX),
  email: z.string().trim().toLowerCase().email().max(EMAIL_MAX),
  role: z.string().trim().max(ROLE_MAX).nullable().optional(),
  // atur minimum sesuai kebijakanmu (contoh 6/8 karakter)
  password: z.string().min(6, "Minimal 6 karakter").max(PASSWORD_MAX),
});

// ---- Input: Update user ----
// id wajib, field lain opsional tapi minimal ada 1 yang diubah
export const UserUpdateSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().trim().min(1).max(NAME_MAX).optional(),
    email: z.string().trim().toLowerCase().email().max(EMAIL_MAX).optional(),
    role: z.string().trim().max(ROLE_MAX).nullable().optional(),
    password: z.string().min(6).max(PASSWORD_MAX).optional(),
  })
  .refine(
    (v) =>
      ["name", "email", "role", "password"].some(
        (k) => v[k as keyof typeof v] !== undefined
      ),
    { message: "Minimal satu field harus diubah", path: ["_"] }
  );

// ---- Input: Login ----
export const UserLoginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(EMAIL_MAX),
  password: z.string().min(1),
});

// ---- Helper untuk whereUnique di Prisma ----
export const UserWhereUniqueSchema = z
  .object({
    id: z.string().uuid().optional(),
    email: z.string().trim().toLowerCase().email().max(EMAIL_MAX).optional(),
  })
  .refine((v) => !!v.id || !!v.email, { message: "Butuh id atau email" });

// ---- Types ----
export type UserType = z.infer<ReturnType<typeof UserSchema>>;
export type UserPublicType = z.infer<typeof UserPublicSchema>;
export type UserCreateInputType = z.infer<typeof UserCreateSchema>;
export type UserUpdateInputType = z.infer<typeof UserUpdateSchema>;
export type UserLoginInputType = z.infer<typeof UserLoginSchema>;
export type UserWhereUniqueInputType = z.infer<typeof UserWhereUniqueSchema>;
