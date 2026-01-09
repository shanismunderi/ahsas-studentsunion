import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "next-themes";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import DashboardProfile from "./pages/DashboardProfile";
import DashboardAchievements from "./pages/DashboardAchievements";
import DashboardDocuments from "./pages/DashboardDocuments";
import DashboardSettings from "./pages/DashboardSettings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMembers from "./pages/admin/AdminMembers";
import AdminAchievements from "./pages/admin/AdminAchievements";
import AdminDocuments from "./pages/admin/AdminDocuments";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminPosts from "./pages/admin/AdminPosts";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminSettings from "./pages/admin/AdminSettings";
import MemberProfile from "./pages/MemberProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Main Route - Login + Leaderboard */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/member/:memberId" element={<MemberProfile />} />

              {/* Member Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard/profile" element={<ProtectedRoute><DashboardProfile /></ProtectedRoute>} />
              <Route path="/dashboard/achievements" element={<ProtectedRoute><DashboardAchievements /></ProtectedRoute>} />
              <Route path="/dashboard/documents" element={<ProtectedRoute><DashboardDocuments /></ProtectedRoute>} />
              <Route path="/dashboard/settings" element={<ProtectedRoute><DashboardSettings /></ProtectedRoute>} />

              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/members" element={<ProtectedRoute requireAdmin><AdminMembers /></ProtectedRoute>} />
              <Route path="/admin/achievements" element={<ProtectedRoute requireAdmin><AdminAchievements /></ProtectedRoute>} />
              <Route path="/admin/documents" element={<ProtectedRoute requireAdmin><AdminDocuments /></ProtectedRoute>} />
              <Route path="/admin/announcements" element={<ProtectedRoute requireAdmin><AdminAnnouncements /></ProtectedRoute>} />
              <Route path="/admin/posts" element={<ProtectedRoute requireAdmin><AdminPosts /></ProtectedRoute>} />
              <Route path="/admin/gallery" element={<ProtectedRoute requireAdmin><AdminGallery /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute requireAdmin><AdminSettings /></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
