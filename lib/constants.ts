export const LANGUAGES = [
    { code: 'vi-VN', name: 'Vietnam', label: '베트남', flag: '🇻🇳' },
    { code: 'uz-UZ', name: 'Uzbek', label: '우즈벡', flag: '🇺🇿' },
    { code: 'ph-PH', name: 'Philippines', label: '필리핀', flag: '🇵🇭' },
    { code: 'id-ID', name: 'Indonesia', label: '인니', flag: '🇮🇩' },
    { code: 'km-KH', name: 'Cambodia', label: '캄보디아', flag: '🇰🇭' },
    { code: 'mn-MN', name: 'Mongolia', label: '몽골어', flag: '🇲🇳' },
    { code: 'en-US', name: 'English', label: '영어', flag: '🇺🇸' },
    { code: 'zh-CN', name: 'Chinese', label: '중국어', flag: '🇨🇳' },
    { code: 'th-TH', name: 'Thai', label: '태국어', flag: '🇹🇭' },
    { code: 'ru-RU', name: 'Russian', label: '러시아어', flag: '🇷🇺' }
];

// 건설 현장 용어 사전 (노가다 용어 → 표준어)
// 출처: 인터넷 현장용어 정리 및 실제 건설현장 사용 용어
export const NOGADA_SLANG = [
    // --- [C] CONSTRUCTION (건설) ---
    { slang: "공구리", standard: "콘크리트 (Concrete)", vi: "Bê tông", uz: "Beton", ph: "Konkreto", id: "Beton", en: "Concrete", km: "បេតុង", mn: "Бетон", zh: "混凝土", th: "คอนกรีต", ru: "Бетон" },
    { slang: "아시바", standard: "비계 (Scaffolding)", vi: "Giàn giáo", uz: "Lesa", ph: "Andamyo", id: "Perancah", en: "Scaffolding", km: "រនោច", mn: "Шат", zh: "脚手架", th: "นั่งร้าน", ru: "Леса" },
    { slang: "가다", standard: "거푸집 (Formwork)", vi: "Cốp pha", uz: "Opalubka", ph: "Porma", id: "Bekisting", en: "Formwork", km: "ទម្រង់", mn: "Хэвлэгч", zh: "模板", th: "แบบหล่อ", ru: "Опалубка" },
    { slang: "반생", standard: "구운 철사 (Tie Wire)", vi: "Dây kẽm gai", uz: "Provoloka", ph: "Alambre", id: "Kawat", en: "Tie Wire", km: "ខ្សែដែក", mn: "Утас", zh: "铁丝", th: "ลวด", ru: "Проволока" },
    { slang: "하시라", standard: "기둥 (Column)", vi: "Cột", uz: "Kolonna", ph: "Poste", id: "Kolom", en: "Column", km: "សសរទ្រ", mn: "Тулгуур", zh: "支撑", th: "ค้ำยัน", ru: "Опора" },
    { slang: "하리", standard: "보 (Beam)", vi: "Dầm", uz: "Balka", ph: "Biga", id: "Balok", en: "Beam", km: "ធ្នឹម", mn: "Дам", zh: "托梁", th: "คาน", ru: "Балка" },
    { slang: "데나오시", standard: "재시공 (Rework)", vi: "Sửa chữa lại", uz: "Remont", ph: "Gawa ulit", id: "Perbaikan", en: "Rework", km: "កែไข", mn: "Дахин хийх", zh: "重做", th: "ทำใหม่", ru: "Ремонт" },
    { slang: "나라시", standard: "평탄화 (Leveling)", vi: "San lấp", uz: "Vyravnivanie", ph: "Patag", id: "Meratakan", en: "Leveling", km: "ធ្វើឲ្យរាប", mn: "Тэгшлэх", zh: "找平", th: "ปรับระดับ", ru: "Выравнивание" },
    { slang: "오함마", standard: "큰 망치 (Sledgehammer)", vi: "Búa tạ", uz: "Kuvalda", ph: "Maso", id: "Palu godam", en: "Sledgehammer", km: "ញញួរធំ", mn: "Том алх", zh: "大锤", th: "ค้อนปอนด์", ru: "Кувалда" },
    { slang: "노미", standard: "정 (Chisel)", vi: "Đục", uz: "Zubilo", ph: "Cincel", id: "Pahat", en: "Chisel", km: "ដែក​កាត់", mn: "Цуулуур", zh: "凿子", th: "สิ่ว", ru: "Зубило" },
    { slang: "폼", standard: "유로폼 (Euroform)", vi: "Cốp pha panel", uz: "Formy", ph: "Porma", id: "Bekisting", en: "Euroform", km: "ហ្វម", mn: "Хэв", zh: "模板", th: "แบบหล่อ", ru: "Формы" },
    { slang: "사포도", standard: "서포트/동바리 (Support)", vi: "Cây chống", uz: "Opora", ph: "Suporta", id: "Penyangga", en: "Support Jack", km: "ទ្រ", mn: "Тулгуур", zh: "支撑", th: "ค้ำยัน", ru: "Опора" },
    { slang: "미장", standard: "질척임/바르기 (Plastering)", vi: "Trát vữa", uz: "Shtukaturka", ph: "Palitada", id: "Plesteran", en: "Plastering", km: "បូកជញ្ជាំង", mn: "Шавардах", zh: "抹灰", th: "ปูนปั้น", ru: "Штукатурка" },
    { slang: "고데", standard: "흙손 (Trowel)", vi: "Bay", uz: "Masterok", ph: "Kutsara", id: "Cetok", en: "Trowel", km: "បន្ទះ", mn: "Шавар тараагч", zh: "抹刀", th: "เกรียง", ru: "Мастерок" },
    { slang: "렌가", standard: "벽돌 (Brick)", vi: "Gạch", uz: "Kirpich", ph: "Ladrilyo", id: "Bata", en: "Brick", km: "ឥដ្ឋ", mn: "Тоосго", zh: "砖", th: "อิฐ", ru: "Кирпич" },
    { slang: "빠루", standard: "노루발못뽑이 (Crowbar)", vi: "Xà beng", uz: "Lom", ph: "Bareta", id: "Linggis", en: "Crowbar", km: "រនុក", mn: "Хов", zh: "撬棍", th: "ชะแลง", ru: "Лом" },
    { slang: "사게부리", standard: "다림추 (Plumb bob)", vi: "Dây dọi", uz: "Otves", ph: "Hulog", id: "Unting-unting", en: "Plumb bob", km: "ខ្សែបន្ទាត់", mn: "Дарилга", zh: "铅锤", th: "ลูกดิ่ง", ru: "Отвес" },
    { slang: "바라시", standard: "해체 (Dismantling)", vi: "Tháo dỡ", uz: "Razborka", ph: "Baklas", id: "Bongkar", en: "Dismantling", km: "រុះរើ", mn: "Буулгах", zh: "拆除", th: "ถอดประกอบ", ru: "Разборка" },
    { slang: "메지", standard: "줄눈 (Joint/Grout)", vi: "Mạch vữa", uz: "Shov", ph: "Kanal", id: "Nat", en: "Grout joint", km: "បន្ទាត់", mn: "Зай", zh: "灰缝", th: "รอยต่อ", ru: "Шов" },

    // --- [M] MANUFACTURING (제조/기계) ---
    { slang: "도라", standard: "드라이버 (Screwdriver)", vi: "Tua vít", uz: "Otvertka", ph: "Distornilyador", id: "Obeng", en: "Screwdriver", km: "វីស", mn: "Боолт", zh: "螺丝", th: "สกรู", ru: "Отвертка" },
    { slang: "뺀찌", standard: "펜치 (Pliers)", vi: "Kìm", uz: "Ploskogubtsy", ph: "Plies", id: "Tang", en: "Pliers", km: "ដង្កាប់", mn: "Бахь", zh: "钳子", th: "คีม", ru: "Плоскогубцы" },
    { slang: "니퍼", standard: "절단기 (Nippers)", vi: "Kìm cắt", uz: "Kusachki", ph: "Cutter", id: "Tang potong", en: "Nippers", km: "ដង្កាប់កាត់", mn: "Тасдагч", zh: "斜口钳", th: "คีมตัด", ru: "Кусачки" },
    { slang: "몽키", standard: "조절 렌치 (Adj. Wrench)", vi: "Mỏ lết", uz: "Razvodnoy klyuch", ph: "Liyabe", id: "Kunci Inggris", en: "Adjustable Wrench", km: "ដង្កាប់មរ", mn: "Түлхүүр", zh: "活动扳手", th: "ประแจเลื่อน", ru: "Разводной ключ" },
    { slang: "기리", standard: "드릴 날 (Drill bit)", vi: "Mũi khoan", uz: "Sverlo", ph: "Drill bit", id: "Mata bor", en: "Drill bit", km: "ស្វាន", mn: "Өрөм", zh: "钻头", th: "ดอกสว่าน", ru: "Сверло" },
    { slang: "야스리", standard: "줄 (File)", vi: "Dũa", uz: "Napilnik", ph: "Kikil", id: "Kikir", en: "File", km: "ខ្សែ", mn: "Хуурай", zh: "锉刀", th: "ตะไบ", ru: "Напильник" },
    { slang: "그라인더", standard: "연삭기 (Grinder)", vi: "Máy mài", uz: "Bolgarka", ph: "Grinder", id: "Gerinda", en: "Angle Grinder", km: "ម៉ាស៊ីនអារ", mn: "Тасдагч", zh: "磨光机", th: "เครื่องเจียร", ru: "Болгарка" },
    { slang: "빠우", standard: "광택 (Buffing)", vi: "Đánh bóng", uz: "Polirovka", ph: "Pakinis", id: "Poles", en: "Buffing", km: "ខាត់", mn: "Өнгөлөх", zh: "抛光", th: "ขัดเงา", ru: "Полировка" },
    { slang: "와샤", standard: "와셔 (Washer)", vi: "Long đền", uz: "Shayba", ph: "Pitsa", id: "Ring", en: "Washer", km: "រ៉ង", mn: "Шайб", zh: "垫圈", th: "แหวนรอง", ru: "Шайба" },
    { slang: "다마", standard: "전구 (Bulb)", vi: "Bóng đèn", uz: "Lampochka", ph: "Bumbilya", id: "Bohlam", en: "Bulb", km: "អំពូល", mn: "Чийдэн", zh: "灯泡", th: "หลอดไฟ", ru: "Лампочка" },
    { slang: "노기스", standard: "버니어 캘리퍼스 (Caliper)", vi: "Thước kẹp", uz: "Shtangentsirkul", ph: "Kaliper", id: "Jangka sorong", en: "Vernier Caliper", km: "ខ្នាត", mn: "Штанги", zh: "游标卡尺", th: "เวอร์เนียร์", ru: "Штангенциркуль" },

    // --- [A] AGRICULTURE (농축산) ---
    { slang: "하우스", standard: "비닐하우스 (Greenhouse)", vi: "Nhà kính", uz: "Teplitsa", ph: "Greenhouse", id: "Rumah kaca", en: "Greenhouse", km: "ផ្ទះកញ្ចក់", mn: "Хүлэмж", zh: "温室", th: "เรือนกระจก", ru: "Теплица" },
    { slang: "사료", standard: "먹이 (Feed)", vi: "Thức ăn", uz: "Korm", ph: "Patuka", id: "Pakan", en: "Feed", km: "ចំណី", mn: "Тэжээл", zh: "饲料", th: "อาหารสัตว์", ru: "Корм" },
    { slang: "개폐기", standard: "환기창 개폐기 (Opener)", vi: "Mô tơ cuốn", uz: "Privod", ph: "Motor", id: "Motor", en: "Vent Opener", km: "ម៉ូទ័រ", mn: "Нээгч", zh: "开关", th: "เครื่องเปิด", ru: "Привод" },
    { slang: "양수기", standard: "물펌프 (Water Pump)", vi: "Máy bơm", uz: "Nasos", ph: "Bomba", id: "Pompa air", en: "Water Pump", km: "ម៉ាស៊ីនបូម", mn: "Насос", zh: "水泵", th: "ปั๊มน้ำ", ru: "Насос" },

    // --- [S] SAFETY & ADMIN (안전/행정) ---
    { slang: "오야지", standard: "반장 (Foreman)", vi: "Đốc công", uz: "Prorab", ph: "Kapataz", id: "Mandor", en: "Foreman", km: "អ្នកគ្រប់គ្រង", mn: "Дарга", zh: "负责人", th: "หัวหน้า", ru: "Прораб" },
    { slang: "데모도", standard: "보조 (Helper)", vi: "Phụ hồ", uz: "Pomoshnik", ph: "Helper", id: "Kenek", en: "Helper", km: "ជំនួយការ", mn: "Туслах", zh: "助手", th: "ผู้ช่วย", ru: "Помощник" },
    { slang: "가불", standard: "선지급 (Advance)", vi: "Ứng lương", uz: "Avans", ph: "Bale", id: "Kasbon", en: "Advance Payment", km: "បើកមុន", mn: "Урьдчилгаа", zh: "预支", th: "เบิกเงินล่วงหน้า", ru: "Аванс" },
    { slang: "시마이", standard: "마무리 (Finish)", vi: "Xong", uz: "Konets", ph: "Tapos na", id: "Selesai", en: "Finish", km: "បញ្ចប់", mn: "Дуусгах", zh: "完成", th: "เสร็จสิ้น", ru: "Конец" },
    { slang: "이빠이", standard: "가득 (Full)", vi: "Đầy", uz: "Polnyy", ph: "Puno", id: "Penuh", en: "Full/Max", km: "ពេញ", mn: "Дүүрэн", zh: "满", th: "เต็ม", ru: "Полный" },
    { slang: "함바", standard: "현장 식당 (Canteen)", vi: "Căn tin", uz: "Stolovaya", ph: "Kantina", id: "Kantin", en: "Canteen", km: "កន្ទីន", mn: "Гуанз", zh: "食堂", th: "โรงอาหาร", ru: "Столовая" },
    { slang: "단도리", standard: "준비 (Preparation)", vi: "Chuẩn bị", uz: "Podgotovka", ph: "Handa", id: "Persiapan", en: "Preparation", km: "ការរៀបចំ", mn: "Бэлтгэл", zh: "准备", th: "การเตรียมตัว", ru: "Подготовка" },
    { slang: "유도리", standard: "융통성 (Flexibility)", vi: "Linh hoạt", uz: "Gibkost", ph: "Diskarte", id: "Fleksibel", en: "Flexibility", km: "ត្រួសត្រាយ", mn: "Уян хатан", zh: "灵活", th: "ความยืดหยุ่น", ru: "Гибкость" },
];

