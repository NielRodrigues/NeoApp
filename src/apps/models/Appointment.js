import Sequelize, { Model } from "sequelize";
import config from "../../config/database";

const sequelize = new Sequelize(config);

class Appointment extends Model {};

Appointment.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    patient_id: {
      type: Sequelize.INTEGER,
      references: { model: "patients", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      allowNull: false,
    },
    doctor_id: {
      type: Sequelize.INTEGER,
      references: { model: "doctors", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      allowNull: false,
    },
    description: Sequelize.TEXT,
    date: Sequelize.DATE,
  },
  {
    sequelize,
  }
);

export default Appointment;