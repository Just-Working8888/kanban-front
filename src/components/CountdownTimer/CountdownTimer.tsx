import React, { useEffect, useState } from 'react';
import { Typography, Space } from 'antd';
import { ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface CountdownProps {
  targetDate: string;
}

const CountdownTimer: React.FC<CountdownProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isOverdue, setIsOverdue] = useState<boolean>(false);
  const [color, setColor] = useState<string>('');

  useEffect(() => {
    const target = dayjs(targetDate);
    const current = dayjs();

    const interval = setInterval(() => {
      const now = dayjs();
      const duration = target.diff(now, 'second');
      if (duration > 0) {
        const days = Math.floor(duration / (3600 * 24));
        const hours = Math.floor((duration % (3600 * 24)) / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = duration % 60;
        setTimeLeft(`${days}д ${hours}ч ${minutes}м ${seconds}с`);
        setIsOverdue(false);
        setColor('green');
      } else {
        const overdueDuration = Math.abs(duration);
        const overdueDays = Math.floor(overdueDuration / (3600 * 24));
        const overdueHours = Math.floor((overdueDuration % (3600 * 24)) / 3600);
        const overdueMinutes = Math.floor((overdueDuration % 3600) / 60);
        const overdueSeconds = overdueDuration % 60;
        setTimeLeft(`${overdueDays}д ${overdueHours}ч ${overdueMinutes}м ${overdueSeconds}с`);
        setIsOverdue(true);
        setColor('red');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <Space style={{ color: color, fontSize: 18 }}>
      {isOverdue ? (
        <>
          <CloseCircleOutlined style={{ fontSize: 20, color: color }} />
          <Typography.Text>Вы просрочили на {timeLeft}</Typography.Text>
        </>
      ) : (
        <>
          <ClockCircleOutlined style={{ fontSize: 20, color: color }} />
          <Typography.Text>До события осталось {timeLeft}</Typography.Text>
        </>
      )}
    </Space>
  );
};

export default CountdownTimer;
