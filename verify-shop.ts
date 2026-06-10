import { GameEngine } from './src/game/GameEngine';
import { ITEMS } from './src/game/constants';

function testShopDeterministic() {
  console.log('=== 测试 1：同种子摊铺位置一致 ===\n');

  const seed = 'testshop123';
  const zodiac = 'dragon';

  const engine1 = new GameEngine(zodiac, seed);
  const engine2 = new GameEngine(zodiac, seed);

  const shops1 = engine1.getShops();
  const shops2 = engine2.getShops();

  const nodes1 = engine1.getNodes();
  const nodes2 = engine2.getNodes();

  const shopIndices1 = nodes1.filter((n) => n.type === 'shop').map((n) => n.index);
  const shopIndices2 = nodes2.filter((n) => n.type === 'shop').map((n) => n.index);

  console.log('第一局摊铺位置:', shopIndices1);
  console.log('第二局摊铺位置:', shopIndices2);

  const positionsMatch = shopIndices1.every((i, idx) => i === shopIndices2[idx]);
  console.log(`摊铺位置一致: ${positionsMatch ? '✅' : '❌'}`);

  let itemsMatch = true;
  for (let i = 0; i < shops1.length; i++) {
    for (let j = 0; j < shops1[i].items.length; j++) {
      const item1 = shops1[i].items[j];
      const item2 = shops2[i].items[j];
      if (
        item1.itemId !== item2.itemId ||
        item1.price !== item2.price ||
        item1.stock !== item2.stock
      ) {
        itemsMatch = false;
        console.log(`商品不匹配: ${item1.itemId} vs ${item2.itemId}`);
      }
    }
  }
  console.log(`商品一致: ${itemsMatch ? '✅' : '❌'}`);
  console.log('');
}

function testItemEffects() {
  console.log('=== 测试 2：道具效果验证 ===\n');

  const engine = new GameEngine('dragon', 'testeffects');

  console.log('初始财运:', engine.getFortune().wealth);

  engine.addItemToInventory('amulet');
  engine.addItemToInventory('candied_haw');
  engine.addItemToInventory('couplet');

  console.log('行囊道具:', engine.getInventory().map((i) => i.itemId));

  let result = engine.moveForward();
  let steps = 0;
  while (result?.type !== 'event' && steps < 20) {
    result = engine.moveForward();
    steps++;
  }

  const event = result?.type === 'event' ? result.event : null;
  if (!event) {
    console.log('未找到事件节点');
    return;
  }

  console.log(`当前事件: ${event.title}`);
  console.log('选项效果:');
  event.choices.forEach((c, i) => {
    console.log(`  选项 ${i + 1}:`, JSON.stringify(c.effect));
  });

  const useAmuletResult = engine.useItem('amulet');
  console.log(`使用护身符: ${useAmuletResult.success ? '✅' : '❌'} ${useAmuletResult.message}`);

  const useCandiedResult = engine.useItem('candied_haw');
  console.log(`使用糖葫芦: ${useCandiedResult.success ? '✅' : '❌'} ${useCandiedResult.message}`);

  const activeEffects = engine.getActiveEffects();
  console.log('活跃效果:', activeEffects.map((e) => e.effectType));

  const negativeChoice = event.choices.findIndex((c) =>
    Object.values(c.effect).some((v) => v !== undefined && v < 0)
  );

  if (negativeChoice >= 0) {
    const beforeFortune = { ...engine.getFortune() };
    console.log(`\n选择选项 ${negativeChoice + 1} (含负面效果)`);
    const result = engine.makeChoice(negativeChoice);
    const afterFortune = engine.getFortune();

    console.log(`结果: ${result.resultText}`);
    console.log('运势变化:');
    for (const key of ['wealth', 'love', 'health', 'career']) {
      const diff = afterFortune[key as keyof typeof afterFortune] - beforeFortune[key as keyof typeof beforeFortune];
      if (diff !== 0) {
        console.log(`  ${key}: ${diff > 0 ? '+' : ''}${diff}`);
      }
    }
  }

  console.log('');
}

