import { notFound } from "next/navigation";
import { deletePostAction, loadAdminPost, updatePostAction } from "@/cms/actions";
import { PostEditor } from "../PostEditor";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await loadAdminPost(id);
  if (!post) notFound();

  const saveAction = updatePostAction.bind(null, post.id);
  const removeAction = deletePostAction.bind(null, post.id);

  return <PostEditor post={post} saveAction={saveAction} deleteAction={removeAction} />;
}
