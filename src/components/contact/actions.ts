"use server";

import { deliverContact } from "./deliver";
import type { ContactState } from "./schema";

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  return deliverContact(formData);
}
