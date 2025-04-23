import React, { ReactNode } from "react";
import AppLoader from "./Loader";

type AppSuspenseProps = {
  children: ReactNode;
  loadingProps?: {
    delay: number;
  };
};

const Suspense: React.FC<AppSuspenseProps> = ({ children }) => {
  return <React.Suspense fallback={<AppLoader />}>{children}</React.Suspense>;
};

export default Suspense;
