"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Search, Edit, Trash2, LogOut, Sparkles, Crown } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { Note } from "@/lib/types"
import { UsageIndicator } from "@/components/usage-indicator"
import axios from "axios"
export default function NotesPage() {
  const [user, setUser] = useState<any>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [newNote, setNewNote] = useState({ title: "", content: "" })
  const [error, setError] = useState("")
  const router = useRouter()
  

  useEffect(() => {
    const token = localStorage.getItem("authorization")
    console.log(token)
    if (!token) {
      router.push("/login")
      return
    }
    fetchUserAndNotes()
  }, [router])

  const fetchUserAndNotes = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("authorization") || '""')
      const response = await axios.get("https://back-27ic.vercel.app/api/note/notes", {
        headers: {
          Authorization: token
        }
      })
      setNotes(response.data.notes || [])
      // Set basic user info if available in response
      if (response.data.user) {
        setUser(response.data.user)
      } else {
        // Set default user info
        setUser({ subscription: "free", name: "User" })
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error)
      // Redirect to login if unauthorized
      router.push("/login")
    }
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const canCreate = user ? (user.subscription === "pro" ? true : notes.length < 3) : false
  const remaining = user ? (user.subscription === "pro" ? Infinity : Math.max(0, 3 - notes.length)) : 0

  const handleCreateNote = async () => {
    if (!canCreate) {
      setError("You've reached the limit of 3 notes. Upgrade to Pro for unlimited notes!")
      return
    }

    if (!newNote.title.trim()) {
      setError("Please enter a title for your note")
      return
    }

    try {
      const token = JSON.parse(localStorage.getItem("authorization") || '""')
      const response = await axios.post("https://back-27ic.vercel.app/api/note", {
        title: newNote.title.trim(),
        content: newNote.content.trim(),
      }, {
        headers: {
          Authorization: token
        }
      })

      // Add the new note to the local state
      const newNoteData = response.data.note
      setNotes(prevNotes => [...prevNotes, newNoteData])
      setNewNote({ title: "", content: "" })
      setIsCreateDialogOpen(false)
      setError("")
    } catch (error: any) {
      console.error("Failed to create note:", error)
      setError(error.response?.data?.message || "Failed to create note")
    }
  }

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setNewNote({ title: note.title, content: note.content })
  }

  const handleUpdateNote = async () => {
    if (!editingNote) return

    if (!newNote.title.trim()) {
      setError("Please enter a title for your note")
      return
    }

    try {
      const token = JSON.parse(localStorage.getItem("authorization") || '""')
      const response = await axios.put(`https://back-27ic.vercel.app/api/note/notes/${editingNote.id}`, {
        title: newNote.title.trim(),
        content: newNote.content.trim(),
      }, {
        headers: {
          Authorization: token
        }
      })

      // Update the note in local state
      const updatedNote = response.data.note
      setNotes(prevNotes => prevNotes.map(note =>
        note.id === editingNote.id ? updatedNote : note
      ))
      setEditingNote(null)
      setNewNote({ title: "", content: "" })
      setError("")
    } catch (error: any) {
      console.error("Failed to update note:", error)
      setError(error.response?.data?.message || "Failed to update note")
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    try {
      const token = JSON.parse(localStorage.getItem("authorization") || '""')
      await axios.delete(`https://back-27ic.vercel.app/api/note/notes/${noteId}`, {
        headers: {
          Authorization: token
        }
      })

      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId))
    } catch (error: any) {
      console.error("Failed to delete note:", error)
      setError(error.response?.data?.message || "Failed to delete note")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("authorization")
    router.push("/")
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">NoteMaster</span>
              </Link>
              <Badge
                className={
                  user.subscription === "pro"
                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-100"
                }
              >
                {user.subscription === "pro" ? (
                  <>
                    <Crown className="w-3 h-3 mr-1" />
                    Pro
                  </>
                ) : (
                  "Free"
                )}
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                  <Crown className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-600 hover:text-slate-900">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">My Notes</h1>
            <UsageIndicator user={user} />
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" disabled={!canCreate}>
                <Plus className="w-4 h-4 mr-2" />
                New Note
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Note</DialogTitle>
                <DialogDescription>Add a new note to your collection</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                )}
                <div>
                  <Input
                    placeholder="Note title"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    className="border-slate-300 focus:border-blue-500"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Write your note here..."
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    rows={6}
                    className="border-slate-300 focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateNote} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Create Note
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreateDialogOpen(false)
                      setNewNote({ title: "", content: "" })
                      setError("")
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {user.subscription === "free" && remaining === 0 && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <Crown className="w-4 h-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              You've reached your limit of 3 notes.{" "}
              <Link href="/profile" className="font-medium underline hover:no-underline">
                Upgrade to Pro
              </Link>{" "}
              for unlimited notes!
            </AlertDescription>
          </Alert>
        )}

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-slate-300 focus:border-blue-500"
          />
        </div>

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {notes.length === 0 ? "No notes yet" : "No notes found"}
            </h3>
            <p className="text-slate-600 mb-4">
              {notes.length === 0 ? "Create your first note to get started" : "Try adjusting your search terms"}
            </p>
            {notes.length === 0 && canCreate && (
              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Note
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note) => (
              <Card key={note.id} className="border-slate-200 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-slate-900 line-clamp-1">{note.title}</CardTitle>
                  <p className="text-sm text-slate-500">
                    {new Date(note.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-slate-600 line-clamp-3 mb-4">{note.content || "No content"}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditNote(note)}
                      className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {handleDeleteNote(note.id)
                        console.log("Deleting note with id:", note.id)
                      }
                        
                      }
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editingNote} onOpenChange={() => setEditingNote(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Note</DialogTitle>
              <DialogDescription>Make changes to your note</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}
              <div>
                <Input
                  placeholder="Note title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Write your note here..."
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  rows={6}
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdateNote} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingNote(null)
                    setNewNote({ title: "", content: "" })
                    setError("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
