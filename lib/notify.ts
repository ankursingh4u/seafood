import { Resend } from "resend";
import { Order } from "@/types/order";

// Email is optional — silently skipped if RESEND_API_KEY is not set.
// To enable: add RESEND_API_KEY + OWNER_EMAIL to .env.local
// Get a free key at https://resend.com (3,000 emails/month free)

export async function sendOrderEmail(order: Order): Promise<void> {
  if (!process.env.RESEND_API_KEY || !process.env.OWNER_EMAIL) return;

  const resend = new Resend(process.env.RESEND_API_KEY);

  const itemsList = order.items
    .map((i) => `<li>${i.name} × ${i.qty} — $${i.price * i.qty}</li>`)
    .join("");

  await resend.emails.send({
    from: "Saltys Orders <orders@saltysseafood.com>",
    to: process.env.OWNER_EMAIL,
    subject: `New Order #${order.id.slice(0, 8).toUpperCase()} — ${order.customer_name}`,
    html: `
      <h2>New Pickup Order</h2>
      <p><strong>Order ID:</strong> ${order.id}</p>
      <p><strong>Customer:</strong> ${order.customer_name}</p>
      <p><strong>Phone:</strong> ${order.phone}</p>
      ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ""}
      <p><strong>Total:</strong> $${order.total}</p>
      <h3>Items:</h3>
      <ul>${itemsList}</ul>
      <p>Go to <a href="/admin">/admin</a> to manage this order.</p>
    `,
  });
}
