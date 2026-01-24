"use client";

import { motion } from "framer-motion";

interface InitScreenProps {
    onActivate: () => void;
}

export default function InitScreen({ onActivate }: InitScreenProps) {
    return (
        <div className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center p-10 text-center">
            <div className="mb-20 relative">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-96 h-auto flex items-center justify-center mx-auto mb-12 relative z-10"
                >
                    {/* Official Seowon Logo */}
                    <img
                        src="/seowon-logo.png"
                        alt="Seowon Construction Logo"
                        className="w-full h-auto object-contain drop-shadow-2xl"
                    />
                </motion.div>

                {/* Ping Effect - Adjusted for rectangular logo */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-48 rounded-full border-2 border-sw-orange/30 animate-[ping_2.5s_ease-in-out_infinite] opacity-20 blur-md"></div>
            </div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <h1 className="text-7xl font-black text-white tracking-tighter uppercase mb-4">
                    <span className="text-sw-orange">SAFE</span>-LINK
                </h1>
                <p className="text-zinc-500 text-base leading-relaxed font-medium italic">
                    "서원토건의 안전을 위한 무중력 소통 엔진 가동"
                </p>
            </motion.div>

            <motion.button
                onClick={onActivate}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="w-full max-w-xs py-5 bg-sw-orange rounded-3xl font-black text-white text-xl shadow-2xl mt-14 hover:shadow-orange-500/30 transition-shadow"
            >
                통합 시스템 활성화
            </motion.button>
        </div>
    );
}
