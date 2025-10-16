import * as XLSX from 'xlsx';

export function exportToExcel(data: any[], filename: string) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Dati");
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export function exportToPDF(elementId: string, filename: string) {
  // Implementazione semplificata - in produzione si userebbe jsPDF o html2pdf
  window.print();
}

export function exportCommissionsToExcel(commissions: any[]) {
  const data = commissions.map(c => ({
    Data: new Date(c.date).toLocaleDateString('it-IT'),
    'N. Polizza': c.policyNumber,
    Cliente: c.clientName,
    Premio: `€${c.premium.toLocaleString()}`,
    'Tasso %': `${c.rate}%`,
    Provvigione: `€${c.amount.toLocaleString()}`,
    Stato: c.status === 'paid' ? 'Pagata' : 'In Attesa',
  }));
  
  exportToExcel(data, `Provvigioni_${new Date().toISOString().split('T')[0]}`);
}

export function exportPoliciesToExcel(policies: any[]) {
  const data = policies.map(p => ({
    'N. Polizza': p.policyNumber,
    Prodotto: p.productName,
    Cliente: p.clientName,
    Stato: p.status,
    Premio: p.premium ? `€${p.premium.toLocaleString()}` : '-',
    'Data Creazione': new Date(p.createdAt).toLocaleDateString('it-IT'),
  }));
  
  exportToExcel(data, `Polizze_${new Date().toISOString().split('T')[0]}`);
}

export function exportClaimsToExcel(claims: any[]) {
  const data = claims.map(c => ({
    'N. Sinistro': c.claimNumber,
    'N. Polizza': c.policyNumber,
    Cliente: c.clientName,
    Tipo: c.type,
    Importo: c.amount ? `€${c.amount.toLocaleString()}` : '-',
    Stato: c.status,
    'Data Apertura': new Date(c.createdAt).toLocaleDateString('it-IT'),
  }));
  
  exportToExcel(data, `Sinistri_${new Date().toISOString().split('T')[0]}`);
}

