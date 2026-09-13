import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your bookings",
  description:
    "Securely access your Hauslash appointment history with a one-time email code.",
};

export default function BookingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
