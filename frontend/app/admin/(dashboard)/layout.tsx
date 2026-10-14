import { Sidebar } from "../_components/Sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen md:pl-64">
    <Sidebar />
    <main className="px-5 py-8 sm:px-10 sm:py-12">{children}</main>
  </div>
);

export default DashboardLayout;
