import { NOGADA_SLANG, LANGUAGES } from "@/lib/constants";

// 언어별 음성 설정 - 사용자 원본 HTML 코드의 음성 설정과 동일
// Gemini 2.5 Flash TTS 전용 음성
export const VOICE_CONFIG: Record<string, { voiceName: string; style: string }> = {
    'vi-VN': { voiceName: 'Zephyr', style: 'Vietnamese native, clear and natural' },
    'uz-UZ': { voiceName: 'Fenrir', style: 'Uzbek native speaker, clear and steady' },
    'km-KH': { voiceName: 'Fenrir', style: 'Khmer native speaker, gentle and clear' },
    'mn-MN': { voiceName: 'Fenrir', style: 'Mongolian native speaker, warm and steady' },
    'en-US': { voiceName: 'Zephyr', style: 'American English, professional and clear' },
    'zh-CN': { voiceName: 'Fenrir', style: 'Mandarin Chinese, professional tone' },
    'th-TH': { voiceName: 'Zephyr', style: 'Thai native speaker, clear and confident' },
    'ru-RU': { voiceName: 'Iapetus', style: 'Russian native, clear pronunciation' },
    'ko-KR': { voiceName: 'Kore', style: 'Korean native female, professional announcer' },
};


// 고품질 음성 선택을 위한 언어별 최적 음성 이름 (Microsoft Edge/Azure)
export const PREFERRED_VOICES: Record<string, string[]> = {
    'vi': ['Microsoft An Online', 'Microsoft HoaiMy Online', 'Google Tiếng Việt', 'Linh'],
    'uz': ['Microsoft Sardor Online', 'Google Uzbek'],
    'km': ['Microsoft Sreymom Online', 'Google Khmer', 'Microsoft Piseth Online'],
    'mn': ['Microsoft Yesui Online', 'Google Mongolian'],
    'en': ['Microsoft Aria Online', 'Microsoft Guy Online', 'Google US English', 'Samantha'],
    'zh': ['Microsoft Xiaoxiao Online', 'Microsoft Yunyang Online', 'Google 普通话', 'Ting-Ting'],
    'th': ['Microsoft Premwadee Online', 'Microsoft Niwat Online', 'Google ไทย', 'Kanya'],
    'ru': ['Microsoft Svetlana Online', 'Microsoft Dmitry Online', 'Google русский', 'Milena'],
    'ko': ['Microsoft SunHi Online', 'Microsoft InJoon Online', 'Google 한국의', 'Yuna'],
};

// 은어 → 표준어 변환 함수
export function convertSlangToStandard(text: string): { converted: string; detected: string[] } {
    let converted = text;
    const detected: string[] = [];

    // 긴 은어부터 먼저 매칭 (부분 매칭 방지)
    const sortedSlang = [...NOGADA_SLANG].sort((a, b) => b.slang.length - a.slang.length);

    sortedSlang.forEach(item => {
        if (text.includes(item.slang)) {
            detected.push(item.slang);
            const standardKorean = item.standard.split('(')[0].trim();
            converted = converted.replace(new RegExp(item.slang, 'g'), standardKorean);
        }
    });

    return { converted, detected };
}

