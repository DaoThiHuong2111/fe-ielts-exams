'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import imgIelts from '@public/images/home/z6763761206203_1bc4c1198ac463a8b68b4fa39e3b9dbb.jpg'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'
import { Button } from '../ui/button'

const rooms = [
  {
    id: 1,
    title: 'Listening vol 1-6',
    image: imgIelts,
  },
  {
    id: 2,
    title: 'Listening vol 1-12',
    image: imgIelts,
  },
  {
    id: 3,
    title: 'Listening vol 1-24',
    image: imgIelts,
  },
]

const tabs = [
  { label: "LISTENING", value: "listening" },
  { label: "RAT ( Recent Actual Test )", value: "rat" },
  { label: "Reading", value: "reading" },
  { label: "REAL TESTS", value: "real-tests" },
];

export default function FeaturedRooms() {
  const [activeTab, setActiveTab] = useState<string>("listening");
  return (
    <section className="bg-white py-16">
      <div className="container">
        <h2 className="text-4xl font-medium uppercase text-slate-900 text-center">
          Đề thi IELTS
        </h2>
        <div className="w-full overflow-x-auto my-10">
          <div className="flex justify-center items-center gap-4 w-max md:w-full px-2">
            {tabs.map((tab) => (
              <Button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`whitespace-nowrap rounded-full px-6 py-2 font-semibold transition-colors duration-200
              ${activeTab === tab.value
                    ? "bg-[#6A2E1A] text-white hover:bg-[#5a2413]"
                    : "border border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
                  }
            `}
                variant={activeTab === tab.value ? "default" : "outline"}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
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
              <Card className="shadow-none border-none !p-0 transition-shadow overflow-hidden gap-0">
                <CardHeader className="!p-0 relative w-full overflow-hidden">
                  <Image
                    src={room.image}
                    alt={room.title}
                    width={400}
                    height={250}
                    className="rounded-t-lg w-full object-cover hover:scale-110 transition-all duration-300 ease-in-out"
                  />
                </CardHeader>
                <CardContent className="flex justify-center items-center mt-1">
                  <CardTitle className="text-lg mb-2 hover:text-brand-secondary uppercase cursor-pointer">{room.title}</CardTitle>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}