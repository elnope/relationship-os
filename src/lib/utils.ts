import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStrengthColor(score: number): {
  bg: string;
  ring: string;
  text: string;
  glow: string;
  label: string;
} {
  if (score >= 80) {
    return {
      bg: 'bg-rose-100',
      ring: 'ring-rose-300',
      text: 'text-rose-700',
      glow: 'shadow-rose-200/50',
      label: 'Strong',
    };
  } else if (score >= 50) {
    return {
      bg: 'bg-emerald-100',
      ring: 'ring-emerald-300',
      text: 'text-emerald-700',
      glow: 'shadow-emerald-200/50',
      label: 'Healthy',
    };
  } else if (score >= 20) {
    return {
      bg: 'bg-amber-100',
      ring: 'ring-amber-300',
      text: 'text-amber-700',
      glow: 'shadow-amber-200/50',
      label: 'Fading',
    };
  } else {
    return {
      bg: 'bg-gray-100',
      ring: 'ring-gray-300',
      text: 'text-gray-500',
      glow: 'shadow-gray-200/50',
      label: 'Lost Contact',
    };
  }
}

export function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins}p trước`;
  if (diffHours < 24) return `${diffHours}h trước`;
  if (diffDays === 1) return 'Hôm qua';
  if (diffDays < 7) return `${diffDays} ngày trước`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
  return `${Math.floor(diffDays / 30)} tháng trước`;
}

export function getInteractionIcon(type: string): string {
  const icons: Record<string, string> = {
    coffee: '☕',
    call: '📞',
    video_call: '📹',
    chat: '💬',
    meal: '🍽️',
    drinks: '🥂',
    activity: '🎯',
    event: '🎉',
    gift: '🎁',
    text: '📱',
    email: '✉️',
    other: '💭',
  };
  return icons[type] || '💭';
}

export function getInteractionLabel(type: string): string {
  const labels: Record<string, string> = {
    coffee: 'Cà phê',
    call: 'Gọi điện',
    video_call: 'Video call',
    chat: 'Chat',
    meal: 'Đi ăn',
    drinks: 'Uống nước',
    activity: 'Hoạt động',
    event: 'Sự kiện',
    gift: 'Quà tặng',
    text: 'Nhắn tin',
    email: 'Email',
    other: 'Khác',
  };
  return labels[type] || 'Khác';
}

// Returns a single hex color based on score
export function getStrengthColorHex(score: number): string {
  if (score >= 80) return '#EF4444'; // rose-500
  if (score >= 50) return '#10B981'; // emerald-500
  if (score >= 20) return '#F59E0B'; // amber-500
  return '#6B7280'; // gray-500
}
