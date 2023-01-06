import { signInGithub, singInPost } from "@/controllers";
import { validateBody } from "@/middlewares";
import { signInSchema } from "@/schemas";
import { Router } from "express";

const authenticationRouter = Router();

authenticationRouter
  .post("/sign-in", validateBody(signInSchema), singInPost)
  .post("/sign-in/github", signInGithub);

export { authenticationRouter };
