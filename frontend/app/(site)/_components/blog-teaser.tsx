import { CldImage } from "./cld-image";
import type { Sections } from "@/lib/content/schema";
import { CtaButton, SectionHeader, linkTarget } from "./ui";

export const BlogTeaser = ({ blog }: { blog: Sections["blog"] }) => (
  <section className="pt-20 pb-[60px] md:pb-[119px]">
    <SectionHeader pill={blog.pill} title={blog.title} />

    {blog.posts.length > 0 && (
      <ul className="mx-auto mt-[30px] grid max-w-[1200px] gap-x-[29px] gap-y-[31px] px-5 md:mt-10 md:gap-y-[39px] lg:grid-cols-3">
        {blog.posts.map((post, i) => (
          <li key={`${post.href}-${i}`} className="reveal">
            <a href={post.href} {...linkTarget(post.href)} className="group block">
              <div className="relative aspect-[367/246] overflow-hidden rounded-[10px]">
                <CldImage
                  src={post.image.publicId}
                  alt=""
                  fill
                  sizes="(min-width: 1200px) 367px, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <h3 className="font-display mt-[35px] min-h-[116px] text-[23px]/[27.6px] font-semibold tracking-[-0.02em] text-white md:text-[25px]/[30px]">
                {post.title}
              </h3>
            </a>
          </li>
        ))}
      </ul>
    )}

    <div className="mt-[29px] flex justify-center md:mt-[41px]">
      <CtaButton link={blog.cta} />
    </div>
  </section>
);
