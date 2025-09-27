
// app/api/alerts/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyJwt } from '@/lib/auth';
import { AlertSeverity, AlertType, AlertStatus } from '@prisma/client';

const alertSchema = z.object({
  title: z.string().min(1),
  location: z.string().min(1),
  severity: z.nativeEnum(AlertSeverity),
  type: z.nativeEnum(AlertType),
  status: z.nativeEnum(AlertStatus).optional(),
  deviceId: z.string().optional(),
  disease: z.string().optional(),
  area: z.string().optional(),
});

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    if (!verifyJwt(token)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const alerts = await prisma.alert.findMany({ orderBy: { createdAt: 'desc' } });
        return NextResponse.json(alerts);
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    if (!verifyJwt(token)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const data = alertSchema.parse(body);

        const alert = await prisma.alert.create({ data });

        return NextResponse.json(alert, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Invalid input', errors: error.errors }, { status: 400 });
        }
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
