import { BrowserRouter, Route, Routes } from "react-router-dom"
import PublicLayout from "./layouts/PublicLayout"
import HomePage from "./pages/HomePage"
import MyPage from "./pages/MyPage"
import DetailPage from "./pages/DetailPage"
import LoginPage from "./pages/LoginPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/user" element={<MyPage />} />
          <Route path="/detail/:id" element={<DetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
