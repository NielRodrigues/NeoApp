import * as Yup from "yup";
import bcrypt from "bcryptjs";
import Appointment from "../models/Appointment";
import Patient from "../models/Patient";
import Doctor from "../models/Doctor";
import { Op } from "sequelize";

class PatientController {
  // Consultar todos os pacientes
  async index(request, response) {
    const patients = await Patient.findAll({
      attributes: { exclude: ["password_hash", "createdAt", "updatedAt", "token"] },
      order: ["id"],
    });

    return response.status(200).json(patients);
  }

  // Mostrar um usuário em específico, junto com as suas consultas marcadas
  async show(request, response) {
    const { id } = request.params
    const patient = await Patient.findByPk(id, {
      attributes: { exclude: ["password_hash", "createdAt", "updatedAt", "token"] },
      order: [[Appointment, "date", "ASC"]],
      include: [
        {
          model: Appointment,
          attributes: { exclude: ["createdAt", "updatedAt", "PatientId", "DoctorId", "patient_id"] },
          where: {
            date: { [Op.gte]: `${new Date().getMonth()+1}-${new Date().getDate()}-${new Date().getFullYear()}`}
          }
        }
      ],
    });

    if (!patient) {
      return response.status(404).json({ error: "Patient not found "});
    }

    const appointments = [];
    const promiseAppointments = patient.Appointments.map(async (appointment) => {
      const doctor = await Doctor.findByPk(appointment.doctor_id);

      if (doctor) {
        appointments.push({
          ...appointment.dataValues,
          doctor_id: undefined,
          doctor: doctor.name,
        })
      }
    });

    await Promise.all(promiseAppointments);

    return response.status(200).json({
      ...patient.dataValues,
      Appointments:  appointments
    });
  }

  // Criar um novo paciente
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


    const { id, name, tel } = await Patient.create(request.body);

    return response.status(201).json({ id, name, email, tel });
  }

  // Atualizar dados do paciente
  async update(request, response) {
    const { id } = request.params;

    const patient = await Patient.findByPk(id);

    if (!patient) {
      return response.status(404).json({ error: "Patient not found "});
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

    await Patient.update(fields, {
      where: {
        id,
      },
    });

    return response.status(200).json({ message: "This user has been updated" });
  }

  // Deletar um paciente
  async delete(request, response) {
    const { id } = request.params;

    const patient = await Patient.findByPk(id);

    if (!patient) {
      return response.status(404).json({ error: "Patient not found "});
    }

    await Patient.destroy({ where: { id } });

    return response.status(200).json({ message: "This user has been deleted" });
  }
}

export default new PatientController();