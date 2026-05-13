'use client'

import { motion } from 'framer-motion'

export default function FotoSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 shadow-lg"
        >
          <div className="text-6xl mb-6">📸</div>
          <h2 className="text-3xl md:text-4xl font-pacifico text-white mb-6 drop-shadow-lg">
            Fotos kommen bald!
          </h2>
          <p className="text-lg font-nunito text-white leading-relaxed">
            Nach der Party laden wir hier die schönsten Fotos hoch — schau bald nochmal vorbei! 🌈
          </p>
        </motion.div>
      </div>
    </section>
  )
}