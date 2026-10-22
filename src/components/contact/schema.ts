/** Shared contact-form contract, used by both the client form and the server action. */

export const PROJECT_TYPES = [
  "Digital experience",
  "Product engineering",
  "AI & intelligent product",
  "Creative development",
  "Content & CMS platform",
  "Not sure yet",
] as const;

export type ContactFields = {
  name: string;
  email: string;
  company: string;
  projectType: string;
  message: string;
};

export type FieldErrors = Partial<Record<keyof ContactFields, string>>;

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: FieldErrors;
  /** Echo submitted values so a no-JS round trip doesn't lose input. */
  values?: Partial<ContactFields>;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function readFields(data: FormData): ContactFields {
  const get = (k: string) => String(data.get(k) ?? "").trim();
  return {
    name: get("name"),
    email: get("email"),
    company: get("company"),
    projectType: get("projectType"),
    message: get("message"),
  };
}

export function validate(f: ContactFields): FieldErrors {
  const errors: FieldErrors = {};
  if (f.name.length < 2) errors.name = "Please tell us your name.";
  else if (f.name.length > 120) errors.name = "That name is a little long — 120 characters max.";
  if (!EMAIL.test(f.email)) errors.email = "Please enter a valid email address, like name@company.com.";
  if (f.company.length > 160) errors.company = "160 characters max.";
  if (f.projectType && !PROJECT_TYPES.includes(f.projectType as (typeof PROJECT_TYPES)[number])) {
    errors.projectType = "Please choose an option from the list.";
  }
  if (f.message.length < 20) errors.message = "A few more details help — at least 20 characters.";
  else if (f.message.length > 5000) errors.message = "Please keep it under 5,000 characters.";
  return errors;
}
