
// app/api/users/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getUserIdFromRequest, verifyJwt } from '@/lib/auth';

const updateUserSchema = z.object({
  name: z.string().min(1),
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    if (!verifyJwt(token)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = getUserIdFromRequest(req);
    if (!userId || userId !== params.id) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    try {
        const body = await req.json();
        const { name } = updateUserSchema.parse(body);

        await prisma.user.update({
            where: { id: userId },
            data: { name },
        });

        return NextResponse.json({ message: 'Profile updated successfully' });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Invalid input', errors: error.errors }, { status: 400 });
        }
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
