/**
 * lunar-utils.ts — 基于专业历法库的农历工具 + 四柱排盘引擎
 *
 * 核心依赖：lunar-javascript（专业历法库，内置天文学级别的节气/排盘算法）
 * - 农历↔阳历精确转换（支持闰月）
 * - 四柱排盘使用 EightChar API（立春年柱/节气月柱/精确日柱/五鼠遁元时柱）
 * - 五行统计 + 十神关系
 */

import { Solar, Lunar, EightChar } from 'lunar-javascript';

// ─── 天干地支基础 ─────────────────────────────────────────────

const tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const shiChenMap: Record<string, string> = {
  '子': '子时 23:00-01:00', '丑': '丑时 01:00-03:00',
  '寅': '寅时 03:00-05:00', '卯': '卯时 05:00-07:00',
  '辰': '辰时 07:00-09:00', '巳': '巳时 09:00-11:00',
  '午': '午时 11:00-13:00', '未': '未时 13:00-15:00',
  '申': '申时 15:00-17:00', '酉': '酉时 17:00-19:00',
  '戌': '戌时 19:00-21:00', '亥': '亥时 21:00-23:00',
};

/** 时辰→对应小时范围（取中间值，用于构造 Solar） */
const shiChenHourMap: Record<string, number> = {
  '子': 0, '丑': 2, '寅': 4, '卯': 6,
  '辰': 8, '巳': 10, '午': 12, '未': 14,
  '申': 16, '酉': 18, '戌': 20, '亥': 22,
};

type WuXing = '金' | '木' | '水' | '火' | '土';

const ganWuXing: Record<string, WuXing> = {
  '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
  '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水',
};
const zhiWuXing: Record<string, WuXing> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火',
  '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水',
};

// 十神映射表：key=日干, value={[其他天干]: 十神}
const shiShenMap: Record<string, Record<string, string>> = {
  '甲': { '甲': '比肩', '乙': '劫财', '丙': '食神', '丁': '伤官', '戊': '偏财', '己': '正财', '庚': '七杀', '辛': '正官', '壬': '偏印', '癸': '正印' },
  '乙': { '甲': '劫财', '乙': '比肩', '丙': '伤官', '丁': '食神', '戊': '正财', '己': '偏财', '庚': '正官', '辛': '七杀', '壬': '正印', '癸': '偏印' },
  '丙': { '甲': '偏印', '乙': '正印', '丙': '比肩', '丁': '劫财', '戊': '食神', '己': '伤官', '庚': '偏财', '辛': '正财', '壬': '七杀', '癸': '正官' },
  '丁': { '甲': '正印', '乙': '偏印', '丙': '劫财', '丁': '比肩', '戊': '伤官', '己': '食神', '庚': '正财', '辛': '偏财', '壬': '正官', '癸': '七杀' },
  '戊': { '甲': '七杀', '乙': '正官', '丙': '偏印', '丁': '正印', '戊': '比肩', '己': '劫财', '庚': '食神', '辛': '伤官', '壬': '偏财', '癸': '正财' },
  '己': { '甲': '正官', '乙': '七杀', '丙': '正印', '丁': '偏印', '戊': '劫财', '己': '比肩', '庚': '伤官', '辛': '食神', '壬': '正财', '癸': '偏财' },
  '庚': { '甲': '偏财', '乙': '正财', '丙': '七杀', '丁': '正官', '戊': '偏印', '己': '正印', '庚': '比肩', '辛': '劫财', '壬': '食神', '癸': '伤官' },
  '辛': { '甲': '正财', '乙': '偏财', '丙': '正官', '丁': '七杀', '戊': '正印', '己': '偏印', '庚': '劫财', '辛': '比肩', '壬': '伤官', '癸': '食神' },
  '壬': { '甲': '食神', '乙': '伤官', '丙': '偏财', '丁': '正财', '戊': '七杀', '己': '正官', '庚': '偏印', '辛': '正印', '壬': '比肩', '癸': '劫财' },
  '癸': { '甲': '伤官', '乙': '食神', '丙': '正财', '丁': '偏财', '戊': '正官', '己': '七杀', '庚': '正印', '辛': '偏印', '壬': '劫财', '癸': '比肩' },
};

