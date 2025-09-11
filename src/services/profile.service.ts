import { clientService } from '@/lib/axios';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileServiceResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  errors?: string[];
}

/**
 * Service for managing user profile operations
 */
export class ProfileService {
  /**
   * Get current user profile
   */
  static async getProfile(): Promise<ProfileServiceResponse<UserProfile>> {
    try {
      const response = await clientService.get('/v1/user/profile');
      
      return {
        success: true,
        data: response.data,
        message: 'Lấy thông tin người dùng thành công',
      };
    } catch (error: any) {
      console.error('Get profile error:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Lấy thông tin người dùng thất bại',
        errors: error.response?.data?.errors,
      };
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    data: UpdateProfileRequest
  ): Promise<ProfileServiceResponse<UserProfile>> {
    try {
      const response = await clientService.put('/v1/user/profile', data);
      
      return {
        success: true,
        data: response.data,
        message: 'Cập nhật thông tin thành công',
      };
    } catch (error: any) {
      console.error('Update profile error:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Cập nhật thông tin thất bại',
        errors: error.response?.data?.errors,
      };
    }
  }

  /**
   * Change user password
   */
  static async changePassword(
    data: ChangePasswordRequest
  ): Promise<ProfileServiceResponse> {
    try {
      const response = await clientService.post('/v1/user/change-password', data);
      
      return {
        success: true,
        message: response.data.message || 'Đổi mật khẩu thành công',
      };
    } catch (error: any) {
      console.error('Change password error:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Đổi mật khẩu thất bại',
        errors: error.response?.data?.errors,
      };
    }
  }

  /**
   * Upload user avatar
   */
  static async uploadAvatar(file: File): Promise<ProfileServiceResponse<{ avatarUrl: string }>> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await clientService.post('/v1/user/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return {
        success: true,
        data: response.data,
        message: 'Tải lên ảnh đại diện thành công',
      };
    } catch (error: any) {
      console.error('Upload avatar error:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Tải lên ảnh đại diện thất bại',
        errors: error.response?.data?.errors,
      };
    }
  }

  /**
   * Delete user avatar
   */
  static async deleteAvatar(): Promise<ProfileServiceResponse> {
    try {
      await clientService.delete('/v1/user/avatar');
      
      return {
        success: true,
        message: 'Xóa ảnh đại diện thành công',
      };
    } catch (error: any) {
      console.error('Delete avatar error:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Xóa ảnh đại diện thất bại',
        errors: error.response?.data?.errors,
      };
    }
  }

  /**
   * Validate profile update data
   */
  static validateProfileData(data: UpdateProfileRequest): string[] {
    const errors: string[] = [];

    // Validate first name
    if (data.firstName && data.firstName.trim().length < 2) {
      errors.push('Họ phải có ít nhất 2 ký tự');
    }

    // Validate last name
    if (data.lastName && data.lastName.trim().length < 2) {
      errors.push('Tên phải có ít nhất 2 ký tự');
    }

    // Validate phone number
    if (data.phone) {
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(data.phone)) {
        errors.push('Số điện thoại không hợp lệ');
      }
    }

    return errors;
  }

  /**
   * Validate password change data
   */
  static validatePasswordData(data: ChangePasswordRequest): string[] {
    const errors: string[] = [];

    // Validate current password
    if (!data.currentPassword || data.currentPassword.length < 6) {
      errors.push('Mật khẩu hiện tại không hợp lệ');
    }

    // Validate new password
    if (!data.newPassword || data.newPassword.length < 8) {
      errors.push('Mật khẩu mới phải có ít nhất 8 ký tự');
    }

    // Validate password confirmation
    if (data.newPassword !== data.confirmPassword) {
      errors.push('Mật khẩu xác nhận không khớp');
    }

    // Check if new password is same as current password
    if (data.newPassword === data.currentPassword) {
      errors.push('Mật khẩu mới phải khác mật khẩu hiện tại');
    }

    return errors;
  }

  /**
   * Validate avatar file
   */
  static validateAvatarFile(file: File): string[] {
    const errors: string[] = [];

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      errors.push('Kích thước ảnh không được vượt quá 5MB');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('Chỉ chấp nhận định dạng ảnh JPEG, PNG hoặc GIF');
    }

    return errors;
  }
}