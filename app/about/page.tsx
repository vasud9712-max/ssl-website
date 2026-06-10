import { redirect } from "next/navigation";
import { routes } from "@/lib/seo";

export default function AboutRedirectPage() {
  redirect(routes.aboutUs);
}
