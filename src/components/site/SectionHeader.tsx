import { Reveal } from "./Reveal";

export function SectionHeader({
  index,
  eyebrow,
  title,
  description,
}: {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <Reveal className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10">
      <div className="md:col-span-4">
        <p className="eyebrow">
          <span className="mr-3 text-foreground/70">{index}</span>
          {eyebrow}
        </p>
      </div>
      <div className="md:col-span-8">
        <h2 className="display-lg max-w-[20ch] text-foreground">{title}</h2>
        {description && (
          <p className="body-lg mt-6 max-w-[58ch]">{description}</p>
        )}
      </div>
    </Reveal>
  );
}
