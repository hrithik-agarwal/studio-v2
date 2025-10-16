import { Spinner } from "@fluentui/react-components";

const SkypointLogoLoader = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between px-8 py-12 text-center text-gray-200">
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

      <Spinner label="Loading..." size="large" labelPosition="below" />

      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span>Powered by</span>
        <img src="/SKPLogo.svg" alt="Skypoint Cloud" className="h-6" />
      </div>
    </div>
  );
};

export default SkypointLogoLoader;
