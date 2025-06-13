import mongoose from "mongoose";
import express from "express";
import Dotenv  from "dotenv";

export const connectDB = ()=>{
   try {
    mongoose.connect(process.env.MONGODB_URL);
    console.log(`mongodb connected successfully`)

   } catch (error) {
    console.log("Erron in connecting mongodb")
   }
}