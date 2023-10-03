import ConfigProvider from 'antd/es/config-provider';
import { ReactNode } from 'react';

interface IMainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: IMainLayoutProps) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: '#fafafa',
            headerColor: 'rgba(241, 157, 2,0.9)',
            rowHoverBg: 'rgba(148, 224, 143, 0.2)',
          },
          DatePicker: {
            cellHoverBg: 'rgba(137, 219, 223, 0.5)',
          },
        },
      }}>
      <div>
        <div className="vh-100">{children}</div>
      </div>
    </ConfigProvider>
  );
};

export default MainLayout;
