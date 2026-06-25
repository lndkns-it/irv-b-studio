import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <main className="min-h-screen p-8 flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-content">
        Irv. B Music Studio
      </h1>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-content-muted">
          Button variants
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>

        <h2 className="text-xl font-semibold text-content-muted mt-4">
          Button sizes
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>
    </main>
  );
}