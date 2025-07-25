'use client'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { motion, AnimatePresence } from 'framer-motion'

// Define types for Room and RelatedRoom
interface RelatedRoom {
  id: number
  name: string
  price: number
  image: string
}

interface Room {
  id: number
  name: string
  area: string
  price: number
  description: string
  images: string[]
  relatedRooms: RelatedRoom[]
}

const mockRoom: Room = {
  id: 1,
  name: 'Phòng đẹp gần đại học Ngoại Thương',
  area: 'Đống Đa, Hà Nội',
  price: 3500000,
  description: 'Phòng rộng 25m², đầy đủ nội thất, gần trường học và bến xe.',
  images: [
    'https://cdn.chotot.com/iZuyCnfXRji-adKHkRBU9aOY8LEiP1ELoZUjN6ctPxw/preset:view/plain/10e3b5968c4ad1de24dfbb3f860b1b4d-2930499143535519925.jpg',
    'https://cdn.chotot.com/W3h0hZUfJWcNQnGFQqXWaPP-UI5vtnqw54-Plfeg0Sg/preset:view/plain/2d464e85b1c8c75d5247109057974f5e-2930499087713562304.jpg',
    'https://cdn.chotot.com/FuRO1CCGyljDbvIxg6PQQ4_8eY2XluanJKp2xzkmUyc/preset:listing/plain/cee14d8fc8afe9241cda22241c764251-2924772497063472735.jpg',
    'https://cdn.chotot.com/cTAeIsLQqraYFndHj0zFlMP6nw7HvejUUh8Zr840cYM/preset:view/plain/83ace57e8e148bf1e109de2413739331-2930499143418295026.jpg',
  ],
  relatedRooms: [
    {
      id: 2,
      name: 'Phòng có gác xép, giá rẻ',
      price: 2500000,
      image: 'https://cdn.chotot.com/cTAeIsLQqraYFndHj0zFlMP6nw7HvejUUh8Zr840cYM/preset:view/plain/83ace57e8e148bf1e109de2413739331-2930499143418295026.jpg',
    },
    {
      id: 3,
      name: 'Phòng ở trung tâm, tiện nghi',
      price: 4000000,
      image: 'https://cdn.chotot.com/W3h0hZUfJWcNQnGFQqXWaPP-UI5vtnqw54-Plfeg0Sg/preset:view/plain/2d464e85b1c8c75d5247109057974f5e-2930499087713562304.jpg',
    },
  ],
}

export default function RoomDetailPage() {
  // State hooks for carousel, modal, and selected image
  const [emblaRef] = useEmblaCarousel({ loop: true })
  const [open, setOpen] = useState<boolean>(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const room = mockRoom

  const handleImageClick = (src: string) => {
    setSelectedImage(src)
    setOpen(true)
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-10 my-6">
      {/* Image carousel */}
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex">
          {room.images.map((src, idx) => (
            <div
              key={idx}
              className="min-w-full relative aspect-video cursor-pointer"
              onClick={() => handleImageClick(src)}
            >
              <Image
                src={src}
                alt={`Ảnh ${idx + 1}`}
                fill
                className="object-cover transition-transform hover:scale-105 duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Modal preview ảnh */}
      <Dialog open={open} onOpenChange={setOpen}>
        <AnimatePresence>
          {open && selectedImage && (
            <DialogContent className="w-full max-w-4xl p-0 bg-transparent border-none shadow-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                className="relative w-full h-[80vh]"
              >
                <Image
                  src={selectedImage}
                  alt="Preview ảnh"
                  fill
                  className="object-contain rounded-lg"
                />
              </motion.div>
            </DialogContent>
          )}
        </AnimatePresence>
      </Dialog>

      {/* Room Info */}
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">{room.name}</h1>
        <p className="text-gray-600">{room.area}</p>
        <p className="text-xl text-blue-600 font-semibold">
          {room.price.toLocaleString()}₫ / tháng
        </p>
        <p className="text-gray-700">{room.description}</p>
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
          Liên hệ ngay
        </button>
      </div>

      {/* Related Rooms */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Phòng liên quan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {room.relatedRooms.map((rel) => (
            <div
              key={rel.id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <div className="relative w-full aspect-video">
                <Image src={rel.image} alt={rel.name} fill className="object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{rel.name}</h3>
                <p className="text-blue-500 font-bold">
                  {rel.price.toLocaleString()}₫ / tháng
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
