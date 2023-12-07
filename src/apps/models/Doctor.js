import Sequelize, { Model } from "sequelize";
import bcrypt from "bcryptjs";
import config from "../../config/database";
import Appointment from "./Appointment";

const sequelize = new Sequelize(config);

class Doctor extends Model {};

Doctor.init(
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

Doctor.addHook("beforeSave", async (user) => {
  if (user.password) {
    user.password_hash = await bcrypt.hash(user.password, 8);
  }
});

Doctor.hasMany(Appointment);
Appointment.belongsTo(Doctor, { foreignKey: "doctor_id" });

export default Doctor;