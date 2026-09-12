import { useState } from 'react';
import { Search } from 'lucide-react';
import './DataTable.scss';

/**
 * Generic table for dashboard lists.
 * columns: [{ key, label, render?(row) }]
 * rows: array of objects
 * searchable: if true, shows a search box filtering on all string values
 */
export default function DataTable({ columns, rows, searchable = true, emptyLabel = 'Nothing here yet.' }) {
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? rows.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(query.trim().toLowerCase())
        )
      )
    : rows;

  return (
    <div className="data-table">
      {searchable && (
        <div className="data-table__search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      )}

      <div className="data-table__scroll">
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="data-table__empty">
                  {emptyLabel}
                </td>
              </tr>
            )}
            {filtered.map((row, i) => (
              <tr key={row.id ?? i}>
                {columns.map((col) => (
                  <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