const lunarMonthNames: Record<number, string> = {
  1: '正月', 2: '二月', 3: '三月', 4: '四月', 5: '五月', 6: '六月',
  7: '七月', 8: '八月', 9: '九月', 10: '十月', 11: '冬月', 12: '腊月',
};
const lunarDayNames: Record<number, string> = {
  1: '初一', 2: '初二', 3: '初三', 4: '初四', 5: '初五', 6: '初六', 7: '初七', 8: '初八', 9: '初九', 10: '初十',
  11: '十一', 12: '十二', 13: '十三', 14: '十四', 15: '十五', 16: '十六', 17: '十七', 18: '十八', 19: '十九', 20: '二十',
  21: '廿一', 22: '廿二', 23: '廿三', 24: '廿四', 25: '廿五', 26: '廿六', 27: '廿七', 28: '廿八', 29: '廿九', 30: '三十',
};

// ─── 历法转换 ───────────────────────────────────────────────

export interface LunarDateInfo {
  year: number;
  month: number;
  day: number;
  monthStr: string;
  dayStr: string;
  isLeap: boolean;
}

/**
 * 农历转阳历（使用 lunar-javascript）
 */
export function lunarToSolar(lunarY: number, lunarM: number, lunarD: number, isLeapMonth = false): { year: number; month: number; day: number } | null {
  try {
    const lunar = Lunar.fromYmd(lunarY, lunarM, lunarD);
    // lunar-javascript 的 Lunar.fromYmd 没有闰月参数，需要用 Solar 反查
    // 如果是闰月，需要特殊处理
    if (isLeapMonth) {
      // 尝试通过 Solar 反查找到闰月
      const solar = lunar.getSolar();
      const solarObj = Solar.fromYmd(solar.getYear(), solar.getMonth(), solar.getDay());
      const checkLunar = solarObj.getLunar();
      if (checkLunar.getMonth() === lunarM && checkLunar.getDay() === lunarD) {
        return { year: solar.getYear(), month: solar.getMonth(), day: solar.getDay() };
      }
    }
    const solar = lunar.getSolar();
    return { year: solar.getYear(), month: solar.getMonth(), day: solar.getDay() };
  } catch {
    return null;
  }
}

/**
 * 阳历转农历（使用 lunar-javascript）
 */
export function solarToLunar(solarY: number, solarM: number, solarD: number): LunarDateInfo | null {
  try {
    const solar = Solar.fromYmd(solarY, solarM, solarD);
    const lunar = solar.getLunar();
    const lYear = lunar.getYear();
    const lMonth = lunar.getMonth();
    const lDay = lunar.getDay();
    const isLeap = lunar.getMonth() < 0; // lunar-javascript 用负数表示闰月
    const absMonth = Math.abs(lMonth);

    return {
      year: lYear,
      month: absMonth,
      day: lDay,
      monthStr: (isLeap ? '闰' : '') + (lunarMonthNames[absMonth] || `${absMonth}月`),
      dayStr: lunarDayNames[lDay] || `${lDay}日`,
      isLeap,
    };
  } catch {
    return null;
  }
}

// ─── 日期校验 ───────────────────────────────────────────────

