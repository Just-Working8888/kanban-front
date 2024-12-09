import { BannerSection } from "./BannerSection";
import { BoardNameSection } from "./BoardNameSection";

export const Header = () => {
  return (
    <>
      <div className=" fixed z-50 flex flex-row items-center w-full h-16 md:h-20 lg:h-24 bg-darkGrey md:divide-x">
        <BannerSection />
        <BoardNameSection />
      </div>
    </>
  );
};
