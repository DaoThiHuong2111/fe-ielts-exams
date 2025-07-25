// app/admin/rooms/page.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'

interface Room {
  id: number
  name: string
  location: string
  price: number
  status: 'available' | 'rented'
}

const pageSize = 5

export default function RoomListPage() {
  const [rooms, setRooms] = useState<Room[]>([
    { id: 1, name: 'Phòng 1', location: 'Hà Nội', price: 1500000, status: 'available' },
    { id: 2, name: 'Phòng 2', location: 'TP.HCM', price: 2000000, status: 'rented' },
    { id: 3, name: 'Phòng 3', location: 'Đà Nẵng', price: 1800000, status: 'available' },
    { id: 4, name: 'Phòng 4', location: 'Huế', price: 1600000, status: 'available' },
    { id: 5, name: 'Phòng 5', location: 'Cần Thơ', price: 1700000, status: 'rented' },
    { id: 6, name: 'Phòng 6', location: 'Hà Nội', price: 1900000, status: 'available' },
  ])

  const [newRoom, setNewRoom] = useState<Partial<Room>>({})
  const [openDialog, setOpenDialog] = useState(false)
  const [filterLocation, setFilterLocation] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const route = useRouter()

  const handleDelete = (id: number) => {
    setRooms(rooms.filter((room) => room.id !== id))
  }

  const handleAdd = () => {
    if (!newRoom.name || !newRoom.location || !newRoom.price) return
    const newId = rooms.length ? Math.max(...rooms.map((r) => r.id)) + 1 : 1
    setRooms([...rooms, { id: newId, ...newRoom, status: 'available' } as Room])
    setNewRoom({})
    setOpenDialog(false)
  }

  const filteredRooms = rooms.filter((room) => {
    return (
      (!filterLocation || room.location === filterLocation) &&
      (!filterStatus || room.status === filterStatus)
    )
  })

  const paginatedRooms = filteredRooms.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const totalPages = Math.ceil(filteredRooms.length / pageSize)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Danh sách phòng</h1>
        <Button className="flex gap-2" onClick={() => route.push('/admin-manage/rooms/create')}>
          <Plus className="w-4 h-4" /> Thêm phòng mới
        </Button>
        {/* <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="flex gap-2" onClick={() => route.push('create')}>
              <Plus className="w-4 h-4" /> Thêm phòng mới
            </Button>
          </DialogTrigger>
          <DialogContent className="space-y-4">
            <h2 className="text-lg font-semibold">Thêm phòng mới</h2>
            <Input placeholder="Tên phòng" value={newRoom.name || ''} onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })} />
            <Input placeholder="Địa điểm" value={newRoom.location || ''} onChange={(e) => setNewRoom({ ...newRoom, location: e.target.value })} />
            <Input type="number" placeholder="Giá phòng" value={newRoom.price?.toString() || ''} onChange={(e) => setNewRoom({ ...newRoom, price: Number(e.target.value) })} />
            <Button onClick={handleAdd} className="w-full">Lưu</Button>
          </DialogContent>
        </Dialog> */}
      </div>

      <div className="flex gap-4">
        <Select onValueChange={setFilterLocation} defaultValue="">
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Lọc theo địa điểm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=".">Tất cả</SelectItem>
            <SelectItem value="Hà Nội">Hà Nội</SelectItem>
            <SelectItem value="TP.HCM">TP.HCM</SelectItem>
            <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
            <SelectItem value="Huế">Huế</SelectItem>
            <SelectItem value="Cần Thơ">Cần Thơ</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={setFilterStatus} defaultValue="">
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=".">Tất cả</SelectItem>
            <SelectItem value="available">Còn trống</SelectItem>
            <SelectItem value="rented">Đã thuê</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl bg-white shadow p-4 border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tên phòng</TableHead>
              <TableHead>Địa điểm</TableHead>
              <TableHead>Giá (VNĐ)</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRooms.map((room) => (
              <TableRow key={room.id} className="hover:bg-slate-50">
                <TableCell>{room.id}</TableCell>
                <TableCell>{room.name}</TableCell>
                <TableCell>{room.location}</TableCell>
                <TableCell>{room.price.toLocaleString()}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-white text-sm ${room.status === 'available' ? 'bg-green-500' : 'bg-gray-400'}`}>
                    {room.status === 'available' ? 'Còn trống' : 'Đã thuê'}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="icon">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(room.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              variant={i + 1 === currentPage ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
