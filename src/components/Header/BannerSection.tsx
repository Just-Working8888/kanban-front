import { Avatar, Flex, message } from 'antd';
import logo from './logo-yellow.svg';
import { useEffect, useState } from 'react';
import { UserProfile } from '../Profile/Profile';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const BannerSection = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const navigate = useNavigate()
  // Fetch user data
  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3000/api/v1/user/${localStorage.getItem('userId')}`)
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        message.error('Ошибка загрузки данных пользователя');
      })
      .finally(() => setLoading(false));
  }, [localStorage.getItem('userId')]);

  return (
    <>
      <div onClick={() => navigate('/profile')} className="hidden md:flex md:w-64 lg:w-80 flex-row pl-6 space-x-2 items-center">
        {/* <img src={logo} className="h-10" /> */}
        <Flex align="center" gap={10}>
          <Avatar src={userData?.avatar} />
          <h3 className="text-white">{userData?.userName}</h3>
        </Flex>
      </div>
    </>
  );
};
