import { useParams } from "react-router-dom";
import ArticleForm from "@/components/admin/ArticleForm";

export default function ArticleEdit() {
  const { id } = useParams<{ id: string }>();
  
  return <ArticleForm articleId={id} mode="edit" />;
}
