'use client';

import { useState, useRef } from 'react';
import { bulkImport } from '@/actions/products/bulkImport';
import Papa from 'papaparse';

interface ImportResult {
  created: number;
  errors?: string[];
}

export default function BulkImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string[][] | null>(null);
  const [headers, setHeaders] = useState<string[] | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const result = Papa.parse(text, { header: true, skipEmptyLines: true });
      if (result.data.length > 0) {
        setHeaders(result.meta.fields || []);
        setPreview(
          result.data.slice(0, 5).map((row: any) =>
            (result.meta.fields || []).map((field) => row[field] || ''),
          ),
        );
      }
    };
    reader.readAsText(f);
  };

  const handleImport = async () => {
    if (!file) return;
    setImporting(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await bulkImport(fd);
      setResult(res);
    } catch (err) {
      setResult({
        created: 0,
        errors: [err instanceof Error ? err.message : 'Import failed'],
      });
    }
    setImporting(false);
  };

  return (
    <div className="container max-w-3xl py-12">
      <h1 className="font-serif text-[28px] tracking-[-0.01em] mb-1">
        Bulk Import
      </h1>
      <p className="text-neutral-500 text-sm mb-8">
        Import multiple products from a CSV file.
      </p>

      <div className="bg-white border border-black/10 p-6 md:p-8 space-y-6">
        <div className="bg-brand-light border border-black/5 p-4 text-sm text-neutral-700 space-y-2">
          <p className="font-medium">Instructions</p>
          <ul className="list-disc list-inside space-y-1 text-neutral-600">
            <li>Upload a CSV file with headers matching the demo template.</li>
            <li>
              Required column: <code className="bg-white px-1">product_title</code>
            </li>
            <li>
              Optional variant columns: <code className="bg-white px-1">variant_N_title</code>,{' '}
              <code className="bg-white px-1">variant_N_price</code>,{' '}
              <code className="bg-white px-1">variant_N_selling_price</code>
              {' '}(e.g. <code className="bg-white px-1">variant_1_title</code>,{' '}
              <code className="bg-white px-1">variant_2_title</code>, etc.)
            </li>
            <li>
              Images are not included in CSV — add them via the product editor
              after import.
            </li>
            <li>
              Download the{' '}
              <a
                href="/demo-product-import.csv"
                className="text-neutral-800 underline font-medium"
              >
                demo CSV template
              </a>{' '}
              to see the correct format.
            </li>
          </ul>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">CSV File</label>
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="block w-full text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-[#0E0E0E] file:text-white file:cursor-pointer hover:file:opacity-90"
          />
        </div>

        {headers && preview && (
          <div>
            <h3 className="text-sm font-medium mb-2">Preview</h3>
            <div className="overflow-x-auto border border-black/10">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-neutral-50">
                    {headers.map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2 text-left font-medium text-neutral-600 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, i) => (
                    <tr key={i} className="border-t border-black/5">
                      {row.map((cell, j) => (
                        <td
                          key={j}
                          className="px-3 py-2 text-neutral-700 truncate max-w-[200px]"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Showing first {preview.length} rows
            </p>
          </div>
        )}

        {file && !result && (
          <button
            onClick={handleImport}
            disabled={importing}
            className="bg-[#0E0E0E] text-white px-6 py-2.5 text-sm hover:opacity-90 disabled:opacity-50"
          >
            {importing ? 'Importing...' : `Import ${file.name}`}
          </button>
        )}

        {result && (
          <div className="border-t border-black/10 pt-4">
            <h3 className="text-sm font-medium mb-2">Results</h3>
            <p className="text-sm text-green-700">
              {result.created} product{result.created !== 1 ? 's' : ''} created
            </p>
            {result.errors && result.errors.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-red-600 mb-1">
                  {result.errors.length} error{result.errors.length !== 1 ? 's' : ''}:
                </p>
                <ul className="text-xs text-red-600 space-y-0.5 list-disc list-inside">
                  {result.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
            <a
              href="/admin/products/list"
              className="inline-block mt-4 text-sm text-neutral-600 underline"
            >
              View all products →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
