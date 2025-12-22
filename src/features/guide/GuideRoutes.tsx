import { Routes, Route, Navigate } from "react-router-dom";
import { GuidePage } from "./GuidePage";
import { WikiGuideSection } from "./components/WikiGuideSection";

export function GuideRoutes() {
  return (
    <Routes>
      <Route element={<GuidePage />}>
        {/* 1. /guide 접속 시 첫 번째 메뉴('auth')로 자동 이동 */}
        {/* 데이터의 첫 번째 id가 'auth'라고 가정했습니다. 필요시 변경하세요. */}
        <Route index element={<Navigate to="basic" replace />} />

        {/* 2. 동적 라우팅: URL 뒤에 오는 단어를 'slug'라는 변수로 받습니다. */}
        {/* 예: /guide/auth, /guide/stream, /guide/goods ... */}
        <Route path=":slug" element={<WikiGuideSection />} />
      </Route>
    </Routes>
  );
}
