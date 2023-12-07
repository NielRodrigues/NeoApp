import * as Yup from "yup";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Patient from "../models/Patient";
import Doctor from "../models/Doctor";

class LoginController {
  async create(request, response) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    const { email, password } = request.body; 

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Error on validate schema" });
    }

    const patient = await Patient.findOne({ where: { email }});

    if (patient) {
      if (password && await (bcrypt.compare(password, patient.password_hash))) {
        return response.status(200).json({
          email: patient.email,
          access: {
            token: jwt.sign({ id: doctor.id }, "y8rbmhfeyvgkywpc1uqrwh4p57hxmls4", {
              expiresIn: "7d",
            })
          },
        })
      }

      return response.status(401).json({ error: "Password wrong"});
    }


    const doctor = await Doctor.findOne({ where: { email }});

    if (doctor) {
      if (password && await (bcrypt.compare(password, doctor.password_hash))) {
        return response.status(200).json({
          email: doctor.email,
          access: {
            token: jwt.sign({ id: doctor.id }, "y8rbmhfeyvgkywpc1uqrwh4p57hxmls4", {
              expiresIn: "7d",
            })
          },
        })
      }

      return response.status(401).json({ error: "Password wrong"});
    }

    return response.status(404).json({ error: "This email don't sing up"});
  }
}

export default new LoginController();