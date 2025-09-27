
// prisma/seed.ts
import { PrismaClient, Role, DeviceStatus, AlertSeverity, AlertType, AlertStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Clear existing data
  await prisma.healthReport.deleteMany({});
  await prisma.alert.deleteMany({});
  await prisma.aIPrediction.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.device.deleteMany({});

  // Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);
  const ashaWorker = await prisma.user.create({
    data: {
      id: "clm1v2y2q0000u4p4h1q2w8c8", // Hardcoded ID for testing
      email: 'asha.worker@example.com',
      name: 'ASHA Worker Ravi Kumar',
      password: hashedPassword,
      role: Role.ASHA_WORKER,
    },
  });

  const doctor = await prisma.user.create({
    data: {
      email: 'dr.priya.sharma@example.com',
      name: 'Dr. Priya Sharma',
      password: hashedPassword,
      role: Role.DOCTOR,
    },
  });

  const doctor2 = await prisma.user.create({
    data: {
      email: 'dr.anjali.gupta@example.com',
      name: 'Dr. Anjali Gupta',
      password: hashedPassword,
      role: Role.DOCTOR,
    },
  });

  console.log('Created users:', { ashaWorker, doctor, doctor2 });

  // Create Devices
  const device1 = await prisma.device.create({ data: { name: 'WQ-001', location: 'Aizawl, Mizoram', status: DeviceStatus.ONLINE } });
  const device2 = await prisma.device.create({ data: { name: 'WQ-002', location: 'Majuli, Assam', status: DeviceStatus.ONLINE } });
  const device3 = await prisma.device.create({ data: { name: 'WQ-003', location: 'Churachandpur, Manipur', status: DeviceStatus.OFFLINE } });

  console.log('Created devices:', { device1, device2, device3 });

  // Create Health Reports
  await prisma.healthReport.createMany({
    data: [
      {
        reporterId: doctor.id,
        location: 'Aizawl, Mizoram',
        disease: 'Diarrhea',
        cases: 12,
        severity: AlertSeverity.MEDIUM,
        reportDate: new Date('2024-01-14T00:00:00Z'),
        createdAt: new Date('2024-01-14T00:00:00Z'),
      },
      {
        reporterId: ashaWorker.id,
        location: 'Majuli, Assam',
        disease: 'Typhoid',
        cases: 3,
        severity: AlertSeverity.HIGH,
        reportDate: new Date('2024-01-13T00:00:00Z'),
        createdAt: new Date('2024-01-13T00:00:00Z'),
      },
      {
        reporterId: doctor2.id,
        location: 'Churachandpur, Manipur',
        disease: 'Cholera',
        cases: 2,
        severity: AlertSeverity.CRITICAL,
        reportDate: new Date('2024-01-12T00:00:00Z'),
        createdAt: new Date('2024-01-12T00:00:00Z'),
      },
      {
        reporterId: ashaWorker.id,
        location: 'Tura, Meghalaya',
        disease: 'Hepatitis A',
        cases: 5,
        severity: AlertSeverity.MEDIUM,
        reportDate: new Date('2024-01-11T00:00:00Z'),
        createdAt: new Date('2024-01-11T00:00:00Z'),
      },
      {
        reporterId: doctor.id, // Dr. Priya Sharma
        location: 'Aizawl, Mizoram',
        disease: 'Typhoid',
        cases: 4,
        severity: AlertSeverity.HIGH,
        reportDate: new Date('2024-01-10T00:00:00Z'),
        createdAt: new Date('2024-01-10T00:00:00Z'),
      },
      {
        reporterId: ashaWorker.id,
        location: 'Majuli, Assam',
        disease: 'Diarrhea',
        cases: 8,
        severity: AlertSeverity.MEDIUM,
        reportDate: new Date('2024-01-09T00:00:00Z'),
        createdAt: new Date('2024-01-09T00:00:00Z'),
      },
      {
        reporterId: ashaWorker.id,
        location: 'Churachandpur, Manipur',
        disease: 'Dysentery',
        cases: 7,
        severity: AlertSeverity.LOW,
        reportDate: new Date('2024-01-08T00:00:00Z'),
        createdAt: new Date('2024-01-08T00:00:00Z'),
      },
      {
        reporterId: ashaWorker.id,
        location: 'Tura, Meghalaya',
        disease: 'Cholera',
        cases: 1,
        severity: AlertSeverity.HIGH,
        reportDate: new Date('2024-01-07T00:00:00Z'),
        createdAt: new Date('2024-01-07T00:00:00Z'),
      },
       {
        reporterId: ashaWorker.id,
        location: 'Aizawl, Mizoram',
        disease: 'Hepatitis A',
        cases: 3,
        severity: AlertSeverity.MEDIUM,
        reportDate: new Date('2024-01-06T00:00:00Z'),
        createdAt: new Date('2024-01-06T00:00:00Z'),
      },
       {
        reporterId: ashaWorker.id,
        location: 'Majuli, Assam',
        disease: 'Dysentery',
        cases: 10,
        severity: AlertSeverity.LOW,
        reportDate: new Date('2024-01-05T00:00:00Z'),
        createdAt: new Date('2024-01-05T00:00:00Z'),
      },
    ],
  });

  console.log('Created health reports.');

  // Create Alerts
  await prisma.alert.createMany({
    data: [
      {
        title: 'High Turbidity Detected',
        location: 'Churachandpur, Manipur',
        severity: AlertSeverity.HIGH,
        type: AlertType.WATER_QUALITY,
        status: AlertStatus.UNDER_PROCESS,
        deviceId: device3.id,
      },
      {
        title: 'Cholera Cases Reported',
        location: 'Aizawl, Mizoram',
        severity: AlertSeverity.CRITICAL,
        type: AlertType.DISEASE_OUTBREAK,
        status: AlertStatus.PENDING,
      },
      {
        title: 'Device Offline - WQ-003',
        location: 'Majuli, Assam',
        severity: AlertSeverity.MEDIUM,
        type: AlertType.DEVICE_MALFUNCTION,
        status: AlertStatus.PENDING,
        deviceId: device2.id,
      },
    ],
  });

  console.log('Created alerts.');

  // Create AI Predictions
  await prisma.aIPrediction.createMany({
      data: [
          { disease: "Cholera", riskLevel: AlertSeverity.HIGH, confidence: 0.82, area: "Majuli, Assam" },
          { disease: "Diarrhea", riskLevel: AlertSeverity.MEDIUM, confidence: 0.74, area: "Churachandpur, Manipur" },
          { disease: "Typhoid", riskLevel: AlertSeverity.LOW, confidence: 0.65, area: "Aizawl, Mizoram" },
      ]
  });

  console.log('Created AI predictions.');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
