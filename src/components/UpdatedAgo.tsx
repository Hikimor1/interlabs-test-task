import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

type Props = {
  // Момент последней успешной загрузки данных.
  since: Date;
};

export function UpdatedAgo({ since }: Props) {
  const getElapsedSeconds = () =>
    Math.max(0, Math.floor((Date.now() - since.getTime()) / 1000));

  const [seconds, setSeconds] = useState(getElapsedSeconds);

  useEffect(() => {
    setSeconds(getElapsedSeconds());

    const timer = setInterval(() => {
      setSeconds(getElapsedSeconds());
    }, 1000);

    return () => clearInterval(timer);
  }, [since]);

  return <Text style={styles.text}>Обновлено {seconds} сек назад</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    color: '#6b7280',
  },
});
