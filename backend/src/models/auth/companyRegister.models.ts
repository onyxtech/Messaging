import mongoose, { Schema, Document } from "mongoose";

export interface IShop extends Document {
  shopName: string;
  userId: mongoose.Types.ObjectId; // Reference to User
  email: string;
  phoneNumber: string;
  companyWebsite: string;
  companyAddress: string;
  country: string;
  zipCode: string;
  latitude: string;
  longitude: string;
  logo: string;
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
      unique: true, // One user can have only one shop
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

// Indexes for better query performance
ShopSchema.index({ userId: 1 });
ShopSchema.index({ shopName: 1 });
ShopSchema.index({ email: 1 });
ShopSchema.index({ isDeleted: 1 });

export const Shop = mongoose.model<IShop>("Shop", ShopSchema);