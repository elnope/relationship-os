/**
 * Relationship OS - Database Seed Script
 * 
 * Populates the database with realistic Vietnamese mock data for testing.
 * 
 * Usage:
 *   npx prisma db seed
 * 
 * Make sure to set DATABASE_URL in .env first.
 */

import { PrismaClient, RelationshipType, RelationshipStatus, InteractionType } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to generate UUID-like IDs for consistent seeding
const uuid = (prefix: string, num: number) => 
  `${prefix}-${num.toString().padStart(4, '0')}-0000-0000-000000000000`.replace(/0/g, () => 
    Math.floor(Math.random() * 10).toString()
  );

// ============================================================================
// MOCK DATA
// ============================================================================

// User
const DEMO_USER = {
  id: 'user-0001-0000-0000-000000000001',
  email: 'minh@relos.app',
  name: 'Minh',
  avatarUrl: null,
};

// Tags with Vietnamese context
const TAGS = [
  { name: 'GiaDinh', color: '#EF4444', icon: '👨‍👩‍👧‍👦' },
  { name: 'CongViec', color: '#3B82F6', icon: '💼' },
  { name: 'TheThao', color: '#10B981', icon: '🏋️' },
  { name: 'UET', color: '#8B5CF6', icon: '🎓' },
  { name: 'Tech', color: '#6366F1', icon: '💻' },
  { name: 'AI', color: '#EC4899', icon: '🤖' },
  { name: 'Kaggle', color: '#20B2AA', icon: '📊' },
  { name: 'Startup', color: '#F59E0B', icon: '🚀' },
  { name: 'Gym', color: '#F97316', icon: '💪' },
  { name: 'HocTap', color: '#14B8A6', icon: '📚' },
  { name: 'Mentor', color: '#A855F7', icon: '🎯' },
  { name: 'HangXom', color: '#EAB308', icon: '🏠' },
];

