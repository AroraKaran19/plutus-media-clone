import type { Metadata } from "next";
import { imageUrl } from "@/app/utils/cloudinary";
import { getSiteContent } from "@/lib/content/get";
import { About } from "./_components/about";
import { Benefits } from "./_components/benefits";
import { BlogTeaser } from "./_components/blog-teaser";
import { CaseStudies } from "./_components/case-studies";
import { CtaFooter } from "./_components/cta-footer";
import { Faq } from "./_components/faq";
import { Hero } from "./_components/hero";
import { SiteNav } from "./_components/site-nav";
import { Testimonials } from "./_components/testimonials";

export const generateMetadata = async (): Promise<Metadata> => {
  const { seo } = await getSiteContent();
  const images = seo.ogImage ? [{ url: imageUrl(seo.ogImage.publicId, 1200), width: 1200, height: 630 }] : undefined;
  return {
    title: seo.title,
    description: seo.description,
    openGraph: { title: seo.title, description: seo.description, images },
    icons: seo.favicon ? { icon: imageUrl(seo.favicon.publicId, 192) } : undefined,
  };
};

const Home = async () => {
  const { navbar, sections, footer } = await getSiteContent();

  return (
    <>
      <SiteNav navbar={navbar} />
      <Hero hero={sections.hero} clients={sections.clients} />
      <About about={sections.about} />
      <CaseStudies caseStudies={sections.caseStudies} />
      <Testimonials testimonials={sections.testimonials} />
      <Benefits benefits={sections.benefits} />
      <BlogTeaser blog={sections.blog} />
      <Faq faq={sections.faq} />
      <CtaFooter cta={sections.cta} footer={footer} logo={navbar.logo} />
    </>
  );
};

export default Home;
