import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './frontend/routes'
import AppFooter from './frontend/components/footer/index'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
    return (
        <Router basename={process.env.PUBLIC_URL}>
            <AppRoutes />
            <AppFooter />
        </Router>
    )
}

export default App
