"use client"

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Crown } from "lucide-react"
import type { User } from "@/lib/types"
import { getRemainingNotes } from "@/lib/subscription"

interface UsageIndicatorProps {
  user: User
  className?: string
}

export function UsageIndicator({ user, className }: UsageIndicatorProps) {
  const remaining = getRemainingNotes(user)
  const isUnlimited = user.subscription === "pro"
  const notesCount = user.notes?.length || 0
  const maxNotes = 3 

  if (isUnlimited) {
    return (
      <div className={className}>
        <div className="flex items-center gap-2">
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Crown className="w-3 h-3 mr-1" />
            Pro
          </Badge>
          <span className="text-sm text-slate-600">{notesCount} notes</span>
        </div>
      </div>
    )
  }

  const usagePercentage = (notesCount / maxNotes) * 100

  return (
    <div className={className}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Notes used</span>
          <span className="text-sm font-medium text-slate-900">
            {notesCount}/{maxNotes}
          </span>
        </div>
        <Progress value={usagePercentage} className="h-2" />
        {remaining === 0 && (
          <p className="text-xs text-amber-600">You've reached your limit. Upgrade to Pro for unlimited notes!</p>
        )}
      </div>
    </div>
  )
}
