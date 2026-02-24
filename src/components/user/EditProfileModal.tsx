import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { FiX } from 'react-icons/fi';
import { User } from '@/types';
import { userService } from '@/services/userService';
import { useAuthStore } from '@/store/authStore';
import Button from '../auth/Button';
import Input from '../auth/Input';

interface EditProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ user, isOpen, onClose }: EditProfileModalProps) {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);

  const [formData, setFormData] = useState({
    fullName: user.fullName || '',
    bio: user.bio || '',
    location: user.location || '',
    website: user.website || '',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        fullName: user.fullName || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
      });
    }
  }, [isOpen, user]);

  const updateMutation = useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['user', user.username] });
      updateUser(updatedUser);
      toast.success('Profile updated!');
      onClose();
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            type="text"
            name="fullName"
            label="Full Name"
            placeholder="Your full name"
            value={formData.fullName}
            onChange={handleChange}
            maxLength={100}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={4}
              maxLength={500}
            />
            <p className="mt-1 text-sm text-gray-500 text-right">
              {formData.bio.length}/500
            </p>
          </div>

          <Input
            type="text"
            name="location"
            label="Location"
            placeholder="City, Country"
            value={formData.location}
            onChange={handleChange}
            maxLength={100}
          />

          <Input
            type="url"
            name="website"
            label="Website"
            placeholder="https://yourwebsite.com"
            value={formData.website}
            onChange={handleChange}
            maxLength={255}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              fullWidth
              isLoading={updateMutation.isPending}
            >
              Save Changes
            </Button>
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
