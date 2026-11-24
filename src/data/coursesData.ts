import { Course } from '../types';
import { generateCurriculum } from './curriculumGenerator';

const pythonSections = generateCurriculum();

export const COURSES: Course[] = [
  {
    id: 'python',
    name: 'Python',
    tagline: 'Ngôn ngữ lập trình số 1 cho AI & Data',
    icon: '🐍',
    totalXp: 1250,
    sections: pythonSections,
    units: pythonSections[0].doors,
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    tagline: 'Linh hồn của Web hiện đại & Frontend',
    icon: '⚡',
    totalXp: 980,
    sections: pythonSections,
    units: pythonSections[0].doors,
  },
  {
    id: 'java',
    name: 'Java',
    tagline: 'Vua của hướng đối tượng & ứng dụng Enterprise',
    icon: '☕',
    totalXp: 950,
    sections: pythonSections,
    units: pythonSections[0].doors,
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    tagline: 'JavaScript với sức mạnh của Type Safety',
    icon: '🔷',
    totalXp: 920,
    sections: pythonSections,
    units: pythonSections[0].doors,
  },
  {
    id: 'cpp',
    name: 'C++',
    tagline: 'Hiệu năng đỉnh cao & lập trình thi đấu thuật toán',
    icon: '🇨',
    totalXp: 1100,
    sections: pythonSections,
    units: pythonSections[0].doors,
  },
  {
    id: 'rust',
    name: 'Rust',
    tagline: 'Ngôn ngữ được yêu thích nhất thế giới',
    icon: '🦀',
    totalXp: 990,
    sections: pythonSections,
    units: pythonSections[0].doors,
  },
  {
    id: 'html_css',
    name: 'HTML & CSS',
    tagline: 'Xây dựng giao diện web đỉnh cao',
    icon: '🌐',
    totalXp: 850,
    sections: pythonSections,
    units: pythonSections[0].doors,
  },
  {
    id: 'sql',
    name: 'SQL & Database',
    tagline: 'Truy vấn & xử lý cơ sở dữ liệu lớn',
    icon: '🐘',
    totalXp: 800,
    sections: pythonSections,
    units: pythonSections[0].doors,
  },
];
