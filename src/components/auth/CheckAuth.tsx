import axios from 'axios';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const CheckAuth = () => {
    const navigate = useNavigate(); // Для навигации в React Router

    useEffect(() => {
        const isAuth = async () => {
            try {
                const res = await axios.get('https://kanban-tau-gilt.vercel.app//api/v1/board/isauth', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (res.data.isAuth) {
                    console.log('Пользователь авторизован');
                } else {
                    console.log('Не авторизован');
                    navigate('/login'); // Перенаправление на страницу login
                }
            } catch (error) {
                console.error('Ошибка при проверке авторизации', error);
                navigate('/login'); // В случае ошибки тоже перенаправляем на /login
            }
        };

        isAuth();
    }, [navigate]);
    return (
        <div>

        </div>
    )
}

export default CheckAuth
