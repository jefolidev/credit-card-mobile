export const UserRole = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  PORTATOR: "PORTATOR",
  ADMIN_SHOP: "ADMIN_SHOP",
  SELLER: "SELLER",
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];