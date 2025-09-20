import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatTimeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return `${minutes}m ago`;
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'extreme': return 'text-red-700 bg-red-100';
    case 'high': return 'text-orange-700 bg-orange-100';
    case 'moderate': return 'text-yellow-700 bg-yellow-100';
    case 'low': return 'text-green-700 bg-green-100';
    default: return 'text-gray-700 bg-gray-100';
  }
}

export function getEventTypeIcon(eventType: string): string {
  switch (eventType) {
    case 'high_wave': return '🌊';
    case 'flood': return '💧';
    case 'unusual_tide': return '🌀';
    case 'cyclone': return '🌪️';
    default: return '⚠️';
  }
}

export function maskPII(text: string, shouldMask: boolean): string {
  if (!shouldMask) return text;
  
  // Mask phone numbers
  return text.replace(/[\+]?[0-9]{1,4}?[-.\s]?\(?[0-9]{1,3}?\)?[-.\s]?[0-9]{3,4}[-.\s]?[0-9]{3,6}/g, 'XXX-XXX-XXXX');
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'open': return 'text-red-700 bg-red-100';
    case 'acknowledged': return 'text-yellow-700 bg-yellow-100';
    case 'dispatched': return 'text-blue-700 bg-blue-100';
    case 'published': return 'text-purple-700 bg-purple-100';
    case 'closed': return 'text-gray-700 bg-gray-100';
    default: return 'text-gray-700 bg-gray-100';
  }
}