export function PageHeader({ title }: { title: string }) {
  return (
    <div className="page-header px-4 py-16 text-center sm:px-8">
      <h1 className="text-4xl font-bold text-white sm:text-5xl">{title}</h1>
      <nav aria-label="breadcrumb" className="mt-4 text-sm text-light">
        <span>Inicio</span>
        <span className="mx-2">/</span>
        <span className="text-white">{title}</span>
      </nav>
    </div>
  );
}
