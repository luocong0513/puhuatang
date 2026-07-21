// 五行数据与逻辑

export type WuXingElement = '木' | '火' | '土' | '金' | '水';

export interface WuXingProfile {
  element: WuXingElement;
  organ: string;
  emotion: string;
  season: string;
  color: string;
  taste: string;
  direction: string;
}

export const wuXingData: Record<WuXingElement, WuXingProfile> = {
  '木': {
    element: '木',
    organ: '肝·胆',
    emotion: '怒',
    season: '春',
    color: '青',
    taste: '酸',
    direction: '东',
  },
  '火': {
    element: '火',
    organ: '心·小肠',
    emotion: '喜',
    season: '夏',
    color: '赤',
    taste: '苦',
    direction: '南',
  },
  '土': {
    element: '土',
    organ: '脾·胃',
    emotion: '思',
    season: '长夏',
    color: '黄',
    taste: '甘',
    direction: '中',
  },
  '金': {
    element: '金',
    organ: '肺·大肠',
    emotion: '悲',
    season: '秋',
    color: '白',
    taste: '辛',
    direction: '西',
  },
  '水': {
    element: '水',
    organ: '肾·膀胱',
    emotion: '恐',
    season: '冬',
    color: '黑',
    taste: '咸',
    direction: '北',
  },
};

// 五行相生顺序：木→火→土→金→水→木
export const shengSequence: WuXingElement[] = ['木', '火', '土', '金', '水'];

// 根据出生年份天干推算日主五行
export function getElementFromYear(year: number): WuXingElement {
  const tianGan = year % 10;
  const map: Record<number, WuXingElement> = {
    0: '金', 1: '金', // 庚辛
    2: '水', 3: '水', // 壬癸
    4: '木', 5: '木', // 甲乙
    6: '火', 7: '火', // 丙丁
    8: '土', 9: '土', // 戊己
  };
  return map[tianGan] || '土';
}

// 生成五行报告
export interface FiveElementsReport {
  mainElement: WuXingElement;
  profile: WuXingProfile;
  bodyFeature: string;
  bodySigns: string[];
  dietAdvice: {
    foods: string[];
    recipes: { name: string; desc: string }[];
  };
  seasonalAdvice: {
    spring: string;
    summer: string;
    autumn: string;
    winter: string;
  };
  emotionAdvice: {
    method: string;
    operaSegment: string;
  };
  lifestyle: {
    schedule: string;
    exercise: string;
  };
  culture: {
    classic: string;
    modern: string;
  };
}