// People with realistic Vietnamese names and contexts
const PEOPLE = [
  // Family - High scores, slow decay
  {
    name: 'Thu Hà',
    relationshipType: RelationshipType.family,
    relationshipStrengthScore: 95,
    relationshipStatus: RelationshipStatus.growing,
    tags: ['GiaDinh'],
    notes: 'Mẹ. Luôn quan tâm và ủng hộ con trong mọi quyết định.',
  },
  {
    name: 'Minh Tuấn',
    relationshipType: RelationshipType.family,
    relationshipStrengthScore: 88,
    relationshipStatus: RelationshipStatus.growing,
    tags: ['GiaDinh'],
    notes: 'Em trai. Đang học năm 3 CNTT tại FPT.',
  },
  {
    name: 'Bà Ngoại',
    relationshipType: RelationshipType.family,
    relationshipStrengthScore: 82,
    relationshipStatus: RelationshipStatus.growing,
    tags: ['GiaDinh'],
    notes: 'Sống cùng gia đình. Mỗi sáng dậy sớm nấu phở.',
  },

  // Friends - Moderate decay
  {
    name: 'Nam Nguyễn',
    relationshipType: RelationshipType.friend,
    relationshipStrengthScore: 85,
    relationshipStatus: RelationshipStatus.growing,
    tags: ['UET', 'Tech', 'Startup'],
    notes: 'UET FC. Anh em từ hồi sinh viên. Giờ là founder startup AI.',
    lastInteractionDaysAgo: 2,
  },
  {
    name: 'Lan Chi',
    relationshipType: RelationshipType.friend,
    relationshipStrengthScore: 78,
    relationshipStatus: RelationshipStatus.stable,
    tags: ['Startup', 'Tech'],
    notes: 'Co-founder. Đang pitch VC cho dự án mới.',
    lastInteractionDaysAgo: 5,
  },
  {
    name: 'Hoàng Calisthenics',
    relationshipType: RelationshipType.friend,
    relationshipStrengthScore: 72,
    relationshipStatus: RelationshipStatus.stable,
    tags: ['TheThao', 'Gym'],
    notes: 'Training partner. Chuyên gia pull-ups và muscle-up.',
    lastInteractionDaysAgo: 7,
  },
  {
    name: 'Khoa Pug',
    relationshipType: RelationshipType.neighbor,
    relationshipStrengthScore: 45,
    relationshipStatus: RelationshipStatus.fading,
    tags: ['HangXom'],
    notes: 'Hàng xóm cùng tầng. Có con Pug tên Bông.',
    lastInteractionDaysAgo: 14,
  },
  {
    name: 'Annie Phạm',
    relationshipType: RelationshipType.friend,
    relationshipStrengthScore: 68,
    relationshipStatus: RelationshipStatus.stable,
    tags: ['Tech', 'AI', 'Kaggle'],
    notes: 'ML Engineer tại Google. Đang làm về LLM fine-tuning.',
    lastInteractionDaysAgo: 3,
  },
  {
    name: 'David Đặng',
    relationshipType: RelationshipType.colleague,
    relationshipStrengthScore: 62,
    relationshipStatus: RelationshipStatus.stable,
    tags: ['CongViec', 'Tech'],
    notes: 'Senior Dev. Pair programming partner.',
    lastInteractionDaysAgo: 4,
  },

  // Mentor - Slow decay
  {
    name: 'Anh Tuấn',
    relationshipType: RelationshipType.mentor,
    relationshipStrengthScore: 92,
    relationshipStatus: RelationshipStatus.growing,
    tags: ['Mentor', 'Kaggle', 'Tech'],
    notes: 'Mentor Kaggle. Giúp em phát triển sự nghiệp trong ML.',
    lastInteractionDaysAgo: 1,
  },
  {
    name: 'Thầy Minh',
    relationshipType: RelationshipType.mentor,
    relationshipStrengthScore: 88,
    relationshipStatus: RelationshipStatus.growing,
    tags: ['UET', 'HocTap', 'Mentor'],
    notes: 'Giảng viên ĐH. Người hướng dẫn luận văn tốt nghiệp.',
    lastInteractionDaysAgo: 10,
  },

  // Client - Fast decay
  {
    name: 'CEO Minh Phạm',
    relationshipType: RelationshipType.client,
    relationshipStrengthScore: 58,
    relationshipStatus: RelationshipStatus.stable,
    tags: ['CongViec'],
    notes: 'CEO công ty logistics. Khách hàng chính của dự án AI.',
    lastInteractionDaysAgo: 6,
  },
  {
    name: 'Sarah Chen',
    relationshipType: RelationshipType.client,
    relationshipStrengthScore: 35,
    relationshipStatus: RelationshipStatus.fading,
    tags: ['Startup', 'Tech'],
    notes: 'Partner từ Singapore. Cần follow up về partnership deal.',
    lastInteractionDaysAgo: 21,
  },

  // Other - Fastest decay
  {
    name: 'Minh Đức',
    relationshipType: RelationshipType.other,
    relationshipStrengthScore: 28,
    relationshipStatus: RelationshipStatus.fading,
    tags: ['UET', 'HocTap'],
    notes: 'Bạn học đại học. Đang làm startup ed-tech.',
    lastInteractionDaysAgo: 30,
  },
  {
    name: 'Emma Wilson',
    relationshipType: RelationshipType.other,
    relationshipStrengthScore: 18,
    relationshipStatus: RelationshipStatus.lost_contact,
    tags: ['Tech', 'AI'],
    notes: 'Gặp tại AI Conference 2024. Chưa follow up lại.',
    lastInteractionDaysAgo: 60,
  },
];

// Interaction templates
const INTERACTION_TEMPLATES: Array<{
  type: InteractionType;
  note: string;
  rating: number;
}> = [
  { type: InteractionType.coffee, note: 'Cà phê bàn về chiến lược', rating: 5 },
  { type: InteractionType.call, note: 'Discussed sản phẩm mới, rất khả thi!', rating: 4 },
  { type: InteractionType.meal, note: 'Bữa tối cùng gia đình, nấu phở bò', rating: 5 },
  { type: InteractionType.coffee, note: 'Pitch ý tưởng startup', rating: 4 },
  { type: InteractionType.activity, note: 'Tập gym 1 tiếng, cải thiện nhiều', rating: 4 },
  { type: InteractionType.video_call, note: 'Demo features mới, team feedback tích cực', rating: 5 },
  { type: InteractionType.chat, note: 'Trò chuyện về xu hướng AI 2024', rating: 4 },
  { type: InteractionType.drinks, note: 'Uống trà, chia sẻ kinh nghiệm career', rating: 4 },
  { type: InteractionType.call, note: 'Review code và architecture', rating: 5 },
  { type: InteractionType.meal, note: 'Lunch meeting, thảo luận về partnership', rating: 4 },
  { type: InteractionType.coffee, note: 'Bàn về Kaggle competition approach', rating: 5 },
  { type: InteractionType.gift, note: 'Tặng sách về Deep Learning', rating: 5 },
  { type: InteractionType.event, note: 'Tham dự AI Conference cùng nhau', rating: 5 },
];

