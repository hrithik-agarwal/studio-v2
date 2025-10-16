import { Spinner } from "@fluentui/react-components";

const SkypointLogoLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 text-gray-50 text-center p-8 bg-gray-900">
      <div className="flex flex-col items-center gap-3">
        <img
          src="/SkyStudio_Icon_Dark.svg"
          alt="Skypoint Studio icon"
          className="max-w-[160px]"
        />
        <img
          src="/Frame 27.svg"
          alt="Skypoint Studio wordmark"
          className="max-w-[220px]"
        />
      </div>

      <Spinner label="Loading..." size="small" labelPosition="below" />

      <div className="flex items-center gap-2 text-sm text-gray-300">
        <span>Powered by</span>
        <img src="/SKPLogo.svg" alt="Skypoint Cloud" className="h-6" />
      </div>
    </div>
  );
};

export default SkypointLogoLoader;
