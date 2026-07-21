// 24节气数据

export interface SolarTerm {
  name: string;
  date: string; // 大约日期 MM-DD
  month: number;
  desc: string;
  threeHou: string[]; // 三候
  climate: string;
  health: string;
  foods: string[];
  opera: string;
  imagery: 'spring' | 'summer' | 'autumn' | 'winter';
  color: string; // CSS gradient colors
  imageUrl: string; // 节气意象图
}

export const solarTerms: SolarTerm[] = [
  {
    name: '立春', date: '02-04', month: 2,
    desc: '春回大地，万物复苏',
    threeHou: ['东风解冻', '蛰虫始振', '鱼陟负冰'],
    climate: '气温回升，但仍有寒意，春风始至',
    health: '护阳养肝，早睡早起，舒展筋骨',
    foods: ['春笋', '韭菜', '香菜', '萝卜', '豆芽'],
    opera: '蒲剧《春草闯堂》——春风拂面，生机盎然',
    imagery: 'spring', color: '#8FBC8F',
    imageUrl: '/images/solar-terms/lichun.jpg',
  },
  {
    name: '雨水', date: '02-19', month: 2,
    desc: '春雨润物，草木萌动',
    threeHou: ['獭祭鱼', '鸿雁来', '草木萌动'],
    climate: '降水增多，空气湿润，乍暖还寒',
    health: '健脾祛湿，饮食温润，忌食生冷',
    foods: ['山药', '红枣', '蜂蜜', '百合', '银耳'],
    opera: '蒲剧《春江月》——雨润新芽，月映春江',
    imagery: 'spring', color: '#98D8C8',
    imageUrl: '/images/solar-terms/yushui.jpg',
  },
  {
    name: '惊蛰', date: '03-05', month: 3,
    desc: '雷声惊醒蛰虫，春意渐浓',
    threeHou: ['桃始华', '仓庚鸣', '鹰化为鸠'],
    climate: '气温明显升高，偶有春雷',
    health: '疏肝理气，防风御寒，适度运动',
    foods: ['梨', '菠菜', '荠菜', '芹菜', '菊花'],
    opera: '蒲剧《雷峰塔》——春雷惊蛰，万物苏醒',
    imagery: 'spring', color: '#7CCD7C',
    imageUrl: '/images/solar-terms/jingzhe.jpg',
  },
  {
    name: '春分', date: '03-20', month: 3,
    desc: '昼夜平分，春色正中',
    threeHou: ['玄鸟至', '雷乃发声', '始电'],
    climate: '昼夜等长，气温适宜，春光明媚',
    health: '调和阴阳，平衡饮食，防春困',
    foods: ['香椿', '春笋', '荠菜', '鸡蛋', '枸杞'],
    opera: '蒲剧《花田错》——春分时节，柳绿花红',
    imagery: 'spring', color: '#66CDAA',
    imageUrl: '/images/solar-terms/chunfen.jpg',
  },
  {
    name: '清明', date: '04-04', month: 4,
    desc: '天清地明，万物皆显',
    threeHou: ['桐始华', '田鼠化为鴽', '虹始见'],
    climate: '天气晴朗，草木繁茂',
    health: '疏肝健脾，户外踏青，调理情志',
    foods: ['青团', '螺蛳', '茶', '杏', '菠菜'],
    opera: '蒲剧《祭江》——清明时节，慎终追远',
    imagery: 'spring', color: '#90EE90',
    imageUrl: '/images/solar-terms/qingming.jpg',
  },
  {
    name: '谷雨', date: '04-20', month: 4,
    desc: '雨生百谷，播种移苗',
    threeHou: ['萍始生', '鸣鸠拂其羽', '戴胜降于桑'],
    climate: '雨水充沛，利于谷物生长',
    health: '养肝护脾，祛湿防潮，食春茶',
    foods: ['茶叶', '香椿', '豆芽', '鲫鱼', '薏米'],
    opera: '蒲剧《采茶歌》——谷雨新茶，沁人心脾',
    imagery: 'spring', color: '#9ACD32',
    imageUrl: '/images/solar-terms/guyu.jpg',
  },
  {
    name: '立夏', date: '05-05', month: 5,
    desc: '夏之始也，万物繁盛',
    threeHou: ['蝼蝈鸣', '蚯蚓出', '王瓜生'],
    climate: '气温显著升高，暑气初至',
    health: '养心安神，清淡饮食，防暑降温',
    foods: ['樱桃', '青梅', '蚕豆', '黄瓜', '绿豆'],
    opera: '蒲剧《荷花灯》——初夏微风，荷灯初上',
    imagery: 'summer', color: '#FFB347',
    imageUrl: '/images/solar-terms/lixia.jpg',
  },
  {
    name: '小满', date: '05-21', month: 5,
    desc: '麦粒渐满，尚未全熟',
    threeHou: ['苦菜秀', '靡草死', '麦秋至'],
    climate: '气温升高，湿度增大',
    health: '清热利湿，健脾和胃，忌贪凉',
    foods: ['苦菜', '薏米', '冬瓜', '黄瓜', '绿豆'],
    opera: '蒲剧《丰收记》——小满时节，麦穗渐满',
    imagery: 'summer', color: '#FFA07A',
    imageUrl: '/images/solar-terms/xiaoman.jpg',
  },
  {
    name: '芒种', date: '06-05', month: 6,
    desc: '有芒之谷，忙于播种',
    threeHou: ['螳螂生', '鵙始鸣', '反舌无声'],
    climate: '气温高，雨量多，梅雨季节',
    health: '清热化湿，预防中暑，适当午休',
    foods: ['梅子', '桑葚', '西瓜', '丝瓜', '莲子'],
    opera: '蒲剧《芒种谣》——梅雨时节，农事繁忙',
    imagery: 'summer', color: '#FF8C69',
    imageUrl: '/images/solar-terms/mangzhong.jpg',
  },
  {
    name: '夏至', date: '06-21', month: 6,
    desc: '日长之至，阳气极盛',
    threeHou: ['鹿角解', '蜩始鸣', '半夏生'],
    climate: '白昼最长，气温最高',
    health: '养心护阳，清淡饮食，晚睡早起',
    foods: ['西瓜', '绿豆', '苦瓜', '荷叶', '酸梅'],
    opera: '蒲剧《荷花令》——夏至日长，荷风送香',
    imagery: 'summer', color: '#FF6347',
    imageUrl: '/images/solar-terms/xiazhi.jpg',
  },
  {
    name: '小暑', date: '07-07', month: 7,
    desc: '暑气渐至，热犹未极',
    threeHou: ['温风至', '蟋蟀居壁', '鹰始击'],
    climate: '炎热初至，偶有暴雨',
    health: '清热解暑，养心除烦，防暑湿',
    foods: ['莲藕', '黄鳝', '绿豆', '西瓜', '丝瓜'],
    opera: '蒲剧《莲池会》——小暑清风，莲池纳凉',
    imagery: 'summer', color: '#FF4500',
    imageUrl: '/images/solar-terms/xiaoshu.jpg',
  },
  {
    name: '大暑', date: '07-22', month: 7,
    desc: '暑热至极，酷暑难当',
    threeHou: ['腐草为萤', '土润溽暑', '大雨时行'],
    climate: '一年中最热之时',
    health: '防暑降温，益气生津，心静自然凉',
    foods: ['冬瓜', '苦瓜', '绿豆', '西瓜', '荷叶'],
    opera: '蒲剧《伏天记》——大暑炎炎，以戏消夏',
    imagery: 'summer', color: '#DC143C',
    imageUrl: '/images/solar-terms/dashu.jpg',
  },
  {
    name: '立秋', date: '08-07', month: 8,
    desc: '秋之始也，暑去凉来',
    threeHou: ['凉风至', '白露降', '寒蝉鸣'],
    climate: '暑气渐消，早晚转凉',
    health: '润燥养肺，早卧早起，收敛神气',
    foods: ['梨', '银耳', '百合', '莲藕', '芝麻'],
    opera: '蒲剧《秋江》——立秋凉风，秋水长天',
    imagery: 'autumn', color: '#DAA520',
    imageUrl: '/images/solar-terms/liqiu.jpg',
  },
  {
    name: '处暑', date: '08-23', month: 8,
    desc: '暑气止也，秋意渐浓',
    threeHou: ['鹰乃祭鸟', '天地始肃', '禾乃登'],
    climate: '暑热渐退，秋高气爽',
    health: '滋阴润燥，调和肺气，适度秋冻',
    foods: ['鸭肉', '龙眼', '百合', '银耳', '蜂蜜'],
    opera: '蒲剧《秋月白》——处暑清秋，月白风清',
    imagery: 'autumn', color: '#CD853F',
    imageUrl: '/images/solar-terms/chushu.jpg',
  },
  {
    name: '白露', date: '09-07', month: 9,
    desc: '露凝而白，秋凉始盛',
    threeHou: ['鸿雁来', '玄鸟归', '群鸟养羞'],
    climate: '气温下降，夜间露水凝结',
    health: '防寒保暖，润肺养阴，早睡早起',
    foods: ['龙眼', '白果', '百合', '梨', '银耳'],
    opera: '蒲剧《白露吟》——露白风清，雁阵南飞',
    imagery: 'autumn', color: '#BDB76B',
    imageUrl: '/images/solar-terms/bailu.jpg',
  },
  {
    name: '秋分', date: '09-23', month: 9,
    desc: '昼夜再分，秋色正中',
    threeHou: ['雷始收声', '蛰虫坯户', '水始涸'],
    climate: '昼夜等长，秋高气爽',
    health: '阴阳调和，润燥养肺，平衡情志',
    foods: ['柿子', '石榴', '螃蟹', '桂花', '板栗'],
    opera: '蒲剧《秋分月》——月圆秋半，桂香满庭',
    imagery: 'autumn', color: '#C4A35A',
    imageUrl: '/images/solar-terms/qiufen.jpg',
  },
  {
    name: '寒露', date: '10-08', month: 10,
    desc: '露气寒冷，将欲凝结',
    threeHou: ['鸿雁来宾', '雀入大水为蛤', '菊有黄华'],
    climate: '气温明显下降，露水冰冷',
    health: '防寒养阴，润肺益胃，添衣保暖',
    foods: ['菊花', '柿子', '芝麻', '核桃', '大枣'],
    opera: '蒲剧《寒露谣》——寒露凝霜，菊花傲骨',
    imagery: 'autumn', color: '#A0785A',
    imageUrl: '/images/solar-terms/hanlu.jpg',
  },
  {
    name: '霜降', date: '10-23', month: 10,
    desc: '露结为霜，秋之末也',
    threeHou: ['豺乃祭兽', '草木黄落', '蛰虫咸俯'],
    climate: '初霜出现，气温骤降',
    health: '温补润燥，护胃防寒，适度进补',
    foods: ['柿子', '牛肉', '鸭肉', '山药', '枸杞'],
    opera: '蒲剧《霜天晓》——霜降天寒，枫叶如丹',
    imagery: 'autumn', color: '#8B6914',
    imageUrl: '/images/solar-terms/shuangjiang.jpg',
  },
  {
    name: '立冬', date: '11-07', month: 11,
    desc: '冬之始也，万物收藏',
    threeHou: ['水始冰', '地始冻', '雉入大水为蜃'],
    climate: '气温降低，开始结冰',
    health: '温补养肾，早卧晚起，避寒就温',
    foods: ['羊肉', '栗子', '核桃', '红枣', '桂圆'],
    opera: '蒲剧《立冬赋》——寒风初至，围炉听戏',
    imagery: 'winter', color: '#708090',
    imageUrl: '/images/solar-terms/lidong.jpg',
  },
  {
    name: '小雪', date: '11-22', month: 11,
    desc: '初雪将至，天地肃穆',
    threeHou: ['虹藏不见', '天气上升地气下降', '闭塞而成冬'],
    climate: '气温继续下降，偶有小雪',
    health: '温补肾阳，御寒保暖，精神内守',
    foods: ['黑芝麻', '黑木耳', '核桃', '羊肉', '萝卜'],
    opera: '蒲剧《雪夜归》——小雪纷飞，归人踏雪',
    imagery: 'winter', color: '#778899',
    imageUrl: '/images/solar-terms/xiaoxue.jpg',
  },
  {
    name: '大雪', date: '12-07', month: 12,
    desc: '雪量增大，银装素裹',
    threeHou: ['鹖鴠不鸣', '虎始交', '荔挺出'],
    climate: '降雪增多，天寒地冻',
    health: '温补防寒，养肾固精，室内运动',
    foods: ['羊肉', '狗肉', '核桃', '红枣', '桂圆'],
    opera: '蒲剧《大雪行》——大雪封山，壮士独行',
    imagery: 'winter', color: '#696969',
    imageUrl: '/images/solar-terms/daxue.jpg',
  },
  {
    name: '冬至', date: '12-22', month: 12,
    desc: '日短之至，阴极阳生',
    threeHou: ['蚯蚓结', '麋角解', '水泉动'],
    climate: '白昼最短，进入数九寒天',
    health: '温补阳气，吃饺子汤圆，静养蓄能',
    foods: ['饺子', '汤圆', '羊肉', '红枣', '枸杞'],
    opera: '蒲剧《冬至令》——冬至阳生，否极泰来',
    imagery: 'winter', color: '#4A6670',
    imageUrl: '/images/solar-terms/dongzhi.jpg',
  },
  {
    name: '小寒', date: '01-05', month: 1,
    desc: '寒犹未极，冰天雪地',
    threeHou: ['雁北乡', '鹊始巢', '雉始雊'],
    climate: '一年中最冷的节气之一',
    health: '温补养肾，防寒保暖，早睡晚起',
    foods: ['羊肉', '腊八粥', '核桃', '栗子', '红枣'],
    opera: '蒲剧《寒梅赞》——小寒时节，梅花傲雪',
    imagery: 'winter', color: '#5F6B7A',
    imageUrl: '/images/solar-terms/xiaohan.jpg',
  },
  {
    name: '大寒', date: '01-20', month: 1,
    desc: '寒至极点，春将不远',
    threeHou: ['鸡乳', '征鸟厉疾', '水泽腹坚'],
    climate: '一年中最冷之时，春意暗藏',
    health: '温补为主，适度运动，准备迎春',
    foods: ['羊肉', '八宝饭', '年糕', '红枣', '桂圆'],
    opera: '蒲剧《大寒归》——大寒极处，春在眼前',
    imagery: 'winter', color: '#4A5568',
    imageUrl: '/images/solar-terms/dahan.jpg',
  },
];

