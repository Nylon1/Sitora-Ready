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

  const statusFilter = options?.publishedOnly ? '&status=eq.Approved' : '';
  const response = await fetch(`${url}/rest/v1/treatment_registry?select=*&order=label.asc${statusFilter}`, {
    headers: headers(),
    cache: 'no-store',
  });

  if (!response.ok) throw new Error(`Treatment registry read failed: ${response.status}`);
  return ((await response.json()) as any[]).map(normalise);
}

export async function getTreatment(id: string) {
  if (!isTreatmentStoreConfigured) return treatmentRegistry.find((item) => item.id === id) ?? null;

  const response = await fetch(`${url}/rest/v1/treatment_registry?id=eq.${encodeURIComponent(id)}&select=*`, {
    headers: headers(),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Treatment registry read failed: ${response.status}`);
  const rows = (await response.json()) as any[];
  return rows[0] ? normalise(rows[0]) : null;
}

export async function upsertTreatment(item: TreatmentRegistryItem, actor = 'prototype-admin') {
  if (!isTreatmentStoreConfigured) throw new Error('Supabase treatment persistence is not configured.');

  const existing = await getTreatment(item.id);
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
  const hasDraftContent = treatment.content.some((item) => item.status !== 'Approved');
  if (hasDraftContent) throw new Error('All required treatment content must be approved before publishing.');

  const next = { ...treatment, status: 'Approved' as const };
  return upsertTreatment(next, actor);
}