export function validateLunarDate(year: number | null, month: number | null, day: number | null, _isLeapMonth = false): string {
  if (month === null && day === null) return '';
  if (month !== null) {
    if (month < 1 || month > 12) return '农历月份应在1-12之间，请检查输入';
  }
  if (day !== null) {
    if (day < 1 || day > 30) return '农历日期应在初一至三十之间，请检查输入';
    if (year !== null && month !== null) {
      // 用 lunar-javascript 验证
      try {
        const lunar = Lunar.fromYmd(year, month, day);
        const solar = lunar.getSolar();
        if (!solar || solar.getYear() < 1900) {
          return `农历${year}年${lunarMonthNames[month] || month + '月'}${lunarDayNames[day] || day + '日'}不是有效日期，请检查输入`;
        }
      } catch {
        return `农历${year}年${lunarMonthNames[month] || month + '月'}${lunarDayNames[day] || day + '日'}不是有效日期，请检查输入`;
      }
    }
  }
  return '';
}

export function validateSolarDate(year: number | null, month: number | null, day: number | null): string {
  if (year === null && month === null && day === null) return '';
  if (month !== null) {
    if (month < 1 || month > 12) return '月份应在1-12之间，请检查输入';
  }
  if (day !== null) {
    if (day < 1 || day > 31) return '日期应在1-31之间，请检查输入';
    if (year !== null && month !== null) {
      const maxDays = new Date(year, month, 0).getDate();
      if (day > maxDays) return `${year}年${month}月最多${maxDays}天，请检查输入`;
    }
  }
  return '';
}

// ─── 输入解析 ─────────────────────────────────────────────────

interface ParsedInput {
  year: number | null;
  month: number | null;
  day: number | null;
  isLeapMonth: boolean;
  shichen: string | null;
}