// 节气精确日期表（公历，精确到日）
// 24 节气顺序：立春 雨水 惊蛰 春分 清明 谷雨 立夏 小满 芒种 夏至 小暑 大暑 立秋 处暑 白露 秋分 寒露 霜降 立冬 小雪 大雪 冬至 小寒 大寒
// 一个节气年从立春开始，到下一年立春前一天结束（小寒/大寒在下一年1月）
const SOLAR_YEAR_DATES: Record<number, string[]> = {
  2026: [
    '2026-02-04', '2026-02-19', '2026-03-06', '2026-03-21', // 立春 雨水 惊蛰 春分
    '2026-04-05', '2026-04-20', '2026-05-06', '2026-05-21', // 清明 谷雨 立夏 小满
    '2026-06-06', '2026-06-21', '2026-07-07', '2026-07-23', // 芒种 夏至 小暑 大暑
    '2026-08-07', '2026-08-23', '2026-09-07', '2026-09-23', // 立秋 处暑 白露 秋分
    '2026-10-08', '2026-10-23', '2026-11-07', '2026-11-22', // 寒露 霜降 立冬 小雪
    '2026-12-07', '2026-12-22', '2027-01-05', '2027-01-20', // 大雪 冬至 小寒 大寒
  ],
  2027: [
    '2027-02-04', '2027-02-19', '2027-03-06', '2027-03-21',
    '2027-04-05', '2027-04-20', '2027-05-06', '2027-05-21',
    '2027-06-06', '2027-06-21', '2027-07-07', '2027-07-23',
    '2027-08-07', '2027-08-23', '2027-09-07', '2027-09-23',
    '2027-10-08', '2027-10-23', '2027-11-07', '2027-11-22',
    '2027-12-07', '2027-12-22', '2028-01-05', '2028-01-20',
  ],
  2028: [
    '2028-02-04', '2028-02-19', '2028-03-05', '2028-03-20',
    '2028-04-04', '2028-04-20', '2028-05-05', '2028-05-21',
    '2028-06-05', '2028-06-21', '2028-07-07', '2028-07-23',
    '2028-08-07', '2028-08-23', '2028-09-07', '2028-09-23',
    '2028-10-08', '2028-10-23', '2028-11-07', '2028-11-22',
    '2028-12-07', '2028-12-22', '2029-01-05', '2029-01-20',
  ],
  2029: [
    '2029-02-04', '2029-02-18', '2029-03-05', '2029-03-20',
    '2029-04-04', '2029-04-20', '2029-05-05', '2029-05-21',
    '2029-06-05', '2029-06-21', '2029-07-07', '2029-07-23',
    '2029-08-07', '2029-08-23', '2029-09-07', '2029-09-23',
    '2029-10-08', '2029-10-23', '2029-11-07', '2029-11-22',
    '2029-12-07', '2029-12-22', '2030-01-05', '2030-01-20',
  ],
  2030: [
    '2030-02-04', '2030-02-18', '2030-03-05', '2030-03-20',
    '2030-04-05', '2030-04-20', '2030-05-05', '2030-05-21',
    '2030-06-05', '2030-06-21', '2030-07-07', '2030-07-23',
    '2030-08-07', '2030-08-23', '2030-09-07', '2030-09-23',
    '2030-10-08', '2030-10-23', '2030-11-07', '2030-11-22',
    '2030-12-07', '2030-12-22', '2031-01-05', '2031-01-20',
  ],
};

