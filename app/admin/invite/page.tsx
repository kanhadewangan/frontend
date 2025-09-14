"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"
import axios from "axios"

function InvitePageContent() {
  const [email, setEmail] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = localStorage.getItem("admin_authorization")
    if (!token) {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
      // Pre-fill email from query parameter
      const emailParam = searchParams.get('email')
      if (emailParam) {
        setEmail(emailParam)
      }
    }
  }, [router, searchParams])

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    if (!email.trim()) {
      setError("Please enter an email address")
      setIsLoading(false)
      return
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    try {
      const token = localStorage.getItem("admin_authorization")
      if (!token) {
        setError("Authentication token not found. Please log in again.")
        setIsLoading(false)
        return
      }

      console.log("Sending invitation request:", {
        url: "https://back-27ic.vercel.app/api/admin/invite",
        email: email.trim(),
        token: token.substring(0, 20) + "..." // Log partial token for debugging
      })

      await axios.post("https://back-27ic.vercel.app/api/admin/invite", {
        email: email.trim()
      }, {
        headers: {
          Authorization: token
        }
      })

      setSuccess(true)
      setEmail("")
    } catch (err: any) {
      console.error("Failed to send invitation:", err)
      console.error("Error response:", err.response)
      console.error("Error status:", err.response?.status)
      console.error("Error data:", err.response?.data)
      setError(err.response?.data?.message || `Failed to send invitation (${err.response?.status || 'Unknown error'})`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_authorization")
    router.push("/admin/login")
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-slate-600">Checking admin access...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-red-600" />
              <span className="text-xl font-bold text-slate-900">Admin Panel</span>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Send Subscription Invitation</h1>
          <p className="text-slate-600">Invite users to upgrade to a premium subscription</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Send Invitation
            </CardTitle>
            <CardDescription>
              Enter the email address of the user you want to invite to subscribe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInvite} className="space-y-4">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    Invitation sent successfully!
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">
                  User Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter user's email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-slate-300 focus:border-red-500"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Sending Invitation...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Invitation
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>• Make sure the email address belongs to a registered user</p>
            <p>• Invitations are sent via email with subscription upgrade details</p>
            <p>• Users will receive a link to upgrade their account</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function InvitePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    }>
      <InvitePageContent />
    </Suspense>
  )
}