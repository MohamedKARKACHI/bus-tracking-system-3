"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { GlassCard } from "@/components/ui/glass-card"
import { DollarSign, Download, Loader2, Receipt, CheckCircle, XCircle, Clock } from "lucide-react"

interface Transaction {
  id: number
  ticket_number: string
  route_name: string
  amount: number
  payment_method: string
  status: string
  transaction_date: string
}

export default function HistoryPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all')

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (!isLoading && user && user.role !== "client") {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user?.id) {
      fetchTransactions()
    }
  }, [user])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/user/transactions?user_id=${user?.id}`)
      const data = await response.json()
      setTransactions(data)
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  if (isLoading || !user || user.role !== "client") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <Loader2 className="w-16 h-16 text-cyan-600 animate-spin" />
      </div>
    )
  }

  const filteredTransactions = filter === 'all'
    ? Array.isArray(transactions) ? transactions : []
    : Array.isArray(transactions) ? transactions.filter(t => t.status && t.status.toLowerCase() === filter) : []

  const totalSpent = transactions
    .filter(t => t && t.status === 'completed')
    .reduce((sum, t) => sum + parseFloat(t.amount?.toString?.() ?? '0'), 0)

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-500" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300"
      case 'pending':
        return "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300"
      case 'failed':
        return "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">Transaction History</h1>
          <p className="text-slate-600 dark:text-slate-400">View your payment history and receipts</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Receipt className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{transactions.length}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Transactions</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">${totalSpent.toFixed(2)}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Spent</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {transactions.filter(t => t.status === 'completed').length}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Completed</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(['all', 'completed', 'pending', 'failed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${filter === status
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Transactions */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 text-cyan-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Loading transactions...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <Receipt className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No transactions found</h3>
            <p className="text-slate-600 dark:text-slate-400">
              {filter === 'all' ? "You haven't made any transactions yet" : `No ${filter} transactions`}
            </p>
          </GlassCard>
        ) : (
          <div className="grid gap-4">
            {filteredTransactions.map((transaction) => (
              <GlassCard key={transaction.id} className="p-6 hover:shadow-lg transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(transaction.status)}
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{transaction.route_name || 'N/A'}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {new Date(transaction.transaction_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-xs text-slate-600 dark:text-slate-400">Ticket</p>
                      <p className="font-medium text-cyan-600 dark:text-cyan-400">{transaction.ticket_number || 'N/A'}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-600 dark:text-slate-400">Payment</p>
                      <p className="font-medium text-slate-900 dark:text-white capitalize">{transaction.payment_method}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-600 dark:text-slate-400">Amount</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">${parseFloat(transaction.amount.toString()).toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                      Receipt
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
