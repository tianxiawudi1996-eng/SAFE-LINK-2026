'use client';

import React, { useRef, useState, useEffect } from 'react';

interface SignaturePadProps {
    onSave: (signatureData: string) => void;
    onCancel: () => void;
    workerName: string;
    instruction: string;
}

export default function SignaturePad({ onSave, onCancel, workerName, instruction }: SignaturePadProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawn, setHasDrawn] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * 2; // Retina support
        canvas.height = rect.height * 2;
        ctx.scale(2, 2);

        // Canvas 초기 스타일
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, rect.width, rect.height);

        // 선 스타일
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }, []);

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();

        if ('touches' in e) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top
            };
        } else {
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        }
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        const { x, y } = getCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
        setHasDrawn(true);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        const { x, y } = getCoordinates(e);
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;

        const rect = canvas.getBoundingClientRect();
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, rect.width, rect.height);
        setHasDrawn(false);
    };

    const handleSave = () => {
        const canvas = canvasRef.current;
        if (!canvas || !hasDrawn) return;

        // Canvas 데이터를 Base64로 변환
        const signatureImage = canvas.toDataURL('image/png');

        // 서명 메타데이터 생성
        const signatureData = JSON.stringify({
            type: 'canvas_signature',
            image: signatureImage,
            timestamp: new Date().toISOString(),
            workerName: workerName,
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
        });

        onSave(signatureData);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-md overflow-hidden shadow-2xl">
                {/* 헤더 */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        ✍️ 전자서명 / Electronic Signature
                    </h2>
                    <p className="text-orange-100 text-sm mt-1">
                        아래 영역에 서명해주세요 / Please sign below
                    </p>
                </div>

                {/* 지시사항 요약 */}
                <div className="p-4 bg-slate-900/50 border-b border-slate-700">
                    <p className="text-slate-400 text-xs mb-1">확인 내용 / Content to confirm:</p>
                    <p className="text-white text-sm line-clamp-2">{instruction}</p>
                    <p className="text-orange-400 text-xs mt-2">서명자 / Signer: <span className="font-bold">{workerName}</span></p>
                </div>

                {/* 서명 캔버스 */}
                <div className="p-4">
                    <div className="relative border-2 border-dashed border-slate-600 rounded-xl overflow-hidden">
                        <canvas
                            ref={canvasRef}
                            className="w-full h-48 touch-none cursor-crosshair"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                        />
                        {!hasDrawn && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <p className="text-slate-500 text-sm">
                                    여기에 서명하세요 / Sign here
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 법적 고지 */}
                <div className="px-4 pb-2">
                    <p className="text-xs text-slate-500 text-center">
                        🔒 본 전자서명은 법적 효력을 가지며, 암호화되어 안전하게 저장됩니다.
                    </p>
                </div>

                {/* 버튼 */}
                <div className="p-4 bg-slate-900/50 flex gap-3">
                    <button
                        onClick={clearCanvas}
                        className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-all"
                    >
                        🔄 다시 쓰기
                    </button>
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-all"
                    >
                        ❌ 취소
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!hasDrawn}
                        className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        ✅ 서명 완료
                    </button>
                </div>
            </div>
        </div>
    );
}
