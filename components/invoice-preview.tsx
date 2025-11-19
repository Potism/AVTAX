"use client";

import { InvoiceData } from "./invoice-generator";

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

interface InvoicePreviewProps {
  invoiceData: InvoiceData;
  breakdown: TaxBreakdown | null;
}

export function InvoicePreview({
  invoiceData,
  breakdown,
}: InvoicePreviewProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("it-IT", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="invoice-preview-container mx-auto max-w-4xl rounded-lg border bg-white p-8 shadow-lg print:border-0 print:shadow-none print:p-12">
      {/* Header */}
      <div className="mb-8 border-b-2 border-gray-300 pb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">FATTURA</h1>
            <p className="text-sm text-gray-600">
              Regime Forfettario - Art. 1, c. 54-89, L. n. 190/2014
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-700">Numero:</p>
            <p className="text-lg font-bold text-gray-900">
              {invoiceData.invoiceNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Supplier and Client Info */}
      <div className="mb-8 grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase text-gray-700">
            Fornitore
          </h2>
          <div className="space-y-1 text-sm text-gray-900">
            <p className="font-semibold">{invoiceData.supplierName}</p>
            <p>{invoiceData.supplierAddress}</p>
            <p>
              {invoiceData.supplierZip} {invoiceData.supplierCity}
            </p>
            <p>CF: {invoiceData.supplierTaxCode}</p>
            {invoiceData.supplierVatId && (
              <p>P.IVA: {invoiceData.supplierVatId}</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase text-gray-700">
            Cliente
          </h2>
          <div className="space-y-1 text-sm text-gray-900">
            <p className="font-semibold">{invoiceData.clientName}</p>
            <p>{invoiceData.clientAddress}</p>
            <p>
              {invoiceData.clientZip} {invoiceData.clientCity}
            </p>
            <p>CF: {invoiceData.clientTaxCode}</p>
            {invoiceData.clientVatId && <p>P.IVA: {invoiceData.clientVatId}</p>}
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-xs font-semibold uppercase text-gray-600">
            Data Fattura
          </p>
          <p className="text-sm text-gray-900">
            {formatDate(invoiceData.invoiceDate)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-gray-600">
            Data Scadenza
          </p>
          <p className="text-sm text-gray-900">
            {formatDate(invoiceData.dueDate)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-gray-600">
            Regime Fiscale
          </p>
          <p className="text-sm text-gray-900">Regime Forfettario</p>
        </div>
      </div>

      {/* Description */}
      <div className="mb-8">
        <h3 className="mb-3 text-sm font-semibold uppercase text-gray-700">
          Descrizione
        </h3>
        <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
          <p className="whitespace-pre-wrap text-sm text-gray-900">
            {invoiceData.description}
          </p>
        </div>
      </div>

      {/* Amount Table */}
      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300 bg-gray-100">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-700">
                Descrizione
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-700">
                Importo
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-3 text-sm text-gray-900">
                Prestazione di servizi
              </td>
              <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                {formatCurrency(invoiceData.amount)}
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                TOTALE FATTURA
              </td>
              <td className="px-4 py-3 text-right text-lg font-bold text-gray-900">
                {formatCurrency(invoiceData.amount)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Tax Calculation Details (Optional - can be hidden in print) */}
      {breakdown && (
        <div className="no-print mb-8 rounded-lg border border-gray-200 bg-gray-50 p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase text-gray-700">
            Dettaglio Calcolo Fiscale (Informazioni Interne)
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Importo Fattura:</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(breakdown.invoiceAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Reddito Imponibile:</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(breakdown.profitableIncome)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Contributi INPS:</span>
              <span className="font-medium text-red-600">
                -{formatCurrency(breakdown.inpsContribution)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">
                Imposta Sostitutiva ({breakdown.taxRate.toFixed(0)}%):
              </span>
              <span className="font-medium text-red-600">
                -{formatCurrency(breakdown.taxAmount)}
              </span>
            </div>
            <div className="border-t border-gray-300 pt-2">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">
                  Totale da Accantonare:
                </span>
                <span className="font-bold text-red-600">
                  -{formatCurrency(breakdown.totalTaxes)}
                </span>
              </div>
            </div>
            <div className="border-t-2 border-gray-400 pt-2">
              <div className="flex justify-between">
                <span className="text-lg font-bold text-gray-900">
                  Guadagno Netto:
                </span>
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(breakdown.netIncome)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 border-t border-gray-300 pt-6 text-xs text-gray-600">
        <p className="mb-2">
          <strong>Note:</strong> Fattura emessa in regime forfettario ai sensi
          dell'art. 1, commi 54-89, della legge n. 190/2014.
        </p>
        <p>
          L'imposta sostitutiva è applicata secondo le disposizioni del regime
          forfettario. Non sono applicabili IVA e ritenute d'acconto.
        </p>
      </div>
    </div>
  );
}
