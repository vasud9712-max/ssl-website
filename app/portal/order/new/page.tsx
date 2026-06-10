import { redirect } from "next/navigation";
import { orderUrl } from "@/lib/seo";

export default function PortalOrderRedirectPage({ searchParams }: { searchParams: { product?: string; error?: string } }) {
  const query = new URLSearchParams();
  if (searchParams.product) query.set("product", searchParams.product);
  if (searchParams.error) query.set("error", searchParams.error);
  redirect(`${orderUrl()}${query.toString() ? `?${query.toString()}` : ""}`);
}
