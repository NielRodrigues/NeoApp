import * as Yup from "yup";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Appointment from "../models/Appointment";
import Doctor from "../models/Doctor";
import Patient from "../models/Patient";
import { Op } from "sequelize";

const verifyAsync = promisify(jwt.verify);

class DoctorController {
  // Consultar todos os médicos
  async index(request, response) {
    const doctors = await Doctor.findAll({
      attributes: { exclude: ["password_hash", "createdAt", "updatedAt", "token"] },
      order: ["id"],
    });

    return response.status(200).json(doctors);
  }

  // Mostrar um médico em específico, junto com as suas consultas marcadas
  async show(request, response) {
    const { id } = request.params;
    const authHeader = request.headers.authorization;

    try{
      const decoded = await verifyAsync(authHeader, "fe67hzp5epvrde492d7jd4gv35kwv2sb")

      if (!id || !decoded || decoded.id != id) {
        return response.status(401).json({ error: "This token cannot access this doctor's route" })
      }
    } catch {
      return response.status(401).json({ error: "This token cannot access this doctor's route" })
    }

    const doctor = await Doctor.findByPk(id, {
      attributes: { exclude: ["password_hash", "createdAt", "updatedAt", "token"] },
      order: [[Appointment, "date", "ASC"]],
      include: [
        {
          model: Appointment,
          attributes: { exclude: ["createdAt", "updatedAt", "PatientId", "DoctorId", "doctor_id"] },
          where: {
            date: { [Op.gte]: `${new Date().getMonth()+1}-${new Date().getDate()}-${new Date().getFullYear()}`}
          }
        }
      ],
    });

    if (!doctor) {
      return response.status(404).json({ error: "Doctor not found "});
    }

    const appointments = [];
    const promiseAppointments = doctor.Appointments.map(async (appointment) => {
      const patient = await Patient.findByPk(appointment.patient_id);

      if (patient) {
        appointments.push({
          ...appointment.dataValues,
          patient_id: undefined,
          name: patient.name,
          tel: patient.tel,
        })
      }
    });

    await Promise.all(promiseAppointments);

    return response.status(200).json({
      ...doctor.dataValues,
      Appointments:  appointments
    });
  }

  // Criar um novo médico
  async create(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      tel: Yup.string().required(),
      password: Yup.string().min(8).required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Error on validate schema" });
    }

    const { email } = request.body; 

    const findPatient = await Patient.findOne({ where: { email }});
    const findDoctor = await Doctor.findOne({ where: { email }});

    if (findPatient || findDoctor) {
      return response.status(400).json({ error: "This email already has been sign up" });
    }

    const { id, name, tel } = await Doctor.create(request.body);

    return response.status(201).json({ id, name, email, tel });
  }

  // Atualizar dados do médico
  async update(request, response) {
    const { id } = request.params;
    const authHeader = request.headers.authorization;

    try{
      const decoded = await verifyAsync(authHeader, "fe67hzp5epvrde492d7jd4gv35kwv2sb")

      if (!id || !decoded || decoded.id != id) {
        return response.status(401).json({ error: "This token cannot access this doctor's route" })
      }
    } catch {
      return response.status(401).json({ error: "This token cannot access this doctor's route" })
    }

    const doctor = await Doctor.findByPk(id);

    if (!doctor) {
      return response.status(404).json({ error: "Doctor not found "});
    }

    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      tel: Yup.string(),
      password: Yup.string().min(8),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Error on validate schema" });
    }

    const { password, email } = request.body;
    const fields = { ...request.body };

    if (email) {
      const findPatient = await Patient.findOne({ where: { email }});
      const findDoctor = await Doctor.findOne({ where: { email }});

      if (findPatient || findDoctor) {
        return response.status(400).json({ error: "This email already has been sign up" });
      }
    }

    if (password) {
      fields.password_hash = await bcrypt.hash(password, 8);
    }

    await Doctor.update(fields, {
      where: {
        id,
      },
    });

    return response.status(200).json({ message: "This user has been updated" });
  }

  // Deletar um médico
  async delete(request, response) {
    const { id } = request.params;
    const authHeader = request.headers.authorization;

    try{
      const decoded = await verifyAsync(authHeader, "fe67hzp5epvrde492d7jd4gv35kwv2sb")

      if (!id || !decoded || decoded.id != id) {
        return response.status(401).json({ error: "This token cannot access this doctor's route" })
      }
    } catch {
      return response.status(401).json({ error: "This token cannot access this doctor's route" })
    }

    const doctor = await Doctor.findByPk(id);

    if (!doctor) {
      return response.status(404).json({ error: "Doctor not found "});
    }

    await Doctor.destroy({ where: { id } });

    return response.status(200).json({ message: "This user has been deleted" });
  }
}

export default new DoctorController();