// 2단계: 모든 언어에 대한 확장된 문법/동사/조사 사전
const FULL_DICT: Record<string, Record<string, string>> = {
    'vi': {
        // 동사/지시어
        '하세요': 'xin hãy làm', '해주세요': 'xin hãy làm', '합니다': 'sẽ làm',
        '확인하세요': 'hãy kiểm tra', '확인해': 'kiểm tra', '확인': 'kiểm tra',
        '준비하세요': 'hãy chuẩn bị', '준비하고': 'chuẩn bị và', '준비해': 'chuẩn bị',
        '주의하세요': 'hãy chú ý', '조심하세요': 'hãy cẩn thận', '조심해': 'cẩn thận',
        '시작하세요': 'hãy bắt đầu', '시작해': 'bắt đầu', '시작': 'bắt đầu',
        '중지하세요': 'hãy dừng lại', '중지해': 'dừng lại', '멈춰': 'dừng lại',
        '착용하세요': 'hãy đeo vào', '착용해': 'đeo vào',
        // 접속사
        '하고': 'và', '그리고': 'và', '또는': 'hoặc', '전에': 'trước khi', '후에': 'sau khi',
        // 명사
        '오늘': 'hôm nay', '내일': 'ngày mai', '현장': 'công trường', '작업': 'công việc',
        '안전': 'an toàn', '위험': 'nguy hiểm', '장비': 'thiết bị', '도구': 'dụng cụ',
        '안전모': 'mũ bảo hiểm', '안전화': 'giày bảo hộ', '안전벨트': 'dây an toàn',
        // 조사 (빈 문자열로 제거)
        '을': '', '를': '', '이': '', '가': '', '의': '', '에서': ' tại', '으로': ' bằng'
    },
    'uz': {
        '하세요': 'iltimos bajaring', '해주세요': 'iltimos bajaring', '합니다': 'bajaradi',
        '확인하세요': 'tekshiring', '확인해': 'tekshir', '확인': 'tekshirish',
        '준비하세요': 'tayyorlang', '준비하고': 'tayyorlab', '준비해': 'tayyorla',
        '주의하세요': "e'tibor bering", '조심하세요': 'ehtiyot boling', '조심해': 'ehtiyot bol',
        '시작하세요': 'boshlang', '시작해': 'boshla', '시작': 'boshlash',
        '중지하세요': "to'xtating", '중지해': "to'xta", '멈춰': "to'xta",
        '착용하세요': 'kiying', '착용해': 'kiy',
        '하고': 'va', '그리고': 'va', '또는': 'yoki', '전에': 'oldin', '후에': 'keyin',
        '오늘': 'bugun', '내일': 'ertaga', '현장': 'qurilish maydoni', '작업': 'ish',
        '안전': 'xavfsizlik', '위험': 'xavf', '장비': 'uskuna', '도구': 'asbob',
        '안전모': 'himoya qalpog', '안전화': 'himoya poyabzali', '안전벨트': 'xavfsizlik kamari',
        '을': '', '를': '', '이': '', '가': '', '의': '', '에서': 'da', '으로': 'bilan'
    },
    'km': {
        '하세요': 'សូមធ្វើ', '해주세요': 'សូមធ្វើ', '합니다': 'នឹងធ្វើ',
        '확인하세요': 'សូមពិនិត្យ', '확인해': 'ពិនិត្យ', '확인': 'ពិនិត្យ',
        '준비하세요': 'សូមរៀបចំ', '준비하고': 'រៀបចំ និង', '준비해': 'រៀបចំ',
        '주의하세요': 'សូមប្រយ័ត្ន', '조심하세요': 'សូមប្រយ័ត្ន', '조심해': 'ប្រយ័ត្ន',
        '시작하세요': 'សូមចាប់ផ្តើម', '시작해': 'ចាប់ផ្តើម', '시작': 'ចាប់ផ្តើម',
        '중지하세요': 'សូមឈប់', '중지해': 'ឈប់', '멈춰': 'ឈប់',
        '착용하세요': 'សូមពាក់', '착용해': 'ពាក់',
        '하고': 'និង', '그리고': 'និង', '또는': 'ឬ', '전에': 'មុន', '후에': 'ក្រោយ',
        '오늘': 'ថ្ងៃនេះ', '내일': 'ថ្ងៃស្អែក', '현장': 'ការដ្ឋាន', '작업': 'ការងារ',
        '안전': 'សុវត្ថិភាព', '위험': 'គ្រោះថ្នាក់', '장비': 'ឧបករណ៍', '도구': 'ឧបករណ៍',
        '안전모': 'មួកសុវត្ថិភាព', '안전화': 'ស្បែកជើងសុវត្ថិភាព', '안전벨트': 'ខ្សែក្រវ៉ាត់សុវត្ថិភាព',
        '을': '', '를': '', '이': '', '가': '', '의': '', '에서': 'នៅ', '으로': 'ដោយ'
    },
    'mn': {
        '하세요': 'хийнэ үү', '해주세요': 'хийнэ үү', '합니다': 'хийнэ',
        '확인하세요': 'шалгана уу', '확인해': 'шалга', '확인': 'шалгах',
        '준비하세요': 'бэлтгэнэ үү', '준비하고': 'бэлтгэж', '준비해': 'бэлтгэ',
        '주의하세요': 'анхаарна уу', '조심하세요': 'болгоомжтой байна уу', '조심해': 'болгоомжтой',
        '시작하세요': 'эхлүүлнэ үү', '시작해': 'эхлүүл', '시작': 'эхлэх',
        '중지하세요': 'зогсоно уу', '중지해': 'зогсоо', '멈춰': 'зогс',
        '착용하세요': 'өмсөнө үү', '착용해': 'өмсө',
        '하고': 'ба', '그리고': 'ба', '또는': 'эсвэл', '전에': 'өмнө', '후에': 'дараа',
        '오늘': 'өнөөдөр', '내일': 'маргааш', '현장': 'талбай', '작업': 'ажил',
        '안전': 'аюулгүй', '위험': 'аюултай', '장비': 'тоног төхөөрөмж', '도구': 'багаж',
        '안전모': 'хамгаалалтын малгай', '안전화': 'хамгаалалтын гутал', '안전벨트': 'аюулгүйн бүс',
        '을': '', '를': '', '이': '', '가': '', '의': '', '에서': '-д', '으로': '-аар'
    },
    'en': {
        '하세요': 'please do', '해주세요': 'please do', '합니다': 'will do',
        '확인하세요': 'please check', '확인해': 'check', '확인': 'check',
        '준비하세요': 'please prepare', '준비하고': 'prepare and', '준비해': 'prepare',
        '주의하세요': 'please be careful', '조심하세요': 'please be careful', '조심해': 'be careful',
        '시작하세요': 'please start', '시작해': 'start', '시작': 'start',
        '중지하세요': 'please stop', '중지해': 'stop', '멈춰': 'stop',
        '착용하세요': 'please wear', '착용해': 'wear',
        '하고': 'and', '그리고': 'and', '또는': 'or', '전에': 'before', '후에': 'after',
        '오늘': 'today', '내일': 'tomorrow', '현장': 'site', '작업': 'work',
        '안전': 'safety', '위험': 'danger', '장비': 'equipment', '도구': 'tools',
        '안전모': 'safety helmet', '안전화': 'safety shoes', '안전벨트': 'safety belt',
        '을': '', '를': '', '이': '', '가': '', '의': '', '에서': 'at', '으로': 'with'
    },
    'zh': {
        '하세요': '请做', '해주세요': '请做', '합니다': '将做',
        '확인하세요': '请检查', '확인해': '检查', '확인': '确认',
        '준비하세요': '请准备', '준비하고': '准备并', '준비해': '准备',
        '주의하세요': '请注意', '조심하세요': '请小心', '조심해': '小心',
        '시작하세요': '请开始', '시작해': '开始', '시작': '开始',
        '중지하세요': '请停止', '중지해': '停止', '멈춰': '停',
        '착용하세요': '请穿戴', '착용해': '穿戴',
        '하고': '并', '그리고': '并且', '또는': '或者', '전에': '之前', '후에': '之后',
        '오늘': '今天', '내일': '明天', '현장': '工地', '작업': '作业',
        '안전': '安全', '위험': '危险', '장비': '设备', '도구': '工具',
        '안전모': '安全帽', '안전화': '安全鞋', '안전벨트': '安全带',
        '을': '', '를': '', '이': '', '가': '', '의': '', '에서': '在', '으로': '用'
    },
    'th': {
        '하세요': 'กรุณาทำ', '해주세요': 'กรุณาทำ', '합니다': 'จะทำ',
        '확인하세요': 'กรุณาตรวจสอบ', '확인해': 'ตรวจสอบ', '확인': 'ตรวจสอบ',
        '준비하세요': 'กรุณาเตรียม', '준비하고': 'เตรียมและ', '준비해': 'เตรียม',
        '주의하세요': 'กรุณาระวัง', '조심하세요': 'กรุณาระวัง', '조심해': 'ระวัง',
        '시작하세요': 'กรุณาเริ่ม', '시작해': 'เริ่ม', '시작': 'เริ่มต้น',
        '중지하세요': 'กรุณาหยุด', '중지해': 'หยุด', '멈춰': 'หยุด',
        '착용하세요': 'กรุณาใส่', '착용해': 'ใส่',
        '하고': 'และ', '그리고': 'และ', '또는': 'หรือ', '전에': 'ก่อน', '후에': 'หลัง',
        '오늘': 'วันนี้', '내일': 'พรุ่งนี้', '현장': 'ไซต์งาน', '작업': 'งาน',
        '안전': 'ความปลอดภัย', '위험': 'อันตราย', '장비': 'อุปกรณ์', '도구': 'เครื่องมือ',
        '안전모': 'หมวกนิรภัย', '안전화': 'รองเท้านิรภัย', '안전벨트': 'เข็มขัดนิรภัย',
        '을': '', '를': '', '이': '', '가': '', '의': '', '에서': 'ที่', '으로': 'ด้วย'
    },
    'ru': {
        '하세요': 'пожалуйста сделайте', '해주세요': 'пожалуйста сделайте', '합니다': 'сделает',
        '확인하세요': 'проверьте пожалуйста', '확인해': 'проверь', '확인': 'проверка',
        '준비하세요': 'подготовьте пожалуйста', '준비하고': 'подготовьте и', '준비해': 'подготовь',
        '주의하세요': 'будьте внимательны', '조심하세요': 'будьте осторожны', '조심해': 'осторожно',
        '시작하세요': 'начните пожалуйста', '시작해': 'начни', '시작': 'начало',
        '중지하세요': 'остановите пожалуйста', '중지해': 'останови', '멈춰': 'стоп',
        '착용하세요': 'наденьте пожалуйста', '착용해': 'надень',
        '하고': 'и', '그리고': 'и', '또는': 'или', '전에': 'до', '후에': 'после',
        '오늘': 'сегодня', '내일': 'завтра', '현장': 'площадка', '작업': 'работа',
        '안전': 'безопасность', '위험': 'опасность', '장비': 'оборудование', '도구': 'инструменты',
        '안전모': 'защитная каска', '안전화': 'защитная обувь', '안전벨트': 'страховочный пояс',
        '을': '', '를': '', '이': '', '가': '', '의': '', '에서': 'на', '으로': ''
    }
};

