'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

const rooms = [
  {
    id: 1,
    title: 'Phòng trọ cao cấp - Quận 1',
    image: 'https://cdn.chotot.com/iZuyCnfXRji-adKHkRBU9aOY8LEiP1ELoZUjN6ctPxw/preset:view/plain/10e3b5968c4ad1de24dfbb3f860b1b4d-2930499143535519925.jpg',
    price: '4.500.000đ/tháng',
  },
  {
    id: 2,
    title: 'Phòng đầy đủ nội thất - Bình Thạnh',
    image: 'https://cdn.chotot.com/cTAeIsLQqraYFndHj0zFlMP6nw7HvejUUh8Zr840cYM/preset:view/plain/83ace57e8e148bf1e109de2413739331-2930499143418295026.jpg',
    price: '2.200.000đ/tháng',
  },
  {
    id: 3,
    title: 'Gần trường ĐH - Gò Vấp',
    image: 'https://cdn.chotot.com/FuRO1CCGyljDbvIxg6PQQ4_8eY2XluanJKp2xzkmUyc/preset:listing/plain/cee14d8fc8afe9241cda22241c764251-2924772497063472735.jpg',
    price: '3.200.000đ/tháng',
  },
]

export default function FeaturedRooms() {
  return (
    <section className="bg-white py-16">
      <div className="container">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">
          Phòng Trọ Nổi Bật
        </h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.15 }}
        >
          {rooms.map((room) => (
            <motion.div
              key={room.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <Image
                    src={room.image}
                    alt={room.title}
                    width={400}
                    height={250}
                    className="rounded-t-lg w-full aspect-video object-cover"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2">{room.title}</CardTitle>
                  <p className="text-primary font-semibold">{room.price}</p>
                  <Link
                    href={`/rooms/${room.id}`}
                    className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                  >
                    Xem chi tiết →
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}