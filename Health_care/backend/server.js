const express = require("express");
const mongoose = require("mongoose");
const Web3 = require("web3");
const cors = require("cors");
const { ethers } = require("ethers");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/healthcare", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB Error:", err));

// Patient Schema
const patientSchema = new mongoose.Schema({
    walletAddress: String,
    sex: String,
    dob: String,
    age: Number,
    workPhone: String,
    doctorName: String,
    appointmentReason: String,
    emergencyContact: String,
    emergencyPhone: String
});

const Patient = mongoose.model("Patient", patientSchema);

// Blockchain Setup
const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID");
const privateKey = "YOUR_PRIVATE_KEY";
const wallet = new ethers.Wallet(privateKey, provider);

const contractABI = require("./HealthCareABI.json");
const contractAddress = "YOUR_CONTRACT_ADDRESS";
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// Register Patient
app.post("/registerPatient", async (req, res) => {
    try {
        const { walletAddress, name, sex, dob, age, workPhone, doctorName, appointmentReason, emergencyContact, emergencyPhone } = req.body;

        // Register patient on blockchain
        const tx = await contract.registerPatient(name, sex, dob, age, workPhone, doctorName, appointmentReason, emergencyContact, emergencyPhone);
        await tx.wait();

        // Save in MongoDB
        const newPatient = new Patient({ walletAddress, sex, dob, age, workPhone, doctorName, appointmentReason, emergencyContact, emergencyPhone });
        await newPatient.save();

        res.json({ message: "Patient registered successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
