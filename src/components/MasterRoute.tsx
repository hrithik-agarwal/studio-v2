import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ROUTES } from "@/libs/constants";
import { auth, validateInstance, checkResourceExistence } from "@/clients";
import type { IValidateInstancePayload } from "@/clients";
import { getDefaultInstanceOfUser } from "@/clients/apiClient";

// Placeholder for Home component - to be created
const Home = () => (
  <div style={{ padding: "2rem" }}>
    <h1>Welcome to SkyStudio</h1>
    <p>Home Page - Dashboard coming soon</p>
  </div>
);

interface InstanceState {
  instanceId: string;
  hasAccess: boolean;
  showCreateTenant: boolean;
  checkResourceFailed: boolean;
  isCheckResourceFailed : boolean
}

const MasterRoute = () => {
  const [instanceState, setInstanceState] = useState<InstanceState>({
    instanceId: "",
    hasAccess: true,
    showCreateTenant: false,
    checkResourceFailed: false,
    isCheckResourceFailed: false
  });

  const hasAccessToInstance = (instanceId: string) => {
    const user = auth.currentUser();
    const payload: IValidateInstancePayload = {
      objectId: user?.id,
      instanceId: instanceId,
    };

    validateInstance(payload).then(
      (data) => {
        if (data.hasAccess && data.isValidInstace) {
          checkIfResourceExist(instanceId);
        } else {
          setInstanceState((prev) => ({ ...prev, hasAccess: false }));
        }
      },
      (error: Error) => {
        console.error("Error validating instance:", error);
        setInstanceState((prev) => ({ ...prev, hasAccess: false }));
      }
    );
  };
  function checkIfResourceExist(instanceId?: string) {
    checkResourceExistence().then(
      (data) => {
        if (data.isSuccessful) {
          if (!instanceId) {
            getDefaultInstance();
          } else {
            redirectToPage();
          }
        } else {
          setInstanceState((prev) => ({
            ...prev,
            showCreateTenant: true,
            checkResourceFailed: false,
          }));
        }
      },
      (error) => {
        setInstanceState((prev) => ({ ...prev, checkResourceFailed: true }));
        console.log(error);
        getUserAccess();
      }
    );
  }
  function getDefaultInstance() {
    const user = auth.currentUser();
    const userExistsRequest = { objectId: user?.id };

    getDefaultInstanceOfUser(userExistsRequest).then(
      (data) => {
        if (data.isSuccessful) {
          setInstanceState((prev) => ({
            ...prev,
            instanceId: data.instance.id,
          }));
          const url = window.location.href;
          const arr = url.split("/");
          if (window.location.pathname != ROUTES.CALLBACK) {
            const newUrl =
              arr[0] +
              "//" +
              arr[2] +
              window.location.pathname +
              "?instanceid=" +
              data.instance.id;
            setInstanceState((prev) => ({
              ...prev,
              instanceId: data.instance.id,
            }));
            setTimeout(function () {
              window.location.href = newUrl;
            }, 2000);
          } else {
            redirectToPage();
          }
        } else {
          console.log("error in getDefaultInstance" + data.message);
        }
      },
      (error) => {
        console.log("error in getDefaultInstance");
        console.log(error);
      }
    );
  }
  function redirectToPage() {
    if (instanceState.isCheckResourceFailed) {
      getUserAccess();
      getSessionDefault();
    } else {
      setInstanceState((prev) => ({ ...prev, isCheckResourceFailed: true }));
      setTimeout(() => {
        getUserAccess();
        getSessionDefault();
      }, 5000);
    }
  }
  useEffect(() => {
    if (window.location && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const instanceId = params.get("instanceid") || "";

      setInstanceState((prev) => ({ ...prev, instanceId }));

      hasAccessToInstance(instanceId);

      // connectToPubSubService(instanceId);

      // handleNewDashboard(instanceId);
    } else {
      // checkIfResourceExist();
    }

    // loadMSAppInsights();
  }, []);
  return (
    <Routes>
      {/* Main home/dashboard route */}
      <Route path={ROUTES.HOME} element={<Home />} />

      {/* Catch-all route - redirect unknown paths to home */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
};

export default MasterRoute;