function testBuyItem() {
  console.log('=== 测试 3：摊铺购买逻辑 ===\n');

  const engine = new GameEngine('dragon', 'testbuy');

  let result = engine.moveForward();
  let steps = 0;
  while (result?.type !== 'shop' && steps < 20) {
    if (engine.getEnding()) break;
    result = engine.moveForward();
    steps++;
  }

  if (result?.type !== 'shop') {
    console.log('未找到摊铺节点');
    return;
  }

  const shop = engine.getCurrentShop();
  console.log(`摊铺位置: 第 ${shop!.nodeIndex + 1} 站`);
  console.log('商品列表:');
  shop!.items.forEach((item) => {
    const itemInfo = ITEMS.find((i) => i.id === item.itemId);
    console.log(`  ${itemInfo?.emoji} ${itemInfo?.name}: ${item.price}财运, 库存${item.stock}`);
  });

  const wealth = engine.getFortune().wealth;
  console.log(`\n当前财运: ${wealth}`);

  const affordableItem = shop!.items.find((i) => i.price <= wealth && i.stock > 0);
  const unaffordableItem = shop!.items.find((i) => i.price > wealth && i.stock > 0);

  if (unaffordableItem) {
    const itemInfo = ITEMS.find((i) => i.id === unaffordableItem.itemId);
    const buyResult = engine.buyItem(unaffordableItem.itemId);
    console.log(`\n尝试购买 ${itemInfo?.name} (${unaffordableItem.price}财运):`);
    console.log(`  结果: ${buyResult.success ? '✅' : '❌'} ${buyResult.message}`);
    console.log(`  财运不足验证: ${!buyResult.success && buyResult.message.includes('财运不足') ? '✅' : '❌'}`);
  }

  if (affordableItem) {
    const itemInfo = ITEMS.find((i) => i.id === affordableItem.itemId);
    const beforeWealth = engine.getFortune().wealth;
    const buyResult = engine.buyItem(affordableItem.itemId);
    const afterWealth = engine.getFortune().wealth;

    console.log(`\n尝试购买 ${itemInfo?.name} (${affordableItem.price}财运):`);
    console.log(`  结果: ${buyResult.success ? '✅' : '❌'} ${buyResult.message}`);
    console.log(`  财运变化: ${beforeWealth} → ${afterWealth}`);
    console.log(`  行囊:`, engine.getInventory().map((i) => {
      const info = ITEMS.find((t) => t.id === i.itemId);
      return `${info?.emoji}x${i.quantity}`;
    }));
  }

  console.log('');
}