// Promise reminders
const PROMISES = [
  {
    personIndex: 4, // Lan Chi
    title: 'Gửi tài liệu AI cho Lan Chi',
    deadlineDaysFromNow: 2,
  },
  {
    personIndex: 5, // Hoàng
    title: 'Hẹn tập xà đơn cuối tuần',
    deadlineDaysFromNow: 5,
  },
  {
    personIndex: 1, // Nam
    title: 'Cà phê bàn chiến thuật UET FC',
    deadlineDaysFromNow: 7,
  },
  {
    personIndex: 8, // David
    title: 'Review PR cho feature mới',
    deadlineDaysFromNow: 1,
  },
  {
    personIndex: 9, // Anh Tuấn
    title: 'Gửi slide presentation',
    deadlineDaysFromNow: 3,
  },
];

// ============================================================================
// SEED FUNCTION
// ============================================================================

async function main() {
  console.log('🌱 Starting seed process...\n');

  // Clean existing data
  console.log('📦 Cleaning existing data...');
  await prisma.personTag.deleteMany();
  await prisma.promiseReminder.deleteMany();
  await prisma.interaction.deleteMany();
  await prisma.person.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Cleaned existing data\n');

  // Create user
  console.log('👤 Creating demo user...');
  const user = await prisma.user.create({
    data: DEMO_USER,
  });
  console.log(`✅ Created user: ${user.name} (${user.email})\n`);

  // Create tags
  console.log('🏷️  Creating tags...');
  const createdTags: Record<string, string> = {};
  for (const tag of TAGS) {
    const created = await prisma.tag.create({
      data: {
        userId: user.id,
        ...tag,
      },
    });
    createdTags[tag.name] = created.id;
    console.log(`   - #${tag.name}`);
  }
  console.log(`✅ Created ${TAGS.length} tags\n`);

  // Create people with tags and interactions
  console.log('👥 Creating people...');
  const createdPeople: string[] = [];

  for (let i = 0; i < PEOPLE.length; i++) {
    const personData = PEOPLE[i];
    const personId = `person-${(i + 1).toString().padStart(4, '0')}-0000-0000-000000000001`;

    // Create person
    const person = await prisma.person.create({
      data: {
        id: personId,
        userId: user.id,
        name: personData.name,
        relationshipType: personData.relationshipType,
        relationshipStrengthScore: personData.relationshipStrengthScore,
        relationshipStatus: personData.relationshipStatus,
        notes: personData.notes,
        lastInteractionAt: personData.lastInteractionDaysAgo
          ? new Date(Date.now() - personData.lastInteractionDaysAgo * 24 * 60 * 60 * 1000)
          : null,
      },
    });
    createdPeople.push(person.id);

    // Create tag connections
    for (const tagName of personData.tags) {
      const tagId = createdTags[tagName];
      if (tagId) {
        await prisma.personTag.create({
          data: {
            personId: person.id,
            tagId: tagId,
          },
        });
      }
    }

    // Create some interactions for each person
    const interactionCount = Math.floor(Math.random() * 5) + 1;
    for (let j = 0; j < interactionCount; j++) {
      const template = INTERACTION_TEMPLATES[Math.floor(Math.random() * INTERACTION_TEMPLATES.length)];
      const daysAgo = Math.floor(Math.random() * 30);
      
      await prisma.interaction.create({
        data: {
          userId: user.id,
          personId: person.id,
          interactionType: template.type,
          rating: template.rating,
          freeTextNote: template.note,
          quickTags: [personData.tags[0] || 'thân_mật'].map(t => t.toLowerCase()),
          interactionDate: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
        },
      });
    }

    console.log(`   - ${person.name} (${personData.relationshipType}) - Score: ${person.relationshipStrengthScore}`);
  }
  console.log(`✅ Created ${PEOPLE.length} people\n`);

  // Create promise reminders
  console.log('📋 Creating promise reminders...');
  for (const promise of PROMISES) {
    const personId = createdPeople[promise.personIndex];
    if (personId) {
      await prisma.promiseReminder.create({
        data: {
          userId: user.id,
          personId: personId,
          title: promise.title,
          deadline: new Date(Date.now() + promise.deadlineDaysFromNow * 24 * 60 * 60 * 1000),
        },
      });
      console.log(`   - "${promise.title}"`);
    }
  }
  console.log(`✅ Created ${PROMISES.length} promises\n`);

  // Summary
  console.log('='.repeat(50));
  console.log('🎉 Seed completed successfully!\n');
  console.log('Summary:');
  console.log(`  - Users: 1`);
  console.log(`  - Tags: ${TAGS.length}`);
  console.log(`  - People: ${PEOPLE.length}`);
  console.log(`  - Interactions: ${await prisma.interaction.count()}`);
  console.log(`  - Promises: ${await prisma.promiseReminder.count()}`);
  console.log('\nYou can now login with:');
  console.log(`  Email: ${DEMO_USER.email}`);
  console.log('\n' + '='.repeat(50));
}

// ============================================================================
// RUN
// ============================================================================

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
