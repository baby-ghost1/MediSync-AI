import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { User, Mail, Phone, Camera, Save, UserRound, Stethoscope, Hospital, DollarSign } from "lucide-react";
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
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().or(z.literal("")),
  specialization: z.string().optional().or(z.literal("")),
  hospital: z.string().optional().or(z.literal("")),
  consultationFee: z.string().optional().or(z.literal("")),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const fadeSlide = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

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
      specialization: user?.specialization || "",
      hospital: user?.hospital || "",
      consultationFee: user?.consultationFee?.toString() || "",
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
    },
    successMessage: "Profile updated",
  });

  const { mutate: changePassword, isPending: isChangingPassword } = useApiMutation({
    mutationFn: (data) => authService.changePassword(data),
    onSuccess: () => { passwordForm.reset(); },
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
    } catch { toast.error("Failed to upload avatar"); }
    finally { setUploading(false); }
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={fadeSlide}>
        <PageHeader title="Profile" description="Manage your professional information" />
      </motion.div>

      <div className="grid gap-8 xl:grid-cols-3">
        <div className="space-y-8 xl:col-span-2">
          <motion.div variants={fadeSlide}>
            <Card>
              <CardHeader title="Professional Information" subtitle="Update your profile and practice details" />
              <form onSubmit={profileForm.handleSubmit((d) => updateProfile(d))} className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <Input label="First Name" leftIcon={<User size={18} />} error={profileForm.formState.errors.firstName?.message} {...profileForm.register("firstName")} />
                  <Input label="Last Name" leftIcon={<User size={18} />} error={profileForm.formState.errors.lastName?.message} {...profileForm.register("lastName")} />
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <Input label="Email" type="email" leftIcon={<Mail size={18} />} error={profileForm.formState.errors.email?.message} {...profileForm.register("email")} />
                  <Input label="Phone" type="tel" leftIcon={<Phone size={18} />} error={profileForm.formState.errors.phone?.message} {...profileForm.register("phone")} />
                </div>
                <div className="grid gap-5 md:grid-cols-3">
                  <Input label="Specialization" leftIcon={<Stethoscope size={18} />} {...profileForm.register("specialization")} />
                  <Input label="Hospital" leftIcon={<Hospital size={18} />} {...profileForm.register("hospital")} />
                  <Input label="Consultation Fee" leftIcon={<DollarSign size={18} />} {...profileForm.register("consultationFee")} />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" loading={isUpdating} leftIcon={<Save size={18} />}>Save Changes</Button>
                </div>
              </form>
            </Card>
          </motion.div>

          <motion.div variants={fadeSlide}>
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
          </motion.div>
        </div>

        <div className="space-y-8">
          <motion.div variants={fadeSlide}>
            <Card>
              <div className="text-center">
                <div className="relative mx-auto inline-block">
                  <Avatar src={user?.avatar?.url || user?.avatar} name={`${user?.firstName || ""} ${user?.lastName || ""}`} size="xl" />
                  <label className="absolute -bottom-1 -right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-lg)] transition-all duration-300 hover:bg-[var(--primary-hover)] hover:shadow-[var(--shadow-xl)]">
                    <Camera size={18} />
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                </div>
                {uploading && <p className="mt-2 text-sm text-[var(--primary)]">Uploading...</p>}
                <h2 className="mt-5 text-2xl font-bold text-[var(--text-primary)]">{user?.firstName} {user?.lastName}</h2>
                <p className="mt-1 capitalize text-[var(--text-secondary)]">
                  <UserRound size={14} className="mr-1 inline" />
                  {user?.specialization || user?.role}
                </p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">{user?.email}</p>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={fadeSlide}>
            <Card>
              <CardHeader title="Account Info" />
              <div className="space-y-4">
                {[
                  { label: "Member Since", value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A" },
                  { label: "Email Verified", value: user?.isEmailVerified ? "Yes" : "No" },
                  { label: "Doctor ID", value: user?._id?.slice(-8) || "N/A" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-[var(--radius-lg)] bg-[var(--surface-off)] px-4 py-3 transition-all duration-300 hover:shadow-[var(--shadow-sm)]">
                    <span className="text-sm text-[var(--text-secondary)]">{item.label}</span>
                    <span className="text-sm font-semibold text-[var(--text-primary)]">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