// 실제 서원토건 현장명 (가나다순 정렬)
export const SITES = [
    { id: 1, name: "과천G-TOWN", region: "경기", active: true },
    { id: 2, name: "과천자이", region: "경기", active: true },
    { id: 3, name: "광교지산", region: "경기", active: true },
    { id: 4, name: "당산디엘", region: "서울", active: true },
    { id: 5, name: "대우왕숙", region: "경기", active: true },
    { id: 6, name: "동탄대우", region: "경기", active: true },
    { id: 7, name: "블랑써밋", region: "서울", active: true },
    { id: 8, name: "부산대방2차", region: "부산", active: true },
    { id: 9, name: "부산대방3차", region: "부산", active: true },
    { id: 10, name: "복대자이", region: "충북", active: true },
    { id: 11, name: "삼송 데이타센터", region: "경기", active: true },
    { id: 12, name: "삼척", region: "강원", active: true },
    { id: 13, name: "산성대우", region: "경기", active: true },
    { id: 14, name: "성수동처", region: "서울", active: true },
    { id: 15, name: "안성현대차", region: "경기", active: true },
    { id: 16, name: "여수디엘", region: "전남", active: true },
    { id: 17, name: "왕숙대우", region: "경기", active: true },
    { id: 18, name: "울산현대", region: "울산", active: true },
    { id: 19, name: "원주무실", region: "강원", active: true },
    { id: 20, name: "의정부대우", region: "경기", active: true },
    { id: 21, name: "이천자이", region: "경기", active: true },
    { id: 22, name: "진접디엘", region: "경기", active: true },
    { id: 23, name: "청주테크노폴리스", region: "충북", active: true },
    { id: 24, name: "청주효성", region: "충북", active: true },
    { id: 25, name: "탕정대우", region: "충남", active: true },
    { id: 26, name: "탕정디엘", region: "충남", active: true },
];
