import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="text-ink min-h-screen bg-[#f4f5fb] font-sans">{children}</div>
);

export default AdminLayout;
