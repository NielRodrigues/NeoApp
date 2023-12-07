import * as Yup from "yup";
import Appointment from "../models/Appointment";
import Patient from "../models/Patient";
import Doctor from "../models/Doctor";
import { Op } from "sequelize";

class AppointmentController {
  async index(request, response) {
    const appointments = await Appointment.findAll({
      order: ["id"]
    });

    return response.status(200).json(appointments);
  }

  async show(request, response) {
    const { id } = request.params;
    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return response.status(404).json({ error: "Appointment not found" })
    }

    return response.status(200).json(appointment);
  }

  async create(request, response) {
    const schema = Yup.object().shape({
      patient_id: Yup.number().required(),
      doctor_id: Yup.number().required(),
      description: Yup.string().required(),
      date: Yup.string().required(),
      hour: Yup.number().required(),
      minutes: Yup.number().required(),
    });
    
    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Error on validate schema" });
    }

    const { patient_id, doctor_id, date, hour, minutes } = request.body;

    // Verificando se o ID de médico e paciente existe no banco de dados
    
    const patient = await Patient.findByPk(patient_id);
    if (!patient) {
      return response.status(404).json({ error: "Patient not found "});
    }

    const doctor = await Doctor.findByPk(doctor_id);
    if (!doctor) {
      return response.status(404).json({ error: "Doctor not found "});
    }

    try {
      /*
       * VERIFICANDO SE O HORÁRIO JÁ ESTÁ RESERVADO
       */
      const findAppointment = await Appointment.findOne({
        where: {
          patient_id,
          doctor_id,
          date: { [Op.eq]: `${date} ${hour}:${minutes} -03:00`}
        }
      });

      if (findAppointment) {
        return response.status(400).json({ error: "This time is already booked" });
      }

      try {
        // Criando consulta e marcando hora no horário de Brasília
        const appointment = await Appointment.create({
          ...request.body,
          date: `${date} ${hour}:${minutes} -03:00`
        });
  
        return response.status(201).json(appointment);
  
      } catch (error) {
        // Se a data estiver errada retornará um erro
        return response.status(400).json({ error: error?.parent?.routine ? error?.parent?.routine : error });
      }


    } catch (error) {
      return response.status(400).json({ error: error?.parent?.routine ? error?.parent?.routine : error });
    }
  }

  async update(request, response) {
    const { id } = request.params;

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return response.status(404).json({ error: "Appointment not found" });
    }
    
    const schema = Yup.object().shape({
      patient_id: Yup.number(),
      doctor_id: Yup.number(),
      description: Yup.string(),
      date: Yup.string(),
    });

    
    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Error on validate schema" });
    }

    const { patient_id, doctor_id } = request.body;
    
    if (patient_id) {
      const patient = await Patient.findByPk(patient_id);
      if (!patient) {
        return response.status(404).json({ error: "Patient not found "});
      }
    }

    if (doctor_id) {
      const doctor = await Doctor.findByPk(doctor_id);
      if (!doctor) {
        return response.status(404).json({ error: "Doctor not found "});
      }
    }

    await Appointment.update(request.body, {
      where: {
        id,
      },
    });

    return response.status(200).json({ message: "Appoiment has been updated"});
  }

  async delete(request, response) {
    const { id } = request.params;

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return response.status(404).json({ error: "Appointment not found "});
    }
    
    await Appointment.destroy({ where: { id } });

    return response.status(200).json({ message: "Appoiment has been deleted"});
  }
}

export default new AppointmentController();