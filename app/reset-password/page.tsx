import { KeyRound, ShieldCheck } from "lucide-react";
import { routes, seoMetadata } from "@/lib/seo";

export const metadata = seoMetadata({
  title: "Reset Password | ShieldxSSL",
  description: "Request help resetting your ShieldxSSL customer portal password.",
  path: routes.resetPassword
});

export default function ResetPasswordPage() {
  return (
    <main className="auth-shell branded-auth">
      <section className="auth-visual-panel">
        <a className="brand" href={routes.home}><span className="brand-mark"><ShieldCheck size={22} /></span>ShieldxSSL</a>
        <div>
          <p className="eyebrow"><KeyRound size={16} /> Account recovery</p>
          <h1>Request a secure admin-assisted password reset.</h1>
          <p>We create an internal support request so admins can verify the account and safely update login details.</p>
        </div>
      </section>
      <section className="auth-form-panel">
        <div className="auth-card-modern">
          <p className="eyebrow dark">Password reset</p>
          <h1>Reset password</h1>
          <p>Submit your account details. The admin team will review the request and mark it resolved after updating your login.</p>
          <form className="form" action="/api/auth/reset-password" method="post">
            <div className="field">
              <label htmlFor="name">Name</label>
              <input className="input" id="name" name="name" autoComplete="name" required placeholder="Your name" />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input className="input" id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
            </div>
            <button className="button primary accent" type="submit">Request reset</button>
          </form>
          <div className="auth-links">
            <a href={routes.login}>Back to login</a>
          </div>
        </div>
      </section>
    </main>
  );
}
