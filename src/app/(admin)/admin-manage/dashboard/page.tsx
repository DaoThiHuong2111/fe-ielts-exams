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
  { name: 'Home', clicks: 1200 },
  { name: 'Rooms', clicks: 950 },
  { name: 'Contact', clicks: 400 },
  { name: 'About', clicks: 300 },
]

const roomStats = [
  { id: 1, name: 'Hà Nội', count: 120 },
  { id: 2, name: 'TP.HCM', count: 200 },
  { id: 3, name: 'Đà Nẵng', count: 80 },
]

export default function DashboardPage() {
  const [locationFilter, setLocationFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')

  const filteredRooms = roomStats.filter((room) =>
    room.name.toLowerCase().includes(locationFilter.toLowerCase())
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
          <h2 className="text-white text-3xl font-bold">Chào mừng bạn đến hệ thống quản lý</h2>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Tổng lượt truy cập</p>
            <p className="text-2xl font-bold">6,450</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Tổng số phòng</p>
            <p className="text-2xl font-bold">325</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Đơn đặt thành công</p>
            <p className="text-2xl font-bold">1,243</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Doanh thu tháng</p>
            <p className="text-2xl font-bold">124,000,000₫</p>
          </CardContent>
        </Card>
      </div>

      {/* User Activity Chart */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Tương tác người dùng theo trang</h2>
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

      {/* Room Stats Filter */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
            <Input
              placeholder="Lọc theo địa điểm (VD: Hà Nội)"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="max-w-[200px]"
            />
            <Button variant="outline">Lọc</Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map((room) => (
              <div key={room.id} className="p-4 border rounded-lg bg-white shadow">
                <p className="text-slate-700 font-medium">{room.name}</p>
                <p className="text-2xl font-bold">{room.count} phòng</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
