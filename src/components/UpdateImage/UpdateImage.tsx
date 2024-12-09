import React, { FC, useState } from 'react';
import axios from 'axios';
import { Button, Upload, message, Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { updateTaskImage } from '../../requests/subtask';
import { useQueryClient } from 'react-query';

const UpdateImage: FC<{ taskId: string }> = ({ taskId }) => {
    const [file, setFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null); // Для хранения URL превью
    const { mutate } = updateTaskImage();
    const queryClient = useQueryClient();
    const handleOnChange = () => {
        if (!file) {
            message.error('Пожалуйста, выберите файл');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);
        const data = {
            taskId: taskId,
            data: formData
        };

        mutate(data, {
            onError: () => {
                message.error("Something went wrong");
            },
            onSettled: () => {
                queryClient.invalidateQueries("allColumnData");
                queryClient.invalidateQueries("getTaskById");
            },
        });
    };
    // Обработчик выбора файла
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            // Создаем превью изображения
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string); // Сохраняем URL изображения
            };
            reader.readAsDataURL(selectedFile); // Чтение файла как URL

            setFile(selectedFile); // Сохраняем выбранный файл
        }
    };

    // Обработчик отправки формы
    const handleSubmit = async () => {
        if (!file) {
            message.error('Пожалуйста, выберите файл');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.patch(
                `https://kanban-tau-gilt.vercel.app//api/v1/task/${taskId}/updateImage`, // Замените {taskId} на актуальный id
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': 'Bearer YOUR_TOKEN', // Если используется авторизация
                    },
                }
            );
            message.success('Изображение обновлено!');
            console.log(response.data);
        } catch (error) {
            message.error('Ошибка при обновлении изображения');
            console.error(error);
        }
    };

    return (
        <div>
            {/* Поле для загрузки файла */}
            <input type="file" onChange={handleFileChange} />

            {/* Превью картинки */}
            {imagePreview && (
                <div style={{ marginTop: 16 }}>
                    <Image width={200} src={imagePreview} />
                </div>
            )}

            {/* Кнопка отправки */}
            <Button
                type="primary"
                onClick={handleOnChange}
                icon={<UploadOutlined />}
                style={{ marginTop: 16 }}
            >
                Обновить изображение
            </Button>
        </div>
    );
};

export default UpdateImage;
