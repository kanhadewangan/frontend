"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Crown, CheckCircle, Sparkles, Mail, Calendar } from "lucide-react"
import { getCurrentUser, updateCurrentUser, logout, type User as AuthUser } from "@/lib/auth"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ProfilePage() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(currentUser)
    setName(currentUser.name)
    setEmail(currentUser.email)
  }, [router])

  const handleUpdateProfile = () => {
    if (!user) return

    setIsLoading(true)
    try {
      const updatedUser = { ...user, name: name.trim(), email: email.trim() }
      setUser(updatedUser)
      updateCurrentUser(updatedUser)
      setIsEditing(false)
      setMessage("Profile updated successfully!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpgradeToProMock = () => {
    if (!user) return

    // Mock upgrade - in real app this would integrate with payment processor
    const upgradedUser = { ...user, subscription: "pro" as const }
    setUser(upgradedUser)
    updateCurrentUser(upgradedUser)
    setMessage("Congratulations! You've been upgraded to Pro!")
    setTimeout(() => setMessage(""), 5000)
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/notes">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Notes
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">NoteMaster</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Profile Settings</h1>
          <p className="text-slate-600">Manage your account and subscription</p>
        </div>

        {message && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-800">{message}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-slate-600" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditing}
                    className="border-slate-300 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!isEditing}
                    className="border-slate-300 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-600">
                    Member since{" "}
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <Separator />

                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        onClick={handleUpdateProfile}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)} variant="outline">
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subscription Card */}
          <div>
            <Card
              className={`border-slate-200 ${user.subscription === "pro" ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200" : ""}`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className={`w-5 h-5 ${user.subscription === "pro" ? "text-yellow-600" : "text-slate-600"}`} />
                  Subscription
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <Badge
                    className={
                      user.subscription === "pro"
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-lg px-4 py-2"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-100 text-lg px-4 py-2"
                    }
                  >
                    {user.subscription === "pro" ? (
                      <>
                        <Crown className="w-4 h-4 mr-2" />
                        Pro Plan
                      </>
                    ) : (
                      "Free Plan"
                    )}
                  </Badge>
                </div>

                {user.subscription === "free" ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-slate-600 mb-2">Current limits:</p>
                      <p className="text-lg font-semibold text-slate-900">{user.notes?.length || 0}/3 notes used</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-900">Upgrade to Pro for:</p>
                      <ul className="space-y-1 text-sm text-slate-600">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          Unlimited notes
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          Advanced search
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          Priority support
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          Export options
                        </li>
                      </ul>
                    </div>

                    <Button
                      onClick={handleUpgradeToProMock}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade to Pro - $9/month
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-slate-600 mb-2">You have:</p>
                      <p className="text-lg font-semibold text-slate-900">Unlimited notes</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-900">Pro benefits:</p>
                      <ul className="space-y-1 text-sm text-slate-600">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          Unlimited notes ✓
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          Advanced search ✓
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          Priority support ✓
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          Export options ✓
                        </li>
                      </ul>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-slate-600">Thank you for being a Pro member!</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card className="border-slate-200 mt-6">
              <CardHeader>
                <CardTitle className="text-slate-900">Account Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  onClick={() => {
                    logout()
                    router.push("/")
                  }}
                  className="w-full border-red-200 text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
