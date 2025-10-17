import { Spinner } from "@fluentui/react-components";
import skyStudioIcon from "../assets/skyStudio-icon-dark.svg";
import skyStudioText from "../assets/skyStudio-text-black.svg";
import skyPointLogo from "../assets/skyPoint-logo-black.svg";

const FullPageLoader = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between px-8 py-12 text-center text-gray-200">
      <div className="flex flex-col items-center gap-3">
        <img
          src={skyStudioIcon}
          alt="Skypoint Studio icon"
          className="max-w-[160px]"
        />
        <img
          src={skyStudioText}
          alt="Skypoint Studio wordmark"
          className="max-w-[220px]"
        />
      </div>

      <Spinner label="Loading..." size="large" labelPosition="below" />

      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span>Powered by</span>
        <img src={skyPointLogo} alt="Skypoint Cloud" className="h-6" />
      </div>
    </div>
  );
};

export default FullPageLoader;
