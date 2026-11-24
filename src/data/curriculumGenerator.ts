import { Section, Unit, Lesson, Course } from '../types';

// Helper to generate rich doors for any section
function createSectionDoors(
  sectionNum: number, 
  sectionTitle: string, 
  sectionColor: string, 
  accentColor: string,
  doorTopics: { title: string; subtitle: string; codeEx: string }[]
): Unit[] {
  return doorTopics.map((topic, idx) => {
    const doorNum = idx + 1;
    const unitId = `sec_${sectionNum}_door_${doorNum}`;

    const lessons: Lesson[] = [
      {
        id: `${unitId}_l1`,
        title: `Bài 1: ${topic.title}`,
        description: `Làm quen khái niệm cốt lõi: ${topic.subtitle}`,
        xpReward: 15,
        gemReward: 5,
        exercises: [
          {
            id: `${unitId}_ex1`,
            type: 'multiple_choice',
            prompt: `Trong ${topic.title}, câu lệnh nào sau đây là cú pháp hợp lệ?`,
            options: [
              topic.codeEx.split('\n')[0] || 'print("Hello")',
              'execute(command)',
              'run.code()',
              'make.var()',
            ],
            correctOptionIndex: 0,
            explanation: `Cú pháp chuẩn trong Python: ${topic.codeEx.split('\n')[0]}`,
          },
          {
            id: `${unitId}_ex2`,
            type: 'code_output',
            prompt: 'Đoạn code sau đây sẽ in ra kết quả gì trên terminal?',
            codeSnippet: topic.codeEx,
            options: [
              'Chạy thành công và in giá trị tương ứng',
              'Lỗi SyntaxError',
              'In ra chuỗi rỗng',
              'Chương trình dừng đột ngột',
            ],
            correctOptionIndex: 0,
            explanation: 'Đoạn code chạy từ trên xuống dưới một cách tuần tự.',
          },
          {
            id: `${unitId}_ex3`,
            type: 'fill_blank',
            prompt: `Điền từ khóa còn thiếu để hoàn thành cú pháp cho ${topic.title}:`,
            template: `x = 10\n__BLANK__(x)`,
            blankOptions: ['print', 'show', 'out', 'call'],
            correctBlankAnswer: 'print',
            explanation: 'Lệnh print() nhận tham số và hiển thị ra màn hình console.',
          },
        ],
      },
      {
        id: `${unitId}_l2`,
        title: `Bài 2: Thực hành ${topic.title}`,
        description: `Vận dụng thực tế và xử lý logic cho ${topic.title}`,
        xpReward: 20,
        gemReward: 8,
        exercises: [
          {
            id: `${unitId}_ex4`,
            type: 'order_blocks',
            prompt: 'Sắp xếp các dòng mã theo thứ tự logic chuẩn:',
            codeBlocks: ['print(ket_qua)', 'ket_qua = 100'],
            correctBlockOrder: ['ket_qua = 100', 'print(ket_qua)'],
            explanation: 'Biến cần được khởi tạo trước khi được sử dụng hoặc in ra.',
          },
          {
            id: `${unitId}_ex5`,
            type: 'fix_bug',
            prompt: 'Tìm lỗi trong đoạn code sau:',
            buggyCode: `x = 5\nprint(x + "5")`,
            bugExplanation: 'Không thể cộng trực tiếp số nguyên int với chuỗi ký tự str!',
            options: [
              'Không thể cộng trực tiếp số nguyên và chuỗi chữ',
              'Biến x chưa được gán',
              'Lệnh print không thể in số',
              'Phải dùng dấu trừ thay vì cộng',
            ],
            correctOptionIndex: 0,
            explanation: 'Trong Python, bạn cần ép kiểu int("5") hoặc str(x) để tương thích kiểu.',
          },
        ],
      },
      {
        id: `${unitId}_l3`,
        title: `Bài 3: Thử thách thể lực code`,
        description: `Ôn tập phản xạ và ghi nhớ sâu`,
        xpReward: 25,
        gemReward: 10,
        exercises: [
          {
            id: `${unitId}_ex6`,
            type: 'multiple_choice',
            prompt: 'Toán tử nào dùng để so sánh hai giá trị bằng nhau trong Python?',
            options: ['==', '=', '===', 'equals'],
            correctOptionIndex: 0,
            explanation: 'Toán tử == dùng để so sánh bằng. Dấu = là phép gán.',
          },
        ],
      },
    ];

    return {
      id: unitId,
      unitNumber: doorNum,
      title: topic.title,
      subtitle: topic.subtitle,
      color: sectionColor,
      accentColor: accentColor,
      guidebook: {
        title: `Hướng dẫn kiến thức: Cửa ${doorNum}`,
        summary: `Tóm tắt lý thuyết trọng tâm của ${topic.title}.`,
        keyConcepts: [
          {
            title: topic.title,
            description: topic.subtitle,
            exampleCode: topic.codeEx,
          },
        ],
      },
      lessons,
    };
  });
}

