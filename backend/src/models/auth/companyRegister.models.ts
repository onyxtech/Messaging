// models/auth/companyRegister.models.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IShop extends Document {
    shopName: string;
    userId: mongoose.Types.ObjectId;
    email: string;
    phoneNumber: string;
    companyWebsite: string;
    companyAddress: string;
    country: string;
    zipCode: string;
    latitude: string;
    longitude: string;
    logo: string;
    // Company branding colors
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    companyEmail: string;
    supportEmail: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ShopSchema = new Schema<IShop>(
    {
        shopName: {
            type: String,
            required: true,
            trim: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        phoneNumber: {
            type: String,
            trim: true,
            default: "",
        },
        companyWebsite: {
            type: String,
            trim: true,
            default: "",
        },
        companyAddress: {
            type: String,
            required: true,
            trim: true,
        },
        country: {
            type: String,
            required: true,
            trim: true,
        },
        zipCode: {
            type: String,
            required: true,
            trim: true,
        },
        latitude: {
            type: String,
            trim: true,
            default: "",
        },
        longitude: {
            type: String,
            trim: true,
            default: "",
        },
        logo: {
            type: String,
            default: "",
        },
        // Three color scheme for company branding
        primaryColor: {
            type: String,
            default: "#1e293b", // Slate 800
        },
        secondaryColor: {
            type: String,
            default: "#3b82f6", // Blue 500
        },
        accentColor: {
            type: String,
            default: "#8b5cf6", // Violet 500
        },
        companyEmail: {
            type: String,
            trim: true,
            lowercase: true,
        },
        supportEmail: {
            type: String,
            trim: true,
            lowercase: true,
            default: "support@example.com",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const Shop = mongoose.model<IShop>("Shop", ShopSchema);