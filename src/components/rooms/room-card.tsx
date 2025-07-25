import Image from 'next/image'
import { motion } from 'framer-motion'

export const RoomCard = ({ room }: any) => {
  return (
    <motion.div
      className="bg-white shadow-lg rounded-lg overflow-hidden"
      whileHover={{
        scale: 1.02,
        rotate: 2,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.2 }
      }}
    >
      <div className="relative w-full aspect-video">
        <Image
          src={room.image}
          alt={room.name}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300"
        />
      </div>

      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{room.name}</h3>
        <p className="text-gray-600 text-sm">{room.area}</p>
        <p className="text-gray-500 text-sm mb-4">{room.description}</p>
        <p className="text-lg font-bold text-gray-800">{room.price}₫/tháng</p>
        <motion.button
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
          whileHover={{ scale: 1.1 }}
        >
          Xem chi tiết
        </motion.button>
      </div>
    </motion.div>
  )
}
