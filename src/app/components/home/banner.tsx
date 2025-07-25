'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '../ui/button'

export default function Hero() {
  return (
    <section className="relative bg-slate-100 overflow-hidden">
      <div className="container py-24 text-center">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-slate-900 mb-4"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Tìm Phòng Trọ Xịn Sò, Nhanh Chóng & Uy Tín
        </motion.h1>

        <motion.p
          className="text-lg text-muted-foreground max-w-xl mx-auto mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Hơn 1000+ phòng trọ được kiểm duyệt kỹ càng, đầy đủ tiện nghi, hỗ trợ đặt phòng nhanh gọn!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Button asChild size="lg">
            <Link href="/rooms">Khám phá ngay</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}