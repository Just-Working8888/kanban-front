import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const AvatarUpload: React.FC = () => {
    const [loading, setLoading] = useState(false);

    const handleUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('avatar', file);
        setLoading(true);
        try {
            const response = await axios.patch(
                `https://kanban-server-psi.vercel.app/api/v1/user/${localStorage.getItem('userId')}/avatar`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': 'Bearer YOUR_TOKEN', // При необходимости добавьте токен авторизации
                    },
                }
            );
            if (response.status === 200) {
                message.success('Аватарка успешно загружена!');
            } else {
                message.error('Ошибка при загрузке аватарки.');
            }
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            message.error('Ошибка при загрузке аватарки.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Upload
                customRequest={({ file, onSuccess, onError }) => {
                    handleUpload(file as File)
                        .then(() => onSuccess?.({}, file))
                        .catch((err) => onError?.(err));
                }}
                showUploadList={false} // Скрыть список загруженных файлов
            >
                <Button shape='circle' style={{ background: '#635fc7' }} type='primary' icon={<UploadOutlined />} loading={loading}>
                </Button>
            </Upload>
        </div>
    );
};

export default AvatarUpload