// 완전한 번역 함수 - NOGADA_SLANG 다국어 데이터 활용
export function translateText(text: string, langCode: string): string {
    const langKey = langCode.split('-')[0].toLowerCase();

    // 언어 코드 매핑 (NOGADA_SLANG 키 형식과 일치)
    const langMapping: Record<string, string> = {
        'vi': 'vi', 'uz': 'uz', 'km': 'km', 'mn': 'mn',
        'en': 'en', 'zh': 'zh', 'th': 'th', 'ru': 'ru'
    };
    const slangLangKey = langMapping[langKey] || 'en';

    let translated = text;

    // 1단계: NOGADA_SLANG에서 표준 한국어를 대상 언어로 직접 번역
    // 긴 단어부터 먼저 처리
    const sortedSlang = [...NOGADA_SLANG].sort((a, b) =>
        b.standard.split('(')[0].trim().length - a.standard.split('(')[0].trim().length
    );

    sortedSlang.forEach(item => {
        const standardKorean = item.standard.split('(')[0].trim();
        const translation = (item as any)[slangLangKey] || item.en;
        if (translation && translated.includes(standardKorean)) {
            translated = translated.replace(new RegExp(standardKorean, 'g'), translation);
        }
    });

    // 2단계: 모든 언어에 대한 확장된 문법/동사/조사 사전
    // 긴 단어부터 먼저 번역
    const dict = FULL_DICT[langKey] || FULL_DICT['en'];
    const sorted = Object.entries(dict).sort((a, b) => b[0].length - a[0].length);
    sorted.forEach(([kr, foreign]) => {
        if (kr) translated = translated.replace(new RegExp(kr, 'g'), foreign);
    });

    // 3단계: 남은 한글 제거 및 정리
    translated = translated.replace(/[가-힣]+/g, '').replace(/\s+/g, ' ').trim();

    // 빈 결과면 의미있는 메시지 반환
    if (!translated || translated.length < 3) {
        const defaultMessages: Record<string, string> = {
            'vi': 'Vui lòng kiểm tra và chuẩn bị công việc',
            'uz': 'Iltimos tekshiring va ishga tayyorlaning',
            'km': 'សូមពិនិត្យនិងរៀបចំការងារ',
            'mn': 'Шалгаж, ажилд бэлтгэнэ үү',
            'en': 'Please check and prepare for work',
            'zh': '请检查并准备工作',
            'th': 'กรุณาตรวจสอบและเตรียมงาน',
            'ru': 'Проверьте и подготовьтесь к работе'
        };
        return defaultMessages[langKey] || defaultMessages['en'];
    }

    return translated;
}

// PCM L16 오디오를 WAV로 변환하는 함수
export function pcmToWav(pcmData: Uint8Array, sampleRate: number = 24000): Blob {
    const numChannels = 1;
    const bitsPerSample = 16;
    const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
    const blockAlign = numChannels * (bitsPerSample / 8);
    const dataSize = pcmData.length;
    const headerSize = 44;
    const totalSize = headerSize + dataSize;

    const buffer = new ArrayBuffer(totalSize);
    const view = new DataView(buffer);

    // RIFF header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, totalSize - 8, true);
    writeString(view, 8, 'WAVE');

    // fmt subchunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // subchunk size
    view.setUint16(20, 1, true); // audio format (PCM)
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);

    // data subchunk
    writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);

    // PCM data
    const outputArray = new Uint8Array(buffer);
    outputArray.set(pcmData, headerSize);

    return new Blob([buffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
    }
}
