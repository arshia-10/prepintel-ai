import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { companyNames, roleTitles, demoExperiences } from './data.js';

const prisma = new PrismaClient();

async function main() {
  for (const name of companyNames) {
    await prisma.company.upsert({
      where: { name },
      update: { description: `${name} campus hiring intelligence · DEMO DATA` },
      create: { name, description: `${name} campus hiring intelligence · DEMO DATA` }
    });
  }

  for (const companyName of companyNames) {
    const company = await prisma.company.findUniqueOrThrow({ where: { name: companyName } });
    for (const title of roleTitles) {
      await prisma.role.upsert({
        where: { title_companyId: { title, companyId: company.id } },
        update: {},
        create: { title, companyId: company.id }
      });
    }
  }

  // Re-running the seed replaces only generated demo records, never users' submitted experiences.
  await prisma.question.deleteMany({ where: { sourceType: 'DEMO_HISTORICAL_DATA' } });
  await prisma.interviewExperience.deleteMany({ where: { sourceType: 'DEMO_HISTORICAL_DATA' } });
  for (const record of demoExperiences) {
    const company = await prisma.company.findUniqueOrThrow({ where: { name: record.company } });
    const role = await prisma.role.findUniqueOrThrow({ where: { title_companyId: { title: record.role, companyId: company.id } } });
    const experience = await prisma.interviewExperience.create({
      data: {
        companyId: company.id, roleId: role.id, college: record.college, year: record.year,
        round: record.round, description: record.description, isAnonymous: true,
        status: 'APPROVED', sourceType: 'DEMO_HISTORICAL_DATA'
      }
    });
    await prisma.question.create({
      data: {
        companyId: company.id, roleId: role.id, experienceId: experience.id,
        text: record.question, topic: record.topic, pattern: record.pattern,
        difficulty: record.difficulty, round: record.round, frequency: record.frequency,
        sourceType: 'DEMO_HISTORICAL_DATA'
      }
    });
  }

  const demoAdminPassword = process.env.DEMO_ADMIN_PASSWORD;
  if (!demoAdminPassword || demoAdminPassword.length < 12) {
    throw new Error('Set DEMO_ADMIN_PASSWORD to a private value of at least 12 characters before seeding.');
  }
  const passwordHash = await bcrypt.hash(demoAdminPassword, 12);
  await prisma.user.upsert({
    where: { email: 'demo@prepintel.ai' },
    update: { passwordHash, isAdmin: true },
    create: {
      name: 'PrepIntel Demo Admin', email: 'demo@prepintel.ai', passwordHash,
      college: 'Chitkara University', branch: 'Computer Science', graduationYear: 2027, isAdmin: true
    }
  });
  console.info(`Seeded ${companyNames.length} DEMO companies, ${roleTitles.length} roles each, ${demoExperiences.length} experiences/questions, and the demo admin account.`);
}

main().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
