'use client';
import { ReactNode, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { ClimbingBoxLoader } from 'react-spinners';
const UNAUTHENTICATED_ROUTES = ['/login', '/signup'];

const ProtectedLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, loadingApp } = useAuth();
  const pathname = usePathname();

  if (loadingApp)
    return (
      <div className="tw-h-[100vh] tw-flex tw-flex-col tw-justify-center tw-items-center">
        <ClimbingBoxLoader color="#36d7b7" size="50px" />
        <h1 className="tw-my-10 tw-mx-10">Loading...!</h1>
      </div>
    );
  if (!loadingApp && !user && !UNAUTHENTICATED_ROUTES.includes(pathname))
    return <></>;
  return <>{children}</>;
};

export default ProtectedLayout;