// 获取当前节气
export function getCurrentSolarTerm(): SolarTerm {
  const now = new Date();
  const year = now.getFullYear();
  const dates = SOLAR_YEAR_DATES[year];

  if (dates) {
    // 精确日期表可用：从后向前找到第一个 <= 今天的节气
    for (let i = dates.length - 1; i >= 0; i--) {
      const termDate = new Date(dates[i]);
      if (now >= termDate) {
        return solarTerms[i];
      }
    }
    // 年初（立春之前），回退到上一节气年查找
    const prevDates = SOLAR_YEAR_DATES[year - 1];
    if (prevDates) {
      for (let i = prevDates.length - 1; i >= 0; i--) {
        const termDate = new Date(prevDates[i]);
        if (now >= termDate) {
          return solarTerms[i];
        }
      }
    }
    return solarTerms[solarTerms.length - 1]; // 兜底：大寒
  }

  // 降级：用近似 MM-DD 比较（处理年份不在表中的情况）
  // 按日历年份排列：小寒(01) 大寒(01) 立春(02) ... 冬至(12)
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const calendarOrder = [...solarTerms.slice(22), ...solarTerms.slice(0, 22)];
  let current = calendarOrder[0];
  for (const term of calendarOrder) {
    const [tMonth, tDay] = term.date.split('-').map(Number);
    if (month > tMonth || (month === tMonth && day >= tDay)) {
      current = term;
    } else {
      break;
    }
  }
  return current;
}

