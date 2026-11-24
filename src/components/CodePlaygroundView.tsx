import React, { useState } from 'react';
import { Play, RotateCcw, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundEffects } from '../utils/audio';

const STARTER_SNIPPETS = [
  {
    name: 'Chào sân duoIingo',
    code: `// Chào mừng đến với duoIingo Sandbox!
const devName = "Lập trình viên";
console.log("Xin chào, " + devName + "!");
console.log("Hôm nay là ngày tuyệt vời để viết code 🚀");`,
  },
  {
    name: 'Vòng lặp tính tổng 1 -> 10',
    code: `let tong = 0;
for (let i = 1; i <= 10; i++) {
  tong += i;
}
console.log("Tổng từ 1 đến 10 là:", tong);`,
  },
  {
    name: 'Mảng ngôn ngữ lập trình',
    code: `const skills = ["Python", "JavaScript", "HTML/CSS", "React"];

skills.forEach((skill, index) => {
  console.log(\`#\${index + 1}: Thành thạo \${skill} cùng duoIingo ✨\`);
});`,
  },
  {
    name: 'Hàm kiểm tra số chẵn lẻ',
    code: `function kiemTra(n) {
  if (n % 2 === 0) {
    return \`\${n} là số chẵn!\`;
  } else {
    return \`\${n} là số lẻ!\`;
  }
}

console.log(kiemTra(7));
console.log(kiemTra(12));`,
  },
];

export const CodePlaygroundView: React.FC = () => {
  const [code, setCode] = useState(STARTER_SNIPPETS[0].code);
  const [outputLogs, setOutputLogs] = useState<string[]>([
    'Trình thông dịch đã sẵn sàng. Hãy bấm "CHẠY CODE" để thực thi!',
  ]);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunCode = () => {
    soundEffects.playPop();
    setIsRunning(true);
    const logs: string[] = [];

    // Safely capture console.log
    const originalLog = console.log;
    try {
      console.log = (...args: unknown[]) => {
        const line = args
          .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)))
          .join(' ');
        logs.push(line);
      };

      // Execute inside sandboxed Function
      const runner = new Function(code);
      runner();

      if (logs.length === 0) {
        logs.push('(Chương trình chạy thành công nhưng không có lệnh console.log nào được gọi)');
      }
      soundEffects.playCorrect();
    } catch (err: unknown) {
      soundEffects.playWrong();
      logs.push(`❌ Lỗi thực thi: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      console.log = originalLog;
      setIsRunning(false);
      setOutputLogs(logs);
    }
  };

  const handleReset = () => {
    soundEffects.playPop();
    setCode(STARTER_SNIPPETS[0].code);
    setOutputLogs(['Đã làm mới code. Hãy viết code của bạn và bấm chạy!']);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4 pb-28 md:pb-16 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#4b4b4b] flex items-center gap-2">
            <Terminal className="w-8 h-8 text-[#1cb0f6]" />
            Góc Thử Code (Sandbox)
          </h1>
          <p className="text-xs md:text-sm font-bold text-[#777777] mt-1">
            Nơi bạn có thể tự do gõ code, thử nghiệm và xem kết quả chạy tức thì!
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap gap-2">
          {STARTER_SNIPPETS.map((snippet, idx) => (
            <button
              key={idx}
              onClick={() => {
                soundEffects.playPop();
                setCode(snippet.code);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border-2 border-[#e5e5e5] hover:border-[#1cb0f6] text-[#4b4b4b] transition-colors"
            >
              {snippet.name}
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Terminal Container */}
      <div className="space-y-4">
        {/* Code Editor */}
        <div className="bg-[#1e293b] rounded-3xl border-2 border-slate-700 overflow-hidden shadow-lg">
          <div className="bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs font-mono text-slate-300 font-bold ml-2">
                main.js (JavaScript Runner)
              </span>
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục</span>
            </button>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            rows={10}
            className="w-full bg-transparent text-emerald-400 font-mono text-sm p-4 focus:outline-none resize-none leading-relaxed selection:bg-emerald-700 selection:text-white"
          />
        </div>

        {/* Run Button Bar */}
        <div className="flex justify-end">
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center gap-2 py-3 px-8 bg-[#58cc02] hover:bg-[#46a302] text-white font-black text-sm uppercase rounded-2xl border-b-4 border-[#46a302] active:translate-y-1 active:border-b-0 transition-all shadow-md cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>CHẠY CODE</span>
          </button>
        </div>

        {/* Output Console */}
        <div className="bg-[#0f172a] rounded-3xl border-2 border-slate-800 p-5 shadow-inner">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400 mb-3 pb-2 border-b border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Kết quả hiển thị (Terminal Output):</span>
          </div>

          <div className="space-y-1.5 font-mono text-xs md:text-sm">
            {outputLogs.map((line, idx) => (
              <div 
                key={idx}
                className={
                  line.startsWith('❌') 
                    ? 'text-red-400' 
                    : line.startsWith('(') 
                    ? 'text-slate-400 italic' 
                    : 'text-slate-200'
                }
              >
                <span className="text-slate-600 select-none mr-2">&gt;</span>
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
