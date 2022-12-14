import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

// const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS,{
//   host: process.env.DB_HOST,
//   dialect: process.env.DB_DIALECT,
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false
//     }
//   }
// });

const db = new Sequelize(process.env.DB_URI, {
  define: {
    timestamps: false
  }
})

export default db