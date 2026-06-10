"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Clock, FileText, Globe2, Info, Mail, ShieldCheck, UserPlus } from "lucide-react";
import { dollars } from "@/lib/orders";

type WizardProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  domainsCovered: string;
  additionalSanPrice: number;
};

type Errors = Partial<Record<"product" | "domain" | "email" | "sans" | "validation" | "confirm" | "account" | "password", string>>;

const validationOptions = [
  { value: "EMAIL", title: "Email Validation", body: "Receive a validation email at admin@yourdomain.com or another approved address.", meta: "5-10 minutes", difficulty: "Easy", icon: Mail },
  { value: "DNS", title: "DNS Validation", body: "Add a TXT record to your domain DNS settings for verification.", meta: "10-30 minutes", difficulty: "Medium", icon: Globe2 },
  { value: "FILE", title: "File Upload Validation", body: "Upload a verification file to your website root directory.", meta: "5-15 minutes", difficulty: "Medium", icon: FileText }
] as const;

const domainPattern = /^(?!-)(?:[a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function splitLines(value: string) {
  return value.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
}

function newOrderToken() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function OrderWizard({
  products,
  selectedSlug,
  userEmail,
  isAuthenticated
}: {
  products: WizardProduct[];
  selectedSlug?: string;
  userEmail: string;
  isAuthenticated: boolean;
}) {
  const initial = products.find((product) => product.slug === selectedSlug) || products[0];
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(1);
  const [productId, setProductId] = useState(initial?.id || "");
  const [domain, setDomain] = useState("");
  const [contactEmail, setContactEmail] = useState(userEmail);
  const [csr, setCsr] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [sanEntries, setSanEntries] = useState("");
  const [validationMethod, setValidationMethod] = useState<"EMAIL" | "DNS" | "FILE">("DNS");
  const [confirmReview, setConfirmReview] = useState(false);
  const [accountMode, setAccountMode] = useState<"create" | "login">("create");
  const [accountName, setAccountName] = useState("");
  const [accountEmail, setAccountEmail] = useState(userEmail);
  const [accountPassword, setAccountPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [orderToken] = useState(newOrderToken);

  const selected = useMemo(() => products.find((product) => product.id === productId) || products[0], [productId, products]);
  const isMultiDomain = selected?.slug.includes("multi");
  const sanList = splitLines(sanEntries);
  const domains = isMultiDomain && sanList.length ? sanEntries : domain;
  const subtotal = selected?.price || 0;
  const validationLabel = validationOptions.find((option) => option.value === validationMethod)?.title || "DNS Validation";
  const authEmail = accountEmail || contactEmail;

  function validate(targetStep = step) {
    const nextErrors: Errors = {};
    if (!selected?.id) nextErrors.product = "Select an SSL certificate plan.";
    if (targetStep >= 2) {
      if (!domain.trim()) nextErrors.domain = "Enter the primary domain name.";
      else if (!domainPattern.test(domain.trim())) nextErrors.domain = "Enter a valid domain such as example.com.";
      if (!contactEmail.trim()) nextErrors.email = "Enter the certificate contact email.";
      else if (!emailPattern.test(contactEmail.trim())) nextErrors.email = "Enter a valid contact email address.";
      if (isMultiDomain) {
        if (sanList.length < 1) nextErrors.sans = "Enter at least one hostname for Multi-Domain SSL.";
        else if (sanList.length > 2) nextErrors.sans = "Enter up to 2 SAN domains during checkout. Support can help add more later.";
        else if (sanList.some((entry) => !domainPattern.test(entry))) nextErrors.sans = "Every SAN entry must be a valid hostname.";
      }
    }
    if (targetStep >= 3 && !validationMethod) nextErrors.validation = "Choose a validation method.";
    if (targetStep >= 4) {
      if (!confirmReview) nextErrors.confirm = "Confirm that you reviewed the order details.";
      if (!isAuthenticated) {
        if (!authEmail.trim() || !emailPattern.test(authEmail.trim())) nextErrors.account = "Enter a valid account email.";
        if (accountMode === "create" && !accountName.trim()) nextErrors.account = "Enter your name to create an account.";
        if (accountPassword.length < (accountMode === "create" ? 10 : 1)) {
          nextErrors.password = accountMode === "create" ? "Use a password with at least 10 characters." : "Enter your password.";
        }
      }
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function next() {
    if (validate(step)) setStep((value) => Math.min(4, value + 1));
  }

  function back() {
    setErrors({});
    setStep((value) => Math.max(1, value - 1));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    if (!validate(4)) {
      event.preventDefault();
      return;
    }
    if (submitting) {
      event.preventDefault();
      return;
    }
    setSubmitting(true);
  }

  return (
    <div className="order-shell">
      <div className="order-title">
        <h1>Order SSL Certificate</h1>
        <p>Complete the order as a guest, then create an account or log in at review before submitting.</p>
      </div>

      <div className="stepper">
        {["Select Plan", "Domain Details", "Validation", "Review & Account"].map((label, index) => {
          const number = index + 1;
          return (
            <div className={`step ${step >= number ? "active" : ""}`} key={label}>
              <span>{number}</span>
              <strong>{label}</strong>
            </div>
          );
        })}
      </div>

      <form ref={formRef} action="/api/orders" method="post" onSubmit={submit} noValidate>
        <input type="hidden" name="orderToken" value={orderToken} />
        <input type="hidden" name="productId" value={productId} />
        <input type="hidden" name="primaryDomain" value={domain.trim()} />
        <input type="hidden" name="domains" value={(domains || domain).trim()} />
        <input type="hidden" name="sanEntries" value={isMultiDomain ? sanEntries : ""} />
        <input type="hidden" name="csr" value={csr} />
        <input type="hidden" name="validationMethod" value={validationMethod} />
        <input type="hidden" name="organizationName" value={(organizationName || contactEmail).trim()} />
        <input type="hidden" name="contactEmail" value={contactEmail.trim()} />
        <input type="hidden" name="accountMode" value={isAuthenticated ? "session" : accountMode} />
        <input type="hidden" name="accountName" value={accountName.trim() || organizationName.trim()} />
        <input type="hidden" name="accountEmail" value={authEmail.trim()} />
        <input type="hidden" name="accountPassword" value={accountPassword} />

        <div className="order-grid">
          <section className="order-panel">
            {step === 1 && (
              <>
                <h2>Select Your SSL Certificate</h2>
                {errors.product && <p className="field-error">{errors.product}</p>}
                <div className="plan-picker">
                  {products.map((product, index) => {
                    const active = product.id === productId;
                    const features = product.slug.includes("wildcard")
                      ? ["Unlimited subdomains", "256-bit encryption", "99.9% Browser compatibility", "Priority support", "Free reissues"]
                      : product.slug.includes("multi")
                        ? ["Protects up to 3 domains", "SAN support", "99.9% Browser compatibility", "Dedicated support", "Free reissues"]
                        : ["Secures one domain", "256-bit encryption", "99.9% Browser compatibility", "24/7 support", "Fast issuance"];
                    return (
                      <button className={`plan-option ${active ? "active" : ""}`} type="button" key={product.id} onClick={() => setProductId(product.id)}>
                        {index === 1 && <span className="recommended">Recommended</span>}
                        <span className="plan-check">{active && <Check size={16} />}</span>
                        <h3>{product.name}</h3>
                        <p>{product.domainsCovered}</p>
                        <strong className="order-price">{dollars(product.price)}<small>/year</small></strong>
                        <ul>{features.map((feature) => <li key={feature}><Check size={15} />{feature}</li>)}</ul>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2>Domain & Contact Information</h2>
                <div className="notice"><Info size={18} /><span><strong>Required Information</strong><br />Domain name and contact email are required for certificate issuance and validation.</span></div>
                <div className="form">
                  <div className="field"><label>Domain Name *</label><input className="input" value={domain} onChange={(event) => setDomain(event.target.value)} placeholder="example.com" />{errors.domain && <span className="field-error">{errors.domain}</span>}</div>
                  <div className="field"><label>Contact Email *</label><input className="input" type="email" value={contactEmail} onChange={(event) => { setContactEmail(event.target.value); if (!accountEmail) setAccountEmail(event.target.value); }} placeholder="admin@example.com" />{errors.email && <span className="field-error">{errors.email}</span>}</div>
                  <div className="field"><label>Organization Name</label><input className="input" value={organizationName} onChange={(event) => setOrganizationName(event.target.value)} placeholder="Your business or personal name" /></div>
                  {isMultiDomain && <div className="field"><label>Multi-Domain SAN Entries * <span className="muted">(up to 2)</span></label><textarea className="textarea" value={sanEntries} onChange={(event) => setSanEntries(event.target.value)} placeholder="www.example.com&#10;www.alex.com" />{errors.sans && <span className="field-error">{errors.sans}</span>}</div>}
                  <div className="notice"><Info size={18} /><span><strong>Domain Ownership Verification</strong><br />You will verify ownership through email, DNS, or file upload after submission.</span></div>
                  <details open className="csr-box">
                    <summary>Have a CSR? <span>(Optional)</span></summary>
                    <textarea className="textarea" value={csr} onChange={(event) => setCsr(event.target.value)} placeholder="-----BEGIN CERTIFICATE REQUEST-----" />
                    <p>If you do not have a CSR yet, you can generate one later or let support help during issuance.</p>
                  </details>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2>Choose Validation Method</h2>
                <p>Select how you would like to verify domain ownership. DNS validation is recommended for most hosted sites.</p>
                {errors.validation && <p className="field-error">{errors.validation}</p>}
                <div className="validation-list">
                  {validationOptions.map((option) => {
                    const Icon = option.icon;
                    const active = validationMethod === option.value;
                    return (
                      <button className={`validation-option ${active ? "active" : ""}`} type="button" key={option.value} onClick={() => setValidationMethod(option.value)}>
                        <span className="validation-icon"><Icon size={24} /></span>
                        <span><strong>{option.title}</strong><small>{option.body}</small><em><Clock size={14} /> {option.meta} · {option.difficulty}</em></span>
                        {active && <Check size={18} />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <h2>Review Your Order</h2>
                <div className="review-box">
                  <h3>Certificate Details</h3>
                  <div><span>Plan:</span><strong>{selected?.name}</strong></div>
                  <div><span>Domain:</span><strong>{domain || "Not supplied"}</strong></div>
                  <div><span>Contact:</span><strong>{contactEmail || "Not supplied"}</strong></div>
                  <div><span>Organization:</span><strong>{organizationName || "Not supplied"}</strong></div>
                  <div><span>Validation:</span><strong>{validationLabel}</strong></div>
                </div>
                <label className="review-confirm">
                  <input type="checkbox" checked={confirmReview} onChange={(event) => setConfirmReview(event.target.checked)} />
                  I confirm the SSL plan, domain, contact email, validation method, and manual PayPal payment details are correct.
                </label>
                {errors.confirm && <p className="field-error">{errors.confirm}</p>}
                {!isAuthenticated ? (
                  <div className="account-gate">
                    <div className="notice"><UserPlus size={18} /><span><strong>Create an account or log in to submit</strong><br />Your SSL order will be created only after account verification at this final step.</span></div>
                    <div className="segmented">
                      <button type="button" className={accountMode === "create" ? "active" : ""} onClick={() => setAccountMode("create")}>Create Account</button>
                      <button type="button" className={accountMode === "login" ? "active" : ""} onClick={() => setAccountMode("login")}>Log In</button>
                    </div>
                    {accountMode === "create" && <div className="field"><label>Name *</label><input className="input" value={accountName} onChange={(event) => setAccountName(event.target.value)} placeholder="Your name" /></div>}
                    <div className="field"><label>Email *</label><input className="input" type="email" value={accountEmail || contactEmail} onChange={(event) => setAccountEmail(event.target.value)} placeholder="you@example.com" /></div>
                    <div className="field"><label>Password *</label><input className="input" type="password" value={accountPassword} onChange={(event) => setAccountPassword(event.target.value)} placeholder={accountMode === "create" ? "At least 10 characters" : "Your password"} /></div>
                    {errors.account && <p className="field-error">{errors.account}</p>}
                    {errors.password && <p className="field-error">{errors.password}</p>}
                  </div>
                ) : (
                  <div className="notice"><ShieldCheck size={18} /><span><strong>Account confirmed</strong><br />You are logged in.</span></div>
                )}
              </>
            )}
          </section>

          <aside className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-row"><span><strong>{selected?.name}</strong><br /><small>1 Year Certificate</small></span><strong>{dollars(subtotal)}</strong></div>
            <div className="summary-row"><span>Domain<br /><strong>{domain || "Not selected"}</strong></span></div>
            <div className="summary-row"><span>Validation Method<br /><strong>{validationLabel}</strong></span></div>
            <div className="summary-row"><span>Subtotal</span><strong>{dollars(subtotal)}</strong></div>
            <div className="summary-total"><span>Total</span><strong>{dollars(subtotal)}</strong></div>
            <p>Payment is handled manually by PayPal after order submission.</p>
          </aside>
        </div>

        <div className="wizard-actions">
          <button className="button secondary" type="button" onClick={back} disabled={step === 1 || submitting}><ChevronLeft size={18} />Back</button>
          {step < 4 ? (
            <button className="button primary" type="button" onClick={next} disabled={submitting}>Continue <ChevronRight size={18} /></button>
          ) : (
            <button className="button primary accent" type="submit" disabled={submitting}><ShieldCheck size={18} />{submitting ? "Creating Order..." : "Complete Order"}</button>
          )}
        </div>
      </form>
    </div>
  );
}
