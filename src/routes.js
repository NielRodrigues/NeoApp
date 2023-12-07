import { Router } from "express";

import patient from "./apps/controllers/PatientController"
import doctor from "./apps/controllers/DoctorController"
import appointment from "./apps/controllers/AppoinmentController"
import login from "./apps/controllers/LoginController"

const routes = new Router();

// Login

routes.post("/login", login.create);

// Pacientes

routes.get("/patients", patient.index);
routes.get("/patients/:id", patient.show);
routes.post("/register_patients", patient.create);
routes.put("/patients/:id", patient.update);
routes.delete("/patients/:id", patient.delete);


// Médicos

routes.get("/doctors", doctor.index);
routes.get("/doctors/:id", doctor.show);
routes.post("/register_doctors", doctor.create);
routes.put("/doctors/:id", doctor.update);
routes.delete("/doctors/:id", doctor.delete);


// Consultas

routes.get("/appointments", appointment.index);
routes.get("/appointments/:id", appointment.show);
routes.post("/appointments", appointment.create);
routes.put("/appointments/:id", appointment.update);
routes.delete("/appointments/:id", appointment.delete);

export default routes;