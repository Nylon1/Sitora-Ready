import { NextResponse } from 'next/server';
import { getTreatment, publishTreatment, upsertTreatment } from '../../../../lib/treatment-store';
import type { TreatmentRegistryItem } from '../../../../lib/treatment-registry';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const treatment = await getTreatment(id);
    if (!treatment) return NextResponse.json({ error: 'Treatment not found.' }, { status: 404 });
    return NextResponse.json({ treatment });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to load treatment.' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = (await request.json()) as TreatmentRegistryItem;
    const saved = await upsertTreatment({ ...body, id });
    return NextResponse.json({ treatment: saved });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to save treatment.' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (body.action !== 'publish') return NextResponse.json({ error: 'Unsupported action.' }, { status: 400 });
    const saved = await publishTreatment(id);
    return NextResponse.json({ treatment: saved });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to publish treatment.' }, { status: 500 });
  }
}
