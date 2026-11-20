
import { Navigate, Outlet } from 'react-router-dom'

export default function AdminRoute() {
    const user = JSON.parse(localStorage.getItem('user') || 'null')

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (user.role?.toUpperCase() !== 'ADMIN') {
        return <Navigate to="/profile" replace />
    }

    return <Outlet />
}
