// ===== 脸谱 URL 池（本地资源） =====
export const MASK_URLS: Record<string, string> = {
  '红生': '/images/masks_0_hongsheng.jpg',
  '黑净': '/images/masks_1_heijing.jpg',
  '白旦': '/images/masks_2_baidan.jpg',
  '丑角': '/images/masks_3_choujiao.jpg',
  '老生': '/images/masks_4_lasheng.jpg',
};

// ===== 封面 URL 池（本地资源） =====
export const COVER_URLS: Record<string, string> = {
  '窦娥冤': '/images/covers_doue.jpg',
  '赵氏孤儿': '/images/covers_zhaoshi_new.jpg',
  '出潼关': '/images/covers_chutongguan.jpg',
  '西厢记': '/images/covers_xixiangji.jpg',
  '白蛇传': '/images/covers_baishezhuan.jpg',
  '白蛇传·游湖': '/images/covers_baishechuan_youhu.jpg',
  '小宴': '/images/covers_xiaoyan.jpg',
  '苏三起解': '/images/covers_susanqijie.jpg',
  '打金枝·闹宫': '/images/covers_dajinzhi_naogong.jpg',
  '琵琶记·描容': '/images/covers_pipaji_miaorong.jpg',
  '琵琶记·吃糠': '/images/covers_pipaji_chikang.jpg',
  '薛刚反唐': '/images/covers_xuegangfantang.jpg',
  '三娘教子': '/images/covers_sanniangjiaozi.jpg',
};

