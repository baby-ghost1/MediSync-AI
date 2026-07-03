import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, Phone, Camera, Save, UserRound } from "lucide-react";
import toast from "react-hot-toast";

import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import PageHeader from "@/components/common/PageHeader";
import authService from "@/services/auth.service";
import { useAuth } from "@/hooks/useAuth";
import { useApiMutation } from "@/hooks/useQuery";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional().or(z.literal("")),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [uploading, setUploading] = useState(false);

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    values: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const { mutate: updateProfile, isPending: isUpdating } = useApiMutation({
    mutationFn: (data) => authService.updateProfile(data),
    onSuccess: (res) => {
      updateUser(res.user || res);
      toast.success("Profile updated successfully");
    },
    successMessage: "Profile updated",
  });

  const { mutate: changePassword, isPending: isChangingPassword } = useApiMutation({
    mutationFn: (data) => authService.changePassword(data),
    onSuccess: () => {
      passwordForm.reset();
      toast.success("Password changed successfully");
    },
    successMessage: "Password changed",
  });

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await authService.uploadAvatar(file);
      updateUser({ avatar: res.url || res.avatar });
      toast.success("Avatar updated");
    } catch {
      toast.error("Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Profile" description="Manage your personal information" />

      <Card paddingSize="lg" className="overflow-hidden border-0 bg-[linear-gradient(135deg,var(--primary),var(--accent))] text-[var(--primary-foreground)] shadow-[var(--shadow-lg)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--primary-foreground)]/70">Account overview</p>
            <h2 className="mt-2 text-xl font-semibold">Keep your profile current and secure</h2>
            <p className="mt-2 max-w-2xl text-sm text-[var(--primary-foreground)]/75">Update personal details, change your password and manage your medical profile with confidence.</p>
          </div>
          <div className="rounded-[var(--radius-lg)] bg-[var(--primary-foreground)]/15 px-4 py-3 backdrop-blur-xl">
            <p className="text-sm font-semibold">{user?.role || "Patient"}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-8 xl:grid-cols-3">
        <div className="space-y-8 xl:col-span-2">
          <Card>
            <CardHeader title="Personal Information" subtitle="Update your profile details" />
            <form onSubmit={profileForm.handleSubmit((d) => updateProfile(d))} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <Input label="First Name" leftIcon={<User size={18} />} error={profileForm.formState.errors.firstName?.message} {...profileForm.register("firstName")} />
                <Input label="Last Name" leftIcon={<User size={18} />} error={profileForm.formState.errors.lastName?.message} {...profileForm.register("lastName")} />
              </div>
              <Input label="Email" type="email" leftIcon={<Mail size={18} />} error={profileForm.formState.errors.email?.message} {...profileForm.register("email")} />
              <Input label="Phone" type="tel" leftIcon={<Phone size={18} />} error={profileForm.formState.errors.phone?.message} {...profileForm.register("phone")} />
              <div className="flex justify-end">
                <Button type="submit" loading={isUpdating} leftIcon={<Save size={18} />}>Save Changes</Button>
              </div>
            </form>
          </Card>

          <Card>
            <CardHeader title="Change Password" subtitle="Update your account password" />
            <form onSubmit={passwordForm.handleSubmit((d) => changePassword(d))} className="space-y-5">
              <Input label="Current Password" type="password" error={passwordForm.formState.errors.currentPassword?.message} {...passwordForm.register("currentPassword")} />
              <div className="grid gap-5 md:grid-cols-2">
                <Input label="New Password" type="password" error={passwordForm.formState.errors.newPassword?.message} {...passwordForm.register("newPassword")} />
                <Input label="Confirm Password" type="password" error={passwordForm.formState.errors.confirmPassword?.message} {...passwordForm.register("confirmPassword")} />
              </div>
              <div className="flex justify-end">
                <Button type="submit" loading={isChangingPassword} variant="outline">Change Password</Button>
              </div>
            </form>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="overflow-hidden border-[var(--border)]/70 bg-[linear-gradient(135deg,var(--surface),var(--surface-off))]">
            <div className="text-center">
              <div className="relative mx-auto inline-block">
                <Avatar src={user?.avatar?.url || user?.avatar} name={`${user?.firstName || ""} ${user?.lastName || ""}`} size="xl" />
                <label className="absolute -bottom-1 -right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-lg)] transition-all duration-300 hover:bg-[var(--primary-hover)]">
                  <Camera size={18} />
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </label>
              </div>
              {uploading && <p className="mt-2 text-sm text-[var(--primary)]">Uploading...</p>}
              <h2 className="mt-5 text-2xl font-bold">{user?.firstName} {user?.lastName}</h2>
              <p className="mt-1 capitalize text-[var(--muted-foreground)]">
                <UserRound size={14} className="mr-1 inline" />
                {user?.role}
              </p>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">{user?.email}</p>
            </div>
          </Card>

          <Card>
            <CardHeader title="Account Info" />
            <div className="space-y-4">
              {[
                { label: "Member Since", value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A" },
                { label: "Email Verified", value: user?.isEmailVerified ? "Yes" : "No" },
                { label: "User ID", value: user?._id?.slice(-8) || "N/A" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-[var(--radius-lg)] bg-[var(--secondary)] px-4 py-3">
                  <span className="text-sm text-[var(--muted-foreground)]">{item.label}</span>
                  <span className="text-sm font-semibold text-[var(--foreground)]">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
