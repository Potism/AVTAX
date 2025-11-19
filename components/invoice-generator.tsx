"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { InvoicePreview } from "@/components/invoice-preview";
import { FileText, Download, Printer } from "lucide-react";

export interface InvoiceData {
  // Supplier (Fornitore) - Your data
  supplierName: string;
  supplierAddress: string;
  supplierCity: string;
  supplierZip: string;
  supplierVatId?: string;
  supplierTaxCode: string;

  // Client (Cliente)
  clientName: string;
  clientAddress: string;
  clientCity: string;
  clientZip: string;
  clientVatId?: string;
  clientTaxCode: string;

  // Invoice details
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  description: string;

  // Financial
  amount: number;
  activityType: string;
  taxRate: string;
  inpsType: string;
}

interface TaxBreakdown {
  invoiceAmount: number;
  profitableIncome: number;
  inpsContribution: number;
  taxableBase: number;
  taxRate: number;
  taxAmount: number;
  totalTaxes: number;
  netIncome: number;
  amountToSetAside: number;
}

const PROFITABILITY_COEFFICIENTS: Record<string, number> = {
  commercio: 0.4,
  servizi: 0.67,
  professioni: 0.78,
  artigiani: 0.67,
  altro: 0.67,
};

const INPS_RATES: Record<string, number> = {
  commercianti: 0.2418,
  artigiani: 0.2418,
  professionisti: 0.2595,
  "gestione-separata": 0.2607,
};