// ===== 五行分类定义 =====
export interface WuxingCategory {
  id: string;
  name: string;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

export const WUXING_CATEGORIES: WuxingCategory[] = [
  {
    id: 'wood',
    name: '春木',
    label: '春木·生发舒展',
    color: '#5B8C5A',
    bgColor: '#F0F7EF',
    borderColor: '#5B8C5A',
    description: '木主生发，紧二性明快高亢，疏肝理气',
  },
  {
    id: 'fire',
    name: '夏火',
    label: '夏火·热闹激越',
    color: '#C75450',
    bgColor: '#FDF2F1',
    borderColor: '#C75450',
    description: '火主热烈，流水板欢快奔放，振奋心气',
  },
  {
    id: 'metal',
    name: '秋金',
    label: '秋金·肃穆悲凉',
    color: '#8B7E6A',
    bgColor: '#F7F5F2',
    borderColor: '#8B7E6A',
    description: '金主肃降，慢板深沉含蓄，润肺宁心',
  },
  {
    id: 'water',
    name: '冬水',
    label: '冬水·沉思内省',
    color: '#3D4F5F',
    bgColor: '#F0F3F6',
    borderColor: '#3D4F5F',
    description: '水主藏纳，二性板低沉内敛，固肾安神',
  },
  {
    id: 'earth',
    name: '中和',
    label: '中和·土德厚载',
    color: '#C9A96E',
    bgColor: '#FBF8F0',
    borderColor: '#C9A96E',
    description: '土主中和，稳板平和端庄，健脾和胃',
  },
];

// ===== 剧目数据（13 个，按五行分类） =====
export interface OperaPiece {
  id: string;
  name: string;
  wuxing: string;       // 五行分类 id
  wuxingName: string;   // 五行分类名
  actor: string;        // 演员
  maskType: string;     // 脸谱类型
  origin: string;       // 出处
  banShi: string;       // 板式
  healthNote: string;   // 一句话康养解读（≤30字）
  resourceType: 'audio' | 'video' | 'placeholder';
  resourceUrl: string;  // 资源链接
  resourceLabel: string; // 资源来源标签
  coverUrl: string;
  maskUrl: string;
  tagColor: string;     // 五行标签色
}

export const operaPieces: OperaPiece[] = [
  // ===== 春木（2） =====
  {
    id: 'wm-01',
    name: '白蛇传·游湖',
    wuxing: 'wood',
    wuxingName: '春木',
    actor: '武俊英',
    maskType: '白旦',
    origin: '传统剧目',
    banShi: '紧二性',
    healthNote: '木主生发，疏肝理气，宜春日养肝',
    resourceType: 'placeholder',
    resourceUrl: '',
    resourceLabel: '即将上线',
    coverUrl: COVER_URLS['白蛇传·游湖'],
    maskUrl: MASK_URLS['白旦'],
    tagColor: '#5B8C5A',
  },
  {
    id: 'wm-02',
    name: '西厢记·听琴',
    wuxing: 'wood',
    wuxingName: '春木',
    actor: '武俊英',
    maskType: '红生',
    origin: '元代·王实甫',
    banShi: '紧二性',
    healthNote: '明快高亢，生发肝气，宜晨起听赏',
    resourceType: 'placeholder',
    resourceUrl: '',
    resourceLabel: '即将上线',
    coverUrl: COVER_URLS['西厢记'],
    maskUrl: MASK_URLS['红生'],
    tagColor: '#5B8C5A',
  },

  // ===== 夏火（3） =====
  {
    id: 'wf-01',
    name: '小宴',
    wuxing: 'fire',
    wuxingName: '夏火',
    actor: '王艺华/景雪变',
    maskType: '红生',
    origin: '传统折子戏',
    banShi: '流水板',
    healthNote: '火主热烈，振奋心气，宜午后消沉时',
    resourceType: 'placeholder',
    resourceUrl: '',
    resourceLabel: '即将上线',
    coverUrl: COVER_URLS['小宴'],
    maskUrl: MASK_URLS['红生'],
    tagColor: '#C75450',
  },
  {
    id: 'wf-02',
    name: '苏三起解',
    wuxing: 'fire',
    wuxingName: '夏火',
    actor: '武俊英',
    maskType: '白旦',
    origin: '传统剧目',
    banShi: '流水板',
    healthNote: '欢快奔放，活血通络，宜气郁不畅时',
    resourceType: 'placeholder',
    resourceUrl: '',
    resourceLabel: '即将上线',
    coverUrl: COVER_URLS['苏三起解'],
    maskUrl: MASK_URLS['白旦'],
    tagColor: '#C75450',
  },
  {
    id: 'wf-03',
    name: '打金枝·闹宫',
    wuxing: 'fire',
    wuxingName: '夏火',
    actor: '武俊英',
    maskType: '白旦',
    origin: '传统剧目',
    banShi: '流水板',
    healthNote: '热闹喜庆，调畅心气，宜心情低落时',
    resourceType: 'placeholder',
    resourceUrl: '',
    resourceLabel: '即将上线',
    coverUrl: COVER_URLS['打金枝·闹宫'],
    maskUrl: MASK_URLS['白旦'],
    tagColor: '#C75450',
  },

  // ===== 秋金（3） =====
  {
    id: 'wg-01',
    name: '西厢记·长亭送别',
    wuxing: 'metal',
    wuxingName: '秋金',
    actor: '武俊英',
    maskType: '白旦',
    origin: '元代·王实甫',
    banShi: '慢板',
    healthNote: '金主肃降，慢板润肺宁心，宜秋夜静听',
    resourceType: 'placeholder',
    resourceUrl: '',
    resourceLabel: '即将上线',
    coverUrl: COVER_URLS['西厢记'],
    maskUrl: MASK_URLS['白旦'],
    tagColor: '#8B7E6A',
  },
  {
    id: 'wg-02',
    name: '琵琶记·描容',
    wuxing: 'metal',
    wuxingName: '秋金',
    actor: '杨晓萍',
    maskType: '白旦',
    origin: '元代·高明',
    banShi: '慢板',
    healthNote: '深沉含蓄，敛肺益气，宜心浮气躁时',
    resourceType: 'placeholder',
    resourceUrl: '',
    resourceLabel: '即将上线',
    coverUrl: COVER_URLS['琵琶记·描容'],
    maskUrl: MASK_URLS['白旦'],
    tagColor: '#8B7E6A',
  },
  {
    id: 'wg-03',
    name: '赵氏孤儿·搜孤救孤',
    wuxing: 'metal',
    wuxingName: '秋金',
    actor: '孔向东',
    maskType: '老生',
    origin: '元代·纪君祥',
    banShi: '慢板',
    healthNote: '悲壮肃穆，宣泄肺气，宜压抑难抒时',
    resourceType: 'placeholder',
    resourceUrl: '',
    resourceLabel: '即将上线',
    coverUrl: COVER_URLS['赵氏孤儿'],
    maskUrl: MASK_URLS['老生'],
    tagColor: '#8B7E6A',
  },

  // ===== 冬水（2） =====
  {
    id: 'ww-01',
    name: '琵琶记·吃糠',
    wuxing: 'water',
    wuxingName: '冬水',
    actor: '蒲州梆子本',
    maskType: '白旦',
    origin: '元代·高明',
    banShi: '二性板',
    healthNote: '水主藏纳，低沉内敛，固肾安神，宜入夜',
    resourceType: 'placeholder',
    resourceUrl: '',
    resourceLabel: '即将上线',
    coverUrl: COVER_URLS['琵琶记·吃糠'],
    maskUrl: MASK_URLS['白旦'],
    tagColor: '#3D4F5F',
  },
  {
    id: 'ww-02',
    name: '出潼关·英雄武谋',
    wuxing: 'water',
    wuxingName: '冬水',
    actor: '待补',
    maskType: '黑净',
    origin: '传统剧目',
    banShi: '二性板',
    healthNote: '深沉苍劲，补肾纳气，宜冬夜沉思',
    resourceType: 'placeholder',
    resourceUrl: '',
    resourceLabel: '即将上线',
    coverUrl: COVER_URLS['出潼关'],
    maskUrl: MASK_URLS['黑净'],
    tagColor: '#3D4F5F',
  },

  // ===== 中和·土（3） =====
  {
    id: 'we-01',
    name: '窦娥冤·六月飞雪',
    wuxing: 'earth',
    wuxingName: '中和',
    actor: '武俊英',
    maskType: '白旦',
    origin: '元代·关汉卿',
    banShi: '稳板',
    healthNote: '土主中和，悲而不伤，健脾和胃，宜午后',
    resourceType: 'placeholder',
    resourceUrl: '',
    resourceLabel: '即将上线',
    coverUrl: COVER_URLS['窦娥冤'],
    maskUrl: MASK_URLS['白旦'],
    tagColor: '#C9A96E',
  },
  {
    id: 'we-02',
    name: '薛刚反唐',
    wuxing: 'earth',
    wuxingName: '中和',
    actor: '郭泽民',
    maskType: '红生',
    origin: '传统剧目',
    banShi: '稳板',
    healthNote: '刚柔并济，调和脾胃，宜饭后消食时',
    resourceType: 'placeholder',
    resourceUrl: '',
    resourceLabel: '即将上线',
    coverUrl: COVER_URLS['薛刚反唐'],
    maskUrl: MASK_URLS['红生'],
    tagColor: '#C9A96E',
  },
  {
    id: 'we-03',
    name: '三娘教子',
    wuxing: 'earth',
    wuxingName: '中和',
    actor: '田娥',
    maskType: '老生',
    origin: '传统剧目',
    banShi: '稳板',
    healthNote: '温和敦厚，养脾益气，宜全家共赏',
    resourceType: 'placeholder',
    resourceUrl: '',
    resourceLabel: '即将上线',
    coverUrl: COVER_URLS['三娘教子'],
    maskUrl: MASK_URLS['老生'],
    tagColor: '#C9A96E',
  },
];

// ===== 节气—五行—剧目推荐映射 =====
export const SEASON_WUXING_MAP: Record<string, string> = {
  '立春': 'wood', '雨水': 'wood', '惊蛰': 'wood', '春分': 'wood',
  '清明': 'wood', '谷雨': 'wood',
  '立夏': 'fire', '小满': 'fire', '芒种': 'fire', '夏至': 'fire',
  '小暑': 'fire', '大暑': 'fire',
  '立秋': 'metal', '处暑': 'metal', '白露': 'metal', '秋分': 'metal',
  '寒露': 'metal', '霜降': 'metal',
  '立冬': 'water', '小雪': 'water', '大雪': 'water', '冬至': 'water',
  '小寒': 'water', '大寒': 'water',
};

// ===== 蒲剧文化知识库 =====

// 蒲剧概述
export const operaOverview = {
  title: '蒲剧概述',
  content: '蒲剧，又称蒲州梆子，因兴于古蒲州（今山西永济）而得名，是流传于山西省运城、临汾及晋陕豫交汇地区的传统戏曲剧种。蒲剧历史逾八百年，是中国现存最早的戏曲剧种（无之一），被尊为"中国戏曲鼻祖"。其声腔系统（梆子腔）是后世中国北方众多剧种的共同源头，对中国戏曲从曲牌体向板腔体的演变起到了奠基作用。2006年，蒲剧被列入第一批国家级非物质文化遗产名录。',
  highlights: ['历史逾八百年', '中国戏曲鼻祖', '国家级非遗'],
};

// 蒲剧为什么是戏曲鼻祖
export const operaAncestorReasons = [
  {
    id: 'r1',
    title: '最早，唯一最早',
    content: '蒲剧的历史可上溯八百余年，远早于昆曲及后世各大梆子腔剧种，是中国戏曲史上现存最早形成的剧种（无之一），是中国戏曲从早期曲牌体走向成熟板腔体的关键一环。',
  },
  {
    id: 'r2',
    title: '梆子腔的源头',
    content: '蒲剧是最早形成的梆子腔剧种，明末清初已在蒲州（今永济）一带成型。梆子腔是中国戏曲最重要的声腔系统之一，影响了北方绝大多数剧种。',
  },
  {
    id: 'r3',
    title: '衍生关系广泛',
    content: '从蒲剧直接或间接衍生出了山西梆子（晋剧）、北路梆子、上党梆子、河北梆子、河南梆子（豫剧）、陕西梆子（秦腔）等多个剧种。京剧中的西皮腔也深受梆子腔影响。',
  },
  {
    id: 'r4',
    title: '声腔传播枢纽',
    content: '蒲州地处晋陕豫三省交界，是南北文化交汇之地，蒲剧的声腔从这里向四面八方辐射，成为北方戏曲传播的地理枢纽。',
  },
  {
    id: 'r5',
    title: '从巫到戏的活化石',
    content: '蒲剧保留了大量从早期傩戏、巫舞演化而来的程式化表演与高腔唱法，是研究中国戏曲"巫—祭—戏"演化的活样本。',
  },
];

// 蒲剧经典剧目
export const classicPlays = [
  { name: '窦娥冤', type: '悲剧', desc: '关汉卿名作，蒲剧版以唱腔悲怆著称' },
  { name: '赵氏孤儿', type: '悲剧', desc: '程婴救孤的忠义故事，蒲剧代表剧目' },
  { name: '西厢记', type: '爱情剧', desc: '原创地就在蒲州（永济普救寺），蒲剧演绎别有风味' },
  { name: '杀狗', type: '折子戏', desc: '蒲剧经典折子戏，表演功力见真章' },
  { name: '归宗图', type: '历史剧', desc: '薛家将故事，蒲剧特有剧目' },
  { name: '火焰驹', type: '传统剧', desc: '忠良之后蒙冤，蒲剧唱腔感染力极强' },
];

// 蒲剧名角
export interface OperaMaster {
  name: string;
  years: string;
  title: string;
  description: string;
  representativeWorks: string[];
}

export const operaMasters: OperaMaster[] = [
  {
    name: '阎逢春',
    years: '1917-1975',
    title: '蒲剧王',
    description: '蒲剧须生泰斗，被誉为"蒲剧王"。创"浮音"行腔，真假声转换自如，高腔如裂帛、低腔如诉语，开蒲剧须生一代新风。帽翅功独步梨园，双翅同旋、异向、交替，堪称绝技。代表剧目《杀狗》《归宗图》均为蒲剧经典范式。',
    representativeWorks: ['杀狗', '归宗图', '舍饭', '芦花'],
  },
  {
    name: '张庆奎',
    years: '1924-2001',
    title: '十三红',
    description: '蒲剧须生名家，艺名"十三红"，张派创始人。嗓音宽厚明亮、穿透力极强，行腔稳中见巧、刚柔相济。与阎逢春并称蒲剧"南北二杰"，形成蒲剧须生艺术的另一座高峰。',
    representativeWorks: ['法门寺', '出棠邑', '三家店', '未央宫'],
  },
  {
    name: '王秀兰',
    years: '1932-',
    title: '蒲旦宗师',
    description: '蒲剧旦角宗师，被誉为"蒲剧皇后""蒲旦宗师"。师承孙广盛，深得蒲剧旦角真传，唱腔婉转流丽、做工细腻入微。毕生办学授徒，桃李满晋南，2022年获蒲剧艺术传承终身成就奖，至今健在，九十四岁仍心系蒲剧传承。',
    representativeWorks: ['西厢记', '窦娥冤', '少华山', '燕燕'],
  },
];

export const otherArtists = [
  { role: '须生', names: '郭泽民、张有万' },
  { role: '旦角', names: '田郁文、温明轩' },
  { role: '净角', names: '杨翠花' },
  { role: '丑角', names: '李安华' },
];

// 蒲剧艺术特色
export const operaArtFeatures = {
  singing: {
    title: '唱腔',
    points: [
      '高亢激越、粗犷豪放，兼具慷慨悲歌与细腻抒情',
      '以梆子击节，板式丰富：慢板、二性、流水、介板、滚白等',
      '"一唱三叹"是蒲剧唱腔的标志性特点',
    ],
  },
  acting: {
    title: '表演',
    points: [
      '做工讲究，身段丰富',
      '甩发、髯口功、翎子功等特技突出',
      '注重"唱做并重"，不偏废',
    ],
  },
  roles: {
    title: '行当',
    points: [
      '生、旦、净、丑齐全',
      '须生戏是蒲剧的特色，在全国戏曲中独树一帜',
    ],
  },
  orchestra: {
    title: '乐队',
    points: [
      '文场：板胡为主奏，配二胡、三弦、笛子等',
      '武场：梆子为主，配鼓板、锣、钹等',
      '梆子的使用是蒲剧最鲜明的标识',
    ],
  },
};

// 蒲剧与汾城
export const fenchengOpera = {
  title: '蒲剧与汾城',
  content: '汾城（今襄汾县汾城镇）位于山西省临汾市，是晋南文化重镇。蒲剧在汾城有深厚的群众基础：当地至今保留着庙会唱蒲剧的传统，蒲剧的方言基础与汾城方言同属晋南方言体系，汾城的古戏台、古建筑群为蒲剧提供了天然的文化空间。',
};

// 汾城风物
export const fenchengCulture = {
  history: {
    title: '历史地位',
    content: '汾城镇历史悠久，古称"太平县"，是国家级历史文化名镇。镇内保存有大量明清古建筑，被誉为"古建筑博物馆"。',
  },
  architecture: {
    title: '古建筑群',
    items: [
      '城隍庙：明代建筑，保存完整',
      '文庙：规模宏大，为县级文庙代表',
      '学宫、鼓楼、古商铺等：形成完整的古建筑群落',
      '古戏台：多座清代戏台保存至今，与蒲剧文化一脉相承',
    ],
  },
  folk: {
    title: '民俗活动',
    items: [
      '庙会：传统庙会是蒲剧演出的重要场合',
      '社火：春节社火活动丰富多彩',
      '面塑：汾城面塑是省级非遗项目',
      '剪纸：晋南剪纸风格独特',
    ],
  },
  food: {
    title: '汾城美食',
    items: [
      '汾城羊肉锅子：当地招牌美食',
      '晋南油酥饼：酥脆层次分明',
      '馈（kuì）：晋南特色面食',
      '各种面食：刀削面、剔尖、拨鱼等',
    ],
  },
  dialect: {
    title: '方言趣谈',
    content: '汾城方言属晋南方言，保留大量古语词。入声字的保留是晋语的重要特征，方言中有许多生动有趣的俗语和歇后语。',
  },
};

// 蒲剧科普数据（保留旧接口兼容）
export interface OperaKnowledge {
  id: string;
  title: string;
  content: string;
  icon: string;
}

export const operaKnowledge: OperaKnowledge[] = [
  {
    id: 'origin',
    title: '蒲剧起源',
    content: '蒲剧，又称蒲州梆子，因兴起于山西蒲州（今永济市）而得名。蒲剧历史逾八百年，是中国现存最早的戏曲剧种（无之一），被尊为"中国戏曲鼻祖"。其声腔系统（梆子腔）是后世中国北方众多剧种的共同源头。2006年被列入首批国家级非物质文化遗产名录。',
    icon: 'scroll',
  },
  {
    id: 'mask',
    title: '蒲剧脸谱',
    content: '蒲剧脸谱以红、黑、白三色为基础，各色寓意分明：红色表忠义刚正，如关公之面如重枣；黑色表刚直不阿，如包拯之铁面无私；白色表奸诈多疑，如曹操之白面奸臣。脸谱勾画讲究对称与夸张，一笔一画皆有法度，是中国戏曲脸谱艺术的瑰宝。',
    icon: 'mask',
  },
  {
    id: 'masters',
    title: '蒲剧名家',
    content: '蒲剧名家辈出，代有传人。阎逢春被誉为"蒲剧王"，创"浮音"行腔与帽翅功绝技；张庆奎艺名"十三红"，张派创始人，与阎逢春并称"南北二杰"；王秀兰被誉为"蒲旦宗师"，师承孙广盛，毕生办学授徒，2022年获蒲剧艺术传承终身成就奖。此外还有郭泽民、田郁文、杨翠花、李安华等各行当名家，形成了蒲剧艺术的黄金时代。',
    icon: 'people',
  },
];
