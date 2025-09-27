
// app/api/iot-data/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyJwt } from '@/lib/auth';

const waterReadingSchema = z.object({
  deviceId: z.string(),
  ph: z.number(),
  tds: z.number(),
  turbidity: z.number(),
  temperature: z.number(),
  odour: z.number().optional(),
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
        const readings = await prisma.waterReading.findMany({
            orderBy: { timestamp: 'desc' },
            take: 100, // Limit to latest 100 readings for performance
        });
        return NextResponse.json(readings);
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    // This endpoint might use a different auth method like an API key in a real scenario
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
        const { deviceId, ...data } = waterReadingSchema.parse(body);

        const reading = await prisma.waterReading.create({
            data: {
                ...data,
                device: { connect: { id: deviceId } },
            },
        });

        return NextResponse.json(reading, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Invalid input', errors: error.errors }, { status: 400 });
        }
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
