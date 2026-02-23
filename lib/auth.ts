// Admin authentication — configured by Dev C
// Options: email login, ENV password, or secret URL

export function verifyAdminPassword(password: string): boolean {
  return password === process.env.ADMIN_PASSWORD;
}
