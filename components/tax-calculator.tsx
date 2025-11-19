'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calculator, TrendingUp, Wallet, PiggyBank } from 'lucide-react'

interface TaxBreakdown {
  invoiceAmount: number
  profitableIncome: number
  inpsContribution: number
  taxableBase: number
  taxRate: number
  taxAmount: number
  totalTaxes: number
  netIncome: number
  amountToSetAside: number
}

const PROFITABILITY_COEFFICIENTS: Record<string, number> = {
  'commercio': 0.40,
  'servizi': 0.67,
  'professioni': 0.78,
  'artigiani': 0.67,
  'altro': 0.67,
}

const INPS_RATES: Record<string, number> = {
  'commercianti': 0.2418,
  'artigiani': 0.2418,
  'professionisti': 0.2595,
  'gestione-separata': 0.2607, // 26.07% as shown in your calculation
}

export function TaxCalculator() {
  const [invoiceAmount, setInvoiceAmount] = useState<string>('')
  const [activityType, setActivityType] = useState<string>('professioni')
  const [taxRate, setTaxRate] = useState<string>('5')
  const [inpsType, setInpsType] = useState<string>('gestione-separata')

  const calculateTaxes = (): TaxBreakdown | null => {
    const amount = parseFloat(invoiceAmount)
    if (!amount || amount <= 0) return null

    // Step 1: Calculate Reddito Imponibile = Fattura × Coefficiente
    const coefficient = PROFITABILITY_COEFFICIENTS[activityType] || 0.67
    const profitableIncome = amount * coefficient
    
    // Step 2: Calculate INPS on Reddito Imponibile
    const inpsRate = INPS_RATES[inpsType] || 0.2607
    const inpsContribution = profitableIncome * inpsRate
    
    // Step 3: Calculate Imposta Sostitutiva on (Reddito Imponibile - INPS)
    const taxableBase = profitableIncome - inpsContribution
    const rate = parseInt(taxRate) / 100
    const taxAmount = taxableBase * rate
    
    // Step 4: Calculate totals
    const totalTaxes = taxAmount + inpsContribution
    const netIncome = amount - totalTaxes
    
    return {
      invoiceAmount: amount,
      profitableIncome,
      inpsContribution,
      taxableBase,
      taxRate: rate * 100,
      taxAmount,
      totalTaxes,
      netIncome,
      amountToSetAside: totalTaxes,
    }
  }

  const breakdown = calculateTaxes()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="size-5" />
            Dati Fattura
          </CardTitle>
          <CardDescription>
            Inserisci i dettagli della tua fattura e attività
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount">Importo Fattura (€)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="2500.00"
              value={invoiceAmount}
              onChange={(e) => setInvoiceAmount(e.target.value)}
              className="text-lg"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="activity">Tipo di Attività</Label>
              <Select value={activityType} onValueChange={setActivityType}>
                <SelectTrigger id="activity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="commercio">Commercio (40%)</SelectItem>
                  <SelectItem value="servizi">Servizi (67%)</SelectItem>
                  <SelectItem value="professioni">Professioni (78%)</SelectItem>
                  <SelectItem value="artigiani">Artigiani (67%)</SelectItem>
                  <SelectItem value="altro">Altro (67%)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Coefficiente di redditività per il calcolo
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxrate">Aliquota Fiscale</Label>
              <Select value={taxRate} onValueChange={setTaxRate}>
                <SelectTrigger id="taxrate">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5% (primi 5 anni)</SelectItem>
                  <SelectItem value="15">15% (standard)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Aliquota applicabile alla tua situazione
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="inps">Tipo Contributi INPS</Label>
            <Select value={inpsType} onValueChange={setInpsType}>
              <SelectTrigger id="inps">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="commercianti">Commercianti (24.18%)</SelectItem>
                <SelectItem value="artigiani">Artigiani (24.18%)</SelectItem>
                <SelectItem value="professionisti">Professionisti (25.95%)</SelectItem>
                <SelectItem value="gestione-separata">Gestione Separata (26.07%)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Tipo di contribuzione previdenziale
            </p>
          </div>
        </CardContent>
      </Card>

      {breakdown && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-medium">
                  <PiggyBank className="size-4 text-primary" />
                  Da Mettere da Parte
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {formatCurrency(breakdown.amountToSetAside)}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatPercentage((breakdown.amountToSetAside / breakdown.invoiceAmount) * 100)} della fattura
                </p>
              </CardContent>
            </Card>

            <Card className="border-accent/20 bg-accent/5">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-medium">
                  <Wallet className="size-4 text-accent" />
                  Guadagno Netto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">
                  {formatCurrency(breakdown.netIncome)}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatPercentage((breakdown.netIncome / breakdown.invoiceAmount) * 100)} della fattura
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-medium">
                  <TrendingUp className="size-4" />
                  Reddito Imponibile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {formatCurrency(breakdown.profitableIncome)}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Dopo coefficiente {formatPercentage(PROFITABILITY_COEFFICIENTS[activityType] * 100)}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Dettaglio Calcolo</CardTitle>
              <CardDescription>
                Ripartizione completa secondo il regime forfettario
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="text-sm font-medium">Importo Fattura</span>
                  <span className="text-lg font-semibold">{formatCurrency(breakdown.invoiceAmount)}</span>
                </div>

                <div className="space-y-3 rounded-lg bg-muted/50 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Reddito Imponibile ({formatPercentage(PROFITABILITY_COEFFICIENTS[activityType] * 100)})
                    </span>
                    <span className="font-medium">{formatCurrency(breakdown.profitableIncome)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      INPS ({formatPercentage(INPS_RATES[inpsType] * 100)})
                    </span>
                    <span className="font-medium text-destructive">-{formatCurrency(breakdown.inpsContribution)}</span>
                  </div>

                  <div className="flex items-center justify-between border-t pt-2 text-sm">
                    <span className="text-muted-foreground">Base Imponibile (Reddito - INPS)</span>
                    <span className="font-medium">{formatCurrency(breakdown.taxableBase)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Imposta Sostitutiva ({formatPercentage(breakdown.taxRate)})
                    </span>
                    <span className="font-medium text-destructive">-{formatCurrency(breakdown.taxAmount)}</span>
                  </div>

                  <div className="flex items-center justify-between border-t pt-2">
                    <span className="font-medium">Totale da Accantonare</span>
                    <span className="text-lg font-bold text-destructive">-{formatCurrency(breakdown.totalTaxes)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t pt-3">
                  <span className="text-lg font-semibold">Netto in Tasca</span>
                  <span className="text-2xl font-bold text-accent">{formatCurrency(breakdown.netIncome)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-muted bg-muted/20">
            <CardContent className="pt-6">
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Note Importanti:</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Calcoli basati sulla formula ufficiale del regime forfettario italiano</li>
                  <li>L'imposta sostitutiva viene applicata su (Reddito Imponibile - INPS)</li>
                  <li>I contributi INPS possono variare in base alla tua cassa previdenziale</li>
                  <li>Non include eventuali deduzioni, crediti d'imposta o altri contributi</li>
                  <li>Consulta sempre un commercialista per la tua situazione specifica</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
