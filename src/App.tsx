import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { MarketingLayout } from './components/MarketingLayout'
import { AppLayout } from './components/AppLayout'
import { RequireAuth } from './components/RequireAuth'
import Landing from './pages/Landing'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Activities = lazy(() => import('./pages/Activities'))
const Calculator = lazy(() => import('./pages/Calculator'))
const Community = lazy(() => import('./pages/Community'))
const Library = lazy(() => import('./pages/Library'))
const Article = lazy(() => import('./pages/Article'))
const Profile = lazy(() => import('./pages/Profile'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageFallback() {
  return (
    <div className="loading-screen">
      <span className="spinner" />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* public marketing */}
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<Landing />} />
        </Route>

        {/* authenticated app */}
        <Route
          path="/app"
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="activities" element={<Activities />} />
          <Route path="calculator" element={<Calculator />} />
          <Route path="community" element={<Community />} />
          <Route path="library" element={<Library />} />
          <Route path="library/:id" element={<Article />} />
          <Route path="profile" element={<Profile />} />

          {/* redirects from old consolidated routes */}
          <Route path="analytics" element={<Navigate to="/app" replace />} />
          <Route path="challenges" element={<Navigate to="/app/community" replace />} />
          <Route path="leaderboard" element={<Navigate to="/app/community" replace />} />
          <Route path="settings" element={<Navigate to="/app/profile" replace />} />
        </Route>

        {/* old public calculator path → in-app */}
        <Route path="/calculator" element={<Navigate to="/app/calculator" replace />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
