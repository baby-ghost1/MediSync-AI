import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MediSync AI API",
      version: "1.0.0",
      description: "RESTful API for MediSync AI — a healthcare management platform with AI-powered features",
      contact: {
        name: "MediSync AI Support",
        url: "https://medisync.ai",
        email: "support@medisync.ai",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
      {
        url: "https://api.medisync.ai",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Something went wrong" },
            stack: { type: "string", description: "Stack trace (development only)" },
          },
        },
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "665f1a2b3c4d5e6f7a8b9c0d" },
            firstName: { type: "string", example: "John" },
            lastName: { type: "string", example: "Doe" },
            email: { type: "string", example: "john@example.com" },
            role: { type: "string", enum: ["patient", "doctor", "admin"], example: "patient" },
            phone: { type: "string", example: "+1234567890" },
          },
        },
        Appointment: {
          type: "object",
          properties: {
            _id: { type: "string" },
            patient: { type: "string", description: "Patient user ID" },
            doctor: { type: "string", description: "Doctor user ID" },
            date: { type: "string", format: "date", example: "2025-03-15" },
            time: { type: "string", example: "10:30" },
            status: { type: "string", enum: ["scheduled", "confirmed", "completed", "cancelled", "no-show"] },
            type: { type: "string", enum: ["in-person", "video", "phone"] },
            reason: { type: "string" },
          },
        },
        Prescription: {
          type: "object",
          properties: {
            _id: { type: "string" },
            patient: { type: "string" },
            doctor: { type: "string" },
            medicines: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  dosage: { type: "string" },
                  frequency: { type: "string" },
                  duration: { type: "string" },
                  instructions: { type: "string" },
                },
              },
            },
            status: { type: "string", enum: ["active", "completed", "cancelled"] },
          },
        },
        ConsultationNote: {
          type: "object",
          properties: {
            _id: { type: "string" },
            appointment: { type: "string" },
            patient: { type: "string" },
            doctor: { type: "string" },
            vitals: {
              type: "object",
              properties: {
                bloodPressure: { type: "string", example: "120/80" },
                heartRate: { type: "number", example: 72 },
                temperature: { type: "number", example: 98.6 },
                weight: { type: "number", example: 70 },
                height: { type: "number", example: 175 },
              },
            },
            symptoms: { type: "string" },
            diagnosis: { type: "string" },
            treatmentPlan: { type: "string" },
          },
        },
        Conversation: {
          type: "object",
          properties: {
            _id: { type: "string" },
            user: { type: "string" },
            title: { type: "string", example: "Health Checkup Discussion" },
            messages: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  role: { type: "string", enum: ["user", "assistant"] },
                  content: { type: "string" },
                  timestamp: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: "Auth", description: "Authentication & authorization" },
      { name: "Users", description: "User management" },
      { name: "Patients", description: "Patient-specific operations" },
      { name: "Doctors", description: "Doctor-specific operations" },
      { name: "Appointments", description: "Appointment scheduling & management" },
      { name: "Reports", description: "Medical reports & uploads" },
      { name: "Prescriptions", description: "Prescription management" },
      { name: "Notifications", description: "In-app notifications" },
      { name: "AI", description: "AI-powered health features" },
      { name: "Admin", description: "Admin panel operations" },
      { name: "Consultations", description: "Consultation notes" },
      { name: "PDF", description: "PDF generation & download" },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerSpec, swaggerUi };
