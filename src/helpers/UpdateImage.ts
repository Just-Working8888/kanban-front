import axios from 'axios';
import { message } from 'antd';
import { useQueryClient } from 'react-query';

/**
 * Функция для обновления изображения задачи
 * @param {string} taskId - ID задачи
 * @param {File} file - Файл изображения
 * @returns {Promise<void>}
 */
const updateTaskImageFunction = async (taskId: string, file: File): Promise<void> => {
    if (!file) {
        message.error('Файл не выбран');
        return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await axios.patch(
            `https://kanban-server-psi.vercel.app/api/v1/task/${taskId}/updateImage`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer YOUR_TOKEN', // Если требуется авторизация
                },
            }
        );
        message.success('Изображение успешно обновлено!');
        console.log(response.data);

        // Обновление данных через react-query, если используется
        const queryClient = useQueryClient();
        queryClient.invalidateQueries("allColumnData");
        queryClient.invalidateQueries("getTaskById");
    } catch (error) {
        message.error('Ошибка при обновлении изображения');
        console.error(error);
    }
};

export default updateTaskImageFunction;
