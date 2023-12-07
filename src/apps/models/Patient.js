import Sequelize, { Model } from "sequelize";
import bcrypt from "bcryptjs";
import config from "../../config/database";
import Appointment from "./Appointment";

const sequelize = new Sequelize(config);

class Patient extends Model {};

Patient.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    tel: Sequelize.STRING,
    password: Sequelize.VIRTUAL,
    password_hash: Sequelize.STRING,
    token: Sequelize.STRING,
  },
  {
    sequelize,
  }
);

Patient.addHook("beforeSave", async (user) => {
  if (user.password) {
    user.password_hash = await bcrypt.hash(user.password, 8);
  }
});

Patient.hasMany(Appointment);
Appointment.belongsTo(Patient, { foreignKey: "patient_id" });

export default Patient;