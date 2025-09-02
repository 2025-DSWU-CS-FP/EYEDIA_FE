import { useEffect } from 'react';

import useCreateBadgeEvent from '@/services/mutations/useCreateBadgeEvent';

const keyForToday = () => {
  const d = new Date();
  const y = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
  }).format(d);
  const m = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    month: '2-digit',
  }).format(d);
  const day = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    day: '2-digit',
  }).format(d);
  return `badge:appOpened:${y}-${m}-${day}`;
};

export default function useAppOpenedEvent(enabled: boolean) {
  const { mutate } = useCreateBadgeEvent();

  useEffect(() => {
    if (!enabled) return;
    const key = keyForToday();
    if (localStorage.getItem(key)) return;

    mutate(
      {
        eventUid: `open-${crypto.randomUUID()}`,
        type: 'APP_OPENED',
        occurredAt: new Date().toISOString(),
        payload: { timezone: 'Asia/Seoul' },
      },
      {
        onSuccess: () => {
          localStorage.setItem(key, '1');
        },
      },
    );
  }, [enabled, mutate]);
}
