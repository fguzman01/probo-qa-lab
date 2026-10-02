import { AppHeader } from '../components/AppHeader';

// Placeholder hasta HU-004 (listado de historias).
export function StoriesPage() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto flex max-w-[1120px] flex-col gap-2 px-6 py-10">
        <h1 className="m-0 text-[28px] font-bold tracking-tight">Historias</h1>
        <p className="m-0 text-[15px] text-muted">El listado de historias llega con la HU-004.</p>
      </main>
    </div>
  );
}
