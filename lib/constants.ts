export const LANGUAGES = [
    { code: 'vi-VN', name: 'Vietnam', label: '베트남', flag: '🇻🇳' },
    { code: 'uz-UZ', name: 'Uzbek', label: '우즈벡', flag: '🇺🇿' },
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
    // ㄱ
    { slang: "가꾸", standard: "틀 (Frame)", vi: "Khung", uz: "Ramka", en: "Frame", km: "ស៊ុម", mn: "Хүрээ", zh: "框架", th: "กรอบ", ru: "Рама" },
    { slang: "가꾸목", standard: "각목 (Square timber)", vi: "Gỗ vuông", uz: "Kvadrat yog'och", en: "Square timber", km: "ឈើការេ", mn: "Дөрвөлжин мод", zh: "方木", th: "ไม้เหลี่ยม", ru: "Брус" },
    { slang: "가네", standard: "직각 (Right angle)", vi: "Góc vuông", uz: "To'g'ri burchak", en: "Right angle", km: "មុំកែង", mn: "Тэгш өнцөг", zh: "直角", th: "มุมฉาก", ru: "Прямой угол" },
    { slang: "가다", standard: "거푸집 (Form/Mold)", vi: "Ván khuôn", uz: "Qolip", en: "Formwork", km: "ទម្រង់", mn: "Хэвлэгч", zh: "模板", th: "แบบหล่อ", ru: "Опалубка" },
    { slang: "가베", standard: "벽 (Wall)", vi: "Tường", uz: "Devor", en: "Wall", km: "ជញ្ជាំង", mn: "Хана", zh: "墙", th: "ผนัง", ru: "Стена" },
    { slang: "곰방", standard: "운반 (Transport)", vi: "Vận chuyển", uz: "Tashish", en: "Transport", km: "ដឹកជញ្ជូន", mn: "Тээвэрлэлт", zh: "运输", th: "ขนส่ง", ru: "Транспортировка" },
    { slang: "공구리", standard: "콘크리트 (Concrete)", vi: "Bê tông", uz: "Beton", en: "Concrete", km: "បេតុង", mn: "Бетон", zh: "混凝土", th: "คอนกรีต", ru: "Бетон" },
    { slang: "구배", standard: "경사 (Slope)", vi: "Độ dốc", uz: "Nishablik", en: "Slope", km: "ជម្រាល", mn: "Налуу", zh: "坡度", th: "ความลาดชัน", ru: "Уклон" },
    { slang: "기리", standard: "절단 (Cutting)", vi: "Cắt", uz: "Kesish", en: "Cutting", km: "កាត់", mn: "Зүсэх", zh: "切割", th: "ตัด", ru: "Резка" },

    // ㄴ
    { slang: "나라시", standard: "평탄화 (Leveling)", vi: "Làm phẳng", uz: "Tekislash", en: "Leveling", km: "ធ្វើឲ្យរាប", mn: "Тэгшлэх", zh: "找平", th: "ปรับระดับ", ru: "Выравнивание" },
    { slang: "네지", standard: "나사 (Screw)", vi: "Vít", uz: "Vint", en: "Screw", km: "វីស", mn: "Боолт", zh: "螺丝", th: "สกรู", ru: "Винт" },
    { slang: "노가다", standard: "막일/노동 (Labor)", vi: "Lao động", uz: "Mehnat", en: "Labor work", km: "ការងារ", mn: "Хөдөлмөр", zh: "劳动", th: "งานแรงงาน", ru: "Труд" },
    { slang: "노미", standard: "끌/정 (Chisel)", vi: "Đục", uz: "Keskir", en: "Chisel", km: "ដែក​កាត់", mn: "Цуулуур", zh: "凿子", th: "สิ่ว", ru: "Долото" },
    { slang: "누끼", standard: "빼기/제거 (Removal)", vi: "Loại bỏ", uz: "Olib tashlash", en: "Removal", km: "ដក", mn: "Авах", zh: "去除", th: "การนำออก", ru: "Удаление" },

    // ㄷ
    { slang: "다데", standard: "세로 (Vertical)", vi: "Dọc", uz: "Vertikal", en: "Vertical", km: "បញ្ឈរ", mn: "Босоо", zh: "纵向", th: "แนวตั้ง", ru: "Вертикаль" },
    { slang: "다루끼", standard: "각목 (Timber)", vi: "Gỗ thanh", uz: "Yog'och", en: "Timber", km: "ឈើ", mn: "Мод", zh: "木材", th: "ไม้", ru: "Брусок" },
    { slang: "단도리", standard: "준비/채비 (Preparation)", vi: "Chuẩn bị", uz: "Tayyorgarlik", en: "Preparation", km: "ការរៀបចំ", mn: "Бэлтгэл", zh: "准备", th: "การเตรียมตัว", ru: "Подготовка" },
    { slang: "덴바", standard: "윗면 (Top surface)", vi: "Mặt trên", uz: "Yuqori qism", en: "Top surface", km: "ផ្ទៃខាងលើ", mn: "Дээд тал", zh: "表面", th: "พื้นผิวด้านบน", ru: "Верхняя поверхность" },
    { slang: "덴죠", standard: "천장 (Ceiling)", vi: "Trần nhà", uz: "Shift", en: "Ceiling", km: "ពិដាន", mn: "Таазан", zh: "天花板", th: "เพดาน", ru: "Потолок" },
    { slang: "데마찌", standard: "대기/작업중단 (Waiting)", vi: "Chờ đợi", uz: "Kutish", en: "Waiting", km: "រង់ចាំ", mn: "Хүлээх", zh: "等待", th: "รอ", ru: "Ожидание" },
    { slang: "도끼다시", standard: "갈아내기 (Grinding)", vi: "Mài", uz: "Silliqlash", en: "Grinding", km: "កិន", mn: "Нунтаглах", zh: "打磨", th: "การเจียร", ru: "Шлифовка" },
    { slang: "돈내기", standard: "하청 (Subcontract)", vi: "Thầu phụ", uz: "Subpudrat", en: "Subcontract", km: "អ្នកម៉ៅកា", mn: "Туслан гүйцэтгэгч", zh: "分包", th: "รับเหมาช่วง", ru: "Субподряд" },

    // ㅁ
    { slang: "마끼", standard: "감기/감아올리기 (Winding)", vi: "Quấn", uz: "O'rash", en: "Winding", km: "រុំ", mn: "Ороох", zh: "缠绕", th: "พัน", ru: "Намотка" },
    { slang: "마끼자", standard: "줄자 (Tape measure)", vi: "Thước dây", uz: "Lenta o'lchagich", en: "Tape measure", km: "ម៉ែត្រ", mn: "Метр", zh: "卷尺", th: "ตลับเมตร", ru: "Рулетка" },
    { slang: "메지", standard: "줄눈 (Grout joint)", vi: "Mạch vữa", uz: "Teshik", en: "Grout joint", km: "បន្ទាត់", mn: "Зай", zh: "灰缝", th: "รอยต่อ", ru: "Шов" },
    { slang: "미다시", standard: "제치장/전면노출 (Exposed)", vi: "Lộ diện", uz: "Ochiq", en: "Exposed", km: "ប៉ះពាល់", mn: "Ил гарсан", zh: "外露", th: "โผล่", ru: "Открытый" },
    { slang: "미쓰모리", standard: "견적 (Estimate)", vi: "Báo giá", uz: "Hisoblab chiqish", en: "Estimate", km: "ការប៉ាន់ស្មាន", mn: "Төсөв", zh: "报价", th: "ประมาณการ", ru: "Смета" },
    { slang: "밀대", standard: "미장흙손 (Trowel)", vi: "Bay xây", uz: "Malala", en: "Trowel", km: "បន្ទះ", mn: "Шавар тараагч", zh: "抹刀", th: "เกรียง", ru: "Кельма" },

    // ㅂ
    { slang: "바라시", standard: "해체 (Dismantling)", vi: "Tháo dỡ", uz: "Demontaj", en: "Dismantling", km: "រុះរើ", mn: "Буулгах", zh: "拆除", th: "ถอดประกอบ", ru: "Демонтаж" },
    { slang: "반셍", standard: "철선 (Wire)", vi: "Dây thép", uz: "Sim", en: "Wire", km: "ខ្សែដែក", mn: "Утас", zh: "铁丝", th: "ลวด", ru: "Проволока" },
    { slang: "베니야", standard: "합판 (Plywood)", vi: "Gỗ dán", uz: "Fanera", en: "Plywood", km: "ផ្ទាំងឈើ", mn: "Фанер", zh: "胶合板", th: "ไม้อัด", ru: "Фанера" },
    { slang: "빠루", standard: "못빼기/쇠지레 (Crowbar)", vi: "Xà beng", uz: "Kaltak", en: "Crowbar", km: "រនុក", mn: "Хов", zh: "撬棍", th: "ชะแลง", ru: "Лом" },
    { slang: "뻥칠", standard: "과장/허풍 (Exaggeration)", vi: "Phóng đại", uz: "Bo'rtirish", en: "Exaggeration", km: "បំផ្លើស", mn: "Хэтрүүлэлт", zh: "夸张", th: "พูดเกินจริง", ru: "Преувеличение" },

    // ㅅ
    { slang: "사게부리", standard: "다림추 (Plumb bob)", vi: "Quả dọi", uz: "Qurg'oshin", en: "Plumb bob", km: "ខ្សែបន្ទាត់", mn: "Дарилга", zh: "铅锤", th: "ลูกดิ่ง", ru: "Отвес" },
    { slang: "사뽀도", standard: "지지대 (Support)", vi: "Cột chống", uz: "Tayanchok", en: "Support", km: "ទ្រ", mn: "Тулгуур", zh: "支撑", th: "ค้ำยัน", ru: "Опора" },
    { slang: "세와", standard: "폭 (Width)", vi: "Chiều rộng", uz: "Kenglik", en: "Width", km: "ទទឹង", mn: "Өргөн", zh: "宽度", th: "ความกว้าง", ru: "Ширина" },
    { slang: "시아게", standard: "마감 (Finishing)", vi: "Hoàn thiện", uz: "Tugatish", en: "Finishing", km: "បញ្ចប់", mn: "Дуусгал", zh: "收尾", th: "งานตกแต่ง", ru: "Отделка" },
    { slang: "시마이", standard: "마무리 (Completion)", vi: "Hoàn thành", uz: "Yakunlash", en: "Completion", km: "បញ្ចប់", mn: "Дуусгах", zh: "完成", th: "เสร็จสิ้น", ru: "Завершение" },
    { slang: "신나", standard: "희석제/시너 (Thinner)", vi: "Dung môi", uz: "Erituvchi", en: "Thinner", km: "ទឹកថ្នាំ", mn: "Шингэлэгч", zh: "稀释剂", th: "ทินเนอร์", ru: "Растворитель" },

    // ㅇ
    { slang: "아시바", standard: "비계 (Scaffolding)", vi: "Giàn giáo", uz: "Iskala", en: "Scaffolding", km: "រនោច", mn: "Шат", zh: "脚手架", th: "นั่งร้าน", ru: "Леса" },
    { slang: "야끼", standard: "불에 굽기/열처리 (Heating)", vi: "Nung", uz: "Qizdirish", en: "Heating", km: "ដុត", mn: "Халаах", zh: "加热", th: "เผา", ru: "Нагрев" },
    { slang: "야리끼리", standard: "할당작업 (Quota work)", vi: "Công khoán", uz: "Kvota ishi", en: "Quota work", km: "ការងារកំណត់", mn: "Хувь ажил", zh: "定额工作", th: "งานโควตา", ru: "Сдельная работа" },
    { slang: "야마", standard: "산/언덕 (Pile)", vi: "Đống", uz: "To'da", en: "Pile", km: "គំនរ", mn: "Овоо", zh: "堆", th: "กอง", ru: "Куча" },
    { slang: "오야지", standard: "책임자/반장 (Supervisor)", vi: "Giám sát", uz: "Nazoratchi", en: "Supervisor", km: "អ្នកគ្រប់គ្រង", mn: "Дарга", zh: "负责人", th: "หัวหน้า", ru: "Прораб" },
    { slang: "우마", standard: "말비계 (Horse scaffold)", vi: "Giàn ngựa", uz: "Ot platformasi", en: "Horse scaffold", km: "សេះ", mn: "Морин тавцан", zh: "马凳", th: "ม้าไม้", ru: "Подмости" },
    { slang: "유도리", standard: "융통성/여유 (Flexibility)", vi: "Linh hoạt", uz: "Moslashuvchanlik", en: "Flexibility", km: "ត្រួសត្រាយ", mn: "Уян хатан", zh: "灵活", th: "ความยืดหยุ่น", ru: "Гибкость" },

    // ㅈ
    { slang: "젠다이", standard: "선반 (Shelf)", vi: "Kệ", uz: "Javon", en: "Shelf", km: "ធ្នើ", mn: "Тавиур", zh: "架子", th: "ชั้นวาง", ru: "Полка" },
    { slang: "조이스", standard: "장선 (Joist)", vi: "Xà gồ", uz: "Yog'och to'sin", en: "Joist", km: "ធ្នឹម", mn: "Дам", zh: "托梁", th: "คาน", ru: "Балка" },

    // ㅊ
    { slang: "짬밥", standard: "경험/경력 (Experience)", vi: "Kinh nghiệm", uz: "Tajriba", en: "Experience", km: "បទពិសោធន៍", mn: "Туршлага", zh: "经验", th: "ประสบการณ์", ru: "Опыт" },

    // ㅋ
    { slang: "쿠사비", standard: "쐐기 (Wedge)", vi: "Nêm", uz: "Ponk", en: "Wedge", km: "ស្នាម", mn: "Шаантаг", zh: "楔子", th: "ลิ่ม", ru: "Клин" },
    { slang: "기스", standard: "긁힌자국/흠집 (Scratch)", vi: "Vết xước", uz: "Tirnalish", en: "Scratch", km: "រោយ", mn: "Зураас", zh: "刮痕", th: "รอยขีดข่วน", ru: "Царапина" },

    // ㅌ
    { slang: "다시", standard: "다시/재작업 (Redo)", vi: "Làm lại", uz: "Qayta qilish", en: "Redo", km: "ធ្វើម្តងទៀត", mn: "Дахин хийх", zh: "重做", th: "ทำใหม่", ru: "Переделка" },
    { slang: "타일링", standard: "타일공사 (Tiling)", vi: "Ốp lát", uz: "Plitka qo'yish", en: "Tiling", km: "ក្រាលក្បឿង", mn: "Хавтан тавих", zh: "贴瓷砖", th: "ปูกระเบื้อง", ru: "Облицовка плиткой" },

    // ㅍ
    { slang: "빠데", standard: "퍼티/방충 (Putty)", vi: "Bột trét", uz: "Shpaklyovka", en: "Putty", km: "កែវ", mn: "Шпатлюр", zh: "腻子", th: "ซีลเลอร์", ru: "Шпатлевка" },
    { slang: "빤스", standard: "합판/패널 (Panel)", vi: "Tấm ván", uz: "Panel", en: "Panel", km: "បន្ទះ", mn: "Хавтан", zh: "面板", th: "แผ่น", ru: "Панель" },

    // ㅎ
    { slang: "하바끼", standard: "걸레받이 (Baseboard)", vi: "Len chân tường", uz: "Plinta", en: "Baseboard", km: "បន្ទះជើង", mn: "Хажуугийн мод", zh: "踢脚线", th: "บัวเชิงผนัง", ru: "Плинтус" },
    { slang: "함바", standard: "현장식당 (Site canteen)", vi: "Căng tin", uz: "Oshxona", en: "Canteen", km: "កន្ទីន", mn: "Гуанз", zh: "食堂", th: "โรงอาหาร", ru: "Столовая" },
    { slang: "헤베", standard: "평방미터 (㎡)", vi: "Mét vuông", uz: "Kvadrat metr", en: "Square meter", km: "ម៉ែត្រការ៉េ", mn: "М.кв", zh: "平方米", th: "ตารางเมตร", ru: "Квадратный метр" },
    { slang: "히끼", standard: "당김/인장 (Pull)", vi: "Kéo", uz: "Tortish", en: "Pull", km: "ទាញ", mn: "Татах", zh: "拉", th: "ดึง", ru: "Тяга" },

    // 추가 일반 용어
    { slang: "가이당", standard: "계단 (Stairs)", vi: "Cầu thang", uz: "Zina", en: "Stairs", km: "ជណ្ដើរ", mn: "Шат", zh: "楼梯", th: "บันได", ru: "Лестница" },
    { slang: "레벨", standard: "수평 (Level)", vi: "Ngang bằng", uz: "Gorizontal", en: "Level", km: "កម្រិត", mn: "Түвшин", zh: "水平", th: "ระดับ", ru: "Уровень" },
    { slang: "센터", standard: "중심 (Center)", vi: "Trung tâm", uz: "Markaz", en: "Center", km: "កណ្ដាល", mn: "Төв", zh: "中心", th: "ศูนย์กลาง", ru: "Центр" },
    { slang: "앙카", standard: "앵커/고정장치 (Anchor)", vi: "Neo", uz: "Anker", en: "Anchor", km: "យុថ្កា", mn: "Анкер", zh: "锚", th: "สมอ", ru: "Анкер" },
    { slang: "타카", standard: "스테이플러/타카기 (Stapler)", vi: "Súng bắn ghim", uz: "Steypler", en: "Staple gun", km: "ម៉ាស៊ីនទប់", mn: "Степлер", zh: "订书机", th: "แม็กเย็บ", ru: "Степлер" },
    { slang: "레미콘", standard: "레디믹스콘크리트 (Ready-mix)", vi: "Bê tông trộn sẵn", uz: "Tayyor beton", en: "Ready-mix", km: "បេតុងលាយ", mn: "Бэлэн бетон", zh: "预拌混凝土", th: "คอนกรีตผสมเสร็จ", ru: "Товарный бетон" },
    { slang: "철근", standard: "철근 (Rebar)", vi: "Cốt thép", uz: "Armatura", en: "Rebar", km: "ដែក", mn: "Арматур", zh: "钢筋", th: "เหล็ก", ru: "Арматура" },
    { slang: "타설", standard: "콘크리트부음 (Pouring)", vi: "Đổ bê tông", uz: "Quyish", en: "Pouring", km: "ចាក់", mn: "Цутгах", zh: "浇筑", th: "เท", ru: "Заливка" },
    { slang: "양생", standard: "콘크리트양생 (Curing)", vi: "Bảo dưỡng", uz: "Pishirish", en: "Curing", km: "ព្យាបាល", mn: "Эмчлэх", zh: "养护", th: "บ่ม", ru: "Твердение" },
    { slang: "다짐", standard: "다짐작업 (Compaction)", vi: "Đầm nén", uz: "Zich qilish", en: "Compaction", km: "បង្ហាប់", mn: "Нягтруулах", zh: "夯实", th: "บดอัด", ru: "Уплотнение" },
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
