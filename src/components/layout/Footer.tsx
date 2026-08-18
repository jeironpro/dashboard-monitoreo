export function Footer() {
  return (
    <footer className="mt-14 border-t px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display font-medium text-foreground">
          Vigía · Observabilidad de infraestructura
        </p>
        <p className="text-xs text-faint">
          Datos de demostración (MOCK) · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}