export function InvoiceGenerator() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    supplierName: "",
    supplierAddress: "",
    supplierCity: "",
    supplierZip: "",
    supplierVatId: "",
    supplierTaxCode: "",
    clientName: "",
    clientAddress: "",
    clientCity: "",
    clientZip: "",
    clientVatId: "",
    clientTaxCode: "",
    invoiceNumber: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    description: "",
    amount: 0,
    activityType: "professioni",
    taxRate: "5",
    inpsType: "gestione-separata",
  });

  const [showPreview, setShowPreview] = useState(false);

  const calculateTaxes = (): TaxBreakdown | null => {
    const amount = invoiceData.amount;
    if (!amount || amount <= 0) return null;

    const coefficient =
      PROFITABILITY_COEFFICIENTS[invoiceData.activityType] || 0.67;
    const profitableIncome = amount * coefficient;

    const inpsRate = INPS_RATES[invoiceData.inpsType] || 0.2607;
    const inpsContribution = profitableIncome * inpsRate;

    const taxableBase = profitableIncome - inpsContribution;
    const rate = parseInt(invoiceData.taxRate) / 100;
    const taxAmount = taxableBase * rate;

    const totalTaxes = taxAmount + inpsContribution;
    const netIncome = amount - totalTaxes;

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
    };
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // For now, we'll use print to PDF functionality
    // In the future, you could integrate a PDF library like react-pdf
    window.print();
  };

  const updateField = (field: keyof InvoiceData, value: string | number) => {
    setInvoiceData((prev) => ({ ...prev, [field]: value }));
  };

  const breakdown = calculateTaxes();
  const canGenerate =
    invoiceData.supplierName &&
    invoiceData.clientName &&
    invoiceData.invoiceNumber &&
    invoiceData.amount > 0;

  return (
    <div className="space-y-6">
      {!showPreview ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-5" />
                Genera Fattura
              </CardTitle>
              <CardDescription>
                Compila i dati per generare la tua fattura con calcoli precisi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Supplier Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Dati Fornitore (Tuo)</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="supplierName">
                      Ragione Sociale / Nome *
                    </Label>
                    <Input
                      id="supplierName"
                      value={invoiceData.supplierName}
                      onChange={(e) =>
                        updateField("supplierName", e.target.value)
                      }
                      placeholder="AV Production"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplierTaxCode">Codice Fiscale *</Label>
                    <Input
                      id="supplierTaxCode"
                      value={invoiceData.supplierTaxCode}
                      onChange={(e) =>
                        updateField("supplierTaxCode", e.target.value)
                      }
                      placeholder="ABCDEF12G34H567I"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplierAddress">Indirizzo *</Label>
                    <Input
                      id="supplierAddress"
                      value={invoiceData.supplierAddress}
                      onChange={(e) =>
                        updateField("supplierAddress", e.target.value)
                      }
                      placeholder="Via Roma 123"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplierCity">Città *</Label>
                    <Input
                      id="supplierCity"
                      value={invoiceData.supplierCity}
                      onChange={(e) =>
                        updateField("supplierCity", e.target.value)
                      }
                      placeholder="Milano"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplierZip">CAP *</Label>
                    <Input
                      id="supplierZip"
                      value={invoiceData.supplierZip}
                      onChange={(e) =>
                        updateField("supplierZip", e.target.value)
                      }
                      placeholder="20100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplierVatId">
                      Partita IVA (opzionale)
                    </Label>
                    <Input
                      id="supplierVatId"
                      value={invoiceData.supplierVatId}
                      onChange={(e) =>
                        updateField("supplierVatId", e.target.value)
                      }
                      placeholder="IT12345678901"
                    />
                  </div>
                </div>
              </div>

              {/* Client Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Dati Cliente</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Ragione Sociale / Nome *</Label>
                    <Input
                      id="clientName"
                      value={invoiceData.clientName}
                      onChange={(e) =>
                        updateField("clientName", e.target.value)
                      }
                      placeholder="Cliente S.r.l."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientTaxCode">Codice Fiscale *</Label>
                    <Input
                      id="clientTaxCode"
                      value={invoiceData.clientTaxCode}
                      onChange={(e) =>
                        updateField("clientTaxCode", e.target.value)
                      }
                      placeholder="CLIENT01A12B345C"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientAddress">Indirizzo *</Label>
                    <Input
                      id="clientAddress"
                      value={invoiceData.clientAddress}
                      onChange={(e) =>
                        updateField("clientAddress", e.target.value)
                      }
                      placeholder="Via Verdi 456"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientCity">Città *</Label>
                    <Input
                      id="clientCity"
                      value={invoiceData.clientCity}
                      onChange={(e) =>
                        updateField("clientCity", e.target.value)
                      }
                      placeholder="Roma"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientZip">CAP *</Label>
                    <Input
                      id="clientZip"
                      value={invoiceData.clientZip}
                      onChange={(e) => updateField("clientZip", e.target.value)}
                      placeholder="00100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientVatId">Partita IVA (opzionale)</Label>
                    <Input
                      id="clientVatId"
                      value={invoiceData.clientVatId}
                      onChange={(e) =>
                        updateField("clientVatId", e.target.value)
                      }
                      placeholder="IT98765432109"
                    />
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Dettagli Fattura</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNumber">Numero Fattura *</Label>
                    <Input
                      id="invoiceNumber"
                      value={invoiceData.invoiceNumber}
                      onChange={(e) =>
                        updateField("invoiceNumber", e.target.value)
                      }
                      placeholder="FAT-2024-001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoiceDate">Data Fattura *</Label>
                    <Input
                      id="invoiceDate"
                      type="date"
                      value={invoiceData.invoiceDate}
                      onChange={(e) =>
                        updateField("invoiceDate", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Data Scadenza *</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={invoiceData.dueDate}
                      onChange={(e) => updateField("dueDate", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Descrizione Servizi/Prodotti *
                  </Label>
                  <Textarea
                    id="description"
                    value={invoiceData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Descrizione dettagliata dei servizi forniti..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Importo Fattura (€) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={invoiceData.amount || ""}
                    onChange={(e) =>
                      updateField("amount", parseFloat(e.target.value) || 0)
                    }
                    placeholder="2500.00"
                    className="text-lg"
                  />
                </div>
              </div>

              {/* Tax Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Impostazioni Fiscali</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="activityType">Tipo di Attività</Label>
                    <select
                      id="activityType"
                      value={invoiceData.activityType}
                      onChange={(e) =>
                        updateField("activityType", e.target.value)
                      }
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="commercio">Commercio (40%)</option>
                      <option value="servizi">Servizi (67%)</option>
                      <option value="professioni">Professioni (78%)</option>
                      <option value="artigiani">Artigiani (67%)</option>
                      <option value="altro">Altro (67%)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Aliquota Fiscale</Label>
                    <select
                      id="taxRate"
                      value={invoiceData.taxRate}
                      onChange={(e) => updateField("taxRate", e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="5">5% (primi 5 anni)</option>
                      <option value="15">15% (standard)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inpsType">Tipo Contributi INPS</Label>
                  <select
                    id="inpsType"
                    value={invoiceData.inpsType}
                    onChange={(e) => updateField("inpsType", e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="commercianti">Commercianti (24.18%)</option>
                    <option value="artigiani">Artigiani (24.18%)</option>
                    <option value="professionisti">
                      Professionisti (25.95%)
                    </option>
                    <option value="gestione-separata">
                      Gestione Separata (26.07%)
                    </option>
                  </select>
                </div>
              </div>

              {breakdown && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Importo Fattura:</span>
                        <span className="text-lg font-bold">
                          {new Intl.NumberFormat("it-IT", {
                            style: "currency",
                            currency: "EUR",
                          }).format(breakdown.invoiceAmount)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Da mettere da parte (tasse):</span>
                        <span className="font-medium text-destructive">
                          {new Intl.NumberFormat("it-IT", {
                            style: "currency",
                            currency: "EUR",
                          }).format(breakdown.amountToSetAside)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Guadagno netto:</span>
                        <span className="font-medium text-accent">
                          {new Intl.NumberFormat("it-IT", {
                            style: "currency",
                            currency: "EUR",
                          }).format(breakdown.netIncome)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-4">
                <Button
                  onClick={() => setShowPreview(true)}
                  disabled={!canGenerate}
                  className="flex-1"
                >
                  <FileText className="size-4" />
                  Genera Anteprima Fattura
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={() => setShowPreview(false)} variant="outline">
              ← Modifica Dati
            </Button>
            <Button onClick={handlePrint} className="flex-1">
              <Printer className="size-4" />
              Stampa / Salva come PDF
            </Button>
            <Button onClick={handleDownload} variant="outline">
              <Download className="size-4" />
              Download
            </Button>
          </div>
          <InvoicePreview invoiceData={invoiceData} breakdown={breakdown} />
        </div>
      )}
    </div>
  );
}
