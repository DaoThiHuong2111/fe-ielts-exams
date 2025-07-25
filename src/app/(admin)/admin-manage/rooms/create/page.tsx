// app/admin/rooms/create.tsx
'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface RoomForm {
  name: string
  description: string
  price: number
  location: string
  status: 'available' | 'rented'
  images: File[]
  amenities: string
  size: number
}

export default function CreateRoomPage() {
  const route = useRouter()
  const [form, setForm] = useState<RoomForm>({
    name: '',
    description: '',
    price: 0,
    location: '',
    status: 'available',
    images: [],
    amenities: '',
    size: 0,
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...newFiles],
      }))
    }
  }

  const handleImageRemove = (index: number) => {
    const newImages = [...form.images]
    newImages.splice(index, 1)
    setForm({ ...form, images: newImages })
  }

  const handleSubmit = () => {
    console.log('Submitting:', form)
    // Handle submit logic here
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 bg-white p-6 rounded-xl shadow">
      <div className='flex items-center gap-3'>
        <div className='cursor-pointer' onClick={() => route.push('/admin-manage/rooms')}>
          <ArrowLeft className="w-4 h-4" />
        </div>
        <h1 className="text-2xl font-bold">Thêm phòng mới</h1>
      </div>

      <div className="space-y-2">
        <Label>Tên phòng</Label>
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nhập tên phòng" />
      </div>

      <div className="space-y-2">
        <Label>Mô tả</Label>
        <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Mô tả chi tiết về phòng" />
      </div>

      <div className="space-y-2">
        <Label>Giá (VNĐ)</Label>
        <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
      </div>

      <div className="space-y-2">
        <Label>Diện tích (m²)</Label>
        <Input type="number" value={form.size} onChange={(e) => setForm({ ...form, size: Number(e.target.value) })} />
      </div>

      <div className="space-y-2">
        <Label>Khu vực</Label>
        <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="VD: Hà Nội, TP.HCM,..." />
      </div>

      <div className="space-y-2">
        <Label>Tiện nghi</Label>
        <Input value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} placeholder="VD: Wifi, điều hòa, giường, bàn,..." />
      </div>

      <div className="space-y-2">
        <Label>Trạng thái</Label>
        <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value as 'available' | 'rented' })}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Còn trống</SelectItem>
            <SelectItem value="rented">Đã thuê</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Ảnh mô tả</Label>
        <Input type="file" accept="image/*" multiple onChange={handleImageChange} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {form.images.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(file)}
                alt={`Ảnh ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border"
              />
              <button
                onClick={() => handleImageRemove(index)}
                className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={handleSubmit}>Tạo phòng</Button>
    </div>
  )
}
