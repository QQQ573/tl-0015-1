import type { Zodiac, GameEvent, EndingType } from './types';

export const ZODIACS: Zodiac[] = [
  {
    id: 'rat',
    name: '鼠',
    emoji: '🐭',
    description: '机灵聪慧，财运亨通',
    bonus: { wealth: 10 },
  },
  {
    id: 'ox',
    name: '牛',
    emoji: '🐮',
    description: '勤劳踏实，事业有成',
    bonus: { career: 10 },
  },
  {
    id: 'tiger',
    name: '虎',
    emoji: '🐯',
    description: '勇猛威武，身强体健',
    bonus: { health: 10 },
  },
  {
    id: 'rabbit',
    name: '兔',
    emoji: '🐰',
    description: '温柔善良，桃花朵朵',
    bonus: { love: 10 },
  },
  {
    id: 'dragon',
    name: '龙',
    emoji: '🐲',
    description: '尊贵吉祥，全面发展',
    bonus: { wealth: 5, career: 5 },
  },
  {
    id: 'snake',
    name: '蛇',
    emoji: '🐍',
    description: '睿智沉稳，财运绵长',
    bonus: { wealth: 8, health: 2 },
  },
  {
    id: 'horse',
    name: '马',
    emoji: '🐴',
    description: '奔腾向前，事业腾飞',
    bonus: { career: 8, health: 2 },
  },
  {
    id: 'goat',
    name: '羊',
    emoji: '🐑',
    description: '温顺祥和，感情顺遂',
    bonus: { love: 8, health: 2 },
  },
  {
    id: 'monkey',
    name: '猴',
    emoji: '🐵',
    description: '聪明伶俐，左右逢源',
    bonus: { career: 5, love: 5 },
  },
  {
    id: 'rooster',
    name: '鸡',
    emoji: '🐔',
    description: '勤奋守时，财源广进',
    bonus: { wealth: 7, career: 3 },
  },
  {
    id: 'dog',
    name: '狗',
    emoji: '🐶',
    description: '忠诚可靠，贵人相助',
    bonus: { health: 7, love: 3 },
  },
  {
    id: 'pig',
    name: '猪',
    emoji: '🐷',
    description: '福气满满，一生富足',
    bonus: { wealth: 6, health: 4 },
  },
];

