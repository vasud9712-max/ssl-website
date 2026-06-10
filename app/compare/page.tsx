import { redirect } from "next/navigation";
import { routes } from "@/lib/seo";

export default function CompareRedirectPage() {
  redirect(routes.compareSslCertificates);
}
