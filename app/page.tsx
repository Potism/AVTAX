import { TaxCalculator } from '@/components/tax-calculator'

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-foreground">
            AV Production Tax Calculator
          </h1>
          <p className="text-pretty text-lg text-muted-foreground">
            Calcola quanto mettere da parte per le tasse e il tuo guadagno netto
          </p>
        </header>
        
        <TaxCalculator />
        
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          
        </footer>
      </div>
    </div>
  )
}