export const EVENTS: GameEvent[] = [
  {
    id: 'redpacket_1',
    type: 'redPacket',
    title: '🧧 天降红包',
    description: '庙会入口处，一位长者正在派发新年红包，你走上前去...',
    choices: [
      {
        text: '恭敬接过，道谢离开',
        effect: { wealth: 12 },
        resultText: '你双手接过红包，感受到沉甸甸的好运，财运上升！',
      },
      {
        text: '推辞一番，再收下',
        effect: { wealth: 8, love: 5 },
        resultText: '你礼貌推辞，长者更觉你懂事，又多塞了几句祝福。',
      },
      {
        text: '坚决不收，转身就走',
        effect: { career: 10 },
        resultText: '你坚守原则不为所动，长者暗暗点头，此子必成大器！',
      },
    ],
  },
  {
    id: 'redpacket_2',
    type: 'redPacket',
    title: '🎯 套圈中奖',
    description: '套圈摊位前围满了人，你手痒想试试手气...',
    choices: [
      {
        text: '买十个圈碰碰运气',
        effect: { wealth: 15 },
        resultText: '你随手一扔，居然套中了最大的奖品！财运爆棚！',
      },
      {
        text: '只买三个圈意思一下',
        effect: { wealth: 5, health: 3 },
        resultText: '你中了个小奖品，心情愉悦，感觉身体都轻快了些。',
      },
      {
        text: '看看热闹就好',
        effect: { love: 8 },
        resultText: '你在一旁为别人喝彩，旁边的人觉得你心态真好，多聊了几句。',
      },
    ],
  },
  {
    id: 'quarrel_1',
    type: 'quarrel',
    title: '😤 口角之争',
    description: '庙会人挤人，有人不小心撞了你一下，还反说你不长眼睛...',
    choices: [
      {
        text: '据理力争，讨个说法',
        effect: { career: 8, health: -10 },
        resultText: '你言辞犀利，说得对方哑口无言，但也气得肝疼。',
      },
      {
        text: '忍一时风平浪静',
        effect: { health: 5, love: 5 },
        resultText: '你选择退让，周围人都投来赞许的目光，心境平和。',
      },
      {
        text: '直接走人，懒得计较',
        effect: { wealth: -5, career: 3 },
        resultText: '你快步离开，不小心掉了点东西，但省下了时间。',
      },
    ],
  },
  {
    id: 'quarrel_2',
    type: 'quarrel',
    title: '🙄 小人谗言',
    description: '偶遇一个不太对付的熟人，对方话里有话地酸你...',
    choices: [
      {
        text: '微笑着怼回去',
        effect: { love: -8, career: 10 },
        resultText: '你四两拨千斤地反击，对方灰溜溜地走了，但也结下了梁子。',
      },
      {
        text: '左耳进右耳出',
        effect: { health: 8 },
        resultText: '你根本不往心里去，心态好得很，身体也舒畅。',
      },
      {
        text: '主动示好，化解矛盾',
        effect: { love: 12, wealth: -5 },
        resultText: '你主动递了杯热茶，对方有些不好意思，关系缓和了不少。',
      },
    ],
  },
  {
    id: 'noble_1',
    type: 'noble',
    title: '👴 贵人相助',
    description: '一位仙风道骨的老者叫住你，说与你有缘，愿赠你几句箴言...',
    choices: [
      {
        text: '虚心求教，洗耳恭听',
        effect: { career: 15 },
        resultText: '老者传授了你许多人生智慧，你顿觉豁然开朗，事业运大增！',
      },
      {
        text: '请教健康养生之道',
        effect: { health: 15 },
        resultText: '老者告诉你一个养生秘方，你如获至宝，身体似乎都轻盈了。',
      },
      {
        text: '询问姻缘感情',
        effect: { love: 15 },
        resultText: '老者掐指一算，说你的桃花运就要来了，你心花怒放！',
      },
    ],
  },
  {
    id: 'noble_2',
    type: 'noble',
    title: '🤝 旧友重逢',
    description: '人群中忽然有人拍你肩膀，回头一看竟是多年未见的老友！',
    choices: [
      {
        text: '邀对方一起逛庙会',
        effect: { love: 10, wealth: 5 },
        resultText: '老友相谈甚欢，对方还说最近有个赚钱的机会想带你一起。',
      },
      {
        text: '交换联系方式，以后再聚',
        effect: { career: 12 },
        resultText: '原来对方现在混得不错，说以后有机会可以合作。',
      },
      {
        text: '简单寒暄，匆匆告别',
        effect: { health: 8 },
        resultText: '虽然只是匆匆一面，但心情大好，感觉走路都带风。',
      },
    ],
  },
  {
    id: 'losemoney_1',
    type: 'loseMoney',
    title: '💸 破财消灾',
    description: '你摸口袋时发现钱包不见了！里面还有不少现金...',
    choices: [
      {
        text: '赶紧回去找',
        effect: { wealth: -15, health: -5 },
        resultText: '你急急忙忙往回跑，找了半天也没找到，又累又心疼。',
      },
      {
        text: '破财消灾，算了',
        effect: { wealth: -10, health: 5 },
        resultText: '你想开了，钱是身外之物，平安最重要，心情反而平静了。',
      },
      {
        text: '报警处理',
        effect: { wealth: -8, career: 8 },
        resultText: '虽然钱找不回来，但你冷静处理的态度让周围人刮目相看。',
      },
    ],
  },
  {
    id: 'losemoney_2',
    type: 'loseMoney',
    title: '🎰 赌坊失利',
    description: '经过一个赌坊，你忍不住进去试试手气，结果...',
    choices: [
      {
        text: '越输越想翻盘',
        effect: { wealth: -20, love: -5 },
        resultText: '你越赌越红眼，最后输得精光，连回家的钱都差点没了。',
      },
      {
        text: '小赌怡情，输了就走',
        effect: { wealth: -8, health: 3 },
        resultText: '你控制住了自己，虽然输了点钱，但就当买个乐子。',
      },
      {
        text: '及时止损，再也不碰',
        effect: { wealth: -5, career: 10 },
        resultText: '你深刻认识到赌博的危害，这份定力让你在事业上也受益。',
      },
    ],
  },
  {
    id: 'neutral_1',
    type: 'neutral',
    title: '🎐 寺庙祈福',
    description: '你来到一座古寺前，香火鼎盛，不少人在许愿...',
    choices: [
      {
        text: '诚心祈福，许下心愿',
        effect: { love: 8, health: 5 },
        resultText: '你虔诚地许下心愿，感觉心中充满了希望与力量。',
      },
      {
        text: '添点香油钱',
        effect: { wealth: -5, career: 8 },
        resultText: '你量力而行捐了些香火钱，心诚则灵，事业有转机。',
      },
      {
        text: '只是参观一下',
        effect: { health: 6 },
        resultText: '寺庙清幽的环境让你心神宁静，身体也得到了放松。',
      },
    ],
  },
  {
    id: 'neutral_2',
    type: 'neutral',
    title: '🍜 美食邂逅',
    description: '一阵香气飘来，原来是一家老字号小吃摊...',
    choices: [
      {
        text: '大吃一顿再说',
        effect: { wealth: -8, health: 8 },
        resultText: '美食下肚，心满意足，身体也得到了滋养。',
      },
      {
        text: '买一份打包带走',
        effect: { wealth: -5, love: 6 },
        resultText: '你想着带回去给家人尝尝，这份心意让感情升温。',
      },
      {
        text: '忍住，刚吃过饭',
        effect: { health: -3, career: 8 },
        resultText: '你展现了惊人的自制力，这份毅力用在事业上定有成就。',
      },
    ],
  },
  {
    id: 'neutral_3',
    type: 'neutral',
    title: '🎭 戏台看戏',
    description: '庙会上搭起了戏台，正在上演一出好戏...',
    choices: [
      {
        text: '坐下来好好欣赏',
        effect: { health: 5, love: 5 },
        resultText: '你看得入迷，心情愉悦，身心都得到了放松。',
      },
      {
        text: '站着看一会儿就走',
        effect: { career: 6 },
        resultText: '你从戏中悟出了一些道理，对事业有所启发。',
      },
      {
        text: '给戏班子捧场喝彩',
        effect: { love: 10, wealth: -3 },
        resultText: '你热情地鼓掌叫好，旁边的人都觉得你是个性情中人。',
      },
    ],
  },
  {
    id: 'neutral_4',
    type: 'neutral',
    title: '📿 算命先生',
    description: '路边一位算命先生招手示意你过去，说要给你算一卦...',
    choices: [
      {
        text: '算一卦试试',
        effect: { wealth: -6, career: 6 },
        resultText: '算命先生说了些似是而非的话，你却从中得到了启发。',
      },
      {
        text: '不信这些，婉拒',
        effect: { health: 8 },
        resultText: '你不迷信，但心情不错，脚步轻快。',
      },
      {
        text: '逗逗算命先生',
        effect: { love: 8, health: 3 },
        resultText: '你和算命先生谈笑风生，周围人都被你逗乐了。',
      },
    ],
  },
];

