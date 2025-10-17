import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { errorHandler } from "./shared/errorhandler";
import FullPageLoader from "./FullPageLoader";
import { ROUTES } from "@/libs";
import { auth } from "@/clients";
import { NoAccessCard } from "./index";

const Callback: React.FC = () => {
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser();
    const userExistsRequest = { objectId: user.id };

    fetch(import.meta.env.VITE_API_BASE_URL + "/api/user/login-studio", {
      method: "POST",
      headers: auth.getAuthorizationHeader(),
      body: JSON.stringify(userExistsRequest),
    })
      //   .then(errorHandler)
      .then((response) => response.json())
      .then(
        (data) => {
          if (data.isSuccess) {
            navigate(`${ROUTES.HOME}?instanceid=${data.instanceId}`, {
              replace: true,
            });
          } else {
            setIsError(true);
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }, [navigate]);

  return isError ? <NoAccessCard /> : <FullPageLoader />;
};

export default Callback;
