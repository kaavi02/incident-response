const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database...');
  await prisma.escalation.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding Users...');
  const admin = await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@aegis.com',
      password: 'admin', // matching our hardcoded check
      role: 'ADMIN',
    },
  });

  const l1Responder = await prisma.user.create({
    data: {
      name: 'John L1',
      email: 'john.l1@aegis.com',
      password: 'password',
      role: 'RESPONDER',
    },
  });

  const l2Responder = await prisma.user.create({
    data: {
      name: 'Jane L2',
      email: 'jane.l2@aegis.com',
      password: 'password',
      role: 'RESPONDER',
    },
  });

  const l3Responder = await prisma.user.create({
    data: {
      name: 'Mike L3',
      email: 'mike.l3@aegis.com',
      password: 'password',
      role: 'RESPONDER',
    },
  });

  console.log('Seeding Incidents...');
  const incident1 = await prisma.incident.create({
    data: {
      title: 'Suspicious Login Activity from Unknown IP',
      description: 'Multiple failed login attempts detected on the production VPN from an unknown IP in Russia. Account locking policy triggered.',
      priority: 'HIGH',
      status: 'INVESTIGATING',
      reporterId: l1Responder.id,
      assigneeId: l1Responder.id,
      tier: 'L1',
    },
  });

  const incident2 = await prisma.incident.create({
    data: {
      title: 'DDoS Attack on Payment Gateway',
      description: 'Massive spike in traffic hitting the payment API. WAF is struggling to mitigate. We need immediate infrastructure scaling.',
      priority: 'CRITICAL',
      status: 'MITIGATING',
      reporterId: l2Responder.id,
      assigneeId: l2Responder.id,
      tier: 'L2',
    },
  });

  const incident3 = await prisma.incident.create({
    data: {
      title: 'Phishing Email Campaign Detected',
      description: 'Several employees reported receiving an email claiming to be from IT requesting password resets.',
      priority: 'MEDIUM',
      status: 'OPEN',
      reporterId: l1Responder.id,
      tier: 'L1',
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