function testAmuletEffect() {
  console.log('=== 测试 4：护身符对负向选项生效 ===\n');

  const engine = new GameEngine('dragon', 'testamulet');

  engine.addItemToInventory('amulet');

  let result = engine.moveForward();
  let steps = 0;
  while (result?.type !== 'event' && steps < 20) {
    result = engine.moveForward();
    steps++;
  }

  const event = result?.type === 'event' ? result.event : null;
  if (!event) {
    console.log('未找到事件节点');
    return;
  }

  const negativeChoice = event.choices.findIndex((c) =>
    Object.values(c.effect).some((v) => v !== undefined && v < 0)
  );

  if (negativeChoice < 0) {
    console.log('当前事件没有负面选项，跳过测试');
    return;
  }

  const choice = event.choices[negativeChoice];
  console.log(`事件: ${event.title}`);
  console.log(`选项 ${negativeChoice + 1} 原始效果:`, JSON.stringify(choice.effect));

  console.log('\n--- 不使用护身符 ---');
  const engine2 = new GameEngine('dragon', 'testamulet');
  let result2 = engine2.moveForward();
  while (result2?.type !== 'event') {
    result2 = engine2.moveForward();
  }
  const before1 = { ...engine2.getFortune() };
  const makeChoiceResult1 = engine2.makeChoice(negativeChoice);
  const after1 = engine2.getFortune();
  console.log('实际变化:');
  for (const key of ['wealth', 'love', 'health', 'career']) {
    const diff = after1[key as keyof typeof after1] - before1[key as keyof typeof before1];
    if (diff !== 0) {
      console.log(`  ${key}: ${diff > 0 ? '+' : ''}${diff}`);
    }
  }

  console.log('\n--- 使用护身符 ---');
  const engine3 = new GameEngine('dragon', 'testamulet');
  engine3.addItemToInventory('amulet');
  let result3 = engine3.moveForward();
  while (result3?.type !== 'event') {
    result3 = engine3.moveForward();
  }
  const useResult = engine3.useItem('amulet');
  console.log(`使用护身符: ${useResult.success ? '✅' : '❌'} ${useResult.message}`);

  const before2 = { ...engine3.getFortune() };
  const makeChoiceResult2 = engine3.makeChoice(negativeChoice);
  const after2 = engine3.getFortune();
  console.log('实际变化:');
  let amuletWorked = true;
  for (const key of ['wealth', 'love', 'health', 'career']) {
    const k = key as keyof typeof after2;
    const diff1 = after1[k] - before1[k];
    const diff2 = after2[k] - before2[k];

    if (diff1 !== 0) {
      console.log(`  ${key}: ${diff1 > 0 ? '+' : ''}${diff1} → ${diff2 > 0 ? '+' : ''}${diff2}`);
      if (diff1 < 0 && diff2 !== Math.floor(diff1 / 2)) {
        amuletWorked = false;
      }
    }
  }
  console.log(`\n护身符生效: ${amuletWorked ? '✅' : '❌'}`);
  console.log('');
}

function testInventory() {
  console.log('=== 测试 5：行囊系统 ===\n');

  const engine = new GameEngine('dragon', 'testinv');

  console.log('初始行囊大小:', engine.getInventory().length);

  let addCount = 0;
  for (const item of ITEMS) {
    const result = engine.addItemToInventory(item.id);
    if (result) addCount++;
    console.log(`添加 ${item.emoji}${item.name}: ${result ? '✅' : '❌'}`);
  }

  console.log(`成功添加: ${addCount}/${ITEMS.length}`);
  console.log('当前行囊:', engine.getInventory().map((i) => {
    const info = ITEMS.find((t) => t.id === i.itemId);
    return `${info?.emoji}x${i.quantity}`;
  }));

  const removeResult = engine.removeItemFromInventory(engine.getInventory()[0]?.itemId || '');
  console.log(`\n移除一个道具: ${removeResult ? '✅' : '❌'}`);
  console.log('当前行囊:', engine.getInventory().map((i) => {
    const info = ITEMS.find((t) => t.id === i.itemId);
    return `${info?.emoji}x${i.quantity}`;
  }));

  console.log('');
}

function testDropItem() {
  console.log('=== 测试 6：事件掉落道具 ===\n');

  let dropCount = 0;
  const testRuns = 100;

  for (let i = 0; i < testRuns; i++) {
    const engine = new GameEngine('dragon', `drop${i}`);
    let result = engine.moveForward();
    let s = 0;
    while (result?.type !== 'event' && s < 20) {
      result = engine.moveForward();
      s++;
    }
    const makeChoiceResult = engine.makeChoice(0);
    if (makeChoiceResult.droppedItem) {
      dropCount++;
      const item = ITEMS.find((t) => t.id === makeChoiceResult.droppedItem);
      console.log(`第 ${i + 1} 局掉落: ${item?.emoji}${item?.name}`);
    }
  }

  console.log(`\n${testRuns} 局中共掉落 ${dropCount} 次，概率约 ${((dropCount / testRuns) * 100).toFixed(1)}%`);
  console.log('');
}

try {
  testShopDeterministic();
  testInventory();
  testBuyItem();
  testItemEffects();
  testAmuletEffect();
  testDropItem();
  console.log('🎉 所有测试完成！');
} catch (e) {
  console.error('❌ 测试出错:', e);
}
