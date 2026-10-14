"use client";

import { MAX_BLOG_POSTS, type Media, type Sections } from "@/lib/content/schema";
import { ArrayField } from "../../_components/ArrayField";
import { EditorShell } from "../../_components/EditorShell";
import { Field, LinkFields } from "../../_components/Field";
import { MediaUpload } from "../../_components/MediaUpload";
import { SectionHeadingFields } from "../../_components/SectionHeadingFields";

type Blog = Sections["blog"];

const NO_MEDIA = null as unknown as Media;

const BlogPage = () => (
  <EditorShell<Blog> title="Blog teaser" description="Three featured articles and the link to the full blog." area="sections.blog" select={(c) => c.sections.blog}>
    {(draft, setDraft) => (
      <>
        <SectionHeadingFields pill={draft.pill} title={draft.title} onPill={(pill) => setDraft((d) => ({ ...d, pill }))} onTitle={(title) => setDraft((d) => ({ ...d, title }))} />
        <ArrayField<Blog["posts"][number]>
          label="Articles"
          items={draft.posts}
          max={MAX_BLOG_POSTS}
          onChange={(update) => setDraft((d) => ({ ...d, posts: update(d.posts) }))}
          create={() => ({ title: "", href: "https://growwithplutus.com/blog/", image: NO_MEDIA })}
          itemLabel={(item) => item.title}
          addLabel="Add article"
          renderItem={(item, update) => (
            <>
              <MediaUpload label="Cover image" required value={item.image} onChange={(image) => update((p) => ({ ...p, image: image ?? NO_MEDIA }))} hint="Shown at 3:2." />
              <Field label="Title" required value={item.title} onChange={(title) => update({ ...item, title })} />
              <Field label="Article link" required value={item.href} onChange={(href) => update({ ...item, href })} />
            </>
          )}
        />
        <LinkFields label="Button" value={draft.cta} onChange={(cta) => setDraft((d) => ({ ...d, cta }))} />
      </>
    )}
  </EditorShell>
);

export default BlogPage;
