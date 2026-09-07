import { AppLayout } from "@/components/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthBootstrap } from "@/features/auth/useAuthBootstrap";

export function App() {
  useAuthBootstrap();
  return (
    <ProtectedRoute>
      <AppLayout />
    </ProtectedRoute>
  );
}
