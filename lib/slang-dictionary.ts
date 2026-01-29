import { Prisma } from '@prisma/client';
import { prisma } from './prisma';
import { NOGADA_SLANG } from './constants';

// --- Types for the Global SaaS Dictionary System ---

export interface LocalizedTerm {
    standard: string; // The standard term in the target language (e.g., "Concrete")
    slang?: string;   // The local site slang (e.g., "Mud", "Bê tông")
}

export interface DictionaryEntry {
    id: string;
    krSlang: string;      // Source: 공구리
    krStandard: string;   // Standard: 콘크리트
    translations: Prisma.JsonValue;
    category?: string;
    isActive?: boolean;
}

// Helper to seed initial data
export async function ensureDictionaryInitialized() {
    try {
        const count = await prisma.dictionaryEntry.count();
        if (count === 0) {
            console.log("[Quad-Mapping] Seeding initial data from NOGADA_SLANG to Database...");
            const langMap: { [key: string]: string } = {
                'vi': 'vi-VN', 'uz': 'uz-UZ', 'ph': 'ph-PH', 'id': 'id-ID',
                'en': 'en-US', 'km': 'km-KH', 'mn': 'mn-MN', 'zh': 'zh-CN',
                'th': 'th-TH', 'ru': 'ru-RU'
            };

            const entries = NOGADA_SLANG.map((item) => {
                const translations: Record<string, LocalizedTerm> = {};
                Object.keys(item).forEach(key => {
                    if (langMap[key]) {
                        const term = (item as any)[key];
                        translations[langMap[key]] = {
                            standard: term,
                            slang: term
                        };
                    }
                });

                return {
                    krSlang: item.slang,
                    krStandard: item.standard.split(' (')[0], // Remove parenthetical explanation from standard name
                    translations: translations as unknown as Prisma.InputJsonValue,
                    category: 'Construction',
                    isActive: true
                };
            });

            // Batch insert
            for (const entry of entries) {
                await prisma.dictionaryEntry.upsert({
                    where: { krSlang: entry.krSlang },
                    update: {},
                    create: entry
                });
            }
            console.log("[Quad-Mapping] Seeding Complete.");
        }
    } catch (e) {
        console.error("[Quad-Mapping] Seeding Error (DB probably not ready):", e);
    }
}

// --- Core Logic: The Quad-Mapping System ---

/**
 * Step 1: Normalize Korean Slang to Standard Korean
 * Input: "공구리 쳐라" -> Output: "콘크리트 쳐라"
 */
export async function standardizeKorean(text: string): Promise<string> {
    await ensureDictionaryInitialized();
    let standardized = text;

    try {
        const entries = await prisma.dictionaryEntry.findMany({ where: { isActive: true } });
        entries.forEach(entry => {
            if (standardized.includes(entry.krSlang)) {
                // Use regex for safer replacement if needed, but replaceAll is fine for simple terms
                standardized = standardized.replaceAll(entry.krSlang, entry.krStandard);
            }
        });
    } catch (e) {
        console.error("Standardize Error:", e);
    }
    return standardized;
}

/**
 * Step 4: Localize Target Standard to Target Slang (Context Generation)
 * Providing the Context to the LLM so it can do Step 2, 3, 4 in one shot.
 */
export async function getSlangContextString(targetLangCode: string): Promise<string> {
    await ensureDictionaryInitialized();
    try {
        const allTerms = await prisma.dictionaryEntry.findMany({ where: { isActive: true } });

        return allTerms.map(entry => {
            const trs = entry.translations as any;
            const target = trs[targetLangCode];
            if (!target) return null;

            const targetStr = target.slang && target.slang !== target.standard
                ? `${target.standard}(${target.slang})`
                : target.standard;

            return `${entry.krSlang}->${entry.krStandard}->${targetStr}`;
        }).filter(Boolean).join(", ");
    } catch (e) {
        return "";
    }
}

/**
 * Admin: Add or Update a term
 */
export async function upsertTerm(entry: Partial<DictionaryEntry>) {
    await ensureDictionaryInitialized();
    try {
        if (entry.id && !entry.id.startsWith('sys-') && !entry.id.startsWith('custom-')) {
            await prisma.dictionaryEntry.update({
                where: { id: entry.id },
                data: {
                    krSlang: entry.krSlang,
                    krStandard: entry.krStandard,
                    translations: entry.translations as unknown as Prisma.InputJsonValue,
                    category: entry.category,
                    isActive: entry.isActive
                }
            });
        } else {
            await prisma.dictionaryEntry.upsert({
                where: { krSlang: entry.krSlang! },
                update: {
                    krStandard: entry.krStandard,
                    translations: entry.translations as unknown as Prisma.InputJsonValue,
                    category: entry.category,
                    isActive: entry.isActive
                },
                create: {
                    krSlang: entry.krSlang!,
                    krStandard: entry.krStandard!,
                    translations: (entry.translations || {}) as unknown as Prisma.InputJsonValue,
                    category: entry.category || 'General',
                    isActive: true
                }
            });
        }
        return true;
    } catch (e) {
        console.error("Upsert Term Error:", e);
        return false;
    }
}

export async function getAllTerms(): Promise<DictionaryEntry[]> {
    await ensureDictionaryInitialized();
    try {
        const entries = await prisma.dictionaryEntry.findMany({
            orderBy: { krSlang: 'asc' }
        });
        return entries as any[];
    } catch (e) {
        return [];
    }
}
export async function deleteTerm(id: string) {
    await ensureDictionaryInitialized();
    try {
        await prisma.dictionaryEntry.delete({
            where: { id }
        });
        return true;
    } catch (e) {
        console.error("Delete Term Error:", e);
        return false;
    }
}
