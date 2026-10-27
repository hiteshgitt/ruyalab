import { createPostAction } from "@/cms/actions";
import { PostEditor } from "../PostEditor";

export default function NewPostPage() {
  return <PostEditor saveAction={createPostAction} />;
}
