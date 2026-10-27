"use server";

import { redirect } from "next/navigation";
import {
  clearSessionCookie,
  cmsConfigured,
  isCmsAuthed,
  requireCmsAuth,
  setSessionCookie,
  verifyPassword,
} from "./auth";
import {
  createPost,
  deletePost,
  getPostById,
  listPosts,
  setCmsSocials,
  updatePost,
  getCmsSocials,
  cmsStorageMode,
  listEnquiries,
  updateEnquiry,
} from "./db";
import { deleteMedia, listMedia, updateMediaAlt } from "./media";
import type { EnquiryStage, PostInput, SocialLink } from "./types";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function loginAction(formData: FormData): Promise<ActionResult> {
  if (!cmsConfigured()) {
    return { ok: false, error: "CMS env is not configured. Set CMS_ADMIN_PASSWORD and CMS_SESSION_SECRET." };
  }
  const password = String(formData.get("password") || "");
  if (!verifyPassword(password)) {
    return { ok: false, error: "Wrong password." };
  }
  await setSessionCookie();
  redirect("/ruyashield");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/ruyashield/login");
}

async function savePost(id: string | null, formData: FormData): Promise<ActionResult> {
  try {
    await requireCmsAuth();
    const input: PostInput = {
      title: String(formData.get("title") || ""),
      slug: String(formData.get("slug") || ""),
      excerpt: String(formData.get("excerpt") || ""),
      body: String(formData.get("body") || ""),
      status: String(formData.get("status") || "draft") === "published" ? "published" : "draft",
    };
    if (id) await updatePost(id, input);
    else await createPost(input);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not save." };
  }
  redirect("/ruyashield/posts");
}

/** Pass directly to client forms — do not wrap in inline arrows. */
export async function createPostAction(formData: FormData): Promise<ActionResult> {
  return savePost(null, formData);
}

export async function updatePostAction(id: string, formData: FormData): Promise<ActionResult> {
  return savePost(id, formData);
}

export async function deletePostAction(id: string): Promise<ActionResult> {
  try {
    await requireCmsAuth();
    await deletePost(id);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not delete." };
  }
  redirect("/ruyashield/posts");
}

export async function saveSocialAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireCmsAuth();
    const labels = formData.getAll("label").map(String);
    const hrefs = formData.getAll("href").map(String);
    const links: SocialLink[] = labels.map((label, i) => ({ label, href: hrefs[i] || "" }));
    await setCmsSocials(links.filter((l) => l.label || l.href));
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not save social links." };
  }
  return { ok: true };
}

export async function loadAdminPosts() {
  if (!(await isCmsAuthed())) redirect("/ruyashield/login");
  return listPosts({ status: "all" });
}

export async function loadAdminPost(id: string) {
  if (!(await isCmsAuthed())) redirect("/ruyashield/login");
  return getPostById(id);
}

export async function loadAdminSocials() {
  if (!(await isCmsAuthed())) redirect("/ruyashield/login");
  return getCmsSocials();
}

export async function loadAdminMeta() {
  if (!(await isCmsAuthed())) redirect("/ruyashield/login");
  return { storage: await cmsStorageMode(), configured: cmsConfigured() };
}

export async function loadAdminEnquiries() {
  if (!(await isCmsAuthed())) redirect("/ruyashield/login");
  return listEnquiries();
}

export async function updateEnquiryAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireCmsAuth();
    const id = String(formData.get("id") || "");
    if (!id) throw new Error("Missing enquiry id.");
    await updateEnquiry(id, {
      stage: String(formData.get("stage") || "New") as EnquiryStage,
      icpFit: String(formData.get("icpFit") || ""),
      notes: String(formData.get("notes") || ""),
      source: String(formData.get("source") || ""),
    });
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not update enquiry." };
  }
  return { ok: true };
}

export async function loadAdminMedia() {
  if (!(await isCmsAuthed())) redirect("/ruyashield/login");
  return listMedia();
}

export async function deleteMediaAction(id: string): Promise<ActionResult> {
  try {
    await requireCmsAuth();
    await deleteMedia(id);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not delete media." };
  }
  return { ok: true };
}

export async function updateMediaAltAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireCmsAuth();
    const id = String(formData.get("id") || "");
    if (!id) throw new Error("Missing media id.");
    await updateMediaAlt(id, String(formData.get("alt") || ""));
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not update alt text." };
  }
  return { ok: true };
}