// Generate Section 9: 6 lessons, resets daily!
export function generateDailySection(todayDateStr: string): Section {
  // 6 specific daily lessons
  const dailyLessons: Lesson[] = [
    {
      id: `daily_${todayDateStr}_l1`,
      title: 'Bài 1: Khởi động não bộ buổi sáng',
      description: 'Luyện phản xạ nhận diện cú pháp căn bản',
      xpReward: 20,
      gemReward: 10,
      exercises: [
        {
          id: `daily_ex_1`,
          type: 'multiple_choice',
          prompt: 'Dòng lệnh in nào sau đây là chuẩn Python 3?',
          options: ['print("Chào ngày mới!")', 'echo "Chào ngày mới!"', 'Console.Write()', 'System.out()'],
          correctOptionIndex: 0,
          explanation: 'Lệnh print("...") là cú pháp chuẩn của Python.',
        },
        {
          id: `daily_ex_2`,
          type: 'fill_blank',
          prompt: 'Điền hàm để hiển thị chuỗi chào buổi sáng:',
          template: '__BLANK__("Chào buổi sáng Coder")',
          blankOptions: ['print', 'log', 'say', 'write'],
          correctBlankAnswer: 'print',
          explanation: 'Hàm print() hiển thị dữ liệu ra màn hình.',
        },
      ],
    },
    {
      id: `daily_${todayDateStr}_l2`,
      title: 'Bài 2: Đoán kết quả hàm (Daily Predict)',
      description: 'Phân tích luồng thực thi của máy tính',
      xpReward: 20,
      gemReward: 10,
      exercises: [
        {
          id: `daily_ex_3`,
          type: 'code_output',
          prompt: 'Đoạn code tính toán thời gian này in ra gì?',
          codeSnippet: 'a = 15\nb = 5\nprint(a // b)',
          options: ['3', '3.0', '75', '0'],
          correctOptionIndex: 0,
          explanation: 'Toán tử // là phép chia lấy phần nguyên, 15 // 5 = 3.',
        },
      ],
    },
    {
      id: `daily_${todayDateStr}_l3`,
      title: 'Bài 3: Săn bắt lỗi Bug trong ngày',
      description: 'Phát hiện lỗi cú pháp tiềm ẩn',
      xpReward: 25,
      gemReward: 10,
      exercises: [
        {
          id: `daily_ex_4`,
          type: 'fix_bug',
          prompt: 'Tìm lỗi trong câu lệnh điều kiện sau:',
          buggyCode: 'if diem >= 5\n    print("Đỗ")',
          bugExplanation: 'Thiếu dấu hai chấm : ở cuối mệnh đề if!',
          options: [
            'Thiếu dấu hai chấm : sau điều kiện if',
            'diem không được so sánh với số 5',
            'Lệnh print phải viết hoa',
            'Thiếu dấu chấm phẩy ở cuối dòng',
          ],
          correctOptionIndex: 0,
          explanation: 'Mọi cấu trúc điều kiện if, elif, else đều phải có dấu hai chấm :.',
        },
      ],
    },
    {
      id: `daily_${todayDateStr}_l4`,
      title: 'Bài 4: Sắp xếp thuật toán (Daily Logic)',
      description: 'Lắp ráp các khối mã thành chương trình chạy được',
      xpReward: 25,
      gemReward: 10,
      exercises: [
        {
          id: `daily_ex_5`,
          type: 'order_blocks',
          prompt: 'Sắp xếp để tạo biến và in ra diện tích hình chữ nhật:',
          codeBlocks: ['print(dien_tich)', 'dien_tich = dai * rong', 'dai = 10', 'rong = 5'],
          correctBlockOrder: ['dai = 10', 'rong = 5', 'dien_tich = dai * rong', 'print(dien_tich)'],
          explanation: 'Khai báo dai, rong -> tính diện tích -> in ra kết quả.',
        },
      ],
    },
    {
      id: `daily_${todayDateStr}_l5`,
      title: 'Bài 5: Thử thách cú pháp Pro',
      description: 'Xử lý chuỗi và định dạng f-string nâng cao',
      xpReward: 30,
      gemReward: 15,
      exercises: [
        {
          id: `daily_ex_6`,
          type: 'code_output',
          prompt: 'Kết quả in ra của câu lệnh f-string là gì?',
          codeSnippet: 'user = "duoIingo"\nprint(f"Học cùng {user.upper()}!")',
          options: ['Học cùng DUOIINGO!', 'Học cùng duoiingo!', 'Học cùng duoIingo!', 'Lỗi cú pháp'],
          correctOptionIndex: 0,
          explanation: 'user.upper() chuyển toàn bộ ký tự thành chữ in hoa DUOIINGO.',
        },
      ],
    },
    {
      id: `daily_${todayDateStr}_l6`,
      title: 'Bài 6: Trùm cuối hôm nay (Daily Boss Code)',
      description: 'Hoàn thành thử thách cao nhất để nhận rương đặc biệt!',
      xpReward: 40,
      gemReward: 25,
      exercises: [
        {
          id: `daily_ex_7`,
          type: 'code_output',
          prompt: 'Giá trị cuối cùng của biến tong là bao nhiêu?',
          codeSnippet: 'tong = 0\nfor i in [1, 2, 3, 4]:\n    tong += i\nprint(tong)',
          options: ['10', '4', '24', '0'],
          correctOptionIndex: 0,
          explanation: '1 + 2 + 3 + 4 = 10. Vòng lặp cộng dồn các phần tử của danh sách.',
        },
      ],
    },
  ];

  // Wrap in 1 unit for Section 9
  const dailyUnit: Unit = {
    id: `sec_9_daily_door_1`,
    unitNumber: 1,
    title: 'Thử Thách Bài Mới Hôm Nay',
    subtitle: 'Hoàn thành 6 bài học để bảo vệ chuỗi Streak và nhận 50 Đá quý!',
    color: '#ce82ff', // Purple daily
    accentColor: '#a559e0',
    guidebook: {
      title: 'Hướng dẫn: Thử Thách Hằng Ngày',
      summary: 'Mỗi ngày hệ thống tạo mới 6 bài tập luyện tập phản xạ code, giúp bạn duy trì thói quen viết mã liên tục.',
      keyConcepts: [
        {
          title: 'Quy tắc 20 phút mỗi ngày',
          description: 'Học lập trình đều đặn 6 bài nhỏ hiệu quả hơn học dồn một ngày cuối tuần.',
          exampleCode: '# Code mỗi ngày cùng duoIingo\nstreak += 1',
        },
      ],
    },
    lessons: dailyLessons,
  };

  return {
    id: 'section_9',
    sectionNumber: 9,
    title: 'Phần 9: Bài Mới Mỗi Ngày (Daily Reset)',
    subtitle: 'Thử thách 6 bài học mới toanh làm mới sau mỗi 24 giờ!',
    description: 'Chinh phục trọn bộ 6 bài học hôm nay để kích hoạt nhân đôi kinh nghiệm và nhận rương vàng!',
    color: '#ce82ff',
    doorsCount: 6,
    isDailySpecial: true,
    doors: [dailyUnit],
  };
}

