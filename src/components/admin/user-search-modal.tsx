'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Search, UserPlus, Calendar } from 'lucide-react'
import axios from '@/lib/axios'
import toast from 'react-hot-toast'

interface User {
  id: string
  username: string
  email: string
  name: string
  role: string
}

interface UserSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectUsers: (userIds: string[], expiresAt?: string) => void
  excludeUserIds?: string[]
}

export default function UserSearchModal({
  isOpen,
  onClose,
  onSelectUsers,
  excludeUserIds = []
}: UserSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [expiresAt, setExpiresAt] = useState('')

  useEffect(() => {
    if (isOpen) {
      searchUsers('')
    }
  }, [isOpen])

  const searchUsers = async (query: string) => {
    try {
      setLoading(true)
      const { data } = await axios.get('/v1/users', {
        params: {
          search: query,
          limit: 20
        }
      })
      // Filter out excluded users
      const filteredUsers = data.filter((user: User) => !excludeUserIds.includes(user.id))
      setUsers(filteredUsers)
    } catch (error) {
      console.error('Failed to search users:', error)
      toast.error('Không thể tìm kiếm người dùng')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    if (value.length >= 2 || value === '') {
      searchUsers(value)
    }
  }

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId)
      } else {
        return [...prev, userId]
      }
    })
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(users.map(u => u.id))
    }
  }

  const handleSubmit = () => {
    if (selectedUsers.length === 0) {
      toast.error('Vui lòng chọn ít nhất một người dùng')
      return
    }

    onSelectUsers(selectedUsers, expiresAt || undefined)
    setSelectedUsers([])
    setSearchTerm('')
    setExpiresAt('')
  }

  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Thêm người dùng vào quiz</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-y-auto">
          {/* Search Input */}
          <div>
            <Label htmlFor="search">Tìm kiếm người dùng</Label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Nhập tên, email hoặc username..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Expiry Date */}
          <div>
            <Label htmlFor="expiresAt">Ngày hết hạn (tùy chọn)</Label>
            <div className="relative mt-1">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="expiresAt"
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                min={getMinDate()}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Để trống nếu muốn cấp quyền vĩnh viễn
            </p>
          </div>

          {/* User List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Chọn người dùng ({selectedUsers.length} đã chọn)</Label>
              {users.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectedUsers.length === users.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                </Button>
              )}
            </div>
            
            <div className="border rounded-lg max-h-[300px] overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">
                  Đang tìm kiếm...
                </div>
              ) : users.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  {searchTerm ? 'Không tìm thấy người dùng phù hợp' : 'Nhập từ khóa để tìm kiếm'}
                </div>
              ) : (
                <div className="divide-y">
                  {users.map(user => (
                    <div
                      key={user.id}
                      className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleUserToggle(user.id)}
                    >
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => handleUserToggle(user.id)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{user.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {user.role}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          {user.email} • @{user.username}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={selectedUsers.length === 0}>
            <UserPlus className="h-4 w-4 mr-2" />
            Thêm {selectedUsers.length > 0 && `(${selectedUsers.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}