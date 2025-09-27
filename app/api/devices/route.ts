
// // app/api/devices/route.ts
// import { NextResponse, NextRequest } from 'next/server';
// import { z } from 'zod';
// import { prisma } from '@/lib/prisma';
// import { getUserIdFromRequest, verifyJwt } from '@/lib/auth';
// import { DeviceStatus } from '@prisma/client';

// const deviceSchema = z.object({
//   name: z.string().min(1),
//   location: z.string().min(1),
//   status: z.nativeEnum(DeviceStatus).optional(),
// });

// export async function GET(req: NextRequest) {
//     // Protected route - check for valid token
//     const authHeader = req.headers.get('authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
//     }
//     const token = authHeader.split(' ')[1];
//     if (!verifyJwt(token)) {
//         return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
//     }

//     try {
//         const devices = await prisma.device.findMany();
//         return NextResponse.json(devices);
//     } catch (error) {
//         return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//     }
// }

// export async function POST(req: NextRequest) {
//     // Protected route
//     const authHeader = req.headers.get('authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
//     }
//     const token = authHeader.split(' ')[1];
//     if (!verifyJwt(token)) {
//         return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
//     }

//     try {
//         const body = await req.json();
//         const { name, location, status } = deviceSchema.parse(body);

//         const device = await prisma.device.create({
//             data: { name, location, status },
//         });

//         return NextResponse.json(device, { status: 201 });
//     } catch (error) {
//         if (error instanceof z.ZodError) {
//             return NextResponse.json({ message: 'Invalid input', errors: error.errors }, { status: 400 });
//         }
//         return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//     }
// }

// app/api/devices/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getUserIdFromRequest, verifyJwt } from '@/lib/auth';
import { DeviceStatus } from '@prisma/client';

const deviceSchema = z.object({
  name: z.string().min(1),
  location: z.string().min(1),
  status: z.nativeEnum(DeviceStatus).optional(),
});

export async function GET(req: NextRequest) {
    // Protected route - check for valid token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    if (!verifyJwt(token)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const devices = await prisma.device.findMany();
        return NextResponse.json(devices);
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    // Protected route
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
        const { name, location, status } = deviceSchema.parse(body);

        const device = await prisma.device.create({
            data: { name, location, status },
        });

        return NextResponse.json(device, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Invalid input', errors: error.errors }, { status: 400 });
        }
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
