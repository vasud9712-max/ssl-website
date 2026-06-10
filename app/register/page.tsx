import { ShieldCheck, UserPlus } from "lucide-react";
import { routes, seoMetadata } from "@/lib/seo";

export const metadata = seoMetadata({
  title: "Create Account | ShieldxSSL",
  description: "Create a ShieldxSSL account to order SSL certificates, track validation, request reissues, and open support tickets.",
  path: routes.register
});

export default function RegisterPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <main className="auth-shell branded-auth">
      <section className="auth-visual-panel">
        <a className="brand" href={routes.home}><span className="brand-mark"><ShieldCheck size={22} /></span>ShieldxSSL</a>
        <div>
          <p className="eyebrow"><UserPlus size={16} /> Create your SSL portal</p>
          <h1>Start ordering and managing SSL certificates with confidence.</h1>
          <p>Your account keeps orders, CSR updates, validation progress, and support requests organized.</p>
        </div>
        <div className="auth-proof">
          <span><strong>Fast</strong><small>guided checkout</small></span>
          <span><strong>Secure</strong><small>portal access</small></span>
        </div>
      </section>
      <section className="auth-form-panel">
        <div className="auth-card-modern">
          <p className="eyebrow dark">Create account</p>
          <h1>Start managing SSL</h1>
          <p>Use your account to place orders, submit CSR details, request reissues, and open support tickets.</p>
          {searchParams.error && <p className="form-error">{searchParams.error}</p>}
          <form className="form" action="/api/auth/register" method="post">
            <div className="grid two">
              <div className="field">
                <label htmlFor="name">Name</label>
                <input className="input" id="name" name="name" autoComplete="name" required placeholder="Your name" />
              </div>
              <div className="field">
                <label htmlFor="company">Company</label>
                <input className="input" id="company" name="company" autoComplete="organization" placeholder="Company name" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input className="input" id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input className="input" id="password" name="password" type="password" autoComplete="new-password" minLength={10} required placeholder="At least 10 characters" />
              <span className="field-hint">Use at least 10 characters for better account security.</span>
            </div>
            <button className="button primary accent" type="submit">Create account</button>
          </form>
          <div className="auth-links">
            <a href={routes.login}>Already have an account?</a>
          </div>
        </div>
      </section>
    </main>
  );
}
