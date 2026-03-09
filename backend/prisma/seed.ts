import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database with Many-to-Many Categories...');

    // 1. Clear existing data
    await prisma.review.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.service.deleteMany();
    await prisma.business.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    const hashedPassword = await bcrypt.hash('password123', 12);

    // 2. Create Users
    const admin = await prisma.user.create({
        data: {
            name: 'Admin User',
            email: 'admin@smartbiz.com',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    const owners = [];
    for (let i = 1; i <= 5; i++) {
        const owner = await prisma.user.create({
            data: {
                name: `Owner ${i}`,
                email: `owner${i}@smartbiz.com`,
                password: hashedPassword,
                role: 'BUSINESS',
            },
        });
        owners.push(owner);
    }

    // 3. Create Categories
    const categoryNames = ['Beauty', 'Tech', 'Food', 'Fitness', 'Cleaning', 'Health', 'Luxury', 'Retail'];
    const categories: any = {};
    for (const name of categoryNames) {
        categories[name] = await prisma.category.create({
            data: { name }
        });
    }

    // 4. Define Business Data (20+)
    const businessData = [
        { name: 'Elite Glow Spa', cats: ['Beauty', 'Health', 'Luxury'], desc: 'Premium skincare and wellness.' },
        { name: 'TechFix Solutions', cats: ['Tech', 'Retail'], desc: 'Fast, reliable repair and gadgets.' },
        { name: 'Gourmet Bites', cats: ['Food', 'Luxury'], desc: 'High-end catering and dining.' },
        { name: 'Iron Gym', cats: ['Fitness', 'Health'], desc: 'Intense strength training.' },
        { name: 'Pure Clean', cats: ['Cleaning', 'Health'], desc: 'Eco-friendly sanitzation.' },
        { name: 'Luxe Hair Studio', cats: ['Beauty', 'Luxury'], desc: 'Salon and spa services.' },
        { name: 'Code Craft', cats: ['Tech'], desc: 'Software development.' },
        { name: 'Fresh Greens', cats: ['Food', 'Health'], desc: 'Organic grocery and meals.' },
        { name: 'Zen Yoga', cats: ['Fitness', 'Health', 'Beauty'], desc: 'Holistic wellness studio.' },
        { name: 'Sparkle Auto', cats: ['Cleaning', 'Luxury'], desc: 'Elite car detailing.' },
        { name: 'Radiant Skin', cats: ['Beauty', 'Health'], desc: 'Dermatology and skin health.' },
        { name: 'Cyber Guard', cats: ['Tech'], desc: 'Cybersecurity services.' },
        { name: 'Bistro 21', cats: ['Food', 'Retail'], desc: 'Café and baked goods.' },
        { name: 'Titan Crossfit', cats: ['Fitness'], desc: 'Functional fitness.' },
        { name: 'Dry Master', cats: ['Cleaning'], desc: 'Professional cleaning.' },
        { name: 'Velvet Nails', cats: ['Beauty'], desc: 'Nail artistry.' },
        { name: 'App Pulse', cats: ['Tech'], desc: 'Mobile engineering.' },
        { name: 'Sizzling Grill', cats: ['Food'], desc: 'Steakhouse and grill.' },
        { name: 'Peak Pilates', cats: ['Fitness', 'Health'], desc: 'Core strength focus.' },
        { name: 'Window Wonder', cats: ['Cleaning'], desc: 'Glass cleaning specialists.' },
        { name: 'Style & Co', cats: ['Beauty', 'Luxury'], desc: 'Personal styling.' }
    ];

    const baseImgUrl = 'https://images.unsplash.com/photo-';
    const imgIds: any = {
        'Beauty': '1560750588-73207b1ef5b8',
        'Tech': '1517694712202-14dd9538aa97',
        'Food': '1504674900247-0877df9cc836',
        'Fitness': '1534438327276-14e5300c3a48',
        'Cleaning': '1581578731548-c64695cc6954'
    };

    // 5. Create Businesses and Services
    for (let i = 0; i < businessData.length; i++) {
        const data: any = businessData[i];
        const owner = owners[i % owners.length];

        const business = await prisma.business.create({
            data: {
                name: data.name,
                description: data.desc,
                categories: {
                    connect: data.cats.map((cName: string) => ({ id: categories[cName].id }))
                },
                email: `info@${data.name.toLowerCase().replace(/\s/g, '')}.com`,
                phone: `+1 555-000-${1000 + i}`,
                address: `${100 + i} Main St, Business City`,
                workingHours: 'Mon-Fri: 9AM - 6PM',
                logo: `${baseImgUrl}${imgIds[data.cats[0]] || '1540555708036-30b9150cc762'}?w=800&auto=format&fit=crop`,
                userId: owner.id,
            },
        });

        await prisma.service.createMany({
            data: [
                {
                    title: `Standard ${data.name} Service`,
                    description: `Core service for ${data.name}.`,
                    price: 30.0 + (i * 2),
                    duration: 45,
                    category: data.cats[0],
                    businessId: business.id,
                },
                {
                    title: `Elite ${data.name} Package`,
                    description: `All-inclusive ${data.name} package.`,
                    price: 150.0 + (i * 5),
                    duration: 90,
                    category: data.cats[0],
                    businessId: business.id,
                }
            ]
        });
    }

    console.log('Seeding completed with 21 businesses across multi-categories!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
