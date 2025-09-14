'use client';


import React, { useState, useTransition } from 'react';



let PRICE_USD = 9; // Constant pricing
const PLAN_ID = 'basic-monthly';
const CURRENCY = 'USD';

type PaymentMethod = 'card' | 'paypal' | 'bank';

export default function PaymentsPage() {
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
    const [email, setEmail] = useState('');
    const [processing, startTransition] = useTransition();
    const [message, setMessage] = useState<string | null>(null);

    const submitPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        startTransition(async () => {
            try {
                // Placeholder: call your backend to create a subscription / payment intent
                const res = await fetch('/api/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        planId: PLAN_ID,
                        amount: PRICE_USD,
                        currency: CURRENCY,
                        paymentMethod,
                        email,
                    }),
                });
                if (!res.ok) throw new Error('Failed to start payment');
                const data = await res.json();
                // If using something like Stripe, redirect to checkout: window.location.href = data.url
                setMessage(`Subscription initialized. Reference: ${data.reference || 'N/A'}`);
            } catch (err: any) {
                setMessage(err.message || 'Error creating subscription');
            }
        });
    };

    return (
        <div style={styles.wrap}>
            <h1 style={styles.h1}>Subscribe</h1>
            <div style={styles.card}>
                <div style={styles.priceBlock}>
                    <span style={styles.amount}>${PRICE_USD}</span>
                    <span style={styles.period}> / month</span>
                </div>
                <p style={styles.desc}>Access the Basic Monthly Subscription.</p>
                <ul style={styles.list}>
                    <li>Full feature access</li>
                    <li>Cancel anytime</li>
                    <li>Email support</li>
                </ul>
                <form onSubmit={submitPayment} style={styles.form}>
                    <label style={styles.label}>
                        Email
                        <input
                            required
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            style={styles.input}
                            placeholder="you@example.com"
                        />
                    </label>

                    <fieldset style={styles.fieldset}>
                        <legend style={styles.legend}>Subscription Plan</legend>
                        <div style={styles.planBox}>
                            <input
                                type="radio"
                                id="plan-basic"
                                name="plan"
                                value={PLAN_ID}
                                defaultChecked
                                readOnly
                            />
                            <label htmlFor="plan-basic" style={styles.planLabel}>
                                Basic Monthly (${PRICE_USD}/mo)
                            </label>
                        </div>
                    </fieldset>

                    <fieldset style={styles.fieldset}>
                        <legend style={styles.legend}>Payment Method</legend>
                        <div style={styles.methods}>
                            <label style={styles.method}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="card"
                                    checked={paymentMethod === 'card'}
                                    onChange={() => setPaymentMethod('card')}
                                />
                                <span>Credit / Debit Card</span>
                            </label>
                            <label style={styles.method}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="paypal"
                                    checked={paymentMethod === 'paypal'}
                                    onChange={() => setPaymentMethod('paypal')}
                                />
                                <span>PayPal</span>
                            </label>
                            <label style={styles.method}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="bank"
                                    checked={paymentMethod === 'bank'}
                                    onChange={() => setPaymentMethod('bank')}
                                />
                                <span>Bank Transfer</span>
                            </label>
                        </div>
                    </fieldset>

                    {/* Placeholder for payment widgets (e.g., Stripe Elements) depending on paymentMethod */}

                    <button
                        type="submit"
                        disabled={processing || !email}
                        style={{
                            ...styles.button,
                            opacity: processing || !email ? 0.6 : 1,
                            cursor: processing || !email ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {processing ? 'Processing...' : 'Start Subscription'}
                    </button>
                    {message && <div style={styles.message}>{message}</div>}
                </form>
                <small style={styles.note}>
                    By subscribing you agree to our Terms & Privacy Policy.
                </small>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    wrap: {
        maxWidth: 640,
        margin: '40px auto',
        padding: '0 20px',
        fontFamily: 'system-ui, sans-serif',
    },
    h1: {
        fontSize: '2rem',
        fontWeight: 600,
        marginBottom: 24,
        textAlign: 'center',
    },
    card: {
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: 28,
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
    },
    priceBlock: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 8,
        marginBottom: 8,
    },
    amount: {
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1,
    },
    period: {
        fontSize: '1rem',
        color: '#6b7280',
    },
    desc: {
        margin: '4px 0 12px',
        color: '#374151',
    },
    list: {
        margin: '0 0 20px 18px',
        padding: 0,
        color: '#374151',
        fontSize: 14,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
    },
    label: {
        display: 'flex',
        flexDirection: 'column',
        fontSize: 14,
        fontWeight: 500,
        gap: 6,
        color: '#111827',
    },
    input: {
        padding: '10px 12px',
        borderRadius: 6,
        border: '1px solid #d1d5db',
        fontSize: 14,
    },
    fieldset: {
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: '12px 14px 14px',
    },
    legend: {
        fontSize: 12,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        color: '#6b7280',
        padding: '0 6px',
    },
    methods: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        marginTop: 6,
    },
    method: {
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        fontSize: 14,
        cursor: 'pointer',
    },
    planBox: {
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        marginTop: 4,
    },
    planLabel: {
        cursor: 'default',
        fontSize: 14,
    },
    button: {
        background: '#2563eb',
        color: '#ffffff',
        fontSize: 15,
        fontWeight: 600,
        border: 'none',
        borderRadius: 8,
        padding: '12px 18px',
        transition: 'background .15s',
    },
    message: {
        marginTop: 4,
        fontSize: 13,
        color: '#111827',
        background: '#f3f4f6',
        padding: '8px 10px',
        borderRadius: 6,
        border: '1px solid #e5e7eb',
    },
    note: {
        display: 'block',
        marginTop: 18,
        fontSize: 11,
        color: '#6b7280',
        textAlign: 'center',
    },
};