export function parseLunarInput(input: string): ParsedInput {
  const yearMatch = input.match(/(\d{4})/);
  const isLeapMonth = /闰/.test(input);

  const monthMap: Record<string, number> = { '正':1,'一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9,'十':10,'十一':11,'十二':12 };
  const dayMap: Record<string, number> = { '初一':1,'初二':2,'初三':3,'初四':4,'初五':5,'初六':6,'初七':7,'初八':8,'初九':9,'初十':10,'十一':11,'十二':12,'十三':13,'十四':14,'十五':15,'十六':16,'十七':17,'十八':18,'十九':19,'二十':20,'廿一':21,'廿二':22,'廿三':23,'廿四':24,'廿五':25,'廿六':26,'廿七':27,'廿八':28,'廿九':29,'三十':30 };

  // Try Chinese format first: 五月十三, 闰四月十五
  const cnMonthMatch = input.match(/(?:闰)?(正|一|二|三|四|五|六|七|八|九|十|十一|十二)月/);
  const cnDayMatch = input.match(/(初[一二三四五六七八九十]|十[一二三四五六七八九]?|二十[一二三四五六七八九]?|三十)/);

  // Try Arabic format: 5月13日
  const arMonthMatch = input.match(/(\d{1,2})月/);
  const arDayMatch = input.match(/(\d{1,2})[日号]/);

  let month: number | null = null;
  let day: number | null = null;

  if (cnMonthMatch && monthMap[cnMonthMatch[1]] !== undefined) {
    month = monthMap[cnMonthMatch[1]];
  } else if (arMonthMatch) {
    month = parseInt(arMonthMatch[1]);
  }

  if (cnDayMatch && dayMap[cnDayMatch[1]] !== undefined) {
    day = dayMap[cnDayMatch[1]];
  } else if (arDayMatch) {
    day = parseInt(arDayMatch[1]);
  }

  // Also parse shichen from input
  const shichenMatch = input.match(/(子|丑|寅|卯|辰|巳|午|未|申|酉|戌|亥)时?/);

  return {
    year: yearMatch ? parseInt(yearMatch[1]) : null,
    month,
    day,
    isLeapMonth,
    shichen: shichenMatch ? shichenMatch[1] : null,
  };
}

export function parseSolarInput(input: string): ParsedInput {
  const yearMatch = input.match(/(\d{4})/);
  const monthMatch = input.match(/(\d{1,2})月/);
  const dayMatch = input.match(/(\d{1,2})[日号]/);

  // Also parse shichen from input
  const shichenMatch = input.match(/(子|丑|寅|卯|辰|巳|午|未|申|酉|戌|亥)时?/);

  return {
    year: yearMatch ? parseInt(yearMatch[1]) : null,
    month: monthMatch ? parseInt(monthMatch[1]) : null,
    day: dayMatch ? parseInt(dayMatch[1]) : null,
    isLeapMonth: false,
    shichen: shichenMatch ? shichenMatch[1] : null,
  };
}

// ─── 格式化 ─────────────────────────────────────────────────

export function formatSolarDate(year: number | null, month: number | null, day: number | null): string {
  if (!year) return '';
  const m = month ? String(month).padStart(2, '0') : '01';
  const d = day ? String(day).padStart(2, '0') : '01';
  return `${year}-${m}-${d}`;
}

export function formatLunarDate(year: number | null, month: number | null, day: number | null, isLeap = false): string {
  if (!year) return '';
  const mName = month ? (lunarMonthNames[month] || `${month}月`) : '正月';
  const dName = day ? (lunarDayNames[day] || `${day}日`) : '初一';
  const leapPrefix = isLeap ? '闰' : '';
  return `${year}年${leapPrefix}${mName}${dName}`;
}

// ─── 核心四柱排盘引擎（基于 lunar-javascript EightChar）────────

export interface WuXingCount {
  木: number; 火: number; 土: number; 金: number; 水: number;
}

export interface ShiShenInfo {
  position: string;    // 年干/年支/月干/月支/日干/日支/时干/时支
  character: string;   // 天干或地支字
  wuXing: WuXing;      // 五行属性
  shiShen: string;     // 十神（日干自身为"日主"）
}

export interface BaZiResult {
  // 四柱
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  hourPillar: string;
  // 各柱天干地支
  yearGan: string; yearZhi: string;
  monthGan: string; monthZhi: string;
  dayGan: string; dayZhi: string;
  hourGan: string; hourZhi: string;
  // 日期信息
  solarDate: { year: number; month: number; day: number };
  lunarDate: LunarDateInfo | null;
  solarStr: string;
  lunarStr: string;
  // 原始输入显示
  originalInput: string;
  convertedSolar: string;
  // 时辰
  hourLabel: string;
  // 生肖
  animal: string;
  // 五行统计
  wuXingCount: WuXingCount;
  // 十神
  shiShen: ShiShenInfo[];
  // 日主（日干）
  dayMaster: string;
  // 日主五行
  dayMasterElement: WuXing;
}

/**
 * 获取地支本气天干
 */
function getZhiMainGan(zhi: string): string {
  const map: Record<string, string> = {
    '子': '癸', '丑': '己', '寅': '甲', '卯': '乙', '辰': '戊', '巳': '丙',
    '午': '丁', '未': '己', '申': '庚', '酉': '辛', '戌': '戊', '亥': '壬',
  };
  return map[zhi] || '';
}

function countWuXing(pillars: { gan: string; zhi: string }[]): WuXingCount {
  const count: WuXingCount = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
  for (const p of pillars) {
    if (p.gan) count[ganWuXing[p.gan]]++;
    if (p.zhi) count[zhiWuXing[p.zhi]]++;
  }
  return count;
}

function calcShiShen(dayGan: string, pillars: { gan: string; zhi: string }[]): ShiShenInfo[] {
  const positions = ['年干', '年支', '月干', '月支', '日干', '日支', '时干', '时支'];
  const result: ShiShenInfo[] = [];

  for (let i = 0; i < pillars.length; i++) {
    const p = pillars[i];

    // 天干十神
    if (p.gan) {
      const ss = i === 2 ? '日主' : (shiShenMap[dayGan]?.[p.gan] || '');
      result.push({
        position: positions[i * 2],
        character: p.gan,
        wuXing: ganWuXing[p.gan],
        shiShen: ss,
      });
    }

    // 地支藏干十神（简化：只算本气）
    if (p.zhi) {
      const zhiMainGan = getZhiMainGan(p.zhi);
      const ss = shiShenMap[dayGan]?.[zhiMainGan] || '';
      result.push({
        position: positions[i * 2 + 1],
        character: p.zhi,
        wuXing: zhiWuXing[p.zhi],
        shiShen: ss,
      });
    }
  }

  return result;
}

/**
 * 完整四柱排盘 —— 基于 lunar-javascript EightChar API
 *
 * 流程：
 * 1. 农历输入先转阳历（lunar-javascript Lunar.fromYmd）
 * 2. 构造 Solar（带时辰小时数）→ Lunar → EightChar
 * 3. EightChar 提供权威四柱（立春年柱/节气月柱/精确日柱/时柱）
 * 4. 五行统计 + 十神
 */
export function calculateBaZi(
  year: number, month: number, day: number,
  hourZhi: string | null,
  calendar: 'solar' | 'lunar',
  isLeapMonth = false
): BaZiResult | null {
  try {
    // 1. 构造 Solar 对象（统一转阳历）
    let solar: InstanceType<typeof Solar>;
    let originalInput = '';
    let convertedSolar = '';

    if (calendar === 'lunar') {
      // 农历 → 阳历
      const lunar = isLeapMonth
        ? Lunar.fromYmd(year, -Math.abs(month), day) // 负数表示闰月
        : Lunar.fromYmd(year, month, day);
      const solarFromLunar = lunar.getSolar();
      originalInput = `农历：${formatLunarDate(year, month, day, isLeapMonth)}`;
      const hourNum = hourZhi ? (shiChenHourMap[hourZhi.replace('时', '')] ?? 12) : 12;
      solar = Solar.fromYmdHms(
        solarFromLunar.getYear(),
        solarFromLunar.getMonth(),
        solarFromLunar.getDay(),
        hourNum, 0, 0
      );
      convertedSolar = `阳历：${formatSolarDate(solar.getYear(), solar.getMonth(), solar.getDay())}`;
    } else {
      originalInput = `阳历：${formatSolarDate(year, month, day)}`;
      const hourNum = hourZhi ? (shiChenHourMap[hourZhi.replace('时', '')] ?? 12) : 12;
      solar = Solar.fromYmdHms(year, month, day, hourNum, 0, 0);
    }

    // 2. 通过 lunar-javascript 计算 Four Pillars
    const lunar = solar.getLunar();
    const ec = EightChar.fromLunar(lunar);

    // 年柱
    const yearGanZhi = ec.getYear(); // e.g. "壬戌"
    const yearGan = yearGanZhi.charAt(0);
    const yearZhi = yearGanZhi.charAt(1);

    // 月柱
    const monthGanZhi = ec.getMonth();
    const monthGan = monthGanZhi.charAt(0);
    const monthZhi = monthGanZhi.charAt(1);

    // 日柱
    const dayGanZhi = ec.getDay();
    const dayGan = dayGanZhi.charAt(0);
    const dayZhi = dayGanZhi.charAt(1);

    // 时柱
    let hourGanStr = '';
    let hourZhiStr = '';
    let hourPillarStr = '';
    let hourLabel = '';
    if (hourZhi) {
      const zhiChar = hourZhi.replace('时', '');
      const timeGanZhi = ec.getTime(zhiChar as '子'|'丑'|'寅'|'卯'|'辰'|'巳'|'午'|'未'|'申'|'酉'|'戌'|'亥');
      hourGanStr = timeGanZhi.charAt(0);
      hourZhiStr = timeGanZhi.charAt(1);
      hourPillarStr = timeGanZhi;
      hourLabel = shiChenMap[zhiChar] || '';
    }

    // 3. 农历信息
    const lunarInfo = solarToLunar(solar.getYear(), solar.getMonth(), solar.getDay());
    if (calendar === 'solar' && lunarInfo) {
      convertedSolar = `农历：${formatLunarDate(lunarInfo.year, lunarInfo.month, lunarInfo.day, lunarInfo.isLeap)}`;
    }

    // 4. 生肖（以立春为界的年支）
    const animalMap: Record<string, string> = {
      '子': '鼠', '丑': '牛', '寅': '虎', '卯': '兔', '辰': '龙', '巳': '蛇',
      '午': '马', '未': '羊', '申': '猴', '酉': '鸡', '戌': '狗', '亥': '猪',
    };

    // 5. 四柱集合
    const pillars = [
      { gan: yearGan, zhi: yearZhi },
      { gan: monthGan, zhi: monthZhi },
      { gan: dayGan, zhi: dayZhi },
      hourZhi ? { gan: hourGanStr, zhi: hourZhiStr } : { gan: '', zhi: '' },
    ];

    // 6. 五行统计
    const wuXingCount = countWuXing(pillars.filter(p => p.gan || p.zhi));

    // 7. 十神
    const shiShen = calcShiShen(dayGan, pillars);

    return {
      yearPillar: yearGan + yearZhi,
      monthPillar: monthGan + monthZhi,
      dayPillar: dayGan + dayZhi,
      hourPillar: hourPillarStr,
      yearGan, yearZhi,
      monthGan, monthZhi,
      dayGan, dayZhi,
      hourGan: hourGanStr, hourZhi: hourZhiStr,
      solarDate: { year: solar.getYear(), month: solar.getMonth(), day: solar.getDay() },
      lunarDate: lunarInfo,
      solarStr: formatSolarDate(solar.getYear(), solar.getMonth(), solar.getDay()),
      lunarStr: lunarInfo ? formatLunarDate(lunarInfo.year, lunarInfo.month, lunarInfo.day, lunarInfo.isLeap) : '',
      originalInput,
      convertedSolar,
      hourLabel,
      animal: animalMap[yearZhi] || '',
      wuXingCount,
      shiShen,
      dayMaster: dayGan,
      dayMasterElement: ganWuXing[dayGan] || '土',
    };
  } catch (e) {
    console.error('排盘计算失败:', e);
    return null;
  }
}

// ─── 时辰工具 ───────────────────────────────────────────────

/** 所有12时辰 */
export const ALL_SHI_CHEN = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;
export type ShiChen = typeof ALL_SHI_CHEN[number];

/** 获取时辰的显示名称 */
export function getShiChenLabel(zhi: string): string {
  return shiChenMap[zhi] || zhi + '时';
}

/** 获取时辰的时间范围 */
export function getShiChenTimeRange(zhi: string): string {
  const ranges: Record<string, string> = {
    '子': '23:00-01:00', '丑': '01:00-03:00', '寅': '03:00-05:00', '卯': '05:00-07:00',
    '辰': '07:00-09:00', '巳': '09:00-11:00', '午': '11:00-13:00', '未': '13:00-15:00',
    '申': '15:00-17:00', '酉': '17:00-19:00', '戌': '19:00-21:00', '亥': '21:00-23:00',
  };
  return ranges[zhi] || '';
}

/** 从小时数推算时辰 */
export function getShiChenFromHour(hour: number): ShiChen {
  if (hour === 23 || hour === 0) return '子';
  return ALL_SHI_CHEN[Math.floor((hour + 1) / 2)];
}

/** 解析用户输入文本中的时辰 */
export function parseShiChenFromInput(input: string): ShiChen | null {
  // 尝试匹配 "X时" 或直接匹配地支
  for (const zhi of ALL_SHI_CHEN) {
    if (input.includes(zhi + '时') || input.includes(zhi)) {
      return zhi;
    }
  }
  // 尝试匹配数字时间
  const hourMatch = input.match(/(\d{1,2})[点时:：]/);
  if (hourMatch) {
    return getShiChenFromHour(parseInt(hourMatch[1]));
  }
  return null;
}
