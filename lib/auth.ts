export interface User {
  id: string
  name: string
  email: string
  password: string
  subscription: "free" | "pro"
  createdAt: string
  notes: Note[]
}

export interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  try {
    const user = localStorage.getItem("notemaster_current_user")
    return user ? JSON.parse(user) : null
  } catch {
    return null
  }
}

export function updateCurrentUser(user: User): void {
  localStorage.setItem("notemaster_current_user", JSON.stringify(user))

  // Also update in users array
  const users = JSON.parse(localStorage.getItem("notemaster_users") || "[]")
  const userIndex = users.findIndex((u: User) => u.id === user.id)
  if (userIndex !== -1) {
    users[userIndex] = user
    localStorage.setItem("notemaster_users", JSON.stringify(users))
  }
}

export function logout(): void {
  localStorage.removeItem("notemaster_current_user")
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}
