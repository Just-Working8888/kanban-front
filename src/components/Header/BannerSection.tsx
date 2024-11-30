import { Avatar, Flex } from 'antd';
import logo from './logo-yellow.svg';

export const BannerSection = () => {
  return (
    <>
      <div className="hidden md:flex md:w-64 lg:w-80 flex-row pl-6 space-x-2 items-center">
        {/* <img src={logo} className="h-10" /> */}
        <Flex  align="center" gap={10}>
          <Avatar />
          <h3 className="text-white">Бекболот</h3>
        </Flex>
      </div>
    </>
  );
};
