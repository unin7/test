import { MessageCircle } from 'lucide-react';
import { useJsonData } from '../../../hooks/useJsonData';

interface FeedItem {
  type: "TEXT" | "IMAGE";
  name: string;
  profileImg: string;
  content: string;
  time: string;
}

export function RecentTweets() {
  const { data: feeds, loading } = useJsonData<FeedItem[]>('1');

  // 로딩 중이거나 데이터가 없으면 화면에 표시하지 않음 (요청사항 반영)
  if (loading || !feeds || feeds.length === 0) return null;

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-purple-100/50">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-4 h-4 text-purple-500" />
        <h4 className="text-gray-800 font-bold">Recent Updates</h4>
      </div>

      <div className="space-y-4">
        {feeds.map((feed, idx) => (
          <div key={idx} className="flex gap-3 items-start">
            {/* 프로필 이미지 */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center flex-shrink-0 p-[2px]">
              <img src={feed.profileImg} alt={feed.name} className="w-full h-full rounded-full object-cover bg-white" />
            </div>

            {/* 내용 영역 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xs font-bold text-gray-800">{feed.name}</span>
                <span className="text-[10px] text-gray-400">{feed.time ? new Date(feed.time).toLocaleDateString() : ''}</span>
              </div>
              
              <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-purple-100/50 inline-block max-w-full">
                 {feed.type === 'IMAGE' ? (
                    <div className="rounded-lg overflow-hidden mt-1">
                        {/* ✅ 이미지 높이 고정 (h-48 = 192px) */}
                        {/* object-cover: 이미지가 찌그러지지 않고 영역을 꽉 채움 */}
                        <img 
                          src={feed.content} 
                          alt="Content" 
                          className="max-w-full w-full h-48 object-cover" 
                        />
                    </div>
                 ) : (
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{feed.content}</p>
                 )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-purple-700 rounded-lg transition-all text-sm font-medium">
        View All Updates
      </button>
    </div>
  );
}
