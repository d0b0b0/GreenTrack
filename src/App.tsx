import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { MarketingLayout } from './components/MarketingLayout'
import { AppLayout } from './components/AppLayout'
import { RequireAuth } from './components/RequireAuth'
import Landing from './pages/Landing'

const Calculator = lazy(() => import('./pages/Calculator'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Activities = lazy(() => import('./pages/Activities'))
const Analytics = lazy(() => import('./pages/Analytics'))
const Challenges = lazy(() => import('./pages/Challenges'))
const Leaderboard = lazy(() => import('./pages/Leaderboard'))
const Library = lazy(() => import('./pages/Library'))
const Article = lazy(() => import('./pages/Article'))
const Profile = lazy(() => import('./pages/Profile'))
const Settings = lazy(() => import('./pages/Settings'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageFallback() {
  return (
    <div className="loading-screen">
      <span className="spinner" />
      Завантаження…
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
          <Route path="/calculator" element={<Calculator />} />
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
          <Route path="analytics" element={<Analytics />} />
          <Route path="challenges" element={<Challenges />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="library" element={<Library />} />
          <Route path="library/:id" element={<Article />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
