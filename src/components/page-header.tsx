type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="font-headline text-3xl sm:text-5xl font-bold tracking-tight text-foreground glow-accent">
        {title}
      </h1>
      {description && (
        <p className="mt-3 text-md sm:text-lg text-muted-foreground max-w-2xl">{description}</p>
      )}
    </div>
  );
}
