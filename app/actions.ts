'use server';

import { getAllTerms, upsertTerm, DictionaryEntry } from "@/lib/slang-dictionary";

export async function getTermsAction() {
    return getAllTerms();
}

export async function saveTermAction(entry: Partial<DictionaryEntry>) {
    await upsertTerm(entry);
    return getAllTerms();
}
