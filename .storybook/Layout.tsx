import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  return <div className="px-20 py-10">{children}</div>;
};

export default Layout;
