import React from 'react';
import { Card, Progress, Col, Tooltip, Flex } from 'antd';
import { CheckCircleOutlined, SyncOutlined, HourglassOutlined } from '@ant-design/icons';

const ProgressCard: React.FC = () => {
    const completedStages = 2;
    const inProgressStages = 1;
    const pendingStages = 1;
    const totalStages = 4;

    const stages = [
        { name: 'Инициализация', progress: 100, status: 'COMPLETED' },
        { name: 'Разработка', progress: 60, status: 'IN_PROGRESS' },
        { name: 'Тестирование', progress: 0, status: 'PENDING' },
    ];

    const progressPercentage = (completedStages / totalStages) * 100;

    return (
        <Col xs={24} sm={12} md={8}>
            <Card
                title="Общий прогресс"
                bordered={false}
                className="shadow-lg h-full  rounded-lg bg-gray-800 text-white"
            >
                <Flex style={{ height: '100%' }} vertical justify='space-between' >
                    <div className="flex items-center justify-between mb-4">
                        <Progress
                            percent={progressPercentage}
                            status="active"
                            strokeColor="#4CAF50"
                            showInfo={false}
                            className="w-full"
                            style={{ marginRight: '10px' }}
                        />
                        <span className="font-semibold text-lg">{Math.round(progressPercentage)}%</span>
                    </div>

                    <div className="flex justify-between items-center text-sm mb-4">
                        <Tooltip title="Этапы, которые уже завершены">
                            <div className="flex items-center">
                                <CheckCircleOutlined style={{ color: 'green', marginRight: '8px' }} />
                                <span>Завершено: {completedStages}</span>
                            </div>
                        </Tooltip>
                        <Tooltip title="Этапы, которые находятся в процессе выполнения">
                            <div className="flex items-center">
                                <SyncOutlined spin style={{ color: 'blue', marginRight: '8px' }} />
                                <span>В процессе: {inProgressStages}</span>
                            </div>
                        </Tooltip>
                        <Tooltip title="Этапы, которые еще не начаты">
                            <div className="flex items-center">
                                <HourglassOutlined style={{ color: 'gray', marginRight: '8px' }} />
                                <span>Ожидает: {pendingStages}</span>
                            </div>
                        </Tooltip>
                    </div>

                    <div className="mt-4 text-xs text-gray-400">
                        <p>Обновлено: {new Date().toLocaleString()}</p>
                    </div>

                    <div className="mt-6">
                        <h4 className="text-sm font-semibold text-gray-200">Прогресс по этапам:</h4>
                        {stages.map((stage, index) => (
                            <div key={index} className="mb-4">
                                <div className="flex items-center justify-between">
                                    <h5 className="font-semibold text-gray-100">{stage.name}</h5>
                                    <span
                                        className={`text-sm ${stage.status === 'COMPLETED'
                                            ? 'text-green-500'
                                            : stage.status === 'IN_PROGRESS'
                                                ? 'text-blue-500'
                                                : 'text-gray-500'
                                            }`}
                                    >
                                        {stage.status === 'COMPLETED' ? 'Завершено' : stage.status === 'IN_PROGRESS' ? 'В процессе' : 'Ожидает'}
                                    </span>
                                </div>

                                <Progress
                                    percent={stage.progress}
                                    status={stage.status === 'COMPLETED' ? 'success' : stage.status === 'IN_PROGRESS' ? 'active' : 'exception'}
                                    strokeColor={
                                        stage.status === 'COMPLETED'
                                            ? '#4CAF50'
                                            : stage.status === 'IN_PROGRESS'
                                                ? '#1890ff'
                                                : '#ff4d4f'
                                    }
                                    showInfo={false}
                                    className="mt-2"
                                />
                            </div>
                        ))}
                    </div>
                </Flex>

            </Card>
        </Col>
    );
};

export default ProgressCard;
