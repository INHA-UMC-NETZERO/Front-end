import { BrowserRouter, Route, Routes } from "react-router-dom"
import PublicLayout from "./layouts/PublicLayout"
import HomePage from "./pages/HomePage"
import MyPage from "./pages/MyPage"
import DetailPage from "./pages/DetailPage"

function App() {
  return (
    <BrowserRouter>
      <Routes> 
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
