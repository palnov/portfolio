"use server";

import { LeadData } from "@/lib/types";
import { submitLeadToCrm } from "@/lib/yandex";

export async function handleLeadAction(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const service = formData.get("service") as string;
  const date = formData.get("date") as string;
  const message = formData.get("message") as string;

  if (!name || !phone || !service) {
    return { success: false, error: "Пожалуйста, заполните все обязательные поля." };
  }

  const result = await submitLeadToCrm({
    name,
    phone,
    service,
    date: date || "Не указана",
    message: message || ""
  });

  if (result.success) {
    return { success: true, message: result.message };
  } else {
    return { success: false, error: result.message };
  }
}
