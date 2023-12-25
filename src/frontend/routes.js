import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/home'

function AppRoutes() {
    return (
        <div>
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="*" element={<Home />} />
            </Routes>
        </div>
    )
}

export default AppRoutes
