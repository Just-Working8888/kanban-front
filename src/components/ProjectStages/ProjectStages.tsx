import React from 'react';
import { Card, Progress, Row, Col, Timeline, Table, Tag, Flex } from 'antd';
import { Pie, Column } from '@ant-design/charts';
import ProgressCard from './ProgressCard';

interface Stage {
    name: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    progress: number;
    startDate: string;
    endDate: string;
    description: string;
}

const mockStages: Stage[] = [
    { name: 'Инициализация', status: 'COMPLETED', progress: 100, startDate: '2024-01-01', endDate: '2024-01-10', description: 'Запуск проекта и анализ требований.' },
    { name: 'Разработка', status: 'IN_PROGRESS', progress: 60, startDate: '2024-01-11', endDate: '2024-02-15', description: 'Разработка функционала и интерфейса.' },
    { name: 'Тестирование', status: 'PENDING', progress: 0, startDate: '2024-02-16', endDate: '2024-03-01', description: 'Проведение тестов и исправление багов.' },
];

const ProjectStages: React.FC = () => {
    const totalStages = mockStages.length;
    const completedStages = mockStages.filter((stage) => stage.status === 'COMPLETED').length;
    const inProgressStages = mockStages.filter((stage) => stage.status === 'IN_PROGRESS').length;
    const pendingStages = mockStages.filter((stage) => stage.status === 'PENDING').length;

    const chartData = [
        { stage: 'Инициализация', progress: 100 },
        { stage: 'Разработка', progress: 60 },
        { stage: 'Тестирование', progress: 0 },
    ];

    const columnData = [
        { stage: 'Завершено', value: completedStages },
        { stage: 'В процессе', value: inProgressStages },
        { stage: 'Ожидает', value: pendingStages },
    ];

    const chartConfig = {
        data: chartData,
        angleField: 'progress',
        colorField: 'stage',
        radius: 0.8,
        label: {
          type: 'outer',
          content: '{percentage}%',  // Показываем процент в метке
          style: {
            fill: '#ffffff',  // Цвет текста
            fontSize: 14,
          },
        },
        color: ['#4CAF50', '#1890ff', '#ff4d4f'],  // Цвета секторов
        statistic: {
          title: {
            content: 'Прогресс по этапам',
            style: {
              fill: '#ffffff',  // Белый цвет для заголовка статистики
            },
          },
          content: {
            style: {
              fill: '#ffffff',  // Белый цвет для контента статистики
            },
          },
        },
      };
    

    const columnConfig = {
        data: columnData,
        xField: 'stage',
        yField: 'value',
        colorField: 'stage',  // Используем поле 'stage' для цвета

        label: {
            position: 'center',
            style: {
                fill: '#fff',
                fontSize: 16,
            },
        },
        color: ['#4CAF50', '#1890ff', '#ff4d4f'], // Здесь задаем массив цветов для секторов
    };

    const columns = [
        { title: 'Этап', dataIndex: 'name', key: 'name' },
        { title: 'Описание', dataIndex: 'description', key: 'description' },
        { title: 'Статус', dataIndex: 'status', key: 'status', render: (status: string) => <Tag color={status === 'COMPLETED' ? 'green' : status === 'IN_PROGRESS' ? 'blue' : 'gray'}>{status}</Tag> },
        { title: 'Прогресс', dataIndex: 'progress', key: 'progress', render: (progress: number) => <Progress percent={progress} size="small" /> },
        { title: 'Дата начала', dataIndex: 'startDate', key: 'startDate' },
        { title: 'Дата окончания', dataIndex: 'endDate', key: 'endDate' },
    ];

    const dataTable = mockStages.map((stage) => ({
        key: stage.name,
        name: stage.name,
        description: stage.description,
        status: stage.status,
        progress: stage.progress,
        startDate: stage.startDate,
        endDate: stage.endDate,
    }));

    return (
        <div className="p-10 pb-32 h-[100vh] overflow-auto">
            <Row gutter={[16, 16]}>
                {/* Карточка с общим прогрессом */}
                <ProgressCard />

                {/* Карточка с диаграммой Pie */}
                <Col xs={24} sm={12} md={8}>
                    <Card title="Прогресс по этапам" bordered={false}>
                        <Pie {...chartConfig} />
                    </Card>
                </Col>

                {/* Карточка с диаграммой Column */}
                <Col xs={24} sm={12} md={8}>
                    <Card title="Статус этапов" bordered={false}>
                        <Column {...columnConfig} />
                    </Card>
                </Col>
            </Row>

            <Flex gap={15}>
                <Row gutter={[16, 16]} className="mt-4 w-full">
                    {/* Карточка с таблицей */}
                    <Col xs={24}>
                        <Card title="Детали этапов проекта" bordered={false}>
                            <Table columns={columns} dataSource={dataTable} pagination={false} />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} className="mt-4 w-[50%]">
                    {/* Карточка с историей изменений */}
                    <Col xs={24}>
                        <Card title="История изменений этапов" bordered={false}>
                            <Timeline mode="left">
                                {mockStages.map((stage, index) => (
                                    <Timeline.Item
                                        key={index}
                                        color={stage.status === 'COMPLETED' ? 'green' : stage.status === 'IN_PROGRESS' ? 'blue' : 'gray'}
                                    >
                                        <h4>{stage.name}</h4>
                                        <p>{stage.description}</p>
                                        <p>{stage.status === 'COMPLETED' ? 'Завершено' : stage.status === 'IN_PROGRESS' ? 'В процессе' : 'Ожидает'}</p>
                                        <Progress percent={stage.progress} size="small" />
                                    </Timeline.Item>
                                ))}
                            </Timeline>
                        </Card>
                    </Col>
                </Row>
            </Flex>
            <div className='h-96'></div>
        </div>
    );
};

export default ProjectStages;
