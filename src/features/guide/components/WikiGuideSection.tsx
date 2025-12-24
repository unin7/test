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
  const [activeSection, setActiveSection] = useState<number>(0);
  
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (allGuides && slug) {
      const found = allGuides.find(g => g.id === slug);
      setTargetGuide(found || null);
    }
  }, [allGuides, slug]);

  // ✅ [수정] 스크롤 감지 (IntersectionObserver)
  useEffect(() => {
    if (!targetGuide) return;

    // 가이드 페이지의 스크롤 컨테이너를 루트로 설정
    const scrollContainer = document.getElementById('guide-scroll-container');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.id.replace('section-', ''));
            setActiveSection(index);
          }
        });
      },
      {
        root: scrollContainer, // ✅ null(뷰포트) 대신 스크롤 컨테이너 지정
        rootMargin: '-10% 0px -80% 0px', // 상단 10% 지점에서 감지
        threshold: 0
      }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [targetGuide]);

  // ✅ [수정] 클릭 시 해당 섹션으로 부드럽게 이동
  const scrollToSection = (index: number) => {
    const container = document.getElementById('guide-scroll-container');
    const element = document.getElementById(`section-${index}`);
    
    if (container && element) {
      // 컨테이너 내부에서의 상대 위치 계산
      const headerOffset = 24; // 상단 여백
      const elementPosition = element.offsetTop;
      
      container.scrollTo({
        top: elementPosition - headerOffset,
        behavior: "smooth"
      });
      
      setActiveSection(index);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">가이드 로딩 중...</div>;
  if (!targetGuide) return <div className="text-center text-gray-400 py-10">내용을 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8 pb-32 relative">
      {/* ✅ items-start: 이게 있어야 sticky가 작동함 (grid 높이만큼 늘어나지 않게 함)
      */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8 items-start">
        
        {/* 왼쪽: 메인 콘텐츠 */}
        <div className="min-w-0 space-y-4">
          <div className="flex items-center gap-3 mb-6 border-b border-indigo-100 pb-4">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
               <AlignLeft className="w-6 h-6"/>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{targetGuide.title}</h2>
          </div>
          
          {targetGuide.items && targetGuide.items.length > 0 ? (
            targetGuide.items.map((item, idx) => (
              <div 
                key={idx} 
                id={`section-${idx}`} 
                ref={el => sectionRefs.current[idx] = el}
                className="scroll-mt-4" // CSS scroll-margin으로도 보정
              >
                <RecursiveGuideCard item={item} depth={0} />
              </div>
            ))
          ) : (
            <div className="text-gray-400">가이드 항목이 없습니다.</div>
          )}
        </div>

        {/* 오른쪽: 목차 영역 (Sticky) */}
        {/* ✅ sticky top-8: 스크롤 컨테이너(GuidePage의 div) 기준 상단 8(32px) 위치에 고정됨
           self-start: 그리드 아이템이 늘어나지 않고 자기 크기만 유지해야 sticky가 먹힘
        */}
        <aside className="sticky top-8 self-start w-full lg:w-auto hidden lg:block">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-indigo-50/50 max-h-[calc(100vh-120px)] flex flex-col">
            <h3 className="text-gray-800 font-bold mb-3 flex items-center gap-2 pb-2 border-b border-gray-100 text-sm uppercase tracking-wide">
               <List className="w-4 h-4 text-indigo-500 flex-shrink-0"/> 
               <span>목차</span>
            </h3>
            
            {!targetGuide.items || targetGuide.items.length === 0 ? (
              <p className="text-sm text-gray-400 py-2">목차 없음</p>
            ) : (
              <div className="space-y-1 overflow-y-auto pr-1 custom-scrollbar max-h-[60vh]">
                {targetGuide.items.map((item, idx) => {
                  const isActive = activeSection === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => scrollToSection(idx)}
                      className={`
                        group flex items-center w-full text-left px-3 py-2 rounded-lg transition-all duration-200
                        text-sm
                        ${isActive 
                          ? 'bg-indigo-50 text-indigo-700 font-bold' 
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <span className={`
                        w-1.5 h-1.5 rounded-full mr-2.5 transition-all duration-300 flex-shrink-0
                        ${isActive ? 'bg-indigo-500 scale-110' : 'bg-gray-300 group-hover:bg-indigo-300'}
                      `}></span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

      </div>
    </div>
  );
}
