import API from "@/api/axios";
import ENDPOINTS from "@/api/endpoints";

class NotificationService {
  async getNotifications(params = {}) {
    const { data } = await API.get(ENDPOINTS.NOTIFICATIONS.ALL, { params });
    return data;
  }

  async getNotification(id) {
    const { data } = await API.get(`${ENDPOINTS.NOTIFICATIONS.ALL}/${id}`);
    return data;
  }

  async createNotification(payload) {
    const { data } = await API.post(ENDPOINTS.NOTIFICATIONS.ALL, payload);
    return data;
  }

  async deleteNotification(id) {
    const { data } = await API.delete(`${ENDPOINTS.NOTIFICATIONS.ALL}/${id}`);
    return data;
  }

  async markAsRead(id) {
    const { data } = await API.patch(ENDPOINTS.NOTIFICATIONS.READ(id));
    return data;
  }

  async markAllAsRead() {
    const { data } = await API.patch(ENDPOINTS.NOTIFICATIONS.READ_ALL);
    return data;
  }

  async markAsUnread(id) {
    const { data } = await API.patch(`${ENDPOINTS.NOTIFICATIONS.ALL}/${id}/unread`);
    return data;
  }

  async deleteRead() {
    const { data } = await API.delete(`${ENDPOINTS.NOTIFICATIONS.ALL}/read`);
    return data;
  }

  async deleteAll() {
    const { data } = await API.delete(`${ENDPOINTS.NOTIFICATIONS.ALL}/all`);
    return data;
  }

  async getUnreadCount() {
    const { data } = await API.get(ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
    return data;
  }
}

export default new NotificationService();
