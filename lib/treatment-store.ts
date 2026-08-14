import 'server-only';

import { treatmentRegistry, type TreatmentRegistryItem } from './treatment-registry';

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isTreatmentStoreConfigured = Boolean(url && serviceKey);

const headers = () => ({
  apikey: serviceKey as string,
  Authorization: `Bearer ${serviceKey}`,
  'Content-Type': 'application/json',
});

const normalise = (row: any): TreatmentRegistryItem => ({
  id: row.id,
  label: row.label,
  aliases: row.aliases ?? [],
  category: row.category,
  estimatedMinutes: row.estimated_minutes ?? 5,
  status: row.status,
  version: row.version,
  modules: row.modules ?? [],
  content: row.content ?? [],
  consentPoints: row.consent_points ?? [],
});

const toRow = (item: TreatmentRegistryItem) => ({
  id: item.id,
  label: item.label,
  aliases: item.aliases,
  category: item.category,
  estimated_minutes: item.estimatedMinutes,
  status: item.status,
  version: item.version,
  modules: item.modules,
  content: item.content,
  consent_points: item.consentPoints,
  updated_at: new Date().toISOString(),
});

export async function listTreatments(options?: { publishedOnly?: boolean }) {
  if (!isTreatmentStoreConfigured) {
    return options?.publishedOnly ? treatmentRegistry.filter((item) => item.status === 'Approved') : treatmentRegistry;
  }

  const response = await fetch(`${url}/rest/v1/treatment_registry?select=*&order=label.asc`, {
    headers: headers(),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Treatment registry read failed: ${response.status}`);

  const persisted = ((await response.json()) as any[]).map(normalise);
  const merged = new Map(treatmentRegistry.map((item) => [item.id, item]));
  persisted.forEach((item) => merged.set(item.id, item));
  const items = Array.from(merged.values()).sort((a, b) => a.label.localeCompare(b.label));
  return options?.publishedOnly ? items.filter((item) => item.status === 'Approved') : items;
}

export async function getTreatment(id: string) {
  if (!isTreatmentStoreConfigured) return treatmentRegistry.find((item) => item.id === id) ?? null;

  const response = await fetch(`${url}/rest/v1/treatment_registry?id=eq.${encodeURIComponent(id)}&select=*`, {
    headers: headers(),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Treatment registry read failed: ${response.status}`);
  const rows = (await response.json()) as any[];
  return rows[0] ? normalise(rows[0]) : treatmentRegistry.find((item) => item.id === id) ?? null;
}

export async function upsertTreatment(item: TreatmentRegistryItem, actor = 'prototype-admin') {
  if (!isTreatmentStoreConfigured) throw new Error('Supabase treatment persistence is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');

  const persistedResponse = await fetch(`${url}/rest/v1/treatment_registry?id=eq.${encodeURIComponent(item.id)}&select=*`, { headers: headers(), cache: 'no-store' });
  const persistedRows = persistedResponse.ok ? ((await persistedResponse.json()) as any[]) : [];
  const existing = persistedRows[0] ? normalise(persistedRows[0]) : null;

  if (existing) {
    await fetch(`${url}/rest/v1/treatment_registry_history`, {
      method: 'POST',
      headers: { ...headers(), Prefer: 'return=minimal' },
      body: JSON.stringify({ treatment_id: existing.id, version: existing.version, snapshot: existing, changed_by: actor }),
    });
  }

  const response = await fetch(`${url}/rest/v1/treatment_registry?on_conflict=id`, {
    method: 'POST',
    headers: { ...headers(), Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify(toRow(item)),
  });

  if (!response.ok) throw new Error(`Treatment registry save failed: ${response.status} ${await response.text()}`);
  const rows = (await response.json()) as any[];
  return normalise(rows[0]);
}

export async function publishTreatment(id: string, actor = 'prototype-admin') {
  const treatment = await getTreatment(id);
  if (!treatment) throw new Error('Treatment not found.');
  if (treatment.status !== 'In review') throw new Error('Treatment must be submitted for clinical review before publishing.');
  const incompleteRequiredContent = treatment.content.some((item) => item.required && item.status !== 'Approved');
  if (incompleteRequiredContent) throw new Error('All required treatment content must be approved before publishing.');
  if (!treatment.consentPoints.length) throw new Error('At least one governed consent point is required before publishing.');

  return upsertTreatment({ ...treatment, status: 'Approved' }, actor);
}
