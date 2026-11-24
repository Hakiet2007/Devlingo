import React, { useState } from 'react';
import { Sparkles, Check, Volume2 } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface SyntaxChar {
  symbol: string;
  name: string;
  language: string;
  usage: string;
  example: string;
}

const SYNTAX_CHARS: SyntaxChar[] = [
  {
    symbol: '{}',
    name: 'Ngoặc nhọn (Curly braces)',
    language: 'JS / CSS / Python',
    usage: 'Bao bọc khối mã (block) hoặc đối tượng Object / Dictionary.',
    example: 'const dev = { name: "Nam", level: 10 };',
  },
  {
    symbol: '[]',
    name: 'Ngoặc vuông (Square brackets)',
    language: 'Python / JS',
    usage: 'Tạo danh sách mảng (Array/List) hoặc truy cập index.',
    example: 'const fruits = ["Táo", "Cam"];\nconsole.log(fruits[0]);',
  },
  {
    symbol: '()',
    name: 'Ngoặc tròn (Parentheses)',
    language: 'Tất cả ngôn ngữ',
    usage: 'Truyền tham số vào hàm và thực thi lệnh gọi hàm.',
    example: 'print("Xin chào");\nMath.random();',
  },
  {
    symbol: '=>',
    name: 'Mũi tên (Arrow function)',
    language: 'JavaScript ES6',
    usage: 'Khai báo hàm ngắn gọn, hiện đại và sạch sẽ.',
    example: 'const gapDoi = (x) => x * 2;',
  },
  {
    symbol: '===',
    name: 'Bằng nghiêm ngặt (Strict equal)',
    language: 'JavaScript',
    usage: 'So sánh cả giá trị lẫn kiểu dữ liệu mà không ép kiểu tự động.',
    example: '5 === 5; // true\n"5" === 5; // false',
  },
  {
    symbol: '==',
    name: 'Toán tử so sánh bằng',
    language: 'Python / C++ / Java',
    usage: 'Kiểm tra xem hai vế có bằng nhau hay không.',
    example: 'if score == 100:\n    print("Hoàn hảo!");',
  },
  {
    symbol: '!=',
    name: 'Khác nhau (Not equal)',
    language: 'Tất cả ngôn ngữ',
    usage: 'Kiểm tra xem hai giá trị có khác nhau hay không.',
    example: 'if password != "":\n    login();',
  },
  {
    symbol: 'f""',
    name: 'Định dạng chuỗi (f-string)',
    language: 'Python 3.6+',
    usage: 'Chèn trực tiếp biến vào trong chuỗi ký tự bằng ngoặc {}.',
    example: 'name = "Byte"\nprint(f"Chào {name}!")',
  },
  {
    symbol: '&&',
    name: 'Toán tử VÀ (Logical AND)',
    language: 'JavaScript / C++',
    usage: 'Trả về true khi và chỉ khi TẤT CẢ các điều kiện đều đúng.',
    example: 'if (isLoggedIn && hasPermission) {\n    showAdmin();\n}',
  },
  {
    symbol: '||',
    name: 'Toán tử HOẶC (Logical OR)',
    language: 'JavaScript / C++',
    usage: 'Trả về true khi có ÍT NHẤT MỘT điều kiện đúng.',
    example: 'if (isFree || hasVoucher) {\n    order();\n}',
  },
];

export const CharactersView: React.FC = () => {
  const [selectedChar, setSelectedChar] = useState<SyntaxChar | null>(SYNTAX_CHARS[0]);

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4 pb-28 md:pb-16 select-none">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950 border border-emerald-800 rounded-full text-emerald-400 font-black text-xs uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Bảng Ký Tự Code Duolingo</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white">
          Bảng Ký Tự & Cú Pháp Cơ Bản
        </h1>
        <p className="text-xs md:text-sm font-bold text-[#849299] mt-1">
          Học và ghi nhớ các ký hiệu lập trình thông dụng như học bảng chữ cái
        </p>
      </div>

      {/* Grid of Syntax Character Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {SYNTAX_CHARS.map((char) => {
          const isSelected = selectedChar?.symbol === char.symbol;
          return (
            <button
              key={char.symbol}
              onClick={() => {
                soundEffects.playPop();
                setSelectedChar(char);
              }}
              className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                isSelected
                  ? 'bg-[#142c38] border-[#1cb0f6] text-[#1cb0f6] scale-105 shadow-xl'
                  : 'bg-[#182730] border-[#37464f] text-white hover:border-[#849299]'
              }`}
            >
              <span className="font-mono font-black text-2xl mb-1">
                {char.symbol}
              </span>
              <span className="text-[10px] font-bold text-[#849299] truncate w-full">
                {char.name.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Detail Card */}
      {selectedChar && (
        <div className="bg-[#182730] border-2 border-[#37464f] rounded-3xl p-6 shadow-2xl animate-in zoom-in-95">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#37464f]">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#142c38] border-2 border-[#1cb0f6] flex items-center justify-center font-mono font-black text-2xl text-[#1cb0f6]">
                {selectedChar.symbol}
              </div>
              <div>
                <h3 className="text-lg font-black text-white">
                  {selectedChar.name}
                </h3>
                <span className="text-xs font-bold text-[#58cc02]">
                  {selectedChar.language}
                </span>
              </div>
            </div>

            <button
              onClick={() => soundEffects.playCorrect()}
              className="p-3 bg-[#131f24] hover:bg-[#20343f] text-[#1cb0f6] rounded-2xl border border-[#37464f] transition-colors"
              title="Phát âm thanh"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-xs font-black uppercase text-[#849299] mb-1">
                Ý nghĩa & Cách dùng:
              </div>
              <p className="text-sm font-semibold text-[#dbe2e6] leading-relaxed">
                {selectedChar.usage}
              </p>
            </div>

            <div>
              <div className="text-xs font-black uppercase text-[#849299] mb-1">
                Ví dụ thực tế:
              </div>
              <div className="p-4 bg-[#131f24] rounded-2xl border border-[#37464f] font-mono text-xs text-emerald-400">
                <pre>{selectedChar.example}</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
