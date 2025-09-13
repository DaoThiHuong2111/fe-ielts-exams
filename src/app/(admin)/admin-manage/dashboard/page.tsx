// app/admin/dashboard/page.tsx
'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

const userStats = [
  { name: 'Reading', clicks: 1200 },
  { name: 'Listening', clicks: 950 },
  { name: 'Quiz', clicks: 800 },
  { name: 'Practice', clicks: 600 },
]

const quizStats = [
  { id: 1, name: 'Reading Quiz', count: 45 },
  { id: 2, name: 'Listening Quiz', count: 32 },
  { id: 3, name: 'Practice Test', count: 28 },
]

export default function DashboardPage() {
  const [quizFilter, setQuizFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')

  const filteredQuizzes = quizStats.filter((quiz) =>
    quiz.name.toLowerCase().includes(quizFilter.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>

      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-xl overflow-hidden shadow-md relative"
      >
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
          alt="Admin banner"
          width={1200}
          height={300}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h2 className="text-white text-3xl font-bold">IELTS Exam Management System</h2>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Students</p>
            <p className="text-2xl font-bold">1,245</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Quizzes</p>
            <p className="text-2xl font-bold">105</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Completed Tests</p>
            <p className="text-2xl font-bold">3,287</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Average Score</p>
            <p className="text-2xl font-bold">7.2/9</p>
          </CardContent>
        </Card>
      </div>

      {/* User Activity Chart */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">User Activity by Section</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userStats}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="clicks" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quiz Stats Filter */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
            <Input
              placeholder="Filter by quiz type (e.g., Reading)"
              value={quizFilter}
              onChange={(e) => setQuizFilter(e.target.value)}
            />
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="max-w-[200px]"
            />
            <Button variant="outline">Filter</Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredQuizzes.map((quiz) => (
              <div key={quiz.id} className="p-4 border rounded-lg bg-white shadow">
                <p className="text-slate-700 font-medium">{quiz.name}</p>
                <p className="text-2xl font-bold">{quiz.count} quizzes</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
