import cron from "node-cron";
import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { sendEmail } from "../config/mailer.js";
import logger from "../services/logger.service.js";

const startReminderJob = () => {
  // Check every 30 minutes for upcoming appointments
  cron.schedule("*/30 * * * *", async () => {
    try {
      const now = new Date();
      const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);
      const inTwoHours = new Date(now.getTime() + 2 * 60 * 60 * 1000);

      const appointments = await Appointment.find({
        status: { $in: ["pending", "confirmed"] },
        appointmentDate: {
          $gte: inOneHour,
          $lte: inTwoHours,
        },
      })
        .populate({ path: "patient", populate: { path: "user", select: "firstName lastName email" } })
        .populate({ path: "doctor", populate: { path: "user", select: "firstName lastName" } });

      for (const apt of appointments) {
        const patientUser = apt.patient?.user;
        const doctorUser = apt.doctor?.user;

        if (!patientUser) continue;

        // In-app notification for patient
        await Notification.create({
          recipient: patientUser._id || patientUser,
          title: "Appointment Reminder",
          message: `Your appointment with Dr. ${doctorUser?.firstName || ""} ${doctorUser?.lastName || ""} is in 1 hour.`,
          type: "appointment",
          metadata: { appointmentId: apt._id, appointmentDate: apt.appointmentDate, appointmentTime: apt.appointmentTime },
        });

        // Email notification
        if (patientUser.email) {
          await sendEmail({
            to: patientUser.email,
            subject: "Appointment Reminder — MediSync AI",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
                <h2 style="color: #2563eb;">Appointment Reminder</h2>
                <p>Your appointment is in <strong>1 hour</strong>.</p>
                <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                  <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Date:</strong></td>
                      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${new Date(apt.appointmentDate).toLocaleDateString()}</td></tr>
                  <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Time:</strong></td>
                      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${apt.appointmentTime}</td></tr>
                  <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Doctor:</strong></td>
                      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">Dr. ${doctorUser?.firstName || ""} ${doctorUser?.lastName || ""}</td></tr>
                </table>
                <p style="color: #6b7280; font-size: 12px;">This is an automated reminder from MediSync AI.</p>
              </div>
            `,
          });
        }
      }

      if (appointments.length > 0) {
        logger.info(`[Reminder Job] Sent ${appointments.length} appointment reminders`);
      }
    } catch (error) {
      logger.error("[Reminder Job] Error:", error.message);
    }
  });

  logger.info("[Cron] Appointment reminder job started");
};

export default startReminderJob;
