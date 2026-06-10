import { GameEngine } from './src/game/GameEngine';

function testNoDuplicateEvents() {
  console.log('=== 测试 1：12 节点事件不重复 ===');
  const engine = new GameEngine('dragon', 'testseed123');
  const nodes = engine.getNodes();
  const eventIds = nodes.map((n) => n.eventId);
  const uniqueIds = new Set(eventIds);

  console.log(`节点数: ${nodes.length}`);
  console.log(`不重复事件数: ${uniqueIds.size}`);
  console.log(`事件 ID 列表:`, eventIds);

  if (uniqueIds.size === nodes.length) {
    console.log('✅ 12 个节点事件全部不重复！');
  } else {
    console.log('❌ 存在重复事件！');
  }
  console.log('');
}

function testZodiacSpecialEvent() {
  console.log('=== 测试 2：生肖专属事件 ===');
  const zodiacs = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'];

  let totalWithSpecial = 0;

  for (const zodiac of zodiacs) {
    const engine = new GameEngine(zodiac, 'testseed_' + zodiac);
    const nodes = engine.getNodes();
    const hasSpecial = nodes.some((n) => n.eventId.startsWith('zodiac_'));
    if (hasSpecial) {
      totalWithSpecial++;
      const specialNode = nodes.find((n) => n.eventId.startsWith('zodiac_'));
      console.log(`✅ ${zodiac}: 包含专属事件 ${specialNode?.eventId}`);
    } else {
      console.log(`⚠️  ${zodiac}: 未包含专属事件 (70% 概率)`);
    }
  }

  console.log(`\n共 ${totalWithSpecial}/12 个生肖包含专属事件`);
  console.log('');
}

function testDifferentZodiacDifferentEvents() {
  console.log('=== 测试 3：不同生肖事件不同 ===');
  const seed = 'sametestseed';
  const engine1 = new GameEngine('rat', seed);
  const engine2 = new GameEngine('ox', seed);

  const events1 = engine1.getNodes().map((n) => n.eventId).sort();
  const events2 = engine2.getNodes().map((n) => n.eventId).sort();

  const common = events1.filter((e) => events2.includes(e));
  console.log(`鼠的事件: ${events1.length} 个`);
  console.log(`牛的事件: ${events2.length} 个`);
  console.log(`共同事件: ${common.length} 个`);

  if (common.length < events1.length) {
    console.log('✅ 不同生肖的事件列表有差异！');
  } else {
    console.log('❌ 不同生肖事件完全相同');
  }
  console.log('');
}

function testSeedDeterministic() {
  console.log('=== 测试 4：种子确定性 ===');
  const seed = 'deterministic_test';
  const zodiac = 'dragon';

  const engine1 = new GameEngine(zodiac, seed);
  const engine2 = new GameEngine(zodiac, seed);

  const events1 = engine1.getNodes().map((n) => n.eventId);
  const events2 = engine2.getNodes().map((n) => n.eventId);

  const isSame = events1.every((e, i) => e === events2[i]);

  if (isSame) {
    console.log('✅ 相同种子 + 相同生肖 = 完全相同的事件序列');
  } else {
    console.log('❌ 相同种子产生了不同结果');
  }
  console.log('');
}

function testEventTypeDistribution() {
  console.log('=== 测试 5：事件类型分布 ===');
  const engine = new GameEngine('rabbit', 'distribution_test');
  const nodes = engine.getNodes();

  const typeCounts: Record<string, number> = {};
  for (const node of nodes) {
    const event = engine.getEventById(node.eventId);
    if (event) {
      typeCounts[event.type] = (typeCounts[event.type] || 0) + 1;
    }
  }

  console.log('事件类型分布:');
  for (const [type, count] of Object.entries(typeCounts)) {
    console.log(`  ${type}: ${count} 个`);
  }
  console.log('');
}

function testTotalEvents() {
  console.log('=== 测试 6：事件库规模 ===');
  const { EVENTS } = require('./src/game/constants');
  console.log(`事件总数: ${EVENTS.length} 个`);

  const types = new Set(EVENTS.map((e: any) => e.type));
  console.log(`事件类型数: ${types.size} 种`);

  const zodiacSpecials = EVENTS.filter((e: any) => e.zodiacExclusive);
  console.log(`生肖专属事件: ${zodiacSpecials.length} 个`);

  const rarities = new Set(EVENTS.map((e: any) => e.rarity || 'common'));
  console.log(`稀有度种类: ${Array.from(rarities).join(', ')}`);
  console.log('');
}

try {
  testTotalEvents();
  testNoDuplicateEvents();
  testZodiacSpecialEvent();
  testDifferentZodiacDifferentEvents();
  testSeedDeterministic();
  testEventTypeDistribution();
  console.log('🎉 所有测试完成！');
} catch (e) {
  console.error('测试出错:', e);
}