export const ENDING_TEXTS: Record<EndingType, { title: string; description: string }> = {
  wealth_peak: {
    title: '💰 财运亨通',
    description:
      '恭喜你！这趟庙会之行收获满满，财运达到了顶峰！新年伊始，财源滚滚而来，无论是正财还是偏财都旺得不行。记住，富贵不淫，方能长久。',
  },
  wealth_valley: {
    title: '💸 一贫如洗',
    description:
      '唉，这趟庙会走下来，钱包空空如也...不过破财消灾，钱财乃身外之物。塞翁失马焉知非福，说不定好运在后头呢！',
  },
  love_peak: {
    title: '💕 桃花泛滥',
    description:
      '恭喜你！桃花运爆棚！单身的很快就能遇到心仪的人，有伴的感情更加甜蜜。新的一年，爱情甜如蜜！',
  },
  love_valley: {
    title: '💔 情路坎坷',
    description:
      '感情路上似乎不太顺利...不过没关系，缘分天注定，该来的总会来。先好好爱自己，对的人正在赶来的路上。',
  },
  health_peak: {
    title: '💪 身强体健',
    description:
      '太棒了！身体状态达到了巅峰！精力充沛，百病不侵。新的一年，保持这份健康活力，去追逐更多可能吧！',
  },
  health_valley: {
    title: '🤒 体弱多病',
    description:
      '这阵子身体不太给力啊...记得好好休息，保重身体。身体是革命的本钱，等养好了精神，咱再大展宏图！',
  },
  career_peak: {
    title: '🚀 飞黄腾达',
    description:
      '恭喜恭喜！事业运势如日中天！升职加薪、创业成功、贵人相助...新的一年，事业版图将迎来大扩张！',
  },
  career_valley: {
    title: '📉 事业低谷',
    description:
      '事业上似乎遇到了瓶颈...不过没关系，低谷是为了更高的起飞。沉下心来积累实力，机会总是留给有准备的人。',
  },
  peaceful: {
    title: '🧧 平安顺遂',
    description:
      '平平淡淡才是真。走完庙会十二站，虽无大起大落，但一切都平平稳稳。平安就是最大的福气，新的一年，岁月静好。',
  },
};

export const FORTUNE_KEYS = ['wealth', 'love', 'health', 'career'] as const;

export const FORTUNE_LABELS: Record<string, string> = {
  wealth: '财',
  love: '情',
  health: '健',
  career: '业',
};

export const FORTUNE_COLORS: Record<string, string> = {
  wealth: '#D4AF37',
  love: '#E91E63',
  health: '#4CAF50',
  career: '#2196F3',
};

export const INITIAL_FORTUNE = {
  wealth: 50,
  love: 50,
  health: 50,
  career: 50,
};

export const NODE_COUNT = 12;

export const STORAGE_KEY = 'temple_fair_records';
