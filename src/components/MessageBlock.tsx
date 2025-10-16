import { type ReactNode } from "react";

const MessageBlock = ({ children }: { children: ReactNode }) => {
  return (
    <div className="center-div">
      <div className="text-center">{children}</div>
    </div>
  );
};

export default MessageBlock;
