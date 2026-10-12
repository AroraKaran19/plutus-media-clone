const SiteLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="w-full min-h-screen px-5 mx-auto max-w-[1600px] xl:max-w-[1400px] lg:max-w-7xl">
      {children}
    </main>
  );
};

export default SiteLayout;
