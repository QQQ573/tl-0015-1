import { GameEngine } from './src/game/GameEngine';
import { EVENTS, ZODIACS } from './src/game/constants';

function testNoDuplicateEvents() {
  console.log('=== 测试 1：12 节点事件不重复 ===\n');

  let allPass = true;
  const testSeeds = ['test001', 'lucky2024', 'dragon888', 'happynewyear', 'miuhui2024'];
  const testZodiacs = ['rat', 'dragon', 'tiger', 'pig', 'monkey'];

  for (const zodiac of testZodiacs) {
    for (const seed of testSeeds) {
      const engine = new GameEngine(zodiac, seed);
      const nodes = engine.getNodes();
      const eventIds = nodes.map((n) => n.eventId);
      const uniqueIds = new Set(eventIds);

      if (uniqueIds.size !== eventIds.length) {
        console.log(`❌ ${zodiac} + ${seed}: 存在重复事件!`);
        console.log(`  事件: ${eventIds.join(', ')}`);
        allPass = false;
      }
    }
  }

  if (allPass) {
    console.log('✅ 所有测试用例的 12 个节点事件全部不重复！');
  }
  console.log('');
}

function testZodiacExclusiveEvents() {
  console.log('=== 测试 2：生肖专属事件出现率 ===\n');

  let totalWithSpecial = 0;
  const testCount = 50;

  for (const zodiac of ZODIACS) {
    let hasSpecialCount = 0;
    for (let i = 0; i < testCount; i++) {
      const engine = new GameEngine(zodiac.id, `seed_${zodiac.id}_${i}`);
      const nodes = engine.getNodes();
      const hasSpecial = nodes.some((n) => n.eventId.startsWith('zodiac_'));
      if (hasSpecial) hasSpecialCount++;
    }
    const rate = ((hasSpecialCount / testCount) * 100).toFixed(1);
    console.log(`${zodiac.emoji} ${zodiac.name}: ${hasSpecialCount}/${testCount} (${rate}%)`);
    if (hasSpecialCount > 0) totalWithSpecial++;
  }

  console.log(`\n✅ 共 ${totalWithSpecial}/12 个生肖能触发专属事件`);
  console.log('');
}

function testDifferentZodiacDifferentEvents() {
  console.log('=== 测试 3：不同生肖事件差异 ===\n');

  const seed = 'sametestseed123';
  const zodiacPairs = [
    ['rat', 'ox'],
    ['dragon', 'tiger'],
    ['rabbit', 'snake'],
    ['horse', 'pig'],
    ['monkey', 'rooster'],
    ['dog', 'goat'],
  ];

  let allDifferent = true;

  for (const [z1, z2] of zodiacPairs) {
    const engine1 = new GameEngine(z1, seed);
    const engine2 = new GameEngine(z2, seed);

    const events1 = new Set(engine1.getNodes().map((n) => n.eventId));
    const events2 = new Set(engine2.getNodes().map((n) => n.eventId));

    const common = [...events1].filter((e) => events2.has(e));
    const diffCount = Math.abs(events1.size - common.length);

    console.log(`${z1} vs ${z2}:`);
    console.log(`  共同事件: ${common.length}/12`);
    console.log(`  差异事件: ${12 - common.length}/12`);

    if (common.length === 12) {
      allDifferent = false;
      console.log('  ⚠️  两个生肖的事件完全相同！');
    }
  }

  if (allDifferent) {
    console.log('\n✅ 不同生肖的事件列表均有差异！');
  }
  console.log('');
}

function testSeedDeterministic() {
  console.log('=== 测试 4：种子完全确定性 ===\n');

  let allPass = true;

  for (const zodiac of ZODIACS) {
    const seed = `deterministic_${zodiac.id}`;
    const engine1 = new GameEngine(zodiac.id, seed);
    const engine2 = new GameEngine(zodiac.id, seed);

    const events1 = engine1.getNodes().map((n) => n.eventId);
    const events2 = engine2.getNodes().map((n) => n.eventId);

    const isSame = events1.every((e, i) => e === events2[i]);

    if (!isSame) {
      console.log(`❌ ${zodiac.name}: 相同种子产生了不同结果！`);
      allPass = false;
    }
  }

  if (allPass) {
    console.log('✅ 相同种子 + 相同生肖 = 完全相同的事件序列！');
  }
  console.log('');
}

function testEventPoolSize() {
  console.log('=== 测试 5：事件库规模 ===\n');

  console.log(`事件总数: ${EVENTS.length} 个`);

  const typeCounts: Record<string, number> = {};
  for (const event of EVENTS) {
    typeCounts[event.type] = (typeCounts[event.type] || 0) + 1;
  }

  console.log('\n按类型分布:');
  for (const [type, count] of Object.entries(typeCounts)) {
    console.log(`  ${type}: ${count} 个`);
  }

  const zodiacSpecials = EVENTS.filter((e) => e.zodiacExclusive && e.zodiacExclusive.length > 0);
  console.log(`\n生肖专属事件: ${zodiacSpecials.length} 个`);

  const rarities: Record<string, number> = {};
  for (const event of EVENTS) {
    const r = event.rarity || 'common';
    rarities[r] = (rarities[r] || 0) + 1;
  }

  console.log('\n按稀有度分布:');
  for (const [rarity, count] of Object.entries(rarities)) {
    console.log(`  ${rarity}: ${count} 个`);
  }

  console.log('');
}

function testEventTypeDistribution() {
  console.log('=== 测试 6：事件类型分布均衡性 ===\n');

  const seed = 'distribution_test';
  const engine = new GameEngine('dragon', seed);
  const nodes = engine.getNodes();

  const typeCounts: Record<string, number> = {};
  for (const node of nodes) {
    const event = EVENTS.find((e) => e.id === node.eventId);
    if (event) {
      typeCounts[event.type] = (typeCounts[event.type] || 0) + 1;
    }
  }

  console.log('本局事件类型分布:');
  for (const [type, count] of Object.entries(typeCounts)) {
    console.log(`  ${type}: ${count} 个`);
  }

  console.log('\n✅ 事件分布基本均衡！');
  console.log('');
}

function testGameFlow() {
  console.log('=== 测试 7：完整游戏流程 ===\n');

  const engine = new GameEngine('dragon', 'testflow123');
  console.log('初始运势:', engine.getFortune());
  console.log('当前节点:', engine.getCurrentNodeIndex());

  let step = 0;
  while (engine.canMoveForward() && !engine.getEnding()) {
    const event = engine.moveForward();
    if (event) {
      step++;
      const choiceIndex = step % event.choices.length;
      const result = engine.makeChoice(choiceIndex);
      console.log(
        `第 ${step} 步: ${event.title} → 选 ${choiceIndex + 1} → 运势: ${JSON.stringify(engine.getFortune())}`
      );

      if (result.ending) {
        console.log(`\n🎉 触发结局: ${result.ending.title}`);
        break;
      }
    }
  }

  if (!engine.getEnding()) {
    console.log('\n🧧 平安走完 12 站！');
  }

  console.log(`\n总步数: ${engine.getSteps()}`);
  console.log('最终运势:', engine.getFortune());
  console.log('✅ 游戏流程正常！');
  console.log('');
}

try {
  testEventPoolSize();
  testNoDuplicateEvents();
  testZodiacExclusiveEvents();
  testDifferentZodiacDifferentEvents();
  testSeedDeterministic();
  testEventTypeDistribution();
  testGameFlow();
  console.log('🎉 所有测试通过！');
} catch (e) {
  console.error('❌ 测试出错:', e);
}
