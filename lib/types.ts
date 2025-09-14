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

export interface SubscriptionLimits {
  maxNotes: number
  features: string[]
}

export const SUBSCRIPTION_LIMITS: Record<"free" | "pro", SubscriptionLimits> = {
  free: {
    maxNotes: 3,
    features: ["Basic note taking", "Mobile access", "Search notes"],
  },
  pro: {
    maxNotes: -1, // -1 means unlimited
    features: ["Unlimited notes", "Advanced search", "Priority support", "Export options", "Rich text editing"],
  },
}
