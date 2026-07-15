/*
 * App은 모든 페이지가 공유하는 공통 레이아웃 컴포넌트입니다.
 * 헤더/푸터 등 공통 UI가 생기면 여기에 추가하고,
 * 각 페이지는 Outlet 위치에 렌더링됩니다.
 */

import { Outlet } from "react-router-dom";

function App() {
    return <Outlet />;
}

export default App;
