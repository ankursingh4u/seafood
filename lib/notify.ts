import nodemailer from "nodemailer";
import { Order } from "@/types/order";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOrderEmail(order: Order): Promise<void> {
  const itemsList = order.items
    .map((i) => `  - ${i.name} x${i.qty} @ ₹${i.price}`)
    .join("\n");

  await transporter.sendMail({
    from: `"Saltys Orders" <${process.env.SMTP_USER}>`,
    to: process.env.OWNER_EMAIL,
    subject: `New Order #${order.id.slice(0, 8).toUpperCase()} — ${order.customer_name}`,
    text: `
New pickup order received!

Order ID : ${order.id}
Customer : ${order.customer_name}
Phone    : ${order.phone}
Total    : ₹${order.total}
Status   : ${order.status}

Items:
${itemsList}

Go to /admin to manage this order.
    `.trim(),
  });
}
