import logo from './logo-yellow.svg'
export const BannerSection = () => {
  return (
    <>
      <div className="md:w-64 lg:w-80 flex flex-row pl-6 space-x-2 items-center">
        <img src={logo} className='h-10 ' />
      </div>
    </>

  );
};