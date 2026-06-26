import { BrowserRouter, Route, Routes } from "react-router-dom"
import PublicLayout from "./layouts/PublicLayout"
import HomePage from "./pages/HomePage"

function App() {
  return (
    <BrowserRouter>
      <Routes> 
        <Route path="/" element={<PublicLayout />}> 
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
