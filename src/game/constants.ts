import type { Zodiac, GameEvent, EndingType } from './types';

export const ZODIACS: Zodiac[] = [
  { id: 'rat', name: '鼠', emoji: '🐭', description: '机灵聪慧，财运亨通', bonus: { wealth: 10 } },
  { id: 'ox', name: '牛', emoji: '🐮', description: '勤劳踏实，事业有成', bonus: { career: 10 } },
  { id: 'tiger', name: '虎', emoji: '🐯', description: '勇猛威武，身强体健', bonus: { health: 10 } },
  { id: 'rabbit', name: '兔', emoji: '🐰', description: '温柔善良，桃花朵朵', bonus: { love: 10 } },
  { id: 'dragon', name: '龙', emoji: '🐲', description: '尊贵吉祥，全面发展', bonus: { wealth: 5, career: 5 } },
  { id: 'snake', name: '蛇', emoji: '🐍', description: '睿智沉稳，财运绵长', bonus: { wealth: 8, health: 2 } },
  { id: 'horse', name: '马', emoji: '🐴', description: '奔腾向前，事业腾飞', bonus: { career: 8, health: 2 } },
  { id: 'goat', name: '羊', emoji: '🐑', description: '温顺祥和，感情顺遂', bonus: { love: 8, health: 2 } },
  { id: 'monkey', name: '猴', emoji: '🐵', description: '聪明伶俐，左右逢源', bonus: { career: 5, love: 5 } },
  { id: 'rooster', name: '鸡', emoji: '🐔', description: '勤奋守时，财源广进', bonus: { wealth: 7, career: 3 } },
  { id: 'dog', name: '狗', emoji: '🐶', description: '忠诚可靠，贵人相助', bonus: { health: 7, love: 3 } },
  { id: 'pig', name: '猪', emoji: '🐷', description: '福气满满，一生富足', bonus: { wealth: 6, health: 4 } },
];

