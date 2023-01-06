import authenticationService, { SignInParams } from "@/services/authentication-service";
import { Request, Response } from "express";
import httpStatus from "http-status";
import axios from "axios";

export async function singInPost(req: Request, res: Response) {
  const { email, password } = req.body as SignInParams;

  try {
    const result = await authenticationService.signIn({ email, password });

    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).send({});
  }
}

export async function signInGithub(req: Request, res: Response) {
  const code = String(req.query.code);

  try {
    const token = await getAccessToken(code);

    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const user = userResponse.data;

    const result = await authenticationService.githubSignIn(user.email);

    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).send({});
  }
}

async function getAccessToken(code: string) {
  const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URL } = process.env;

  const body = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_url: REDIRECT_URL,
    code
  };

  const response = await axios.post("https://github.com/login/oauth/access_token", body);
  const token = response.data.access_token;

  return token;
}
