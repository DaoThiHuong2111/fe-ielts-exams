'use client'

import { RoomList } from '@/components/rooms/room-list'
import { SearchBar } from '@/components/rooms/search-bar'
import { useState } from 'react'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [area, setArea] = useState('')

  return (
    <div className="container min-h-screen bg-gray-50 p-6 my-6 rounded-2xl">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Danh sách phòng trọ tại Hà Nội</h1>

      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        area={area}
        setArea={setArea}
      />

      <RoomList
        searchQuery={searchQuery}
        priceRange={priceRange}
        area={area}
      />
    </div>
  )
}
