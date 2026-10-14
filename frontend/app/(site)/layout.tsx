const SiteLayout = ({ children }: { children: React.ReactNode }) => {
  return <main className="relative w-full overflow-x-clip">{children}</main>;
};

export default SiteLayout;
