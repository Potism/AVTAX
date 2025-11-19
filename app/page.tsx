"use client";

import { TaxCalculator } from "@/components/tax-calculator";
import { InvoiceGenerator } from "@/components/invoice-generator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calculator, FileText } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-foreground">
            AV Production Tax Calculator
          </h1>
          <p className="text-pretty text-lg text-muted-foreground">
            Calcola quanto mettere da parte per le tasse e genera fatture con
            calcoli precisi
          </p>
        </header>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="mb-6 w-full sm:w-auto">
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="size-4" />
              Calcolatore Tasse
            </TabsTrigger>
            <TabsTrigger value="invoice" className="flex items-center gap-2">
              <FileText className="size-4" />
              Genera Fattura
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <TaxCalculator />
          </TabsContent>

          <TabsContent value="invoice">
            <InvoiceGenerator />
          </TabsContent>
        </Tabs>

        <footer className="mt-12 text-center text-sm text-muted-foreground"></footer>
      </div>
    </div>
  );
}
