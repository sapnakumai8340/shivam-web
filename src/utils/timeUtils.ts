import { useState, useEffect } from 'react';

/**
 * Hook that triggers a re-render at regular intervals to keep relative timestamps alive in real time
 */
export function useLiveTicker(intervalMs: number = 3000): number {
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  return now;
}

export function formatRelativeTime(timestamp?: number | string | Date): string {
  if (!timestamp) return 'Just now';
  
  const now = Date.now();
  const time = typeof timestamp === 'number' 
    ? timestamp 
    : typeof timestamp === 'string' && !isNaN(Number(timestamp)) 
      ? Number(timestamp) 
      : new Date(timestamp).getTime();

  if (isNaN(time)) {
    return typeof timestamp === 'string' ? timestamp : 'Just now';
  }

  const diffMs = Math.max(0, now - time);
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 5) return 'Just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin === 1) return '1m ago';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour === 1) return '1h ago';
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay === 1) return '1d ago';
  if (diffDay < 7) return `${diffDay}d ago`;
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(time));
}

export function formatExactUploadTime(timestamp?: number | string | Date): string {
  if (!timestamp) {
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(new Date());
  }

  const time = typeof timestamp === 'number' 
    ? timestamp 
    : typeof timestamp === 'string' && !isNaN(Number(timestamp)) 
      ? Number(timestamp) 
      : new Date(timestamp).getTime();

  if (isNaN(time)) {
    return typeof timestamp === 'string' ? timestamp : '14 Aug 2026, 07:19 AM';
  }

  const date = new Date(time);
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date);
}

export function formatShortUploadTime(timestamp?: number | string | Date): string {
  if (!timestamp) return 'Today at 07:19 AM';

  const time = typeof timestamp === 'number' 
    ? timestamp 
    : typeof timestamp === 'string' && !isNaN(Number(timestamp)) 
      ? Number(timestamp) 
      : new Date(timestamp).getTime();

  if (isNaN(time)) return typeof timestamp === 'string' ? timestamp : 'Today at 07:19 AM';

  const date = new Date(time);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

