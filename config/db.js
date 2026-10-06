const mongoose = require("mongoose");

const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)

        console.log("MongoDB ga ulandi ")
    } catch (error) {
        console.error("MongoDb ulanishda xatolik:", error.message);
        process.exit(1);
    }
}

module.exports = connectDB;;