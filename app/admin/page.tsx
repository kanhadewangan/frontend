"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield, Users, Settings, BarChart3, LogOut, Mail, Loader2, Clock, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import axios from "axios"

interface User {
  id: string
  name: string
  email: string
  subscription: string
  createdAt: string
}

interface Invitation {
  id: string
  email: string
  invitedAt: string
  status: 'pending' | 'accepted' | 'expired'
  invitedBy: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("admin_authorization")
    if (!token) {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
      fetchUsers()
      fetchInvitations()
    }
  }, [router])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("admin_authorization")
      const response = await axios.get("https://back-27ic.vercel.app/api/admin/users", {
        headers: {
          Authorization: token
        }
      })

      

      const usersData = response.data.users || response.data || []
      setUsers(Array.isArray(usersData) ? usersData : [])
    } catch (error) {
      console.error("Failed to fetch users:", error)
      // For demo purposes, show some mock data
      setUsers([
        { id: "1", name: "John Doe", email: "john@example.com", subscription: "free", createdAt: "2024-01-01" },
        { id: "2", name: "Jane Smith", email: "jane@example.com", subscription: "premium", createdAt: "2024-01-15" },
        { id: "3", name: "Bob Johnson", email: "bob@example.com", subscription: "free", createdAt: "2024-02-01" },
      ])
    } finally {
      setLoading(false)
    }
  }

  const fetchInvitations = async () => {
    try {
      const token = localStorage.getItem("admin_authorization")
      const response = await axios.get("https://back-27ic.vercel.app/api/admin/invites", {
        headers: {
          Authorization: token
        }
      })

      const invitationsData = response.data.invitations || response.data || []
      setInvitations(Array.isArray(invitationsData) ? invitationsData : [])
    } catch (error) {
      console.error("Failed to fetch invitations:", error)
      // For demo purposes, show some mock data
      setInvitations([
        { id: "1", email: "john@example.com", invitedAt: "2024-01-15T10:00:00Z", status: "pending", invitedBy: "admin" },
        { id: "2", email: "jane@example.com", invitedAt: "2024-01-20T14:30:00Z", status: "accepted", invitedBy: "admin" },
        { id: "3", email: "bob@example.com", invitedAt: "2024-01-25T09:15:00Z", status: "expired", invitedBy: "admin" },
      ])
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
              <span className="text-xl font-bold text-slate-900">Admin Dashboard</span>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to Admin Panel</h1>
          <p className="text-slate-600">Manage your application settings and monitor usage.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users?.filter(u => u.subscription === 'premium').length || 0}</div>
              <p className="text-xs text-muted-foreground">Paid subscribers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invitations</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{invitations?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Sent to users</p>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              User Management
            </CardTitle>
            <CardDescription>View all users and manage subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="ml-2">Loading users...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.subscription === 'premium' ? 'default' : 'secondary'}>
                          {user.subscription}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {user.subscription === 'free' && (
                          <Link href={`/admin/invite?email=${encodeURIComponent(user.email)}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex items-center gap-1"
                            >
                              <Mail className="w-3 h-3" />
                              Invite to Subscribe
                            </Button>
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                  )) || []}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Invitations Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Invitation History
            </CardTitle>
            <CardDescription>Track sent subscription invitations and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Invited Date</TableHead>
                  <TableHead>Invited By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations?.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell className="font-medium">{invitation.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          invitation.status === 'accepted' ? 'default' :
                          invitation.status === 'pending' ? 'secondary' :
                          'destructive'
                        }
                        className="flex items-center gap-1 w-fit"
                      >
                        {invitation.status === 'accepted' && <CheckCircle className="w-3 h-3" />}
                        {invitation.status === 'pending' && <Clock className="w-3 h-3" />}
                        {invitation.status === 'expired' && <XCircle className="w-3 h-3" />}
                        {invitation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(invitation.invitedAt).toLocaleDateString()}</TableCell>
                    <TableCell>{invitation.invitedBy}</TableCell>
                  </TableRow>
                )) || []}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/invite">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Send Invitations
                </CardTitle>
                <CardDescription>Invite users to upgrade subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Send Invite</Button>
              </CardContent>
            </Card>
          </Link>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                System Settings
              </CardTitle>
              <CardDescription>Configure application settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">Configure</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Analytics
              </CardTitle>
              <CardDescription>View usage statistics and reports</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">View Reports</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}