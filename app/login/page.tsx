import { LockKeyhole, ShieldCheck } from "lucide-react";
import { routes, seoMetadata } from "@/lib/seo";

export const metadata = seoMetadata({
  title: "Log In | ShieldxSSL Customer Portal",
  description: "Log in to manage SSL certificate orders, validation details, downloads, reissues, and support tickets.",
  path: routes.login
});

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <main className="auth-shell branded-auth">
      <section className="auth-visual-panel">
        <a className="brand" href={routes.home}><span className="brand-mark"><ShieldCheck size={22} /></span>ShieldxSSL</a>
        <div>
          <p className="eyebrow"><LockKeyhole size={16} /> Secure customer access</p>
          <h1>Manage SSL orders, validation, and support from one portal.</h1>
          <p>Track certificate status, submit CSR details, request reissues, and contact SSL specialists.</p>
        </div>
        <div className="auth-proof">
          <span><strong>99.9%</strong><small>browser trust</small></span>
          <span><strong>24/7</strong><small>ticket intake</small></span>
        </div>
      </section>
      <section className="auth-form-panel">
        <div className="auth-card-modern">
          <p className="eyebrow dark">Customer portal</p>
          <h1>Log in</h1>
          <p>Access orders, certificates, validation details, and support tickets.</p>
          {searchParams.error && <p className="form-error">{searchParams.error}</p>}
          <form className="form" action="/api/auth/login" method="post">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input className="input" id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input className="input" id="password" name="password" type="password" autoComplete="current-password" required placeholder="Your password" />
            </div>
            <button className="button primary accent" type="submit">Log in</button>
          </form>
          <div className="auth-links">
            <a href={routes.resetPassword}>Reset password</a>
            <a href={routes.register}>Create account</a>
          </div>
        </div>
      </section>
    </main>
  );
}
