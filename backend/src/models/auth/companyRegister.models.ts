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
    // New branding fields
    primaryColor?: string;
    accentColor?: string;
    companyEmail?: string;
    supportEmail?: string;
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
        // New branding fields
        primaryColor: {
            type: String,
            default: "#0f172a",
        },
        accentColor: {
            type: String,
            default: "#6366f1",
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