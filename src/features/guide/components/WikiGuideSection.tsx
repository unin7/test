import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { List, AlignLeft } from 'lucide-react';
import { useJsonData } from '../../../hooks/useJsonData';
import { RecursiveGuideCard, GuideItem } from './RecursiveGuideCard';

interface GuideGroup {
  id: string;
  title: string;
  items: GuideItem[];
}

export function WikiGuideSection() {
  const { slug } = useParams();
  const { data: allGuides, loading } = useJsonData<GuideGroup[]>('guides');
  const [targetGuide, setTargetGuide] = useState<GuideGroup | null>(null);
  
  // ✅ [추가] 현재 보고 있는 섹션 번호를 저장할 state
  const [activeSection, setActiveSection] = useState<number>(0);
  
  // 관찰할 요소들을 담을 refs
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (allGuides && slug) {
      const found = allGuides.find(g => g.id === slug);
      setTargetGuide(found || null);
    }
  }, [allGuides, slug]);

  // ✅ [추가] 스크롤 위치 감지 로직 (Scroll Spy)
  useEffect(() => {
    if (!targetGuide) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // id="section-0", "section-1" 형태에서 숫자만 추출
            const index = Number(entry.target.id.replace('section-', ''));
            setActiveSection(index);
          }
        });
      },
      {
        root: null, // 뷰포트 기준
        rootMargin: '-10% 0px -80% 0px', // 상단 10% 지점을 지나면 활성화
        threshold: 0.1
      }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [targetGuide]);

  const scrollToSection = (index: number) => {
    const element = document.getElementById(`section-${index}`);
    if (element) {
      // 헤더 높이 등을 고려해 조금 위쪽에 멈추도록 설정
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(index); // 클릭 시 즉시 활성화
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">가이드 로딩 중...</div>;
  if (!targetGuide) return <div className="text-center text-gray-400 py-10">내용을 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8 pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8 items-start">
        
        {/* 1. 왼쪽: 메인 콘텐츠 */}
        <div className="min-w-0 space-y-4 order-1">
          <div className="flex items-center gap-3 mb-6 border-b border-purple-100 pb-4">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
               <AlignLeft className="w-6 h-6"/>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{targetGuide.title}</h2>
          </div>
          
          {targetGuide.items.map((item, idx) => (
            <div 
              key={idx} 
              id={`section-${idx}`} 
              ref={el => sectionRefs.current[idx] = el} // ref 연결
              className="scroll-mt-6" // 스크롤 시 상단 여백 확보
            >
              {/* 카드를 감싸서 스크롤 타겟으로 삼음 */}
              <RecursiveGuideCard item={item} depth={0} />
            </div>
          ))}
        </div>

        {/* 2. 오른쪽: 목차 영역 (Sticky 적용) */}
        {/* ✅ sticky top-6: 스크롤 컨테이너 최상단에서 24px(top-6) 떨어진 곳에 착 붙습니다.
           self-start: 높이가 늘어나지 않게 하여 sticky가 잘 작동하도록 함
        */}
        <aside className="order-2 w-full lg:w-auto sticky top-6 self-start z-10 transition-all duration-300 ease-out">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-purple-100/60">
            <h3 className="text-gray-800 font-bold mb-4 flex items-center gap-2 border-b border-gray-100 pb-3 text-sm uppercase tracking-wide">
               <List className="w-4 h-4 text-purple-500"/> 
               <span>목차</span>
            </h3>
            <div className="space-y-1 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
              {targetGuide.items.map((item, idx) => {
                // 현재 섹션인지 확인
                const isActive = activeSection === idx;
                
                return (
                  <button
                    key={idx}
                    onClick={() => scrollToSection(idx)}
                    className={`
                      group flex items-center w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-purple-50 text-purple-700 font-bold shadow-sm ring-1 ring-purple-100' // 활성 상태 디자인
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900' // 비활성 상태 디자인
                      }
                    `}
                  >
                    {/* 활성 상태일 때 점 색상 변경 */}
                    <span className={`
                      w-1.5 h-1.5 rounded-full mr-3 transition-colors duration-300
                      ${isActive ? 'bg-purple-500 scale-125' : 'bg-gray-300 group-hover:bg-purple-300'}
                    `}></span>
                    
                    <span className="text-sm truncate">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