export const EVENTS: GameEvent[] = [
  // ===== 红包类事件 (redPacket) =====
  {
    id: 'redpacket_1',
    type: 'redPacket',
    title: '🧧 天降红包',
    description: '庙会入口处，一位长者正在派发新年红包，你走上前去...',
    rarity: 'common',
    choices: [
      { text: '恭敬接过，道谢离开', effect: { wealth: 12 }, resultText: '你双手接过红包，感受到沉甸甸的好运，财运上升！' },
      { text: '推辞一番，再收下', effect: { wealth: 8, love: 5 }, resultText: '你礼貌推辞，长者更觉你懂事，又多塞了几句祝福。' },
      { text: '坚决不收，转身就走', effect: { career: 10 }, resultText: '你坚守原则不为所动，长者暗暗点头，此子必成大器！' },
    ],
  },
  {
    id: 'redpacket_2',
    type: 'redPacket',
    title: '🎯 套圈中奖',
    description: '套圈摊位前围满了人，你手痒想试试手气...',
    rarity: 'common',
    choices: [
      { text: '买十个圈碰碰运气', effect: { wealth: 15 }, resultText: '你随手一扔，居然套中了最大的奖品！财运爆棚！' },
      { text: '只买三个圈意思一下', effect: { wealth: 5, health: 3 }, resultText: '你中了个小奖品，心情愉悦，感觉身体都轻快了些。' },
      { text: '看看热闹就好', effect: { love: 8 }, resultText: '你在一旁为别人喝彩，旁边的人觉得你心态真好，多聊了几句。' },
    ],
  },
  {
    id: 'redpacket_3',
    type: 'redPacket',
    title: '💰 捡钱奇遇',
    description: '低头走路时，你发现地上有一个鼓鼓的钱包...',
    rarity: 'uncommon',
    choices: [
      { text: '原地等待失主', effect: { career: 12, love: 5 }, resultText: '失主赶来对你千恩万谢，原来是位大老板，说以后有事尽管找他。' },
      { text: '交给庙会管理处', effect: { health: 8, career: 5 }, resultText: '工作人员连连称赞你品德高尚，你心情舒畅，脚步都轻快了。' },
      { text: '装进自己口袋', effect: { wealth: 18, health: -8 }, resultText: '你把钱收了起来，但心里总是惴惴不安，总觉得有人在看你。' },
    ],
  },
  {
    id: 'redpacket_4',
    type: 'redPacket',
    title: '🎁 抽奖大转盘',
    description: '商场门口有个新年大转盘，免费抽奖一次...',
    rarity: 'common',
    choices: [
      { text: '用力转到底', effect: { wealth: 10 }, resultText: '指针停在了「二等奖」，你获得了一个大红包！' },
      { text: '轻轻转一下意思意思', effect: { love: 7, wealth: 3 }, resultText: '转到了「桃花运」小奖，还附赠了一小份礼金。' },
      { text: '让旁边的小朋友帮你转', effect: { health: 6, wealth: 6 }, resultText: '小朋友咯咯笑着转了转盘，中了个「健康快乐」奖。' },
    ],
  },
  {
    id: 'redpacket_5',
    type: 'redPacket',
    title: '📱 微信摇一摇',
    description: '庙会有摇红包活动，你掏出手机准备试试...',
    rarity: 'common',
    choices: [
      { text: '拼命摇手机', effect: { wealth: 8, health: -3 }, resultText: '你摇得手都酸了，抢到了几个小红包，加起来还不少。' },
      { text: '慢悠悠摇几下', effect: { wealth: 4, love: 5 }, resultText: '你摇到了一个「新年祝福」红包，还加了个新朋友。' },
      { text: '不凑热闹', effect: { career: 7 }, resultText: '你把时间省下来观察人群，学到了不少东西。' },
    ],
  },

  // ===== 口舌类事件 (quarrel) =====
  {
    id: 'quarrel_1',
    type: 'quarrel',
    title: '😤 口角之争',
    description: '庙会人挤人，有人不小心撞了你一下，还反说你不长眼睛...',
    rarity: 'common',
    choices: [
      { text: '据理力争，讨个说法', effect: { career: 8, health: -10 }, resultText: '你言辞犀利，说得对方哑口无言，但也气得肝疼。' },
      { text: '忍一时风平浪静', effect: { health: 5, love: 5 }, resultText: '你选择退让，周围人都投来赞许的目光，心境平和。' },
      { text: '直接走人，懒得计较', effect: { wealth: -5, career: 3 }, resultText: '你快步离开，不小心掉了点东西，但省下了时间。' },
    ],
  },
  {
    id: 'quarrel_2',
    type: 'quarrel',
    title: '🙄 小人谗言',
    description: '偶遇一个不太对付的熟人，对方话里有话地酸你...',
    rarity: 'common',
    choices: [
      { text: '微笑着怼回去', effect: { love: -8, career: 10 }, resultText: '你四两拨千斤地反击，对方灰溜溜地走了，但也结下了梁子。' },
      { text: '左耳进右耳出', effect: { health: 8 }, resultText: '你根本不往心里去，心态好得很，身体也舒畅。' },
      { text: '主动示好，化解矛盾', effect: { love: 12, wealth: -5 }, resultText: '你主动递了杯热茶，对方有些不好意思，关系缓和了不少。' },
    ],
  },
  {
    id: 'quarrel_3',
    type: 'quarrel',
    title: '😡 插队风波',
    description: '排队买小吃时，有人居然插到了你前面...',
    rarity: 'common',
    choices: [
      { text: '大声喊出来制止', effect: { career: 7, love: -5 }, resultText: '你仗义执言，大家都支持你，但那个人对你怀恨在心。' },
      { text: '默默忍耐', effect: { health: -6, career: 3 }, resultText: '你忍了，但心里堵得慌，一整天都不太舒服。' },
      { text: '委婉提醒对方', effect: { love: 4, health: -2 }, resultText: '对方有些不好意思地排到了后面，还跟你道了歉。' },
    ],
  },
  {
    id: 'quarrel_4',
    type: 'quarrel',
    title: '💢 商家坑人',
    description: '买的东西缺斤短两，你回去找商家理论...',
    rarity: 'uncommon',
    choices: [
      { text: '不依不饶，要赔偿', effect: { wealth: 8, health: -5 }, resultText: '你据理力争，商家最终赔了你双倍的钱，但你也累得够呛。' },
      { text: '算了，自认倒霉', effect: { wealth: -8, health: 3 }, resultText: '你安慰自己破财消灾，心情很快就平复了。' },
      { text: '找市场管理处投诉', effect: { career: 10, wealth: -3 }, resultText: '你冷静地走流程投诉，管理员很欣赏你的办事方式。' },
    ],
  },
  {
    id: 'quarrel_5',
    type: 'quarrel',
    title: '😤 熊孩子捣乱',
    description: '一个熊孩子在你身边乱跑，差点把你手机撞掉...',
    rarity: 'common',
    choices: [
      { text: '大声训斥孩子', effect: { career: 5, love: -8 }, resultText: '孩子被你吓哭了，家长过来跟你大吵了一架。' },
      { text: '好言相劝家长管管', effect: { love: 5, health: -3 }, resultText: '家长有些不好意思，赶紧把孩子拉走了。' },
      { text: '自己躲开', effect: { health: 5 }, resultText: '你眼疾手快地闪开了，还顺便帮孩子挡了一下，免得他摔跤。' },
    ],
  },

  // ===== 贵人类事件 (noble) =====
  {
    id: 'noble_1',
    type: 'noble',
    title: '👴 贵人相助',
    description: '一位仙风道骨的老者叫住你，说与你有缘，愿赠你几句箴言...',
    rarity: 'rare',
    choices: [
      { text: '虚心求教，洗耳恭听', effect: { career: 15 }, resultText: '老者传授了你许多人生智慧，你顿觉豁然开朗，事业运大增！' },
      { text: '请教健康养生之道', effect: { health: 15 }, resultText: '老者告诉你一个养生秘方，你如获至宝，身体似乎都轻盈了。' },
      { text: '询问姻缘感情', effect: { love: 15 }, resultText: '老者掐指一算，说你的桃花运就要来了，你心花怒放！' },
    ],
  },
  {
    id: 'noble_2',
    type: 'noble',
    title: '🤝 旧友重逢',
    description: '人群中忽然有人拍你肩膀，回头一看竟是多年未见的老友！',
    rarity: 'uncommon',
    choices: [
      { text: '邀对方一起逛庙会', effect: { love: 10, wealth: 5 }, resultText: '老友相谈甚欢，对方还说最近有个赚钱的机会想带你一起。' },
      { text: '交换联系方式，以后再聚', effect: { career: 12 }, resultText: '原来对方现在混得不错，说以后有机会可以合作。' },
      { text: '简单寒暄，匆匆告别', effect: { health: 8 }, resultText: '虽然只是匆匆一面，但心情大好，感觉走路都带风。' },
    ],
  },
  {
    id: 'noble_3',
    type: 'noble',
    title: '🌟 偶遇大咖',
    description: '你居然在庙会上遇到了一位业界大佬...',
    rarity: 'rare',
    choices: [
      { text: '鼓起勇气搭话', effect: { career: 18, love: -3 }, resultText: '大佬居然很和蔼，跟你聊了几句还留了联系方式，你激动得不行！' },
      { text: '远远观察，不敢上前', effect: { career: 5, health: 3 }, resultText: '虽然没搭上话，但你观察到了很多细节，也算是收获。' },
      { text: '假装不认识擦肩而过', effect: { health: 6 }, resultText: '你保持了自己的节奏，心情平静，反而觉得很舒坦。' },
    ],
  },
  {
    id: 'noble_4',
    type: 'noble',
    title: '📚 良师益友',
    description: '逛书店时，一位儒雅的中年人跟你聊起了同一本书...',
    rarity: 'uncommon',
    choices: [
      { text: '深入交流心得体会', effect: { career: 10, love: 5 }, resultText: '你们聊得投机，对方邀你加入一个读书社群，结识了不少志同道合的朋友。' },
      { text: '礼貌地听对方说', effect: { career: 8 }, resultText: '对方的见解让你受益匪浅，很多困惑都解开了。' },
      { text: '借故离开', effect: { health: 4 }, resultText: '你不太习惯跟陌生人深聊，但也收获了几句话的启发。' },
    ],
  },
  {
    id: 'noble_5',
    type: 'noble',
    title: '🌸 桃花运',
    description: '转角处，一个气质出众的人对你微笑了一下...',
    rarity: 'uncommon',
    choices: [
      { text: '主动上前搭讪', effect: { love: 18, wealth: -5 }, resultText: '你鼓起勇气搭话，对方居然很感兴趣，你们聊了很久还约了下次见面！' },
      { text: '回以微笑，擦肩而过', effect: { love: 8, health: 3 }, resultText: '虽然只是一面之缘，但那微笑让你一整天心情都很好。' },
      { text: '假装没看见', effect: { career: 6 }, resultText: '你克制住了自己的心思，专心做自己的事，效率反而提高了。' },
    ],
  },

  // ===== 破财类事件 (loseMoney) =====
  {
    id: 'losemoney_1',
    type: 'loseMoney',
    title: '💸 破财消灾',
    description: '你摸口袋时发现钱包不见了！里面还有不少现金...',
    rarity: 'common',
    choices: [
      { text: '赶紧回去找', effect: { wealth: -15, health: -5 }, resultText: '你急急忙忙往回跑，找了半天也没找到，又累又心疼。' },
      { text: '破财消灾，算了', effect: { wealth: -10, health: 5 }, resultText: '你想开了，钱是身外之物，平安最重要，心情反而平静了。' },
      { text: '报警处理', effect: { wealth: -8, career: 8 }, resultText: '虽然钱找不回来，但你冷静处理的态度让周围人刮目相看。' },
    ],
  },
  {
    id: 'losemoney_2',
    type: 'loseMoney',
    title: '🎰 赌坊失利',
    description: '经过一个赌坊，你忍不住进去试试手气，结果...',
    rarity: 'common',
    choices: [
      { text: '越输越想翻盘', effect: { wealth: -20, love: -5 }, resultText: '你越赌越红眼，最后输得精光，连回家的钱都差点没了。' },
      { text: '小赌怡情，输了就走', effect: { wealth: -8, health: 3 }, resultText: '你控制住了自己，虽然输了点钱，但就当买个乐子。' },
      { text: '及时止损，再也不碰', effect: { wealth: -5, career: 10 }, resultText: '你深刻认识到赌博的危害，这份定力让你在事业上也受益。' },
    ],
  },
  {
    id: 'losemoney_3',
    type: 'loseMoney',
    title: '🛍️ 冲动消费',
    description: '看到一个特别喜欢的东西，但价格不菲...',
    rarity: 'common',
    choices: [
      { text: '咬牙买下来', effect: { wealth: -15, love: 5, health: 3 }, resultText: '虽然花了不少钱，但你爱不释手，心情超级好！' },
      { text: '犹豫一下，还是算了', effect: { wealth: 5, health: -2 }, resultText: '你忍住了冲动，但心里总有点痒痒的。' },
      { text: '理性分析后决定不买', effect: { career: 8, wealth: 3 }, resultText: '你展现了超强的自制力，这种品质在事业上很有帮助。' },
    ],
  },
  {
    id: 'losemoney_4',
    type: 'loseMoney',
    title: '🤕 意外受伤',
    description: '走路不小心崴了脚，需要去医馆看看...',
    rarity: 'uncommon',
    choices: [
      { text: '去大医院好好检查', effect: { wealth: -18, health: 5 }, resultText: '花了不少钱检查，好在没什么大事，安心了。' },
      { text: '找个小诊所随便看看', effect: { wealth: -8, health: -3 }, resultText: '省了点钱，但总觉得不太放心，恢复得也慢。' },
      { text: '自己撑着不去看', effect: { wealth: 0, health: -10, career: -3 }, resultText: '你硬扛着，结果越来越严重，耽误了不少事。' },
    ],
  },
  {
    id: 'losemoney_5',
    type: 'loseMoney',
    title: '💳 被宰客',
    description: '吃饭时发现账单贵得离谱，明显被宰了...',
    rarity: 'common',
    choices: [
      { text: '跟老板理论', effect: { wealth: -5, health: -5, career: 5 }, resultText: '吵了半天只免了一点，还把心情搞坏了，但你维护了自己的权益。' },
      { text: '认栽付钱走人', effect: { wealth: -12, health: -3 }, resultText: '你不想惹事，但心里很不爽，连饭都没吃好。' },
      { text: '拍照留证，事后投诉', effect: { wealth: -10, career: 8 }, resultText: '你冷静地收集证据，事后投诉成功挽回了损失，也学到了维权知识。' },
    ],
  },

  // ===== 平常类事件 (neutral) =====
  {
    id: 'neutral_1',
    type: 'neutral',
    title: '🎐 寺庙祈福',
    description: '你来到一座古寺前，香火鼎盛，不少人在许愿...',
    rarity: 'common',
    choices: [
      { text: '诚心祈福，许下心愿', effect: { love: 8, health: 5 }, resultText: '你虔诚地许下心愿，感觉心中充满了希望与力量。' },
      { text: '添点香油钱', effect: { wealth: -5, career: 8 }, resultText: '你量力而行捐了些香火钱，心诚则灵，事业有转机。' },
      { text: '只是参观一下', effect: { health: 6 }, resultText: '寺庙清幽的环境让你心神宁静，身体也得到了放松。' },
    ],
  },
  {
    id: 'neutral_2',
    type: 'neutral',
    title: '🍜 美食邂逅',
    description: '一阵香气飘来，原来是一家老字号小吃摊...',
    rarity: 'common',
    choices: [
      { text: '大吃一顿再说', effect: { wealth: -8, health: 8 }, resultText: '美食下肚，心满意足，身体也得到了滋养。' },
      { text: '买一份打包带走', effect: { wealth: -5, love: 6 }, resultText: '你想着带回去给家人尝尝，这份心意让感情升温。' },
      { text: '忍住，刚吃过饭', effect: { health: -3, career: 8 }, resultText: '你展现了惊人的自制力，这份毅力用在事业上定有成就。' },
    ],
  },
  {
    id: 'neutral_3',
    type: 'neutral',
    title: '🎭 戏台看戏',
    description: '庙会上搭起了戏台，正在上演一出好戏...',
    rarity: 'common',
    choices: [
      { text: '坐下来好好欣赏', effect: { health: 5, love: 5 }, resultText: '你看得入迷，心情愉悦，身心都得到了放松。' },
      { text: '站着看一会儿就走', effect: { career: 6 }, resultText: '你从戏中悟出了一些道理，对事业有所启发。' },
      { text: '给戏班子捧场喝彩', effect: { love: 10, wealth: -3 }, resultText: '你热情地鼓掌叫好，旁边的人都觉得你是个性情中人。' },
    ],
  },
  {
    id: 'neutral_4',
    type: 'neutral',
    title: '📿 算命先生',
    description: '路边一位算命先生招手示意你过去，说要给你算一卦...',
    rarity: 'common',
    choices: [
      { text: '算一卦试试', effect: { wealth: -6, career: 6 }, resultText: '算命先生说了些似是而非的话，你却从中得到了启发。' },
      { text: '不信这些，婉拒', effect: { health: 8 }, resultText: '你不迷信，但心情不错，脚步轻快。' },
      { text: '逗逗算命先生', effect: { love: 8, health: 3 }, resultText: '你和算命先生谈笑风生，周围人都被你逗乐了。' },
    ],
  },
  {
    id: 'neutral_5',
    type: 'neutral',
    title: '🎐 花灯展览',
    description: '各式各样的花灯琳琅满目，美不胜收...',
    rarity: 'uncommon',
    choices: [
      { text: '慢慢欣赏每一盏灯', effect: { health: 7, love: 4 }, resultText: '精美的花灯让你心旷神怡，脚步也慢了下来。' },
      { text: '买一个花灯带走', effect: { wealth: -5, love: 7 }, resultText: '你挑了一个最喜欢的花灯，提着它逛庙会，回头率超高。' },
      { text: '拍照打卡发朋友圈', effect: { love: 9, career: 2 }, resultText: '你拍了好多美照，收获了一堆赞，还有人私信问你在哪。' },
    ],
  },
  {
    id: 'neutral_6',
    type: 'neutral',
    title: '🎪 街头卖艺',
    description: '一群艺人在街头表演，引来阵阵喝彩...',
    rarity: 'common',
    choices: [
      { text: '停下看完整场表演', effect: { health: 4, love: 6 }, resultText: '精彩的表演让你大开眼界，心情愉悦。' },
      { text: '打赏几个铜板', effect: { wealth: -3, love: 8 }, resultText: '你慷慨解囊，艺人连连道谢，你也觉得很开心。' },
      { text: '匆匆路过', effect: { career: 5 }, resultText: '你没有停留，把时间用在了更有意义的事情上。' },
    ],
  },
  {
    id: 'neutral_7',
    type: 'neutral',
    title: '🍵 茶馆小憩',
    description: '走累了，路边有个茶馆可以歇歇脚...',
    rarity: 'common',
    choices: [
      { text: '点壶好茶慢慢品', effect: { wealth: -5, health: 8 }, resultText: '一杯热茶下肚，浑身舒坦，疲劳一扫而空。' },
      { text: '跟茶客聊聊天', effect: { love: 8, career: 4 }, resultText: '你跟旁边的茶客聊得投机，还交换了不少信息。' },
      { text: '就坐一会儿歇脚', effect: { health: 5 }, resultText: '你闭目养神了一会儿，精力恢复了不少。' },
    ],
  },

  // ===== 生肖专属事件（第一系列） =====
  {
    id: 'zodiac_rat_special_1',
    type: 'redPacket',
    title: '🐭 鼠年奇遇·粮仓探秘',
    description: '你发现了一条隐蔽的小巷，里面似乎藏着什么宝贝...',
    rarity: 'rare',
    zodiacExclusive: ['rat'],
    choices: [
      { text: '小心翼翼地探索', effect: { wealth: 20, career: 5 }, resultText: '你发挥了属鼠人的机敏，发现了一个被遗忘的钱袋！财运大发！' },
      { text: '先观察一下再说', effect: { wealth: 10, health: 5 }, resultText: '你谨慎地观察了一番，找到了一些散落在地上的铜钱。' },
      { text: '太可疑了，不去', effect: { career: 8, health: 3 }, resultText: '你警惕性很高，没有冒险，这份谨慎在事业上很有帮助。' },
    ],
  },
  {
    id: 'zodiac_ox_special_1',
    type: 'noble',
    title: '🐮 牛年奇遇·农夫赠礼',
    description: '一位老农看你气质不凡，说要送你一件祖传的宝贝...',
    rarity: 'rare',
    zodiacExclusive: ['ox'],
    choices: [
      { text: '恭敬收下，千恩万谢', effect: { wealth: 15, career: 10 }, resultText: '老农送了你一本失传的耕作秘籍，你的事业运大幅提升！' },
      { text: '坚持要给钱买下', effect: { wealth: -5, career: 15 }, resultText: '老农更欣赏你的品格，把宝贝和手艺都传给了你。' },
      { text: '婉言谢绝', effect: { health: 10, love: 8 }, resultText: '老农觉得你品格高尚，跟你聊了很多养生之道。' },
    ],
  },
  {
    id: 'zodiac_tiger_special_1',
    type: 'noble',
    title: '🐯 虎年奇遇·山君点化',
    description: '山林间，你仿佛看到了一只吊睛白额大虫，但它似乎没有恶意...',
    rarity: 'rare',
    zodiacExclusive: ['tiger'],
    choices: [
      { text: '与它对视，毫不畏惧', effect: { health: 20, career: 5 }, resultText: '大虫（其实是山神化身）点了点头，赐予你强健的体魄！' },
      { text: '缓缓后退，保持敬意', effect: { health: 12, love: 5 }, resultText: '你表现出的尊重让它很满意，赐予你充沛的精力。' },
      { text: '转身就跑', effect: { health: 5, wealth: 5 }, resultText: '虽然有点狼狈，但你激发了潜能，跑得飞快还捡到了钱。' },
    ],
  },
  {
    id: 'zodiac_rabbit_special_1',
    type: 'noble',
    title: '🐰 兔年奇遇·月宫使者',
    description: '月光下，一只白玉般的兔子向你走来，口中叼着一封信...',
    rarity: 'rare',
    zodiacExclusive: ['rabbit'],
    choices: [
      { text: '接过信仔细阅读', effect: { love: 20, health: 3 }, resultText: '信中记载着增进感情的秘法，你的桃花运直接爆棚！' },
      { text: '轻轻抚摸玉兔', effect: { love: 12, health: 8 }, resultText: '玉兔柔顺地靠在你身边，你感觉整个人都温柔了许多。' },
      { text: '不敢相信，掐自己一下', effect: { love: 8, wealth: 5 }, resultText: '虽然像是幻觉，但你口袋里莫名多了几颗桂花糖。' },
    ],
  },
  {
    id: 'zodiac_dragon_special_1',
    type: 'noble',
    title: '🐲 龙年奇遇·龙珠现世',
    description: '天空中祥云聚集，一颗璀璨的龙珠向你飞来...',
    rarity: 'rare',
    zodiacExclusive: ['dragon'],
    choices: [
      { text: '张开双臂迎接', effect: { wealth: 12, career: 12 }, resultText: '龙珠融入你的身体，财运和事业运同时大涨！真命天子！' },
      { text: '跪下叩拜接福', effect: { wealth: 8, career: 8, health: 5 }, resultText: '你的虔诚感动了龙神，各项运势都有提升。' },
      { text: '这是幻觉吧？', effect: { career: 15 }, resultText: '虽然你半信半疑，但脑子里莫名多了很多事业上的灵感。' },
    ],
  },
  {
    id: 'zodiac_snake_special_1',
    type: 'noble',
    title: '🐍 蛇年奇遇·白蛇报恩',
    description: '一条白蛇挡住了你的去路，但它似乎是来报恩的...',
    rarity: 'rare',
    zodiacExclusive: ['snake'],
    choices: [
      { text: '听它把话说完', effect: { wealth: 18, health: 5 }, resultText: '白蛇告诉你一个生财之道，还传授了养生秘诀。' },
      { text: '有点害怕，但还是听着', effect: { wealth: 10, health: 10 }, resultText: '虽然有点紧张，但你获得了财富和健康双重祝福。' },
      { text: '绕道而行', effect: { health: 8, career: 6 }, resultText: '你没有贪求，但白蛇的祝福还是悄悄降临了。' },
    ],
  },
  {
    id: 'zodiac_horse_special_1',
    type: 'noble',
    title: '🐴 马年奇遇·千里神驹',
    description: '一匹神骏的天马出现在你面前，示意你骑上去...',
    rarity: 'rare',
    zodiacExclusive: ['horse'],
    choices: [
      { text: '翻身上马，驰骋天际', effect: { career: 20, health: 5 }, resultText: '你骑着天马飞越山河，事业格局大开，前途无量！' },
      { text: '轻抚马头，表达敬意', effect: { career: 12, health: 8 }, resultText: '神驹与你心意相通，你的事业和身体都得到了加持。' },
      { text: '不敢骑，太危险了', effect: { health: 5, career: 8 }, resultText: '虽然没有骑乘，但你也学到了一些勇往直前的精神。' },
    ],
  },
  {
    id: 'zodiac_goat_special_1',
    type: 'noble',
    title: '🐑 羊年奇遇·仙草献瑞',
    description: '一只口衔灵芝的仙羊出现在你面前，似乎要把灵芝送给你...',
    rarity: 'rare',
    zodiacExclusive: ['goat'],
    choices: [
      { text: '开心地接受礼物', effect: { health: 18, love: 5 }, resultText: '灵芝果然是仙草，你感觉浑身清爽，百病不侵！' },
      { text: '先谢过再收下', effect: { health: 12, love: 10 }, resultText: '你彬彬有礼的态度让仙羊很满意，健康和感情双丰收。' },
      { text: '太贵重了，不能收', effect: { love: 15, health: 3 }, resultText: '你推辞不受，仙羊觉得你品德高尚，反而赐下更多祝福。' },
    ],
  },
  {
    id: 'zodiac_monkey_special_1',
    type: 'neutral',
    title: '🐵 猴年奇遇·仙桃大会',
    description: '一群猴子邀请你参加它们的仙桃大会...',
    rarity: 'rare',
    zodiacExclusive: ['monkey'],
    choices: [
      { text: '开心地加入它们', effect: { health: 15, love: 8 }, resultText: '你和猴子们玩得不亦乐乎，还吃了仙桃，身体倍儿棒！' },
      { text: '跟它们学几招', effect: { career: 12, health: 6 }, resultText: '你从猴子那里学到了灵活应变的本事，事业更上一层楼。' },
      { text: '礼貌谢绝', effect: { career: 8, love: 6 }, resultText: '你保持了自己的风度，猴子们反而对你更尊敬了。' },
    ],
  },
  {
    id: 'zodiac_rooster_special_1',
    type: 'redPacket',
    title: '🐔 鸡年奇遇·金鸡报晓',
    description: '一只金光闪闪的公鸡在你面前打鸣，声音震耳欲聋...',
    rarity: 'rare',
    zodiacExclusive: ['rooster'],
    choices: [
      { text: '跟着一起晨练', effect: { wealth: 10, career: 12 }, resultText: '金鸡报晓带来了财运和事业运，勤奋的人运气都不会太差！' },
      { text: '仔细观察金鸡', effect: { wealth: 15, health: 3 }, resultText: '你从金鸡身上悟出了生财之道，财运大涨！' },
      { text: '捂耳朵躲远点', effect: { wealth: 5, health: 5 }, resultText: '虽然有点吵，但你还是沾了点金气。' },
    ],
  },
  {
    id: 'zodiac_dog_special_1',
    type: 'noble',
    title: '🐶 狗年奇遇·天狗护佑',
    description: '一只威风凛凛的天狗出现在你面前，它似乎认识你...',
    rarity: 'rare',
    zodiacExclusive: ['dog'],
    choices: [
      { text: '上前摸摸它的头', effect: { health: 15, love: 10 }, resultText: '天狗亲昵地蹭蹭你，赐予你健康和好人缘。' },
      { text: '问它有什么事', effect: { career: 10, health: 10 }, resultText: '天狗叼来一封信，里面是对你事业和健康的忠告。' },
      { text: '有点害怕，慢慢退开', effect: { health: 8, love: 5 }, resultText: '你虽然有点怕，但天狗还是默默守护着你。' },
    ],
  },
  {
    id: 'zodiac_pig_special_1',
    type: 'redPacket',
    title: '🐷 猪年奇遇·福气满满',
    description: '一只圆滚滚的福猪向你走来，身上挂满了红包...',
    rarity: 'rare',
    zodiacExclusive: ['pig'],
    choices: [
      { text: '开心地抱抱它', effect: { wealth: 15, health: 10 }, resultText: '福猪把满满的福气都传给了你，财运健康双丰收！' },
      { text: '收下它的红包', effect: { wealth: 20, love: 3 }, resultText: '红包里居然有好多钱！你今天财运爆棚！' },
      { text: '给它喂点吃的', effect: { wealth: 8, love: 10, health: 5 }, resultText: '你的善良感动了福猪，各项运势都有提升。' },
    ],
  },

  // ===== 生肖专属事件（第二系列·庙会特色） =====
  {
    id: 'zodiac_rat_special_2',
    type: 'neutral',
    title: '🐭 鼠年奇遇·地道探险',
    description: '你发现庙会地下有一条古老的通道，似乎通向某处秘境...',
    rarity: 'rare',
    zodiacExclusive: ['rat'],
    choices: [
      { text: '钻进去一探究竟', effect: { wealth: 18, health: -3 }, resultText: '你在地道深处发现了古人藏的财宝！虽然灰头土脸但收获满满。' },
      { text: '在入口看看就行', effect: { wealth: 8, career: 5 }, resultText: '你在入口处捡到了几枚古币，还了解了不少历史知识。' },
      { text: '太窄了，不去', effect: { career: 10, health: 3 }, resultText: '你克制住了好奇心，这种定力在事业上很有帮助。' },
    ],
  },
  {
    id: 'zodiac_ox_special_2',
    type: 'neutral',
    title: '🐮 牛年奇遇·耕读传家',
    description: '庙会中有个「耕读传家」的展台，一位老秀才邀你切磋学问...',
    rarity: 'rare',
    zodiacExclusive: ['ox'],
    choices: [
      { text: '虚心请教，认真学习', effect: { career: 18, wealth: -3 }, resultText: '老秀才传授了你很多做人做事的道理，事业运大幅提升！' },
      { text: '跟对方探讨交流', effect: { career: 10, love: 5 }, resultText: '你们谈得投机，老秀才很欣赏你的才学和人品。' },
      { text: '婉言谢绝，继续逛', effect: { health: 5, wealth: 3 }, resultText: '你选择了放松身心，庙会之旅更加惬意。' },
    ],
  },
  {
    id: 'zodiac_tiger_special_2',
    type: 'quarrel',
    title: '🐯 虎年奇遇·路见不平',
    description: '你看到几个恶霸在欺负一个小贩...',
    rarity: 'rare',
    zodiacExclusive: ['tiger'],
    choices: [
      { text: '挺身而出，仗义执言', effect: { career: 15, love: 8, health: -5 }, resultText: '你威武霸气地震慑住了恶霸，周围人纷纷叫好！但也受了点小伤。' },
      { text: '暗中报官求助', effect: { career: 10, health: 3 }, resultText: '你冷静地找来了官差，既解决了问题又保护了自己。' },
      { text: '多一事不如少一事', effect: { health: 8, wealth: -3 }, resultText: '你选择了明哲保身，但心里总有点过意不去。' },
    ],
  },
  {
    id: 'zodiac_rabbit_special_2',
    type: 'neutral',
    title: '🐰 兔年奇遇·药圃仙缘',
    description: '你误入一片药草园，一位慈祥的老药师正在采药...',
    rarity: 'rare',
    zodiacExclusive: ['rabbit'],
    choices: [
      { text: '帮老人一起采药', effect: { health: 18, love: 5 }, resultText: '老人传授了你很多养生知识，还送了你滋补的药材。' },
      { text: '请教养生之道', effect: { health: 12, career: 5 }, resultText: '药师告诉你很多保养身体的秘诀，让你受益终身。' },
      { text: '道声打扰就离开', effect: { love: 10, health: 3 }, resultText: '你彬彬有礼的态度让老人很有好感，还送了你一小包花草茶。' },
    ],
  },
  {
    id: 'zodiac_dragon_special_2',
    type: 'redPacket',
    title: '🐲 龙年奇遇·龙宫宝藏',
    description: '庙会上的喷泉水池忽然金光闪闪，池底似乎有什么宝物...',
    rarity: 'rare',
    zodiacExclusive: ['dragon'],
    choices: [
      { text: '伸手去捞', effect: { wealth: 20, health: -2 }, resultText: '你捞出了一个金光闪闪的宝物！价值连城！' },
      { text: '仔细观察再说', effect: { wealth: 10, career: 8 }, resultText: '你观察了一会儿，发现了寻宝的规律，收获不少。' },
      { text: '这是幻觉吧？', effect: { career: 12 }, resultText: '虽然没去捞，但你从这异象中悟出了事业发展的道理。' },
    ],
  },
  {
    id: 'zodiac_snake_special_2',
    type: 'loseMoney',
    title: '🐍 蛇年奇遇·歧路抉择',
    description: '你遇到了两条岔路，一条看起来安全但绕远，一条近但似乎有危险...',
    rarity: 'rare',
    zodiacExclusive: ['snake'],
    choices: [
      { text: '选近路，抄小道', effect: { wealth: 8, health: -8, career: 5 }, resultText: '虽然差点遇到危险，但你反应快躲过了，还省了不少时间。' },
      { text: '走远路，求平安', effect: { health: 5, wealth: -5, love: 3 }, resultText: '虽然多花了点时间和钱，但你在路上遇到了有趣的人。' },
      { text: '先观察再决定', effect: { career: 10, wealth: 3 }, resultText: '你仔细分析后做出了最优选择，效率和安全兼顾。' },
    ],
  },
  {
    id: 'zodiac_horse_special_2',
    type: 'redPacket',
    title: '🐴 马年奇遇·赛马夺魁',
    description: '庙会有赛马活动，冠军奖品丰厚...',
    rarity: 'rare',
    zodiacExclusive: ['horse'],
    choices: [
      { text: '报名参加比赛', effect: { wealth: 18, career: 8 }, resultText: '你策马奔腾，一举夺魁！名利双收！' },
      { text: '先去看看再说', effect: { wealth: 5, career: 5 }, resultText: '你观察了比赛，学到了不少技巧，还小赢了一点赌注。' },
      { text: '不感兴趣', effect: { health: 8, love: 5 }, resultText: '你去别处逛了，反而遇到了聊得来的朋友。' },
    ],
  },
  {
    id: 'zodiac_goat_special_2',
    type: 'noble',
    title: '🐑 羊年奇遇·三羊开泰',
    description: '你遇到了三位慈祥的老者，他们自称「三阳老人」，说要送你祝福...',
    rarity: 'rare',
    zodiacExclusive: ['goat'],
    choices: [
      { text: '恭敬地接受祝福', effect: { health: 15, love: 10 }, resultText: '三位老人的祝福让你身心舒畅，人缘也好了起来。' },
      { text: '请他们指点迷津', effect: { career: 12, health: 8 }, resultText: '老人们的人生智慧让你茅塞顿开，事业和健康都受益。' },
      { text: '有点怀疑，婉拒了', effect: { love: 8, wealth: 5 }, resultText: '虽然没接受祝福，但你的礼貌让老人很满意，临走送了你小礼物。' },
    ],
  },
  {
    id: 'zodiac_monkey_special_2',
    type: 'quarrel',
    title: '🐵 猴年奇遇·智斗刁民',
    description: '有个狡诈的商贩想骗你买假货...',
    rarity: 'rare',
    zodiacExclusive: ['monkey'],
    choices: [
      { text: '将计就计，反将一军', effect: { wealth: 15, love: -5, career: 8 }, resultText: '你机智地揭穿了骗局，还让商贩吃了苦头，周围人拍手称快！' },
      { text: '委婉提醒，好言相劝', effect: { love: 8, career: 6 }, resultText: '你巧妙地让商贩意识到自己的问题，对方还挺感激你的。' },
      { text: '不买就是了', effect: { health: 5, wealth: 3 }, resultText: '你懒得计较，转身去了别的摊位，还捡了个小便宜。' },
    ],
  },
  {
    id: 'zodiac_rooster_special_2',
    type: 'neutral',
    title: '🐔 鸡年奇遇·闻鸡起舞',
    description: '清晨的庙会，有位老者在练剑，招式行云流水...',
    rarity: 'rare',
    zodiacExclusive: ['rooster'],
    choices: [
      { text: '上前请教，跟着学', effect: { health: 15, career: 8 }, resultText: '你跟着老者练了一套剑法，神清气爽，还领悟了不少人生哲理。' },
      { text: '在一旁观摩学习', effect: { health: 8, career: 5 }, resultText: '你认真地看着，学到了不少招式和心法。' },
      { text: '太早了，再睡会儿', effect: { health: 3, wealth: 5 }, resultText: '你选择了多休息一会儿，养足了精神。' },
    ],
  },
  {
    id: 'zodiac_dog_special_2',
    type: 'loseMoney',
    title: '🐶 狗年奇遇·忠犬救主',
    description: '一只流浪狗突然冲着你狂叫，似乎在警告你什么...',
    rarity: 'rare',
    zodiacExclusive: ['dog'],
    choices: [
      { text: '相信狗狗，停下来', effect: { wealth: -5, health: 12, love: 8 }, resultText: '你刚停下，前方就掉下一块招牌！狗狗救了你！你收养了它。' },
      { text: '看看怎么回事', effect: { health: 8, love: 5 }, resultText: '你警惕地观察，发现了危险，及时避开了。' },
      { text: '讨厌，赶走它', effect: { health: -5, wealth: 3 }, resultText: '你赶走了狗狗，结果受了点小伤，有些后悔。' },
    ],
  },
  {
    id: 'zodiac_pig_special_2',
    type: 'neutral',
    title: '🐷 猪年奇遇·美食奇缘',
    description: '你循着香味来到一家小吃摊，老板居然是位御厨传人！',
    rarity: 'rare',
    zodiacExclusive: ['pig'],
    choices: [
      { text: '每样都来一份', effect: { wealth: -10, health: 15, love: 5 }, resultText: '美味佳肴让你大快朵颐，还跟老板成了朋友！' },
      { text: '点招牌菜尝尝', effect: { wealth: -5, health: 10, love: 3 }, resultText: '招牌菜果然名不虚传，你吃得心满意足。' },
      { text: '请教做菜秘诀', effect: { career: 8, health: 8 }, resultText: '老板传授了你几道家常菜做法，以后自己动手丰衣足食。' },
    ],
  },

  // ===== 更多普通事件 =====
  {
    id: 'redpacket_6',
    type: 'redPacket',
    title: '🧧 春联大赛',
    description: '庙会举办写春联大赛，获奖者有红包奖励...',
    rarity: 'common',
    choices: [
      { text: '报名参加', effect: { career: 10, wealth: 5 }, resultText: '你写的春联获得了好评，拿到了奖励还涨了名声！' },
      { text: '当观众看看热闹', effect: { love: 5, health: 3 }, resultText: '你欣赏了不少好作品，还认识了几个兴趣相投的朋友。' },
      { text: '不感兴趣', effect: { wealth: 3, career: 3 }, resultText: '你去别处逛了，时间用在了更有意义的事情上。' },
    ],
  },
  {
    id: 'redpacket_7',
    type: 'redPacket',
    title: '🎊 新年礼物交换',
    description: '有人在组织新年礼物交换活动...',
    rarity: 'common',
    choices: [
      { text: '准备礼物参加', effect: { love: 10, wealth: -3 }, resultText: '你换到了一份很有心意的礼物，还认识了新朋友。' },
      { text: '在旁边看看', effect: { love: 5, health: 3 }, resultText: '看着大家交换礼物，你也感受到了节日的快乐。' },
      { text: '没啥意思', effect: { career: 5, wealth: 3 }, resultText: '你把时间花在了自己的事情上，也挺充实。' },
    ],
  },
  {
    id: 'quarrel_6',
    type: 'quarrel',
    title: '😤 丢东西疑云',
    description: '有人说你拿了他的东西，周围人都看了过来...',
    rarity: 'uncommon',
    choices: [
      { text: '自证清白，据理力争', effect: { career: 8, love: -3 }, resultText: '你冷静地证明了自己的清白，但也让对方有些下不来台。' },
      { text: '配合检查，清者自清', effect: { love: 5, health: -2 }, resultText: '虽然有点委屈，但最后真相大白，大家都觉得你人品好。' },
      { text: '直接走人，懒得解释', effect: { career: -3, health: 3 }, resultText: '你不想浪费时间，但总有些人会在背后议论你。' },
    ],
  },
  {
    id: 'noble_6',
    type: 'noble',
    title: '📖 秘籍残卷',
    description: '你在旧书摊上发现了一本破旧的秘籍，看起来有些年头了...',
    rarity: 'uncommon',
    choices: [
      { text: '买下来研究', effect: { career: 12, wealth: -6 }, resultText: '你花了不少钱买下，但里面的内容让你受益匪浅！' },
      { text: '翻翻看再说', effect: { career: 6, wealth: -2 }, resultText: '你翻了翻，学到了一些有用的知识。' },
      { text: '肯定是假的', effect: { wealth: 2, career: 2 }, resultText: '你没有上当，把钱省了下来。' },
    ],
  },
  {
    id: 'losemoney_6',
    type: 'loseMoney',
    title: '🎁 人情往来',
    description: '遇到好久不见的远房亲戚，似乎要给你家小孩发红包...',
    rarity: 'common',
    choices: [
      { text: '热情寒暄，礼尚往来', effect: { love: 10, wealth: -8 }, resultText: '你们聊得很开心，虽然花了点钱，但亲情更浓了。' },
      { text: '礼貌地拒绝', effect: { wealth: 2, love: -3 }, resultText: '你客气地拒绝了，但对方好像有点不高兴。' },
      { text: '假装没看见', effect: { wealth: 0, love: -5 }, resultText: '你躲开了，但对方好像看到你了，有点尴尬。' },
    ],
  },
  {
    id: 'neutral_8',
    type: 'neutral',
    title: '🎆 烟花表演',
    description: '晚上的烟花表演开始了，绚丽多彩...',
    rarity: 'common',
    choices: [
      { text: '找个好位置欣赏', effect: { health: 6, love: 6 }, resultText: '美丽的烟花让你心情大好，身边的人也都很开心。' },
      { text: '拍照发朋友圈', effect: { love: 8, career: 2 }, resultText: '你拍了好多美照，收获了一堆赞。' },
      { text: '人太多，挤不进去', effect: { health: 3, career: 4 }, resultText: '虽然没看到烟花，但你利用时间做了点别的事。' },
    ],
  },
  {
    id: 'neutral_9',
    type: 'neutral',
    title: '🥟 包饺子比赛',
    description: '庙会有包饺子比赛，大家都玩得很开心...',
    rarity: 'common',
    choices: [
      { text: '踊跃报名参加', effect: { love: 10, health: 3 }, resultText: '你包的饺子虽然不太好看，但大家一起玩得很开心！' },
      { text: '在旁边学习', effect: { health: 5, love: 3 }, resultText: '你学会了包饺子，以后可以自己做了。' },
      { text: '等着吃就好', effect: { health: 8, wealth: -3 }, resultText: '你买了一些现成的饺子，味道还不错。' },
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
