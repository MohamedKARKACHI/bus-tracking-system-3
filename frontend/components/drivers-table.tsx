"use client"

import { useState, useEffect } from "react"
import { User, Phone, Mail, Clock, Loader2, Pencil, Trash2, Shield, UserCircle } from "lucide-react"
import { GlassCard } from "./ui/glass-card"
import { fetchWithAuth } from "@/lib/api-client"
import { EditUserModal } from "./edit-user-modal"

export function DriversTable() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<any | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetchWithAuth('/api/users')
      if (!response.ok) throw new Error('Failed to fetch users')
      const data = await response.json()
      setUsers(data)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      const response = await fetchWithAuth(`/api/users/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete user')
      fetchUsers()
    } catch (err: any) {
      alert(err.message)
    }
  }

  if (loading) {
    return (
      <GlassCard className="p-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading users...</span>
      </GlassCard>
    )
  }

  if (error) {
    return (
      <GlassCard className="p-6">
        <div className="text-center text-red-500">
          <p className="font-semibold">Error loading user list</p>
          <p className="text-sm mt-2">{error}</p>
          <button onClick={fetchUsers} className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80">Retry</button>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">User</th>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Role</th>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Contact</th>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Joined</th>
              <th className="text-right p-4 text-sm font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border/20 hover:bg-muted/30 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-br ${user.role === 'admin' ? 'from-purple-500 to-indigo-500' :
                        user.role === 'driver' ? 'from-blue-500 to-cyan-500' :
                          'from-emerald-500 to-teal-500'
                      }`}>
                      {user.role === 'admin' ? <Shield className="h-5 w-5 text-white" /> :
                        user.role === 'driver' ? <UserCircle className="h-5 w-5 text-white" /> :
                          <User className="h-5 w-5 text-white" />}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                      user.role === 'driver' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                        'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    {user.phone || 'N/A'}
                  </div>
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-lg transition-colors"
                      title="Edit User"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EditUserModal
        isOpen={!!editingUser}
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSuccess={() => {
          fetchUsers()
          setEditingUser(null)
        }}
      />
    </GlassCard>
  )
}
