
import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { TrackingPreferences } from "@/components/TrackingPreferences";

const Preferences = () => {
  const { session } = useAuth();

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container max-w-2xl py-8 pl-16">
      <h1 className="text-2xl font-bold mb-6">Tracking Preferences</h1>
      <TrackingPreferences />
    </div>
  );
};

export default Preferences;
