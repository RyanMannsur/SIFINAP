export class DateUtil {
  static formatRelativeTime(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    
    const isToday = date.getDate() === now.getDate() && 
                    date.getMonth() === now.getMonth() && 
                    date.getFullYear() === now.getFullYear();

    const pad = (n: number) => n < 10 ? '0' + n : n;
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    if (isToday) {
      return `Hoje às ${hours}:${minutes}`;
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.getDate() === yesterday.getDate() && 
                        date.getMonth() === yesterday.getMonth() && 
                        date.getFullYear() === yesterday.getFullYear();
    
    if (isYesterday) {
      return `Ontem às ${hours}:${minutes}`;
    }

    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} às ${hours}:${minutes}`;
  }
}
