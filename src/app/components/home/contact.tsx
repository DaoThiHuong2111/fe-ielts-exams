'use client'

import { motion } from 'framer-motion'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'

export default function Contact() {
  return (
    <section id='contact-us' className="bg-white py-16">
      <motion.div
        className="container max-w-2xl mx-auto text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Liên Hệ</h2>
        <p className="text-muted-foreground mb-8">Chúng tôi luôn sẵn sàng hỗ trợ bạn.</p>
        <form className="space-y-4 text-left">
          <Input placeholder="Họ và tên" />
          <Input type="email" placeholder="Email" />
          <Textarea placeholder="Nội dung tin nhắn..." rows={5} />
          <Button type="submit" className="w-full">Gửi liên hệ</Button>
        </form>
      </motion.div>
    </section>
  )
}