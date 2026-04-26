(function () {
  const courses = {
    back: {
      title: "《背影》",
      author: "朱自清",
      stage: "初一 · 亲情散文",
      genre: "回忆性散文",
      kicker: "课程内容页 · 亲情叙事",
      subtitle: "从一次送别、一趟买橘子的背影里，读懂中国散文里最克制也最深沉的父爱。",
      tags: ["细节描写", "父子亲情", "叙事节奏", "情感留白"],
      bannerDesc: "本页补充了《背影》的独立内容梳理，包括作品背景、阅读重点、学习路径和名句摘录。当前完整交互流程仍以《荷塘月色》为演示模板。",
      overview: [
        ["作者", "朱自清，现代散文家、诗人，以语言清润、情感真挚见长。"],
        ["时代背景", "写于家庭变故与社会动荡之后，文字中带有浓重的个人记忆色彩。"],
        ["核心母题", "父爱、成长、理解与迟来的体认。"],
        ["内容线索", "回忆送别场景，聚焦父亲翻越月台买橘子的动作。"],
        ["阅读提示", "注意动作、姿态、语言节制如何共同塑造情感张力。"],
      ],
      quote: "我看见他戴着黑布小帽，穿着黑布大马褂，深青布棉袍，蹒跚地走到铁道边。",
      quoteSource: "朱自清《背影》",
      stats: [
        { value: "1个", label: "核心意象", desc: "全文用“背影”统摄父爱与记忆。" },
        { value: "3层", label: "情感推进", desc: "不解、感动、理解，逐层深入。" },
        { value: "4处", label: "细节抓手", desc: "衣着、动作、步态、语言共同造情。" },
      ],
      focuses: [
        { title: "细节如何写情", desc: "父亲不直接抒情，作者借动作与姿态让情感自己浮现。" },
        { title: "为什么反复写背影", desc: "背影既是视觉焦点，也是情感最难直言时的表达方式。" },
        { title: "叙述者的成长", desc: "文章真正动人的地方，不只是父爱，更是“我”终于懂得父爱。" },
      ],
      summary: "文章以回忆展开，从家中困顿、祖母去世、父亲送站写起，最后将镜头凝聚到“攀爬月台买橘子”的背影上。看似平静的叙述，实际上把儿子对父亲的理解变化一层层推出来。它的力量不在夸张，而在节制，在把最重的情感压进最普通的动作里。",
      tasks: [
        { title: "圈出动作链", desc: "找出父亲过铁道、探身、攀爬、倾身等动作，体会其中的艰难。" },
        { title: "比较称呼变化", desc: "注意“我”叙述时的态度变化，理解情感从迟钝到被触动的过程。" },
        { title: "练习细节仿写", desc: "尝试用一个动作场景去写“爱”，不要直接说爱，而是让细节说话。" },
      ],
      path: [
        { name: "读情节", desc: "先厘清送站事件的时间顺序。", current: false },
        { name: "看细节", desc: "抓动作、衣着、步态等描写。", current: true },
        { name: "悟情感", desc: "理解“我”的情绪变化。", current: false },
        { name: "做仿写", desc: "把细节描写迁移到自己的表达。", current: false },
      ],
      goals: [
        "理解“背影”为什么能成为整篇文章的情感中心。",
        "学会用动作细节分析人物情感，而不是停留在事件表面。",
        "把握回忆性散文“淡叙述、深情感”的表达特点。",
        "尝试用生活化场景写出隐忍而真实的情感。",
      ],
      scene: "back",
    },
    baicao: {
      title: "《从百草园到三味书屋》",
      author: "鲁迅",
      stage: "初一 · 童年回忆",
      genre: "回忆散文",
      kicker: "课程内容页 · 童年经验",
      subtitle: "在自由的园子与规训的书塾之间，读出鲁迅童年经验里的趣味、反差与成长。",
      tags: ["童年视角", "场景对比", "趣味描写", "回忆散文"],
      bannerDesc: "本页补充了《从百草园到三味书屋》的独立内容页，用于支撑课程列表中的独立阅读入口。",
      overview: [
        ["作者", "鲁迅，现代文学奠基者，文字锋利而富有生命力。"],
        ["时代背景", "写童年回忆，借回忆折射儿童世界与教育场景的对照。"],
        ["核心母题", "童趣、自由、规训、成长。"],
        ["内容线索", "百草园的乐趣 → 被送入书塾 → 书塾生活的复杂感受。"],
        ["阅读提示", "注意写景与写事如何共同制造“趣味”与“落差”。"],
      ],
      quote: "不必说碧绿的菜畦，光滑的石井栏，高大的皂荚树，紫红的桑椹。",
      quoteSource: "鲁迅《从百草园到三味书屋》",
      stats: [
        { value: "2个", label: "核心场景", desc: "百草园与三味书屋构成鲜明对照。" },
        { value: "多感官", label: "描写方式", desc: "视觉、听觉、触觉共同营造童年世界。" },
        { value: "1条", label: "成长暗线", desc: "从自由嬉戏走向学习规训。" },
      ],
      focuses: [
        { title: "百草园为什么迷人", desc: "景物不是静止名词堆积，而是充满动作、颜色和声音的童年宇宙。" },
        { title: "书屋真的只有压抑吗", desc: "作者并未简单否定书塾，而是写出儿童复杂的体验。" },
        { title: "对比结构怎么服务主题", desc: "两个空间切换，让“童趣”与“成长”同时成立。" },
      ],
      summary: "文章由“我的乐园”百草园起笔，写虫鸟草木、传说故事、雪地捕鸟，极富生气；随后转入三味书屋，用先生、课堂与私下趣事构成新的童年图景。文章并非简单二分，而是在对比中保留了童年经验的丰富层次。",
      tasks: [
        { title: "找出感官描写", desc: "从颜色、声音、触感入手，分析鲁迅如何把景物写活。" },
        { title: "比较两处空间", desc: "百草园和书屋各自代表什么样的童年经验。" },
        { title: "试做对比写作", desc: "用两个学习或生活空间的对比，写出自己的感受变化。" },
      ],
      path: [
        { name: "读场景", desc: "梳理百草园与书屋两大空间。", current: false },
        { name: "抓趣味", desc: "分析景物描写与趣事叙述。", current: true },
        { name: "看对比", desc: "理解自由与规训的反差。", current: false },
        { name: "做迁移", desc: "尝试写自己的童年空间。", current: false },
      ],
      goals: [
        "感受鲁迅笔下童年世界的生命力与趣味。",
        "理解场景切换如何带出文章主题。",
        "学会分析回忆散文中的空间描写与情感变化。",
        "尝试用细节和对比写自己的成长经验。",
      ],
      scene: "garden",
    },
    wisteria: {
      title: "《紫藤萝瀑布》",
      author: "宗璞",
      stage: "初一 · 托物言志",
      genre: "抒情散文",
      kicker: "课程内容页 · 景物象征",
      subtitle: "从一树盛放的紫藤萝出发，读懂生命如何在伤痛之后重新舒展。",
      tags: ["托物言志", "象征手法", "生命感悟", "抒情散文"],
      bannerDesc: "本页补充《紫藤萝瀑布》的独立内容页，帮助课程列表中的该书目形成完整入口。",
      overview: [
        ["作者", "宗璞，语言细腻，常在景物中寄寓深层人生感悟。"],
        ["时代背景", "写于个人与家庭经历沉重之后，花的盛放具有明显的精神象征意味。"],
        ["核心母题", "生命、重生、希望、时间流动。"],
        ["内容线索", "见花惊叹 → 回忆旧花与旧事 → 回到当下获得鼓舞。"],
        ["阅读提示", "抓住“花”的形态变化与作者心境变化之间的对应关系。"],
      ],
      quote: "花和人都会遇到各种各样的不幸，但是生命的长河是无止境的。",
      quoteSource: "宗璞《紫藤萝瀑布》",
      stats: [
        { value: "1树花", label: "核心意象", desc: "整篇围绕紫藤萝展开层层联想。" },
        { value: "2次", label: "时空切换", desc: "当下花景与旧日回忆相互映照。" },
        { value: "3层", label: "主题递进", desc: "赏花、忆花、悟生命。" },
      ],
      focuses: [
        { title: "为什么叫“瀑布”", desc: "比喻把静态花景写成奔涌流动的生命力量。" },
        { title: "景物如何象征人生", desc: "花的命运与人的遭际相互照亮，形成托物言志。" },
        { title: "情感转折从哪里出现", desc: "从凝视盛放开始，作者内心由沉重转向开阔。" },
      ],
      summary: "文章从眼前一树灿烂盛开的紫藤萝写起，先描摹它的颜色、流动感与层次，再引出旧日花树衰败与家族往事的回忆，最后回到眼前，完成从悲痛到振作的精神提升。景物描写不仅是“看见”，更是一种生命体悟的路径。",
      tasks: [
        { title: "找比喻和拟人", desc: "分析“瀑布”“流动”等词语如何增强生命张力。" },
        { title: "梳理心境转折", desc: "标出作者情绪变化最明显的语句。" },
        { title: "做象征练习", desc: "选择一个自然物象，尝试写它所承载的人生感受。" },
      ],
      path: [
        { name: "赏花景", desc: "从视觉描写进入文本。", current: false },
        { name: "识象征", desc: "理解花景背后的生命意味。", current: true },
        { name: "读转折", desc: "看作者如何由伤转悟。", current: false },
        { name: "写感悟", desc: "尝试用物象表达内心。", current: false },
      ],
      goals: [
        "理解景物描写如何承载抽象主题。",
        "掌握托物言志类文本的基本分析路径。",
        "感受文章由景入情、由情入理的结构方式。",
        "尝试将自然物象转化为情感表达资源。",
      ],
      scene: "wisteria",
    },
    spring: {
      title: "《春》",
      author: "朱自清",
      stage: "初一 · 写景名篇",
      genre: "写景散文",
      kicker: "课程内容页 · 春景描写",
      subtitle: "在春草、春花、春风和春雨里，学习朱自清如何把季节写成一场有节奏的苏醒。",
      tags: ["写景散文", "修辞赏析", "多感官描写", "节奏感"],
      bannerDesc: "本页补充了《春》的独立内容页，可直接从课程列表进入查看。",
      overview: [
        ["作者", "朱自清，现代散文代表作家，语言清新自然。"],
        ["时代背景", "作品以礼赞自然和生命为核心，展现温润明朗的审美气质。"],
        ["核心母题", "生机、希望、苏醒、向上。"],
        ["内容线索", "盼春 → 绘春 → 赞春。"],
        ["阅读提示", "注意景物层层铺开时的顺序感、节奏感与修辞密度。"],
      ],
      quote: "一年之计在于春，刚起头儿，有的是工夫，有的是希望。",
      quoteSource: "朱自清《春》",
      stats: [
        { value: "5幅", label: "春景画面", desc: "草、花、风、雨、人，层层展开。" },
        { value: "多修辞", label: "语言特点", desc: "比喻、拟人、排比共同构成明快节奏。" },
        { value: "1种", label: "整体情感", desc: "对春天和生命的热爱与赞美。" },
      ],
      focuses: [
        { title: "为什么读起来有节奏", desc: "短句、排比、反复等方式共同形成朗读感。" },
        { title: "春景如何有层次", desc: "作者不是乱写景，而是按由物到人、由静到动的顺序展开。" },
        { title: "景中为什么有情", desc: "景物并非客观记录，而是作者情绪的温度投射。" },
      ],
      summary: "《春》先写人对春天的期待，再依次铺展春草、春花、春风、春雨和春天里的人们，最后用三个比喻赞美春天。全文明丽轻快，兼具画面感与音乐感，是中学写景散文学习的经典样本。",
      tasks: [
        { title: "分图赏读", desc: "把春草图、春花图、春风图、春雨图分别提炼出来。" },
        { title: "找修辞高密句", desc: "挑出比喻、拟人、排比密集的句子，分析其表达效果。" },
        { title: "仿写季节片段", desc: "用类似结构写“秋天的操场”或“雨后的校园”。" },
      ],
      path: [
        { name: "理顺序", desc: "先看文章如何组织画面。", current: false },
        { name: "赏语言", desc: "分析修辞和节奏。", current: true },
        { name: "悟情感", desc: "把握赞美春天的主调。", current: false },
        { name: "做仿写", desc: "迁移到自己的景物表达。", current: false },
      ],
      goals: [
        "掌握写景散文常见的层次展开方式。",
        "理解修辞如何增强景物的生动性与节奏感。",
        "感受文章明朗、昂扬的情感基调。",
        "尝试组织一段有画面感的季节描写。",
      ],
      scene: "spring",
    },
    winter: {
      title: "《济南的冬天》",
      author: "老舍",
      stage: "初一 · 城市写景",
      genre: "写景散文",
      kicker: "课程内容页 · 城市风景",
      subtitle: "在温晴、安静而柔和的冬景中，体会老舍如何把一座城市写得可亲可感。",
      tags: ["城市风景", "语言风格", "整体感知", "比较阅读"],
      bannerDesc: "本页补充了《济南的冬天》的独立内容页，用于支撑课程目录中的城市写景主题。",
      overview: [
        ["作者", "老舍，语言亲切生动，擅长以平实笔调写出生活温度。"],
        ["时代背景", "作品通过与北平等地冬景对比，突出济南冬天的独特气质。"],
        ["核心母题", "温晴、安适、可爱、城市气息。"],
        ["内容线索", "总写温晴 → 山景描写 → 水色描写。"],
        ["阅读提示", "重点体会“温暖”如何成为全文最核心的审美感受。"],
      ],
      quote: "这一圈小山在冬天特别可爱，好像是把济南放在一个小摇篮里。",
      quoteSource: "老舍《济南的冬天》",
      stats: [
        { value: "1个词", label: "总领全文", desc: "“温晴”概括了济南冬天的气质。" },
        { value: "2类景", label: "描写重点", desc: "山与水共同构成冬日城市图景。" },
        { value: "强对比", label: "写法特点", desc: "通过外地冬景反衬济南之好。" },
      ],
      focuses: [
        { title: "为什么强调温晴", desc: "这个词不仅描述气候，也决定了整篇文章的情感色调。" },
        { title: "山景如何写可爱", desc: "作者用拟人和比喻，把山写得像会护着人的存在。" },
        { title: "水色为什么重要", desc: "水的澄清和明亮，把冬天写得不冷、不硬，而是柔和。" },
      ],
      summary: "文章先用与北平、伦敦、热带地区的对比，指出济南冬天“温晴”的特点；接着重点写小山和薄雪，最后写清亮的水色。整篇文字不追求宏大，而是通过近距离、日常化的观察，写出城市冬景的温柔与亲近感。",
      tasks: [
        { title: "找对比句", desc: "分析文章开头的比较怎样服务中心特点。" },
        { title: "圈定修辞", desc: "标出描写小山和薄雪的关键比喻、拟人。" },
        { title: "练习城市写景", desc: "试写一处你熟悉城市角落的季节感。" },
      ],
      path: [
        { name: "抓特点", desc: "先锁定“温晴”这个总领词。", current: false },
        { name: "看山水", desc: "分析山景和水色的不同作用。", current: true },
        { name: "读语言", desc: "感受老舍语言的亲切自然。", current: false },
        { name: "做迁移", desc: "尝试写一座城市的季节印象。", current: false },
      ],
      goals: [
        "整体把握文章如何围绕一个核心特点组织内容。",
        "理解比喻、拟人在写景散文中的作用。",
        "感受老舍笔下城市风景的温度与亲切感。",
        "尝试写出一个城市空间的独特气质。",
      ],
      scene: "winter",
    },
    walk: {
      title: "《散步》",
      author: "莫怀戚",
      stage: "初二 · 家庭主题",
      genre: "叙事散文",
      kicker: "课程内容页 · 家庭关系",
      subtitle: "从一次普通散步读出责任、温情与家庭关系中细小却坚实的力量。",
      tags: ["家庭伦理", "细节解读", "主题归纳", "叙事散文"],
      bannerDesc: "本页补充《散步》的独立内容页，聚焦家庭主题阅读。",
      overview: [
        ["作者", "莫怀戚，文字平实，擅长从寻常生活中提炼主题。"],
        ["时代背景", "作品以家庭日常为载体，呈现温和却有分量的伦理主题。"],
        ["核心母题", "责任、孝顺、亲情、传承。"],
        ["内容线索", "出门散步 → 路线分歧 → 背负前行。"],
        ["阅读提示", "抓住“分歧”和“选择”这两个关键点。"],
      ],
      quote: "我和妻子都是慢慢地，稳稳地，走得很仔细，好像我背上的同她背上的加起来，就是整个世界。",
      quoteSource: "莫怀戚《散步》",
      stats: [
        { value: "1次", label: "事件冲突", desc: "一次路线分歧撑起全文主题。" },
        { value: "4个人", label: "家庭结构", desc: "三代同堂构成关系层次。" },
        { value: "日常化", label: "表达方式", desc: "不用激烈冲突，仍能写出厚重主题。" },
      ],
      focuses: [
        { title: "分歧为什么重要", desc: "小冲突让每个家庭成员的立场与关系都显现出来。" },
        { title: "谁在承担责任", desc: "“我”的选择不仅是决定路线，更是承担家庭平衡。" },
        { title: "结尾为什么有力量", desc: "“整个世界”把个体行动提升为家庭伦理的象征。" },
      ],
      summary: "《散步》以一次普通的家庭出行为核心事件，在母亲想走大路、儿子想走小路的分歧中，写出“我”对老人和孩子的双重照应。文章篇幅不长，但借极小的日常事件，表达了家庭责任与亲情传承的重量。",
      tasks: [
        { title: "理人物关系", desc: "梳理母亲、我、妻子、儿子各自的位置与情感功能。" },
        { title: "看语言分量", desc: "分析为什么结尾一句会产生“以小见大”的效果。" },
        { title: "迁移到生活", desc: "写一次普通家庭小事，尝试从中提炼主题。" },
      ],
      path: [
        { name: "读事件", desc: "先看散步中的分歧是什么。", current: false },
        { name: "解关系", desc: "分析三代人关系与责任分配。", current: true },
        { name: "悟主题", desc: "理解“整个世界”的含义。", current: false },
        { name: "做表达", desc: "尝试从日常写出深意。", current: false },
      ],
      goals: [
        "理解叙事散文如何借小事写出大主题。",
        "掌握分析家庭关系文本的关键抓手。",
        "体会平实语言中蕴含的情感重量。",
        "尝试从日常生活片段中发现写作主题。",
      ],
      scene: "walk",
    },
    opera: {
      title: "《社戏》",
      author: "鲁迅",
      stage: "初二 · 小说阅读",
      genre: "小说",
      kicker: "课程内容页 · 乡土叙事",
      subtitle: "在江南水乡的夜航与看戏经历里，读出童年记忆的温度、友情与乡土气息。",
      tags: ["小说阅读", "人物关系", "乡土叙事", "童年记忆"],
      bannerDesc: "本页补充《社戏》的独立内容页，用于课程目录中的小说阅读入口。",
      overview: [
        ["作者", "鲁迅，现代文学重要作家，擅长以回忆与现实交织写出复杂人情。"],
        ["时代背景", "作品取材于江南乡村童年记忆，具有浓厚的乡土风情。"],
        ["核心母题", "童年、友情、乡土、记忆美化。"],
        ["内容线索", "盼看戏 → 夜航去看戏 → 看戏体验 → 归来偷豆。"],
        ["阅读提示", "重点看“看戏”本身和“看戏过程”哪一个更动人。"],
      ],
      quote: "真的，一直到现在，我实在再没有吃到那夜似的好豆，也不再看到那夜似的好戏了。",
      quoteSource: "鲁迅《社戏》",
      stats: [
        { value: "1次", label: "童年夜航", desc: "夜里乘船赴戏，是全文最具画面感的场景。" },
        { value: "多人物", label: "群像关系", desc: "双喜等伙伴共同塑造童年共同体。" },
        { value: "重回忆", label: "叙述特点", desc: "“好戏”“好豆”包含记忆滤镜。" },
      ],
      focuses: [
        { title: "真正打动人的是什么", desc: "未必是戏台本身，而是去看戏的过程与伙伴情谊。" },
        { title: "环境描写的作用", desc: "水路、月色、船声共同营造童年夜航的诗意。" },
        { title: "结尾为什么写豆", desc: "“好豆”象征童年经验整体的美好感受。" },
      ],
      summary: "小说通过“我”在平桥村的经历，写出童年伙伴一起驾船去赵庄看社戏的过程。戏并没有真正好看到不可替代，真正让人难忘的是路途中的月夜、船行、伙伴之间的默契，以及回村后偷豆煮豆的情景。文章以回忆的方式，把童年乡村世界写得格外温暖明亮。",
      tasks: [
        { title: "梳理情节波峰", desc: "把“盼戏、去戏、看戏、归来”四个阶段串起来。" },
        { title: "分析双喜形象", desc: "看他如何成为童年集体中的关键人物。" },
        { title: "感受夜航描写", desc: "找出最能体现月夜水乡意境的句子并赏析。" },
      ],
      path: [
        { name: "理情节", desc: "先梳理看戏前后四段过程。", current: false },
        { name: "赏环境", desc: "重点分析夜航景物描写。", current: true },
        { name: "看人物", desc: "理解伙伴群像的作用。", current: false },
        { name: "悟回忆", desc: "体会“好戏好豆”的情感滤镜。", current: false },
      ],
      goals: [
        "掌握小说阅读中情节、环境、人物三要素的结合分析。",
        "理解乡土叙事中的童年滤镜和记忆美感。",
        "体会环境描写如何营造叙事情绪。",
        "尝试写一个难忘夜晚的片段，突出氛围感。",
      ],
      scene: "opera",
    },
    peach: {
      title: "《桃花源记》",
      author: "陶渊明",
      stage: "初二 · 文言阅读",
      genre: "文言文",
      kicker: "课程内容页 · 理想世界",
      subtitle: "沿着渔人误入桃源的路线，理解文言叙事中的理想社会想象与精神寄托。",
      tags: ["文言文", "理想社会", "叙事线索", "桃源意象"],
      bannerDesc: "本页补充《桃花源记》的独立内容页，支撑课程列表中的文言阅读入口。",
      overview: [
        ["作者", "陶渊明，东晋诗人、散文家，作品常寄寓归隐与理想。"],
        ["时代背景", "现实社会动荡，作品通过虚构桃源表达对理想社会的向往。"],
        ["核心母题", "避乱、理想、宁静、自足。"],
        ["内容线索", "缘溪而行 → 发现桃林 → 进入桃源 → 再寻不得。"],
        ["阅读提示", "兼顾字词理解、叙事结构和思想意蕴三个层面。"],
      ],
      quote: "土地平旷，屋舍俨然，有良田、美池、桑竹之属。",
      quoteSource: "陶渊明《桃花源记》",
      stats: [
        { value: "1条路", label: "叙事路径", desc: "全文围绕“发现—进入—离开—寻找”展开。" },
        { value: "多字词", label: "文言重点", desc: "需关注古今异义、通假与省略。" },
        { value: "理想性", label: "思想核心", desc: "桃源是现实无法抵达的精神寄托。" },
      ],
      focuses: [
        { title: "桃源为什么动人", desc: "它不仅风景优美，更关键在于人与社会关系的和谐。" },
        { title: "结尾为什么再寻不得", desc: "让桃源从现实地点转变为理想象征。" },
        { title: "文言叙事怎么读", desc: "先通句意，再抓线索，最后理解主题。" },
      ],
      summary: "《桃花源记》写武陵渔人偶然发现世外桃源：那里远离战乱，民风淳朴，生活安定。渔人离开后再去寻找，却再也找不到。文章用简洁的文言叙事构造了一个极具吸引力的理想世界，也因此成为中国文学中最经典的“理想社会想象”之一。",
      tasks: [
        { title: "梳理文言词义", desc: "集中处理“缘”“鲜美”“交通”等重点词句。" },
        { title: "画发现路线图", desc: "把渔人的行进路线和叙事节奏可视化。" },
        { title: "讨论桃源意义", desc: "桃源究竟是现实想象、政治理想，还是心灵寄托。" },
      ],
      path: [
        { name: "通词句", desc: "先打通字词句障碍。", current: false },
        { name: "理结构", desc: "抓住渔人发现与再寻两段。", current: true },
        { name: "悟思想", desc: "理解桃源的理想社会含义。", current: false },
        { name: "做比较", desc: "可与现实社会进行对照讨论。", current: false },
      ],
      goals: [
        "准确理解《桃花源记》的基本文言内容。",
        "掌握文言叙事文本的阅读步骤。",
        "理解桃源意象在中国文学中的典型意义。",
        "尝试把“理想世界”主题转化为自己的表达。",
      ],
      scene: "peach",
    },
    tower: {
      title: "《岳阳楼记》",
      author: "范仲淹",
      stage: "初三 · 古文名篇",
      genre: "文言文",
      kicker: "课程内容页 · 家国情怀",
      subtitle: "从岳阳楼上远望洞庭湖，理解景物描写如何一步步通向士人的家国担当。",
      tags: ["古文名篇", "议论抒情", "家国情怀", "景中寓理"],
      bannerDesc: "本页补充《岳阳楼记》的独立内容页，作为古文名篇课程的独立内容入口。",
      overview: [
        ["作者", "范仲淹，北宋政治家、文学家，文风阔大沉雄。"],
        ["时代背景", "作于政事忧患之中，文字带有强烈公共关怀。"],
        ["核心母题", "忧乐观、家国情怀、士人担当。"],
        ["内容线索", "作记缘起 → 两种迁客心境 → 古仁人之心 → 名句收束。"],
        ["阅读提示", "注意文章如何由景入情、由情入理。"],
      ],
      quote: "先天下之忧而忧，后天下之乐而乐。",
      quoteSource: "范仲淹《岳阳楼记》",
      stats: [
        { value: "2类景", label: "对照景象", desc: "阴雨霏霏与春和景明构成强对照。" },
        { value: "2种心境", label: "情感比较", desc: "悲与喜都被超越，指向更高境界。" },
        { value: "1句", label: "千古名言", desc: "凝缩整篇文章的思想高度。" },
      ],
      focuses: [
        { title: "景物描写为何浓墨重彩", desc: "景不只是景，而是情感和议论的铺垫。" },
        { title: "为什么超越迁客骚人", desc: "文章强调“古仁人”不以个人得失为情绪中心。" },
        { title: "名句如何落地", desc: "“先忧后乐”不是口号，而是前文层层铺垫后的思想结论。" },
      ],
      summary: "《岳阳楼记》先交代重修岳阳楼的缘起，再写洞庭湖阴晴变化所对应的两种典型心境，随后引出“古仁人之心”，指出真正的士人胸怀不应被个人际遇左右，最后以“先天下之忧而忧，后天下之乐而乐”将全篇提升到家国担当的高度。",
      tasks: [
        { title: "分段理结构", desc: "把缘起、写景、写情、议论四层关系理清。" },
        { title: "对照两种景", desc: "分析景象变化如何带出情感对照。" },
        { title: "讨论忧乐观", desc: "结合现实生活理解“先忧后乐”的责任意识。" },
      ],
      path: [
        { name: "通文意", desc: "先把关键文言句读通。", current: false },
        { name: "看景情", desc: "分析阴晴景象与情感。", current: true },
        { name: "悟议论", desc: "理解古仁人之心的高度。", current: false },
        { name: "连现实", desc: "思考家国担当的现实意义。", current: false },
      ],
      goals: [
        "理解《岳阳楼记》由景入理的结构逻辑。",
        "掌握古文中写景、抒情、议论结合的阅读方法。",
        "体会传统士人家国情怀的精神内核。",
        "尝试用自己的语言解释“先忧后乐”的现实意义。",
      ],
      scene: "tower",
    },
  };

  function sceneSvg(scene) {
    const scenes = {
      back: `
        <svg viewBox="0 0 960 420" preserveAspectRatio="none">
          <defs><linearGradient id="scene-back" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#335a8f"/><stop offset="62%" stop-color="#4e6ca3"/><stop offset="100%" stop-color="#71523d"/></linearGradient></defs>
          <rect width="960" height="420" fill="url(#scene-back)"/>
          <rect y="290" width="960" height="130" fill="#4a352a"/>
          <rect y="272" width="960" height="12" fill="rgba(255,255,255,0.16)"/>
          <path d="M160 420 L290 220 L340 420 Z" fill="#241b1f"/>
          <rect x="275" y="208" width="14" height="108" fill="#1f171b"/>
          <path d="M545 420 L585 300 L635 300 L675 420 Z" fill="#161317"/>
          <circle cx="610" cy="287" r="20" fill="#161317"/>
          <rect x="700" y="180" width="190" height="78" rx="6" fill="rgba(35,39,54,0.72)"/>
          <rect x="720" y="200" width="30" height="22" fill="#f8d48b"/>
          <rect x="765" y="200" width="30" height="22" fill="#f8d48b"/>
          <rect x="810" y="200" width="30" height="22" fill="#f8d48b"/>
          <rect x="855" y="200" width="16" height="22" fill="#f8d48b"/>
        </svg>`,
      garden: `
        <svg viewBox="0 0 960 420" preserveAspectRatio="none">
          <defs><linearGradient id="scene-garden" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1c5d61"/><stop offset="55%" stop-color="#2f7b72"/><stop offset="100%" stop-color="#3e5d2a"/></linearGradient></defs>
          <rect width="960" height="420" fill="url(#scene-garden)"/>
          <circle cx="760" cy="72" r="36" fill="#f8ef9a"/>
          <rect y="302" width="960" height="118" fill="#59462a"/>
          <rect x="442" y="156" width="168" height="92" fill="#f0dfbf"/>
          <path d="M420 168 L526 112 L632 168 Z" fill="#6a3f22"/>
          <rect x="504" y="186" width="44" height="62" fill="#6d5234"/>
          <circle cx="120" cy="252" r="70" fill="#5aa863"/>
          <circle cx="205" cy="214" r="58" fill="#4c9157"/>
          <circle cx="320" cy="264" r="78" fill="#73b46b"/>
          <circle cx="816" cy="226" r="74" fill="#658f49"/>
          <circle cx="885" cy="274" r="56" fill="#4f7e3d"/>
        </svg>`,
      wisteria: `
        <svg viewBox="0 0 960 420" preserveAspectRatio="none">
          <defs><linearGradient id="scene-wisteria" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#324b82"/><stop offset="56%" stop-color="#5a5cb1"/><stop offset="100%" stop-color="#3d2d62"/></linearGradient></defs>
          <rect width="960" height="420" fill="url(#scene-wisteria)"/>
          <rect y="310" width="960" height="110" fill="#213556"/>
          <path d="M90 0 Q118 156 138 336" stroke="#5b356e" stroke-width="14" stroke-linecap="round"/>
          <path d="M228 0 Q248 132 276 324" stroke="#62387a" stroke-width="14" stroke-linecap="round"/>
          <path d="M402 0 Q422 146 444 320" stroke="#5f3878" stroke-width="14" stroke-linecap="round"/>
          <path d="M585 0 Q603 152 624 334" stroke="#6f4289" stroke-width="14" stroke-linecap="round"/>
          <path d="M774 0 Q794 154 816 324" stroke="#6d4189" stroke-width="14" stroke-linecap="round"/>
          <ellipse cx="138" cy="148" rx="44" ry="92" fill="#cfb3ff"/>
          <ellipse cx="276" cy="176" rx="48" ry="100" fill="#be9aff"/>
          <ellipse cx="444" cy="154" rx="52" ry="106" fill="#d6bbff"/>
          <ellipse cx="624" cy="186" rx="48" ry="104" fill="#c7a8ff"/>
          <ellipse cx="816" cy="160" rx="52" ry="100" fill="#ceb1ff"/>
        </svg>`,
      spring: `
        <svg viewBox="0 0 960 420" preserveAspectRatio="none">
          <defs><linearGradient id="scene-spring" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4e87d4"/><stop offset="58%" stop-color="#8bc8ff"/><stop offset="100%" stop-color="#74b55d"/></linearGradient></defs>
          <rect width="960" height="420" fill="url(#scene-spring)"/>
          <circle cx="760" cy="72" r="38" fill="#ffe69a"/>
          <path d="M0 310 Q156 246 310 282 T635 268 T960 304 V420 H0 Z" fill="#6fb764"/>
          <path d="M0 344 Q216 286 392 304 T742 298 T960 332 V420 H0 Z" fill="#5aa851"/>
          <path d="M130 334 Q166 216 230 118" stroke="#6f4a31" stroke-width="10" stroke-linecap="round"/>
          <circle cx="228" cy="116" r="34" fill="#ffc3d1"/>
          <circle cx="190" cy="152" r="28" fill="#ffd7bd"/>
          <circle cx="270" cy="160" r="24" fill="#ffd2df"/>
        </svg>`,
      winter: `
        <svg viewBox="0 0 960 420" preserveAspectRatio="none">
          <defs><linearGradient id="scene-winter" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7bb0ea"/><stop offset="56%" stop-color="#a7d1f2"/><stop offset="100%" stop-color="#dbe8f4"/></linearGradient></defs>
          <rect width="960" height="420" fill="url(#scene-winter)"/>
          <circle cx="760" cy="72" r="36" fill="#fff0b2"/>
          <path d="M0 304 Q172 250 348 284 T654 274 T960 304 V420 H0 Z" fill="#cbd7e4"/>
          <rect x="84" y="260" width="140" height="68" fill="#6e7f97"/>
          <path d="M66 260 L154 210 L242 260 Z" fill="#f5f7fb"/>
          <rect x="284" y="244" width="170" height="84" fill="#75859b"/>
          <path d="M262 244 L368 188 L474 244 Z" fill="#f7f8fc"/>
          <rect x="558" y="256" width="132" height="72" fill="#62758d"/>
          <path d="M540 256 L624 206 L708 256 Z" fill="#f3f6fb"/>
          <rect x="744" y="250" width="122" height="78" fill="#75859b"/>
          <path d="M726 250 L805 200 L884 250 Z" fill="#f4f7fb"/>
        </svg>`,
      walk: `
        <svg viewBox="0 0 960 420" preserveAspectRatio="none">
          <defs><linearGradient id="scene-walk" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#6fb58b"/><stop offset="58%" stop-color="#9bc88c"/><stop offset="100%" stop-color="#8b6a4d"/></linearGradient></defs>
          <rect width="960" height="420" fill="url(#scene-walk)"/>
          <path d="M0 420 L0 298 Q234 256 372 280 T694 272 T960 298 V420 Z" fill="#73a85d"/>
          <path d="M360 420 Q432 292 480 246 Q532 290 606 420 Z" fill="#d9c59b"/>
          <circle cx="392" cy="268" r="18" fill="#2d2a2e"/>
          <rect x="382" y="284" width="20" height="52" rx="10" fill="#2d2a2e"/>
          <circle cx="474" cy="242" r="24" fill="#2d2a2e"/>
          <rect x="462" y="270" width="24" height="64" rx="12" fill="#2d2a2e"/>
          <circle cx="548" cy="276" r="16" fill="#2d2a2e"/>
          <rect x="540" y="288" width="18" height="46" rx="9" fill="#2d2a2e"/>
          <circle cx="132" cy="186" r="64" fill="#5a8e47"/>
          <circle cx="204" cy="218" r="58" fill="#719f57"/>
          <circle cx="836" cy="194" r="66" fill="#5f8b44"/>
        </svg>`,
      opera: `
        <svg viewBox="0 0 960 420" preserveAspectRatio="none">
          <defs><linearGradient id="scene-opera" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#143661"/><stop offset="55%" stop-color="#205381"/><stop offset="100%" stop-color="#0d2948"/></linearGradient></defs>
          <rect width="960" height="420" fill="url(#scene-opera)"/>
          <circle cx="760" cy="72" r="34" fill="#ffe49e"/>
          <rect y="320" width="960" height="100" fill="#0a2040"/>
          <path d="M458 302 Q536 210 632 148 Q698 218 748 302 Z" fill="#dcb56b"/>
          <rect x="534" y="166" width="126" height="82" fill="#7f4d29"/>
          <path d="M516 166 L597 120 L678 166 Z" fill="#e7c57f"/>
          <rect x="560" y="194" width="24" height="28" fill="#f6e7b6"/>
          <rect x="610" y="194" width="24" height="28" fill="#f6e7b6"/>
          <ellipse cx="208" cy="320" rx="124" ry="24" fill="#214d74"/>
          <path d="M154 320 Q208 266 258 320" fill="#2b587f"/>
          <circle cx="534" cy="146" r="8" fill="#f9c663"/>
          <circle cx="658" cy="146" r="8" fill="#f9c663"/>
        </svg>`,
      peach: `
        <svg viewBox="0 0 960 420" preserveAspectRatio="none">
          <defs><linearGradient id="scene-peach" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7fc1b2"/><stop offset="54%" stop-color="#a7dbc0"/><stop offset="100%" stop-color="#5a965c"/></linearGradient></defs>
          <rect width="960" height="420" fill="url(#scene-peach)"/>
          <path d="M0 420 L0 278 Q166 156 284 188 T500 174 T740 194 T960 170 V420 Z" fill="#3d6f5f"/>
          <path d="M0 420 L0 314 Q174 240 344 268 T664 254 T960 286 V420 Z" fill="#4d875a"/>
          <path d="M128 372 Q196 288 258 198" stroke="#734d34" stroke-width="14" stroke-linecap="round"/>
          <path d="M756 374 Q694 286 636 190" stroke="#734d34" stroke-width="14" stroke-linecap="round"/>
          <circle cx="260" cy="194" r="36" fill="#ffc6d9"/>
          <circle cx="220" cy="236" r="30" fill="#ffd3e3"/>
          <circle cx="636" cy="190" r="36" fill="#ffc4d7"/>
          <circle cx="676" cy="236" r="30" fill="#ffd7e7"/>
          <path d="M466 420 Q482 346 516 252" stroke="#dfd1ab" stroke-width="28" stroke-linecap="round"/>
        </svg>`,
      tower: `
        <svg viewBox="0 0 960 420" preserveAspectRatio="none">
          <defs><linearGradient id="scene-tower" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#5f5db1"/><stop offset="55%" stop-color="#7d5f9b"/><stop offset="100%" stop-color="#22496a"/></linearGradient></defs>
          <rect width="960" height="420" fill="url(#scene-tower)"/>
          <circle cx="760" cy="72" r="36" fill="#ffe39d"/>
          <rect y="320" width="960" height="100" fill="#264f6d"/>
          <rect x="430" y="170" width="104" height="112" fill="#6d4022"/>
          <path d="M408 170 L482 124 L556 170 Z" fill="#d2a665"/>
          <rect x="448" y="202" width="68" height="20" fill="#f3e0ad"/>
          <rect x="448" y="232" width="68" height="20" fill="#f3e0ad"/>
          <rect x="464" y="98" width="36" height="30" fill="#6d4022"/>
          <path d="M446 98 L482 72 L518 98 Z" fill="#d7b06c"/>
          <path d="M0 334 Q180 322 356 330 T704 328 T960 334" stroke="rgba(255,255,255,0.18)" stroke-width="6" fill="none"/>
        </svg>`,
    };

    return scenes[scene] || scenes.back;
  }

  function renderList(items, renderer) {
    return items.map(renderer).join("");
  }

  function getCourse() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("course");
    return courses[slug] || courses.back;
  }

  function renderCourse(course) {
    document.title = "NovaRead AI语文 · " + course.title;

    document.getElementById("crumb-title").textContent = course.title;
    document.getElementById("detail-kicker").textContent = course.kicker;
    document.getElementById("detail-title").textContent = course.title;
    document.getElementById("detail-subtitle").textContent = course.subtitle;
    document.getElementById("detail-banner-desc").textContent = course.bannerDesc;
    document.getElementById("detail-quote").textContent = course.quote;
    document.getElementById("detail-quote-source").textContent = course.quoteSource;
    document.getElementById("detail-summary").textContent = course.summary;
    document.getElementById("detail-hero-scene").innerHTML = sceneSvg(course.scene);

    document.getElementById("detail-meta-row").innerHTML = [
      course.author,
      course.stage,
      course.genre,
    ].map(function (item) {
      return '<span class="detail-chip">' + item + "</span>";
    }).join("");

    document.getElementById("detail-tag-row").innerHTML = course.tags
      .map(function (tag) {
        return '<span class="detail-chip">' + tag + "</span>";
      })
      .join("");

    document.getElementById("overview-list").innerHTML = renderList(
      course.overview,
      function (item) {
        return (
          '<div class="overview-item"><div class="overview-label">' +
          item[0] +
          '</div><div class="overview-value">' +
          item[1] +
          "</div></div>"
        );
      }
    );

    course.stats.forEach(function (stat, index) {
      var id = index + 1;
      document.getElementById("stat-" + id + "-value").textContent = stat.value;
      document.getElementById("stat-" + id + "-label").textContent = stat.label;
      document.getElementById("stat-" + id + "-desc").textContent = stat.desc;
    });

    document.getElementById("focus-grid").innerHTML = renderList(
      course.focuses,
      function (item, index) {
        return (
          '<div class="focus-card animate-in" style="animation-delay:.' +
          (18 + index * 2) +
          's"><div class="focus-card-title">' +
          item.title +
          '</div><div class="focus-card-desc">' +
          item.desc +
          "</div></div>"
        );
      }
    );

    document.getElementById("task-list").innerHTML = renderList(
      course.tasks,
      function (item, index) {
        return (
          '<div class="task-item"><div class="task-bullet">' +
          (index + 1) +
          '</div><div class="task-copy"><strong>' +
          item.title +
          "</strong><br/>" +
          item.desc +
          "</div></div>"
        );
      }
    );

    document.getElementById("path-track-local").innerHTML = renderList(
      course.path,
      function (item, index) {
        return (
          '<div class="path-step-local ' +
          (item.current ? "current" : "") +
          '"><div class="path-step-index">' +
          (index + 1) +
          '</div><div class="path-step-name">' +
          item.name +
          '</div><div class="path-step-desc">' +
          item.desc +
          "</div></div>"
        );
      }
    );

    document.getElementById("goal-list").innerHTML = renderList(
      course.goals,
      function (item, index) {
        return (
          '<div class="goal-item-local"><div class="goal-bullet">' +
          (index + 1) +
          '</div><div class="goal-copy"><strong>目标 ' +
          (index + 1) +
          "：</strong>" +
          item +
          "</div></div>"
        );
      }
    );
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderCourse(getCourse());
  });
})();
