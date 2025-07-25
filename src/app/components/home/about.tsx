'use client'

import { motion } from 'framer-motion'

export default function About() {
  return (
    <section id='about-us' className="bg-slate-50 py-16">
      <motion.div
        className="container text-center max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Về Chúng Tôi</h2>
        <p className="text-muted-foreground text-lg">
          Nền tảng kết nối người thuê với các chủ nhà trọ uy tín. Mỗi phòng được kiểm duyệt để đảm bảo
          đúng như mô tả. Hỗ trợ 24/7 – Đặt phòng nhanh – Không lo bị lừa.
        </p>
      </motion.div>
    </section>
  )
}