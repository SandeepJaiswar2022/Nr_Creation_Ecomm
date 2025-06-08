import { z } from "zod";

// List of Indian states
export const INDIAN_STATES = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli",
    "Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry"
];

export const addressSchema = z.object({
    name: z.string().min(1, "Name is required"),
    phone: z.string()
        .min(10, "Phone number must be 10 digits")
        .max(10, "Phone number must be 10 digits")
        .regex(/^[6-9]\d{9}$/, "Please enter a valid phone number starting with 6, 7, 8, or 9"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.enum(INDIAN_STATES, {
        errorMap: () => ({ message: "Please select a valid state" }),
    }),
    pinCode: z.string().regex(/^\d{6}$/, "PIN code must be 6 digits"),
    country: z.string().default("India"),
}); 