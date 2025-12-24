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

  useEffect(() => {
    if (!targetGuide) return;

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
        root: null,
        rootMargin: '-15% 0px -80% 0px',
        threshold: 0
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
      // 상단 헤더 높이(약 60px) + 여유분(20px) 만큼 보정하여 스크롤
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      
      setActiveSection(index);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">가이드 로딩 중...</div>;
  if (!targetGuide) return <div className="text-center text-gray-400 py-10">내용을 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8 pb-32 relative">
      {/* [수정 포인트 1] items-start: Sticky 동작을 위해 필수
        화면이 작을 때도 레이아웃이 깨지지 않도록 grid 설정을 유지하되,
        작은 화면에서는 목차가 아래로 내려가도록 설정했습니다.
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
                className="scroll-mt-28" 
              >
                <RecursiveGuideCard item={item} depth={0} />
              </div>
            ))
          ) : (
            <div className="text-gray-400">가이드 항목이 없습니다.</div>
          )}
        </div>

        {/* 오른쪽: 목차 영역 (Sticky) */}
        {/* [수정 포인트 2] hidden lg:block 제거 -> 항상 보이게 변경
          [수정 포인트 3] order-first lg:order-last -> 모바일에서는 목차가 위에 오도록 설정 (선택사항)
          현재는 기본 순서(콘텐츠 아래)로 두었으니, 모바일에서는 본문 다 읽고 맨 아래에 목차가 나옵니다.
        */}
        <aside className="sticky top-4 self-start z-10 transition-all duration-300 w-full lg:w-auto">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-indigo-100/60 max-h-[calc(100vh-120px)] flex flex-col">
            <h3 className="text-gray-800 font-bold mb-4 flex items-center gap-2 border-b border-gray-100 pb-3 text-sm uppercase tracking-wide">
               <List className="w-4 h-4 text-indigo-500 flex-shrink-0"/> 
               <span>목차 ({targetGuide.items ? targetGuide.items.length : 0})</span>
            </h3>
            
            {/* 데이터가 없을 경우 안내 메시지 */}
            {!targetGuide.items || targetGuide.items.length === 0 ? (
              <p className="text-sm text-gray-400 py-2">목차 없음</p>
            ) : (
              <div className="space-y-1 overflow-y-auto pr-1 custom-scrollbar">
                {targetGuide.items.map((item, idx) => {
                  const isActive = activeSection === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => scrollToSection(idx)}
                      className={`
                        group flex items-center w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200
                        ${isActive 
                          ? 'bg-indigo-50 text-indigo-700 font-bold shadow-sm ring-1 ring-indigo-100' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <span className={`
                        w-1.5 h-1.5 rounded-full mr-3 transition-colors duration-300 flex-shrink-0
                        ${isActive ? 'bg-indigo-500 scale-125' : 'bg-gray-300 group-hover:bg-indigo-300'}
                      `}></span>
                      <span className="text-sm truncate">{item.label}</span>
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
