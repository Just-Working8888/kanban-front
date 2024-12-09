import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Select, Spin, message } from 'antd';
import { assignUsersToTask } from '../../helpers/AddUserToTask';

const { Option } = Select;

interface User {
    id: string;
    userName: string;
    email: string;
    role: string;
    avatar: string | null;
    createAt: string;
    updateAt: string;
}

const UserSelect: React.FC<{ taskId: string }> = ({ taskId }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await axios.get('https://kanban-server-psi.vercel.app/api/v1/user'); // Замените на URL вашего API
                setUsers(response.data);
            } catch (err) {
                setError('Ошибка при загрузке пользователей');
                message.error('Не удалось загрузить пользователей');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Выберите пользователя</h2>
            <Select
                dropdownStyle={{ backgroundColor: '#2b2c37' }}
                style={{ width: "100%" }}
                placeholder="Выберите пользователя"
                loading={loading}
                mode="multiple"
                // 
                onChange={(e) => assignUsersToTask(taskId, e)
                }
                allowClear
            >
                {loading ? (
                    <Spin size="small" />
                ) : (
                    users.map((user) => (
                        <Option key={user.id} value={user.id}>
                            {user.userName} ({user.email})
                        </Option>
                    ))
                )}
            </Select>
        </div >
    );
};

export default UserSelect;
