'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const MainPage = () => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded overflow-hidden shadow-md relative"
      >
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
          alt="Admin banner"
          width={1200}
          height={300}
          className="w-full aspect-video object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h2 className="text-white text-3xl font-bold">IELTS Exam Management System</h2>
        </div>
      </motion.div>
    </div>
  )
}
export default MainPage