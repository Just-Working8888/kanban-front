// src/components/LoginForm.tsx
import React, { useState } from 'react';
import { Form, Input, Button, message, Divider } from 'antd';
import api from '../../requests/axios_client'
import { useNavigate } from 'react-router-dom';
const LoginForm: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const onFinish = async (values: { email: string; password: string }) => {
        setLoading(true);
        try {
            const response = await api.post('/auth/login', {
                email: values.email,
                password: values.password,
            });

            const { token, userId } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
            navigate('/')
            message.success('Успешный вход!');
        } catch (error) {
            message.error('Ошибка при авторизации. Попробуйте снова!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-900">
            <div style={{ background: '#20212c' }} className=" p-12 rounded-3xl shadow-2xl w-full max-w-lg">
                <h2 className="text-center text-4xl font-semibold text-white mb-6">Авторизация</h2>
                <Form
                    name="login"
                    onFinish={onFinish}
                    initialValues={{ email: '', password: '' }}
                    layout="vertical"
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, type: 'email', message: 'Пожалуйста, введите корректный email!' }]}
                    >
                        <input
                            className="bg-darkGrey border border-lines text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Введите email"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Пароль"
                        name="password"
                        rules={[{ required: true, message: 'Пожалуйста, введите ваш пароль!' }]}
                    >
                        <input
                            type='password'
                            className="bg-darkGrey border border-lines text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"

                            placeholder="Введите пароль"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg py-3 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Войти
                        </Button>
                        <Divider>или</Divider>
                        <Button
                            block
                            href='/register'
                            type="primary"

                            loading={loading}
                            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg py-3 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            Регистрация
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default LoginForm;
