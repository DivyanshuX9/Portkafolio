import ridehubMd from "@/assests/Blogs/ridehub-blog.md?raw";
import nabhaMd from "@/assests/Blogs/nabha-blog.md?raw";
import constellationMd from "@/assests/Blogs/constellation-blog.md?raw";
import germanMd from "@/assests/Blogs/german-learning-blog.md?raw";

export type BlogPost = {
  slug: string;
  tag: string;
  dateLabel: string;
  title: string;
  excerpt: string;
  content: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "i-got-lost-in-chennai-then-i-built-ridehub",
    tag: "Product",
    dateLabel: "May · 28",
    title: "I Got Lost in Chennai. Then I Built RideHub.",
    excerpt:
      "Why a transport aggregation layer matters — and how RideHub started as a personal need that turned into a systems problem worth solving.",
    content: ridehubMd,
  },
  {
    slug: "nabha-what-happens-when-technology-stops-assuming",
    tag: "Health",
    dateLabel: "May · 28",
    title: "Nabha: What Happens When Technology Stops Assuming",
    excerpt:
      "Designing for constrained connectivity and real-world workflows: lessons from Nabha Civil Hospital and our telemedicine prototype.",
    content: nabhaMd,
  },
  {
    slug: "the-night-i-mapped-stars",
    tag: "Myself",
    dateLabel: "Apr · 26",
    title: "The Night I Mapped Stars and Started Thinking About Systems",
    excerpt:
      "A 2 AM star-gazing session turned into a three-night rabbit hole about plate-solving, constellation boundaries, and why the best abstractions are useful lies.",
    content: constellationMd,
  },
  {
    slug: "ich-lerne-deutsch",
    tag: "Life",
    dateLabel: "Mar · 26",
    title: "Ich Lerne Deutsch. Es Ist Kompliziert.",
    excerpt:
      "What learning German in third semester taught me about structure, failure, and why hard things only get easier by doing them badly — repeatedly.",
    content: germanMd,
  },
  {
    slug: "walmart-sales-model-stacking-vs-linear",
    tag: "Data Science",
    dateLabel: "Mar · 26",
    title: "Walmart sales model: Stacking Regressor vs linear baseline",
    excerpt:
      "A lightweight comparison of a stacked ensemble against a strong linear baseline, including where complexity helped—and where it didn't.",
    content: [
      "Start with the simplest model that can't embarrass you, then earn complexity.",
      "I used a linear baseline to establish a clean reference point, then tested a stacking regressor to see if non-linearity actually mattered.",
      "The ensemble improved specific seasonal segments, but the baseline won overall maintainability. That trade-off is often the right answer.",
    ].join("\n\n"),
  },
  {
    slug: "weather-based-traffic-signal-model",
    tag: "Computer Vision",
    dateLabel: "Feb · 26",
    title: "Weather-based adaptive traffic signal control system",
    excerpt:
      "Designing adaptive signal timing algorithms that combine real-time weather sensors and computer vision inference under adverse weather conditions.",
    content: [
      "Traditional fixed-time traffic signals fail when weather degrades driving speed and visibility.",
      "I built an adaptive traffic signal control model combining computer vision and environmental data to dynamically adjust green light durations during rain, fog, and poor road conditions.",
      "Identical preprocessing and weather-shift domain adaptation proved critical to maintaining object detection accuracy when camera lenses face adverse conditions.",
    ].join("\n\n"),
  },
  {
    slug: "encrypted-docs-audit-logs",
    tag: "SWE",
    dateLabel: "Jan · 26",
    title: "Role-based encrypted documents with audit logs",
    excerpt:
      "Design notes on document encryption, access boundaries, and auditability—plus why 'blockchain' is usually the least interesting part of the system.",
    content: [
      "My approach was role-first: define who can do what, then derive keys and storage rules from that.",
      "Audit logs are only useful if they're queryable and explainable. I optimized for 'what happened and why' over cryptographic novelty.",
      "The takeaway: secure systems are mostly about careful defaults and predictable recovery paths.",
    ].join("\n\n"),
  },
];
