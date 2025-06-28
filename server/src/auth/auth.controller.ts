import { Request, Response, NextFunction } from "express";
import { AuthService } from "../auth/auth.service";
import ApiError from "../errors/ApiError";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async register(req: Request, res: Response, next: NextFunction) {
    const { email, password, name } = req.body;

    try {
      const createdUser = await this.authService.registerUser(
        email,
        password,
        name
      );
      res.status(201).json({ user: createdUser });
    } catch (error: any) {
      const status = error instanceof ApiError ? error.statusCode : 500;
      res.status(status).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    try {
      const { token, user } = await this.authService.loginUser(email, password);
      res.status(200).json({ token, user });
    } catch (error: any) {
      const status = error instanceof ApiError ? error.statusCode : 500;
      res.status(status).json({ error: error.message });
    }
  }
}
