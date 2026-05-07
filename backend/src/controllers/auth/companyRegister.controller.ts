import { Request, Response } from "express";
import { User } from "../../models/auth/user.models";
import { Shop } from "../../models/auth/companyRegister.models"; // Your Shop/Company model
import mongoose from "mongoose";

export const registerShopDetails = async (req: Request, res: Response) => {
  console.log("Content-Type:", req.headers['content-type']);
  console.log("req.body:", req.body);
  console.log("req.file:", req.file);

  try {
    const {
      firstName,
      middleName,
      lastName,
      emailId,
      companyName,
      mobileNumber,
      phoneNumber,
      companyWebsite,
      companyAddress,
      country,
      zipCode,
      latitude,
      longitude,
      password,
      confirmPassword,
    } = req.body;

    console.log("API HIT");
    const logoPath = (req.file as Express.Multer.File)?.filename || "";

    // 1. Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email: emailId });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }


    try {
      // 3. Create User (without shopId initially)
      const newUser = await User.create({
        email: emailId,
        password: password,
        role: "Admin",
        isActive: true,
        isDeleted: false,
        firstName: firstName || "",
        middleName: middleName || "",
        lastName: lastName || "",
        mobileNumber: mobileNumber || "",
      });

      if (!newUser) {
        throw new Error("User creation failed");
      }

      const userId = newUser._id;
      console.log("NEW USER ID:", userId);

      // 4. Create Shop/Company with userId reference
      const newShop = await Shop.create({
        shopName: companyName || "",
        userId: userId, // Shop has userId
        email: emailId,
        phoneNumber: phoneNumber || "",
        companyWebsite: companyWebsite || "",
        companyAddress: companyAddress || "",
        country: country || "",
        zipCode: zipCode || "",
        latitude: latitude || "",
        longitude: longitude || "",
        logo: logoPath,
        isActive: true,
        isDeleted: false,
      });

      if (!newShop) {
        throw new Error("Shop creation failed");
      }

      // 5. Update User with shopId
      newUser.shopId = newShop._id;
      
      
      // Success
      return res.status(201).json({
        message: "Shop registered successfully",
        userId: userId,
        shopId: newShop._id,
        email: newUser.email,
      });

    } catch (error: any) {
          
      throw error;
    } 

  } catch (error: any) {
    console.error("Registration error:", JSON.stringify(error, null, 2));

    return res.status(500).json({
      message: "Registration failed",
      error: process.env.NODE_ENV === "development"
        ? { message: error.message, errors: error.errors }
        : undefined,
    });
  }
};