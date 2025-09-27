
// app/api/reports/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getUserIdFromRequest, verifyJwt } from '@/lib/auth';
import { AlertSeverity } from '@prisma/client';

const reportSchema = z.object({
  location: z.string().min(1, "Location is required"),
  disease: z.string().min(1, "Disease is required"),
  cases: z.number().int().min(1, "Cases must be a positive integer"),
  severity: z.nativeEnum(AlertSeverity),
  reportDate: z.date(),
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

    const userId = getUserIdFromRequest(req);
    if (!userId) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const whereClause = user.role === 'ADMIN' ? {} : { reporterId: userId };

        const reports = await prisma.healthReport.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            include: { reporter: { select: { name: true, role: true } } },
        });
        return NextResponse.json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error); // Log error for debugging
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

    const userId = getUserIdFromRequest(req);
    if (!userId) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    try {
        const body = await req.json();
        
        // Handle both single and array of reports
        if (Array.isArray(body)) {
            const data = z.array(reportSchema).parse(body.map(b => ({...b, reportDate: new Date(b.reportDate)})));
            const reports = await prisma.healthReport.createMany({
                data: data.map(report => ({ ...report, reporterId: userId })),
            });
            return NextResponse.json(reports, { status: 201 });
        } else {
            const data = reportSchema.parse({...body, reportDate: new Date(body.reportDate)});
            const report = await prisma.healthReport.create({
                data: { ...data, reporterId: userId },
            });
            return NextResponse.json(report, { status: 201 });
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Invalid input', errors: error.errors }, { status: 400 });
        }
        console.error(error); // Log error for debugging
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}


