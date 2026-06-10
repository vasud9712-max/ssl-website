import { redirect } from "next/navigation";
import { productUrl } from "@/lib/seo";

export default function ProductRedirectPage({ params }: { params: { slug: string } }) {
  redirect(productUrl(params.slug));
}
