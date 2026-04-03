import { Router } from "express";
import { validateBody } from "../middlewares/validationMiddleware.js";
import { register, login, authRegisterSchema, authLoginSchema } from "../controllers/authController.js";

const router = Router();

router.post("/register", validateBody(authRegisterSchema), register);

router.post("/login", validateBody(authLoginSchema), login);

// I check if the route is working or not 
router.get("/", (req, res) => {
  res.send("Auth route working");
});

export default router;

