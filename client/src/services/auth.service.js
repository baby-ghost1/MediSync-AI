import API from "@/api/axios";
import ENDPOINTS from "@/api/endpoints";

class AuthService {
  async login(credentials) {
    const { data } = await API.post(
      ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return data;
  }

  async register(payload) {
    const { data } = await API.post(
      ENDPOINTS.AUTH.REGISTER,
      payload
    );
    return data;
  }

  async me() {
    const { data } = await API.get(
      ENDPOINTS.AUTH.ME
    );
    return data;
  }

  async logout() {
    try {
      await API.post(ENDPOINTS.AUTH.LOGOUT);
    } finally {
      try {
        localStorage.removeItem("medisync-auth");
      } catch {
        // ignore
      }
    }
  }

  async forgotPassword(email) {
    const { data } = await API.post(
      ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email }
    );
    return data;
  }

  async resetPassword({ token, password }) {
    const { data } = await API.post(
      ENDPOINTS.AUTH.RESET_PASSWORD,
      { token, password }
    );
    return data;
  }

  async verifyEmail(token) {
    const { data } = await API.post(
      ENDPOINTS.AUTH.VERIFY_EMAIL,
      { token }
    );
    return data;
  }

  async changePassword({ currentPassword, newPassword }) {
    const { data } = await API.patch(
      ENDPOINTS.AUTH.CHANGE_PASSWORD,
      { currentPassword, newPassword }
    );
    return data;
  }

  async updateProfile(payload) {
    const { data } = await API.patch(
      ENDPOINTS.AUTH.PROFILE,
      payload
    );
    return data;
  }

  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append("avatar", file);
    const { data } = await API.patch(
      ENDPOINTS.AUTH.AVATAR,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  }

  async deleteAccount() {
    const { data } = await API.delete(
      ENDPOINTS.AUTH.ACCOUNT
    );
    return data;
  }
}

export default new AuthService();
