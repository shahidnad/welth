"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-center px-4 overflow-hidden">
      {/* Animated Gradient 404 */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-[7rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 drop-shadow-lg select-none"
      >
        404
      </motion.h1>

      {/* Subtitle */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-2xl font-semibold mb-3 text-gray-800"
      >
        Oops! Page Not Found
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-gray-600 max-w-md mb-8"
      >
        The page you&apos;re looking for doesn&apos;t exist or might have been
        moved. Let’s get you back home safely.
      </motion.p>

      {/* Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <Link href="/" passHref>
          <Button className="flex items-center gap-2 px-6 py-2 text-base font-medium shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300">
            <ArrowLeft size={18} />
            Return Home
          </Button>
        </Link>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 text-gray-400 text-sm"
      >
        © {new Date().getFullYear()}{" "}
        <span className="font-medium text-gray-500">Welth</span>. All rights
        reserved.
      </motion.div>
    </div>
  );
}
