'use client';

import React, { useState, useRef } from 'react';
import styles from './labor.module.css';
import { GoogleGenerativeAI } from '@google/generative-ai';

const LANGUAGES = [
    { code: 'CN', flag: '🇨🇳', name: '한국계중국인', workers: '341,000명' },
    { code: 'VN', flag: '🇻🇳', name: '베트남', workers: '149,000명' },
    { code: 'TH', flag: '🇹🇭', name: '태국', workers: '48,000명' },
    { code: 'NP', flag: '🇳🇵', name: '네팔', workers: '47,000명' },
    { code: 'KH', flag: '🇰🇭', name: '캄보디아', workers: '47,000명' },
    { code: 'UZ', flag: '🇺🇿', name: '우즈베키스탄', workers: '43,000명' },
    { code: 'PH', flag: '🇵🇭', name: '필리핀', workers: '35,000명' },
    { code: 'ID', flag: '🇮🇩', name: '인도네시아', workers: '32,000명' },
    { code: 'MM', flag: '🇲🇲', name: '미얀마', workers: '28,000명' },
    { code: 'MN', flag: '🇲🇳', name: '몽골', workers: '22,000명' },
    { code: 'LK', flag: '🇱🇰', name: '스리랑카', workers: '18,000명' },
    { code: 'BD', flag: '🇧🇩', name: '방글라데시', workers: '15,000명' },
    { code: 'EN', flag: '🇺🇸', name: '영어', workers: '12,000명' },
    { code: 'RU', flag: '🇷🇺', name: '러시아', workers: '11,000명' },
];

export default function LaborAiPage() {
    const [selectedLang, setSelectedLang] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [resultReady, setResultReady] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResultReady(false);
        }
    };

    const handleZoneClick = () => {
        fileInputRef.current?.click();
    };

    const handleTranslate = async () => {
        if (!file || !selectedLang) return;

        setIsProcessing(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('targetLang', selectedLang); // Code like 'VN', 'CN'. The API might need full name mapping or handle codes.

            const response = await fetch('/api/labor/translate', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Translation failed');
            }

            // Handle file download response
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;

            // Map code to name for filename if needed, or rely on API header
            const langName = LANGUAGES.find(l => l.code === selectedLang)?.name || selectedLang;
            link.download = `${file.name.replace(/\.xlsx?$/, '')}_${langName}_Translated.xlsx`;
            document.body.appendChild(link);
            link.click();
            link.remove();

            setResultReady(true);

            // Scroll to result
            setTimeout(() => {
                const resultEl = document.getElementById('resultSection');
                resultEl?.scrollIntoView({ behavior: 'smooth' });
            }, 100);

        } catch (error) {
            console.error('Translation error:', error);
            alert('번역 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (!file || !selectedLang) return;
        const name = file.name.replace(/\.xlsx?$/, '');
        alert(`다운로드 시뮬레이션: ${name}_${selectedLang}.xlsx`);
    };

    return (
        <div className={styles.bgPattern}>
            <div className={styles.bgAnimation}></div>

            <div className={styles.container}>
                <header className={styles.header}>
                    {/* Logo omitted or verify path */}
                    <div className={styles.titleContainer}>
                        <h1 className={styles.mainTitle}>노무AI 시스템</h1>
                        <p className={styles.subtitle}>15개국 언어 자동 번역 플랫폼</p>
                        <div className={styles.badge}>⚡ AI POWERED TRANSLATION</div>
                    </div>
                </header>

                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statNumber}>15</div>
                        <div className={styles.statLabel}>지원 언어</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statNumber}>1M+</div>
                        <div className={styles.statLabel}>외국인 취업자</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statNumber}>100%</div>
                        <div className={styles.statLabel}>번역 정확도</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statNumber}>34년</div>
                        <div className={styles.statLabel}>Since 1991</div>
                    </div>
                </div>

                <div className={styles.uploadZone} onClick={handleZoneClick}>
                    <div className={styles.uploadIcon}>{file ? '✅' : '📄'}</div>
                    <div className={styles.uploadText}>
                        {file ? file.name : '노무 서류 업로드'}
                    </div>
                    <div className={styles.uploadSubtext}>
                        {file ? '파일 준비 완료 • 언어를 선택하세요' : '근로계약서, 취업규칙, 안전교육자료 등 모든 노무 서류'}
                    </div>
                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                </div>

                <h2 className={styles.sectionTitle}>🌏 번역 언어 선택</h2>

                <div className={styles.languageGrid}>
                    {LANGUAGES.map((lang) => (
                        <div
                            key={lang.code}
                            className={`${styles.languageCard} ${selectedLang === lang.code ? styles.selected : ''}`}
                            onClick={() => setSelectedLang(lang.code)}
                        >
                            <span className={styles.languageFlag}>{lang.flag}</span>
                            <div className={styles.languageName}>{lang.name}</div>
                            <div className={styles.languageWorkers}>{lang.workers}</div>
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: 'center' }}>
                    <button
                        className={styles.actionBtn}
                        disabled={!file || !selectedLang || isProcessing}
                        onClick={handleTranslate}
                    >
                        {isProcessing ? '번역 중...' : '🚀 완벽 번역 시작'}
                    </button>
                </div>

                {resultReady && (
                    <div id="resultSection" className={styles.resultSection}>
                        <div className={styles.resultIcon}>✨</div>
                        <div className={styles.resultTitle}>번역 완료!</div>
                        <div className={styles.resultDesc}>수식, 병합, 서식이 모두 완벽하게 보존되었습니다</div>
                        <button className={styles.actionBtn} onClick={handleDownload} style={{ margin: 0 }}>
                            💾 번역 파일 다운로드
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