export function generateReport(element: WuXingElement): FiveElementsReport {
  const reports: Record<WuXingElement, FiveElementsReport> = {
    '木': {
      mainElement: '木',
      profile: wuXingData['木'],
      bodyFeature: '木行之人，面色微青，身形修长如松，筋骨柔韧有力。木主生发，气机升腾，其人举止果断而不失灵活，步态轻捷如风穿竹林。肝气充盈则目光有神，若肝郁气滞则面色暗沉、胸胁胀满。木行体质者宜疏不宜郁，养肝为第一要务。',
      bodySigns: [
        '面色偏青，尤其在春季更为明显',
        '筋骨柔韧，指趾修长，关节灵活',
        '情绪易怒，发则面红目赤',
      ],
      dietAdvice: {
        foods: ['菠菜', '芹菜', '枸杞', '绿豆', '青梅'],
        recipes: [
          { name: '枸杞菠菜汤', desc: '菠菜焯水配枸杞，滋肝明目，宜春日清晨食之' },
          { name: '青梅绿豆粥', desc: '绿豆煮至开花，入青梅少许，清肝解毒' },
          { name: '芹菜核桃仁', desc: '芹菜切段配核桃，平肝降压，佐餐佳品' },
        ],
      },
      seasonalAdvice: {
        spring: '春季木旺，宜早起散步，舒展筋骨，忌暴怒伤肝。清晨可面东深呼吸，纳东方生发之气。',
        summer: '夏月木休，肝胆渐安，饮食宜清淡，多食酸味以收敛心火，防木火相煽。',
        autumn: '秋金克木，肝气易郁，宜食酸补肝，适度运动疏泄情志，听蒲剧悲腔以宣泄。',
        winter: '冬水生木，木气潜藏蓄势，宜早睡晚起，养藏为主，静待春来生发。',
      },
      emotionAdvice: {
        method: '怒伤肝，当以悲胜怒。悲则气消，可消解怒气之郁结。每日晨起默坐片刻，观想翠竹在风中摇曳而不折，学其柔韧之性。',
        operaSegment: '蒲剧《窦娥冤》"六月飞雪"唱段——悲腔婉转，可宣泄胸中郁怒之气',
      },
      lifestyle: {
        schedule: '宜早起（5:00-7:00），卯时肝经当令，宜起身活动舒展。午间小憩养心，亥时（21:00-23:00）入睡养肝血。',
        exercise: '太极拳、八段锦中以"青龙探爪"一式最宜木行体质，舒展肝胆经气。户外林间散步亦佳。',
      },
      culture: {
        classic: '《黄帝内经·素问》："东方生风，风生木，木生酸，酸生肝，肝生筋，筋生心，肝主目。"',
        modern: '现代医学证实，肝脏是人体最大的代谢器官，春季肝细胞再生能力最强，与古人"春养肝"之说不谋而合。规律作息与适度运动确能改善肝功能指标。',
      },
    },
    '火': {
      mainElement: '火',
      profile: wuXingData['火'],
      bodyFeature: '火行之人，面色红润如霞，身形匀称偏瘦，肌腠致密。火主炎上，气机升腾外散，其人热情爽朗，语速轻快如流水击石。心气充盈则面色荣润有光，若心火过旺则口舌生疮、心烦失眠。火行体质者宜清不宜燥，养心为根本之道。',
      bodySigns: [
        '面色红润偏赤，颧骨处尤显',
        '掌心温热，易出汗，畏热喜凉',
        '性情急躁，遇事速决，言辞直快',
      ],
      dietAdvice: {
        foods: ['莲子', '百合', '苦瓜', '红豆', '西瓜'],
        recipes: [
          { name: '莲子百合粥', desc: '莲子去心配百合，清心润肺，夏夜食用安神助眠' },
          { name: '苦瓜炒红豆', desc: '苦瓜清心火，红豆利水消肿，清补兼施' },
          { name: '西瓜皮凉茶', desc: '西瓜翠衣煮水，加少许冰糖，清热解暑佳品' },
        ],
      },
      seasonalAdvice: {
        spring: '春木生火，心气渐旺，宜清淡饮食，防心火上炎。午后可小憩片刻养心神。',
        summer: '夏季火旺，宜静心凝神，午时（11:00-13:00）小憩养心。多食苦味清心，忌辛辣燥热。',
        autumn: '秋火始退，心神渐宁，饮食宜润肺养阴，承夏之余热，过渡至冬藏。',
        winter: '冬水克火，心气内守，宜温补心阳，食羊肉、桂圆之类，但不可太过。',
      },
      emotionAdvice: {
        method: '喜伤心，当以恐胜喜。大喜则气缓，恐则气下，可收摄心神。日间可习书法，以静制动，笔锋沉稳则心火自平。',
        operaSegment: '蒲剧《赵氏孤儿》"搜孤救孤"唱段——惊心动魄，可收摄散漫心神',
      },
      lifestyle: {
        schedule: '午时（11:00-13:00）心经当令，务必小憩15-30分钟。子时（23:00-1:00）前入睡，养心阴。避免熬夜耗伤心血。',
        exercise: '八段锦"摇头摆尾去心火"一式最宜，配合深呼吸导引心火下行。避免剧烈运动大汗伤阴。',
      },
      culture: {
        classic: '《黄帝内经·素问》："南方生热，热生火，火生苦，苦生心，心生血，血生脾，心主舌。"',
        modern: '现代心血管医学研究表明，夏季气温升高时血压波动增大，心梗发生率上升，与中医"夏养心"理念一致。午间休息确能降低心血管事件风险。',
      },
    },
    '土': {
      mainElement: '土',
      profile: wuXingData['土'],
      bodyFeature: '土行之人，面色黄润如粟，身形敦厚稳重，肌肉丰满。土主承载，气机居中化运，其人宽厚包容，行事稳健如大地。脾气健运则四肢有力、面色荣润，若脾虚湿困则面色萎黄、身体困重。土行体质者宜化不宜滞，健脾祛湿为要务。',
      bodySigns: [
        '面色偏黄，肤色均匀润泽',
        '体形敦实，肌肉松软，易发胖',
        '性格温和，思虑较多，易多思伤脾',
      ],
      dietAdvice: {
        foods: ['山药', '薏米', '红枣', '小米', '南瓜'],
        recipes: [
          { name: '山药薏米粥', desc: '山药薏米同煮，健脾祛湿，早晚温服最宜' },
          { name: '红枣小米粥', desc: '小米养胃，红枣补脾，长夏养生良方' },
          { name: '南瓜蒸百合', desc: '南瓜健脾，百合润肺，甘甜适口老少皆宜' },
        ],
      },
      seasonalAdvice: {
        spring: '春木克土，脾胃易虚，饮食宜温软，少食酸味以免伤脾。晨起一杯温水护胃气。',
        summer: '长夏土旺，湿气最重，宜食健脾祛湿之品，忌生冷寒凉。居室通风除湿。',
        autumn: '秋燥伤肺及脾，宜润燥健脾，食梨、山药等，循序渐进调理。',
        winter: '冬寒伤阳，脾胃虚寒者宜温补，姜汤、羊肉粥可暖中焦。',
      },
      emotionAdvice: {
        method: '思伤脾，当以怒胜思。思虑太过则气结，怒则气上，可冲散郁结。然不可大怒，微怒即可。常做手工、编织等动手之事，转移思虑。',
        operaSegment: '蒲剧《忠保国》"忠臣直谏"唱段——慷慨激昂，可振奋中焦脾气',
      },
      lifestyle: {
        schedule: '辰时（7:00-9:00）胃经当令，此时早餐最易消化。巳时（9:00-11:00）脾经当令，宜适度活动助脾运化。饭后缓行百步。',
        exercise: '八段锦"调理脾胃须单举"最宜，双手交替上托，升清降浊。散步、慢跑亦有助脾运。',
      },
      culture: {
        classic: '《黄帝内经·素问》："中央生湿，湿生土，土生甘，甘生脾，脾生肉，肉生肺，脾主口。"',
        modern: '消化系统疾病在换季时高发，与中医"脾主四季末十八日"的理论吻合。现代营养学也证实规律饮食对消化系统健康至关重要。',
      },
    },
    '金': {
      mainElement: '金',
      profile: wuXingData['金'],
      bodyFeature: '金行之人，面色白净如玉，身形端正挺拔，骨节分明。金主肃降，气机清肃下行，其人刚毅果决，行事有度如度量衡器。肺气充盈则声音洪亮、皮肤润泽，若肺气不足则声音低微、面色苍白。金行体质者宜润不宜燥，养肺润燥为关键。',
      bodySigns: [
        '面色白皙偏薄，皮肤细腻易干燥',
        '身形端正，肩背宽阔，骨节明显',
        '性格刚直，重义守信，易悲忧伤肺',
      ],
      dietAdvice: {
        foods: ['雪梨', '银耳', '白萝卜', '杏仁', '蜂蜜'],
        recipes: [
          { name: '银耳雪梨羹', desc: '银耳炖雪梨加蜂蜜，润肺生津，秋季每日一碗' },
          { name: '白萝卜杏仁汤', desc: '萝卜下气，杏仁润肺，化痰止咳良方' },
          { name: '蜂蜜藕粉羹', desc: '藕粉冲调加蜂蜜，润肺养阴，晨起温服' },
        ],
      },
      seasonalAdvice: {
        spring: '春木侮金，肺气易损，注意防风保暖，早起深呼吸纳清气。',
        summer: '夏火克金，肺阴易伤，宜食清凉润肺之品，忌烈日暴晒。',
        autumn: '秋金当令，燥气最盛，养肺为第一要务。早睡早起，与鸡俱兴，食润燥之品。',
        winter: '冬水泻金，宜温补肺气，食羊肉、姜汤暖肺。注意背部保暖，肺俞穴不可受寒。',
      },
      emotionAdvice: {
        method: '悲伤肺，当以喜胜悲。悲则气消，喜则气和，以欢笑驱散忧愁。多与友人聚会畅谈，观蒲剧喜剧，开怀一笑胜过良药。',
        operaSegment: '蒲剧《拾玉镯》"少女怀春"唱段——活泼俏皮，可驱散心中忧悲',
      },
      lifestyle: {
        schedule: '寅时（3:00-5:00）肺经当令，此时应深度睡眠。清晨可面西做深呼吸，扩胸展肺。申时（15:00-17:00）宜户外活动。',
        exercise: '六字诀"呬"字功最宜养肺，深吸缓呼配合发音。太极拳"白鹤亮翅"一式可展胸扩肺。',
      },
      culture: {
        classic: '《黄帝内经·素问》："西方生燥，燥生金，金生辛，辛生肺，肺生皮毛，皮毛生肾，肺主鼻。"',
        modern: '呼吸系统疾病在秋季高发已被大量流行病学数据证实，与中医"秋养肺"的理念完全一致。深呼吸训练确实能改善肺功能指标。',
      },
    },
    '水': {
      mainElement: '水',
      profile: wuXingData['水'],
      bodyFeature: '水行之人，面色偏暗如墨玉，身形圆润，腰腹易蓄脂肪。水主润下，气机深沉内敛，其人智慧深沉，谋定后动如深潭蓄水。肾气充盈则发黑齿坚、精力充沛，若肾精不足则腰膝酸软、面色晦暗。水行体质者宜温不宜寒，补肾固元为根本。',
      bodySigns: [
        '面色偏暗偏黑，眼眶周围尤显',
        '体形偏胖，腰腹部易蓄积脂肪',
        '性格深沉内敛，善于谋略，易恐惧伤肾',
      ],
      dietAdvice: {
        foods: ['黑芝麻', '黑豆', '核桃', '栗子', '海参'],
        recipes: [
          { name: '黑芝麻核桃糊', desc: '黑芝麻核桃磨粉冲服，补肾健脑，冬晨食用最佳' },
          { name: '黑豆栗子汤', desc: '黑豆栗子同炖，补肾强腰，温而不燥' },
          { name: '海参小米粥', desc: '海参补精益肾，小米养胃，阴阳双补' },
        ],
      },
      seasonalAdvice: {
        spring: '春木泄水，肾气渐耗，宜食补肾之品固本，勿过度劳累耗伤精气。',
        summer: '夏火灼水，汗出伤阴，宜多饮水补充津液，食酸味收敛心火护肾水。',
        autumn: '秋金生水，肾气渐充，宜早睡养阴，蓄积精气以备冬藏。食黑色入肾之品。',
        winter: '冬水当令，万物闭藏，养肾最佳时节。早卧晚起，避寒就温，食温补之品。',
      },
      emotionAdvice: {
        method: '恐伤肾，当以思胜恐。恐惧则气下，思虑则气聚，以理性思考化解无端恐惧。临睡前静坐，数息安定心神，驱散恐惧。',
        operaSegment: '蒲剧《出潼关》"英雄筹谋"唱段——深思熟虑，可安定恐惧心神',
      },
      lifestyle: {
        schedule: '酉时（17:00-19:00）肾经当令，此时宜休息养肾，不可过度劳累。亥时（21:00-23:00）入睡最佳，养肾藏精。',
        exercise: '八段锦"双手攀足固肾腰"最宜，前屈后伸强腰固肾。冬季宜室内运动，避免寒气伤肾。',
      },
      culture: {
        classic: '《黄帝内经·素问》："北方生寒，寒生水，水生咸，咸生肾，肾生骨髓，髓生肝，肾主耳。"',
        modern: '现代内分泌学发现，冬季褪黑素分泌增加，基础代谢率变化，与中医"冬藏"理论一致。冬季补肾食物（如黑芝麻、核桃）确实富含锌、维生素E等对肾脏有益的营养素。',
      },
    },
  };
  return reports[element];
}