// 获取下一个节气
export function getNextSolarTerm(): SolarTerm {
  const now = new Date();
  const year = now.getFullYear();
  const dates = SOLAR_YEAR_DATES[year];

  if (dates) {
    for (let i = 0; i < dates.length; i++) {
      const termDate = new Date(dates[i]);
      if (now < termDate) {
        return solarTerms[i];
      }
    }
    // 当前节气年的所有节气都过了，返回下一年的立春
    const nextDates = SOLAR_YEAR_DATES[year + 1];
    if (nextDates) {
      return solarTerms[0]; // 立春
    }
    // 年初：当前年立春还没到，下一个节气就在当前年的表里
    // 但上面的循环没找到（因为now < dates[0] = 立春），说明需要找当前表的立春
    return solarTerms[0]; // 立春
  }

  // 降级
  const current = getCurrentSolarTerm();
  const idx = solarTerms.findIndex(t => t.name === current.name);
  return solarTerms[(idx + 1) % solarTerms.length];
}

// 计算距下一节气的天数
export function daysUntilNextTerm(): number {
  const now = new Date();
  const year = now.getFullYear();
  const dates = SOLAR_YEAR_DATES[year];

  if (dates) {
    for (let i = 0; i < dates.length; i++) {
      const termDate = new Date(dates[i]);
      if (now < termDate) {
        return Math.ceil((termDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      }
    }
    // 当前节气年结束，算到下一年立春
    const nextDates = SOLAR_YEAR_DATES[year + 1];
    if (nextDates) {
      const lichun = new Date(nextDates[0]);
      return Math.ceil((lichun.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    }
    // 年初：当前年立春还没到
    const lichun = new Date(dates[0]);
    return Math.ceil((lichun.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }

  // 降级：用近似日期
  const next = getNextSolarTerm();
  const [m, d] = next.date.split('-').map(Number);
  let nextDate = new Date(now.getFullYear(), m - 1, d);
  if (nextDate <= now) {
    nextDate = new Date(now.getFullYear() + 1, m - 1, d);
  }
  return Math.ceil((nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}
