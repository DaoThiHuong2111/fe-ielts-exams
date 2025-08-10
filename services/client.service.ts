// services/auth.service.ts

import { clientService } from "@/lib/axios";
import { parseAxiosError } from "@/lib/errorHandler";
import axios from "axios";

export async function login(email: string, password: string): Promise<any> {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`, { username: email, password });
    return res?.data?.data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export async function logout(): Promise<any> {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/logout`); // nếu có
    return true;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export async function getMe(): Promise<any> {
  try {
    const dataRes = await clientService.get('/v1/users/me'); // nếu có
    return dataRes?.data?.data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
