import React, { useEffect, useState } from 'react';
import { Input, Button, Card, Spin, message, Upload, Avatar, Flex, Badge, Splitter, TabsProps, Tabs } from 'antd';
import axios from 'axios';
import { SolutionOutlined, TableOutlined, UploadOutlined } from '@ant-design/icons';
import { TaskList } from './MyTasksList';
import { Header } from '../Header/Header';
import AvatarUpload from './AvatarUpload';
import { MyBoards } from '../Boards/MyBoards';

export interface UserProfile {
    id: string;
    userName: string;
    Board: any
    email: string;
    password: string;
    role: string;
    avatar: string | null;
    createAt: string;
    updateAt: string;
    tasks: any
}

const Profile: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [editedData, setEditedData] = useState<UserProfile | null>(null);
    const [isEdit, setIsEdit] = useState<boolean>(true);

    // Fetch user data
    useEffect(() => {
        setLoading(true);
        axios
            .get(`http://localhost:3000/api/v1/user/${localStorage.getItem('userId')}`)
            .then((response) => {
                setUserData(response.data);
                setEditedData(response.data); // Initialize the edit state with fetched data
            })
            .catch((error) => {
                message.error('Ошибка загрузки данных пользователя');
            })
            .finally(() => setLoading(false));
    }, [localStorage.getItem('userId')]);

    // Handle changes in the form fields
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (editedData) {
            setEditedData({
                ...editedData,
                [name]: value,
            });
        }
    };

    // Handle save changes
    const handleSave = () => {

        if (editedData) {
            setLoading(true);
            axios
                .patch(`http://localhost:3000/api/v1/user/${localStorage.getItem('userId')}`, editedData)
                .then(() => {
                    message.success('Данные успешно обновлены!');
                    setUserData(editedData); // Update the displayed data
                })
                .catch(() => {
                    message.error('Ошибка при сохранении данных');
                })
                .finally(() => setLoading(false));
        }
    };

    // Handle avatar change (optional)
    const handleAvatarChange = (info: any) => {

    };

    const onChange = (key: string) => {
        console.log(key);
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Мои Задачи',
            children: <div className=''>


                <TaskList tasks={userData?.tasks} />

            </div>,
        },
        {
            key: '2',
            label: 'Мои Доски',
            children: <MyBoards />,
        },
        {
            key: '3',
            label: 'Tab 3',
            children: 'Content of Tab Pane 3',
        },
    ];


    if (loading) {
        return <Spin size="large" className="flex justify-center items-center h-screen" />;
    }

    return (
        <><Header />
            <br /><br /><br />
            <div className="flex">

                <div
                    className="bg-dark-card text-dark-text max-w-sm"
                >
                    <div className="space-y-4 w-[359px] p-10" >
                        <Flex vertical gap={20}>
                            <div className=' relative'>
                                <Avatar style={{ border: '1px solid #3e3f4e' }} src={userData?.avatar} size={250} />
                                <div className=' absolute  bottom-8 right-2'>
                                    <AvatarUpload />
                                </div>
                            </div>
                            {
                                isEdit ? <div>
                                    <h1 className='text-lg  text-white font-semibold'>
                                        {userData?.userName}
                                    </h1>
                                    <p className='text-white'>
                                        {
                                            userData?.email
                                        }
                                    </p>
                                    <br />
                                    <button className="focus:outline-none w-full text-white bg-mainPurple hover:bg-mainPurpleHover focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                        onClick={() => setIsEdit(false)}>Редактировать</button>
                                </div> :
                                    <div>
                                        <div>
                                            <label htmlFor="userName" className="block text-xs mb-1  text-white">Имя пользователя:</label>
                                            <input
                                                name="userName"
                                                id="userName"
                                                className="bg-darkGrey border border-lines text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"

                                                value={editedData?.userName || ''}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <br />
                                        <div>
                                            <label htmlFor="email" className="block text-xs mb-1  text-white " style={{ textWrap: "nowrap" }}>Электронная почта:</label>
                                            <input
                                                name="email"
                                                id="email"
                                                value={editedData?.email || ''}
                                                onChange={handleChange}
                                                className="bg-darkGrey border border-lines text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            />
                                        </div>
                                        <br />
                                        <div className="flex justify-end space-x-4">
                                            <Button
                                                type="default"
                                                className="text-dark-text"
                                                onClick={() => {
                                                    setIsEdit(true)
                                                    setEditedData(userData)
                                                }} // Reset to original user data
                                            >
                                                Отмена
                                            </Button>
                                            <Button
                                                type="primary"
                                                className="bg-blue-600 text-white"
                                                onClick={handleSave}
                                            >
                                                Сохранить изменения
                                            </Button>
                                        </div>
                                    </div>
                            }


                        </Flex>
                        <div className='flex gap-3'>
                            <div className='flex text-[#9198a1] gap-1'>
                                <SolutionOutlined />
                                <span className='text-[#f0f6fc]'>                            {userData?.tasks?.length}
                                </span>
                                мои задачи
                            </div>
                            <div className='flex text-[#9198a1] gap-1'>
                                <TableOutlined />                                <span className='text-[#f0f6fc]'>                            {userData?.Board?.length}
                                </span>
                                Мои доски
                            </div>
                        </div>

                        <div className="flex flex-col space-y-4">
                            <div className="flex items-center space-x-4 bg-darkGrey p-4 rounded-lg shadow-lg dark:bg-gray-700">
                                <span className="text-white font-medium">Роль:</span>
                                <span className="text-sm text-gray-300">{editedData?.role || 'Не задано'}</span>
                            </div>

                            <div className="flex items-center space-x-4 bg-darkGrey p-4 rounded-lg shadow-lg dark:bg-gray-700">
                                <span className="text-white font-medium">Дата создания:</span>
                                <span className="text-sm text-gray-300">
                                    {editedData?.createAt ? new Date(editedData.createAt).toLocaleString() : 'Не задано'}
                                </span>
                            </div>

                            <div className="flex items-center space-x-4 bg-darkGrey p-4 rounded-lg shadow-lg dark:bg-gray-700">
                                <span className="text-white font-medium">Дата обновления:</span>
                                <span className="text-sm text-gray-300">
                                    {editedData?.updateAt ? new Date(editedData.updateAt).toLocaleString() : 'Не задано'}
                                </span>
                            </div>
                        </div>



                    </div>
                </div>
                <div>
                    <br />
                    <Tabs defaultActiveKey="1" items={items} onChange={onChange} />

                </div>
            </div >
        </>
    );
};

export default Profile;
