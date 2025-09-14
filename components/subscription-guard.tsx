"use client"

import type { ReactNode } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Crown } from "lucide-react"
import Link from "next/link"
import type { User } from "@/lib/types"
import { isFeatureAvailable } from "@/lib/subscription"

interface SubscriptionGuardProps {
  user: User
  feature: string
  children: ReactNode
  fallback?: ReactNode
}

export function SubscriptionGuard({ user, feature, children, fallback }: SubscriptionGuardProps) {
  const hasAccess = isFeatureAvailable(user, feature)

  if (hasAccess) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  return (
    <Alert className="border-yellow-200 bg-yellow-50">
      <Crown className="w-4 h-4 text-yellow-600" />
      <AlertDescription className="text-yellow-800">
        This feature requires a Pro subscription.{" "}
        <Link href="/profile" className="font-medium underline hover:no-underline">
          Upgrade now
        </Link>{" "}
        to unlock {feature.toLowerCase()}.
      </AlertDescription>
    </Alert>
  )
}