// Generate all 9 sections (Sections 1-8 have 21 Doors each!)
export function generateCurriculum(): Section[] {
  const todayStr = new Date().toISOString().split('T')[0];

  const sectionsData = [
    {
      number: 1,
      title: 'Phần 1: Nhập Môn & Cú Pháp Cơ Bản',
      subtitle: 'Chào hỏi, lệnh in print(), biến số và kiểu dữ liệu',
      color: '#ff4b4b', // Coral Red
      accent: '#d33131',
      doors: [
        { title: 'Cửa 1: Chào hỏi & Dòng code đầu tiên', subtitle: 'Lệnh in print và chuỗi Hello World', codeEx: 'print("Xin chào duoIingo!")' },
        { title: 'Cửa 2: Biến số & Gán giá trị', subtitle: 'Lưu trữ thông tin với biến', codeEx: 'tuoi = 20\nprint(tuoi)' },
        { title: 'Cửa 3: Ghép chuỗi & f-string', subtitle: 'Tạo thông điệp động f"..."', codeEx: 'ten = "Byte"\nprint(f"Chào {ten}!")' },
        { title: 'Cửa 4: Phép cộng trừ toán học', subtitle: 'Toán tử + và - cơ bản', codeEx: 'a = 10\nb = 5\nprint(a + b)' },
        { title: 'Cửa 5: Phép nhân và chia', subtitle: 'Toán tử * và / trong code', codeEx: 'print(4 * 5)\nprint(20 / 4)' },
        { title: 'Cửa 6: Chia nguyên và chia dư', subtitle: 'Toán tử // và % thần thánh', codeEx: 'print(10 // 3)\nprint(10 % 3)' },
        { title: 'Cửa 7: Nhập dữ liệu với input()', subtitle: 'Nhận dữ liệu gõ từ bàn phím', codeEx: 'ten = "Nam"\nprint("Xin chào " + ten)' },
        { title: 'Cửa 8: Ép kiểu dữ liệu int và str', subtitle: 'Chuyển đổi qua lại giữa số và chữ', codeEx: 's = "50"\nn = int(s)\nprint(n + 10)' },
        { title: 'Cửa 9: Số thực Float & Số nguyên Int', subtitle: 'Phân biệt số có dấu phẩy động', codeEx: 'pi = 3.14\nr = 5\nprint(pi * r * r)' },
        { title: 'Cửa 10: Đúng hay Sai với Boolean', subtitle: 'Giá trị logic True và False', codeEx: 'is_coder = True\nprint(is_coder)' },
        { title: 'Cửa 11: So sánh bằng == và khác !=', subtitle: 'Kiểm tra đẳng thức của hai biến', codeEx: 'x = 10\nprint(x == 10)' },
        { title: 'Cửa 12: So sánh lớn hơn & nhỏ hơn', subtitle: 'Toán tử > và <', codeEx: 'diem = 9\nprint(diem >= 5)' },
        { title: 'Cửa 13: Cắt chuỗi Slicing [0:3]', subtitle: 'Trích xuất ký tự trong từ', codeEx: 's = "Python"\nprint(s[0:2])' },
        { title: 'Cửa 14: Đếm độ dài với hàm len()', subtitle: 'Độ dài của chuỗi ký tự', codeEx: 'chuoi = "duoIingo"\nprint(len(chuoi))' },
        { title: 'Cửa 15: Chuyển chữ hoa .upper()', subtitle: 'Phương thức chuỗi hoa thường', codeEx: 'msg = "hi"\nprint(msg.upper())' },
        { title: 'Cửa 16: Kiểm tra từ khóa với in', subtitle: 'Tìm kiếm chuỗi con nhanh', codeEx: 'print("py" in "python")' },
        { title: 'Cửa 17: Dấu nhảy dòng \\n và tab \\t', subtitle: 'Ký tự escape trong chuỗi', codeEx: 'print("Dong 1\\nDong 2")' },
        { title: 'Cửa 18: Chuỗi nhiều dòng """', subtitle: 'Văn bản dài nhiều đoạn', codeEx: 'text = """A\\nB\\nC"""\nprint(text)' },
        { title: 'Cửa 19: Toán tử gán kết hợp +=', subtitle: 'Rút gọn x = x + 1', codeEx: 'count = 0\ncount += 5\nprint(count)' },
        { title: 'Cửa 20: Lũy thừa số học **', subtitle: 'Tính số mũ 2 lũy thừa 3', codeEx: 'print(2 ** 3)' },
        { title: 'Cửa 21: Thử thách tổng ôn Phần 1', subtitle: 'Chinh phục toàn bộ cú pháp khởi đầu', codeEx: 'print("Hoan thanh Phan 1!")' },
      ],
    },
    {
      number: 2,
      title: 'Phần 2: Cấu Trúc Điều Kiện & Rẽ Nhánh',
      subtitle: 'Làm chủ if, elif, else và logic so sánh đa chiều',
      color: '#ff9600', // Orange
      accent: '#e08500',
      doors: Array.from({ length: 21 }, (_, i) => ({
        title: `Cửa ${i + 1}: Điều kiện logic cấp độ ${i + 1}`,
        subtitle: `Rẽ nhánh điều kiện và kiểm tra biểu thức logic bước ${i + 1}`,
        codeEx: `if diem >= ${i * 4}:\n    print("Dat chi tieu")`,
      })),
    },
    {
      number: 3,
      title: 'Phần 3: Vòng Lặp For & Dải Số Range',
      subtitle: 'Tự động hóa tác vụ lặp đi lặp lại hàng nghìn lần',
      color: '#ffc800', // Yellow
      accent: '#e5b400',
      doors: Array.from({ length: 21 }, (_, i) => ({
        title: `Cửa ${i + 1}: Vòng lặp For bước ${i + 1}`,
        subtitle: `Duyệt dải số range(${i + 1}) và biến đếm`,
        codeEx: `for i in range(${i + 2}):\n    print(f"Lan lap {i}")`,
      })),
    },
    {
      number: 4,
      title: 'Phần 4: Vòng Lặp While & Kiểm Soát Break',
      subtitle: 'Vòng lặp có điều kiện và thoát lặp thông minh',
      color: '#58cc02', // Duo Green
      accent: '#46a302',
      doors: Array.from({ length: 21 }, (_, i) => ({
        title: `Cửa ${i + 1}: Vòng lặp While cấp ${i + 1}`,
        subtitle: `Dừng vòng lặp với break và tiếp tục với continue`,
        codeEx: `n = 0\nwhile n < ${i + 2}:\n    n += 1`,
      })),
    },
    {
      number: 5,
      title: 'Phần 5: Danh Sách List & Cấu Trúc Dữ Liệu',
      subtitle: 'Lưu trữ bộ sưu tập phần tử và thao tác mảng',
      color: '#1cb0f6', // Cyan / Blue
      accent: '#1899d6',
      doors: Array.from({ length: 21 }, (_, i) => ({
        title: `Cửa ${i + 1}: Mảng List phần tử cấp ${i + 1}`,
        subtitle: `Phương thức .append(), .pop() và sắp xếp sort()`,
        codeEx: `arr = [1, 2, ${i + 1}]\narr.append(100)`,
      })),
    },
    {
      number: 6,
      title: 'Phần 6: Từ Điển Dictionary & Tuple',
      subtitle: 'Cặp khóa - giá trị Key:Value và dữ liệu bất biến',
      color: '#ce82ff', // Super Purple
      accent: '#a559e0',
      doors: Array.from({ length: 21 }, (_, i) => ({
        title: `Cửa ${i + 1}: Dictionary & Mapping bước ${i + 1}`,
        subtitle: `Tra cứu dữ liệu siêu tốc O(1) theo Key`,
        codeEx: `user = {"name": "Byte", "level": ${i + 1}}`,
      })),
    },
    {
      number: 7,
      title: 'Phần 7: Hàm Function & Xử Lý Ngoại Lệ',
      subtitle: 'Tái sử dụng mã nguồn với def và bắt lỗi try/except',
      color: '#00cd9c', // Emerald
      accent: '#00a880',
      doors: Array.from({ length: 21 }, (_, i) => ({
        title: `Cửa ${i + 1}: Định nghĩa hàm def bước ${i + 1}`,
        subtitle: `Tham số truyền vào và từ khóa return giá trị`,
        codeEx: `def tinh_toan(x):\n    return x * ${i + 1}`,
      })),
    },
    {
      number: 8,
      title: 'Phần 8: Lập Trình Hướng Đối Tượng OOP',
      subtitle: 'Xây dựng Class, Đối Tượng Object và Kế Thừa',
      color: '#e03535', // Deep Red
      accent: '#b82020',
      doors: Array.from({ length: 21 }, (_, i) => ({
        title: `Cửa ${i + 1}: Lớp Class & Kế Thừa cấp ${i + 1}`,
        subtitle: `Hàm khởi tạo __init__ và phương thức đối tượng`,
        codeEx: `class Robot:\n    def __init__(self):\n        self.pin = ${i + 1}`,
      })),
    },
  ];

  const sections: Section[] = sectionsData.map((sec) => {
    return {
      id: `section_${sec.number}`,
      sectionNumber: sec.number,
      title: sec.title,
      subtitle: sec.subtitle,
      description: `Bao gồm ${sec.doors.length} cửa thử thách học lập trình bài bản.`,
      color: sec.color,
      doorsCount: sec.doors.length,
      doors: createSectionDoors(sec.number, sec.title, sec.color, sec.accent, sec.doors),
    };
  });

  // Section 9: Special daily reset!
  const section9 = generateDailySection(todayStr);
  sections.push(section9);

  return sections;
}
