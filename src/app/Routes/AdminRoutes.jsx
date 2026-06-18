import Loading from "@/components/SharedComponent/Loading";
import useRole from "@/hooks/useRole";
import { Navigate } from "react-router";

const AdminRoute = ({ children }) => {
  const [role, isLoading] = useRole();

  if (isLoading) return <Loading />;
  if (role !== "admin") return <Navigate to="/dashboard" />;

  return children;
};

export default AdminRoute;
