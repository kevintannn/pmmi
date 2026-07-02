/**
 * Seed data for PMMI.
 * Run with: `npm run db:seed`
 */
import { PrismaClient, EmploymentType, CareerStatus, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

function daysAgo(n: number): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - n);
  return d;
}

async function seedScrapPrices() {
  const categories = ['HMS 1', 'Shredded', 'Heavy Scrap', 'Industrial Scrap'] as const;
  const basePrice: Record<(typeof categories)[number], number> = {
    'HMS 1': 385,
    Shredded: 402,
    'Heavy Scrap': 372,
    'Industrial Scrap': 358,
  };

  const rows: Prisma.ScrapPriceCreateManyInput[] = [];
  // 14 days of history, small daily drift.
  for (let day = 13; day >= 0; day--) {
    for (const category of categories) {
      const drift = Math.round((Math.sin(day / 2) + (13 - day) * 0.4) * 10) / 10;
      rows.push({
        date: daysAgo(day),
        category,
        price: new Prisma.Decimal((basePrice[category] + drift).toFixed(2)),
        currency: 'USD',
        notes: category === 'HMS 1' ? 'CFR Indonesia, indicative' : null,
      });
    }
  }

  await prisma.scrapPrice.deleteMany();
  await prisma.scrapPrice.createMany({ data: rows });
  console.log(`✓ Seeded ${rows.length} scrap price records`);
}

async function seedCareers() {
  await prisma.career.deleteMany();
  await prisma.career.createMany({
    data: [
      {
        position: 'Steelmaking Process Engineer',
        department: 'Production',
        location: 'IMIP, Morowali, Indonesia',
        employmentType: EmploymentType.FULL_TIME,
        status: CareerStatus.OPEN,
        description:
          'Own and optimize the BOF–LF–CCM process route. Drive yield, quality and energy-efficiency improvements across the integrated steelmaking line.',
      },
      {
        position: 'Quality Control Metallurgist',
        department: 'Quality Assurance',
        location: 'IMIP, Morowali, Indonesia',
        employmentType: EmploymentType.FULL_TIME,
        status: CareerStatus.OPEN,
        description:
          'Lead chemical and mechanical testing of slabs and billets. Maintain laboratory standards and ensure products meet international specifications.',
      },
      {
        position: 'Continuous Casting Operator',
        department: 'Production',
        location: 'IMIP, Morowali, Indonesia',
        employmentType: EmploymentType.FULL_TIME,
        status: CareerStatus.OPEN,
        description:
          'Operate and monitor the continuous casting machine. Ensure casting stability, surface quality and safe operation of the CCM.',
      },
      {
        position: 'Mechanical Maintenance Technician',
        department: 'Maintenance',
        location: 'IMIP, Morowali, Indonesia',
        employmentType: EmploymentType.CONTRACT,
        status: CareerStatus.OPEN,
        description:
          'Perform preventive and corrective maintenance on furnaces, casters and utilities to maximize plant availability.',
      },
      {
        position: 'Graduate Trainee — Metallurgical Engineering',
        department: 'Human Resources',
        location: 'IMIP, Morowali, Indonesia',
        employmentType: EmploymentType.INTERNSHIP,
        status: CareerStatus.OPEN,
        description:
          'A 12-month rotational program across production, quality and utilities for fresh metallurgy and mechanical engineering graduates.',
      },
    ],
  });
  console.log('✓ Seeded 5 career openings');
}

async function seedSiteContent() {
  const content: Array<{ key: string; en: string; zh: string }> = [
    {
      key: 'contact.email',
      en: 'info@permaimetal.com',
      zh: 'info@permaimetal.com',
    },
    {
      key: 'contact.phone',
      en: '+62 851 2107 4332',
      zh: '+62 851 2107 4332',
    },
    {
      key: 'contact.office',
      en: 'Jakarta Representative Office, Indonesia',
      zh: '印度尼西亚雅加达代表处',
    },
    {
      key: 'contact.factory',
      en: 'Indonesia Morowali Industrial Park (IMIP), Central Sulawesi, Indonesia',
      zh: '印度尼西亚莫罗瓦利工业园区（IMIP），中苏拉威西省',
    },
    {
      key: 'contact.hours',
      en: 'Monday – Saturday, 08:00 – 17:00 WITA',
      zh: '周一至周六 08:00 – 17:00（印尼中部时间）',
    },
  ];

  for (const item of content) {
    for (const locale of ['en', 'zh'] as const) {
      await prisma.siteContent.upsert({
        where: { key_locale: { key: item.key, locale } },
        update: { value: item[locale] },
        create: { key: item.key, locale, value: item[locale] },
      });
    }
  }
  console.log(`✓ Seeded ${content.length * 2} site content entries`);
}

async function main() {
  console.log('Seeding database…');
  await seedScrapPrices();
  await seedCareers();
  await seedSiteContent();
  console.log('Done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
