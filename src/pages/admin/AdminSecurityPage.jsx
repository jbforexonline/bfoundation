import { useState } from 'react';
import { ShieldAlert, ShieldCheck, Activity, Eye } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Notice from '../../components/ui/Notice';
import useApi from '../../hooks/useApi';
import { api, formatDateTime, timeAgo } from '../../api/client';
import '../../components/dashboard/DashboardPage.scss';

const SEVERITY = { HIGH: 'danger', MEDIUM: 'warning', LOW: 'neutral' };
const TYPES = {
  VOTE_VELOCITY_IP: 'Too many votes from one network',
  FAST_NEW_ACCOUNT_VOTE: 'New account voted within minutes',
  SIGNUP_BURST_IP: 'Many sign-ups from one network',
};
const small = { padding: '6px 12px', fontSize: '0.78rem' };

function FraudTab() {
  const [status, setStatus] = useState('open');
  const { data, error, loading, reload } = useApi('/admin/security/fraud-flags', { status, limit: 100 });
  const [notice, setNotice] = useState(null);

  const resolve = async (f) => {
    const resolution = window.prompt('What did you find? (optional note)');
    if (resolution === null) return;
    try {
      await api(`/admin/security/fraud-flags/${f.id}/resolve`, { method: 'PATCH', body: { resolution } });
      setNotice({ tone: 'success', text: 'Flag marked as reviewed.' });
      reload();
    } catch (err) {
      setNotice({ tone: 'error', text: err.message });
    }
  };

  const rows = (data?.flags ?? []).map((f) => ({ id: f.id, raw: f }));
  return (
    <>
      <Notice tone={notice?.tone}>{notice?.text}</Notice>
      <Notice tone="error">{error?.message}</Notice>
      <div className="dash-page__stats">
        <StatCard icon={ShieldAlert} label="Open flags" value={data?.stats.open ?? '—'} />
        <StatCard icon={ShieldAlert} label="High severity (open)" value={data?.stats.openHigh ?? '—'} />
        <StatCard icon={ShieldCheck} label="Rule" value="Review, then act" sub="Suspend accounts or adjust votes if needed" />
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {[
          ['open', 'Open'],
          ['resolved', 'Reviewed'],
          ['all', 'All'],
        ].map(([v, l]) => (
          <button key={v} type="button" className={`btn ${status === v ? 'btn--gold' : 'btn--outline'}`} style={small} onClick={() => setStatus(v)}>
            {l}
          </button>
        ))}
      </div>
      <DataTable
        emptyLabel={loading ? 'Loading…' : 'No suspicious activity. 🎉'}
        columns={[
          { key: 'when', label: 'When', render: (row) => timeAgo(row.raw.createdAt) },
          { key: 'type', label: 'What', render: (row) => TYPES[row.raw.type] ?? row.raw.type },
          { key: 'severity', label: 'Severity', render: (row) => <Badge tone={SEVERITY[row.raw.severity]}>{row.raw.severity}{row.raw.blocked ? ' · blocked' : ''}</Badge> },
          { key: 'user', label: 'Account', render: (row) => (row.raw.user ? `${row.raw.user.name} (${row.raw.user.email})` : '—') },
          { key: 'ip', label: 'Network (IP)', render: (row) => row.raw.ipAddress ?? '—' },
          { key: 'details', label: 'Details', render: (row) => <code style={{ fontSize: '0.72rem' }}>{JSON.stringify(row.raw.details)}</code> },
          {
            key: 'actions',
            label: '',
            render: (row) =>
              row.raw.resolved ? (
                <span style={{ fontSize: '0.78rem', color: '#a8a49b' }} title={row.raw.resolution ?? ''}>
                  Reviewed by {row.raw.resolvedBy}
                </span>
              ) : (
                <button type="button" className="btn btn--outline" style={small} onClick={() => resolve(row.raw)}>
                  <ShieldCheck size={14} /> Mark reviewed
                </button>
              ),
          },
        ]}
        rows={rows}
      />
    </>
  );
}

function AuditTab() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data, error, loading } = useApi('/admin/security/audit-logs', { page, limit: 50, entity: search || undefined });
  const [open, setOpen] = useState(null);
  const pages = data?.pagination.totalPages ?? 1;
  const rows = (data?.logs ?? []).map((l) => ({ id: l.id, raw: l }));
  const ENTITIES = ['', 'contestants', 'applications', 'nominations', 'categories', 'votes', 'events', 'tickets', 'sponsors', 'hall-of-fame', 'users', 'contact-messages', 'newsletter', 'notifications', 'security'];
  return (
    <>
      <Notice tone="error">{error?.message}</Notice>
      <p style={{ color: '#a8a49b', fontSize: '0.85rem', marginBottom: 12 }}>
        Every change made in the admin dashboard is recorded automatically (passwords are never stored).
      </p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        {ENTITIES.map((e) => (
          <button key={e} type="button" className={`btn ${search === e ? 'btn--gold' : 'btn--outline'}`} style={small} onClick={() => { setSearch(e); setPage(1); }}>
            {e || 'Everything'}
          </button>
        ))}
      </div>
      <DataTable
        searchable={false}
        emptyLabel={loading ? 'Loading…' : 'Nothing recorded yet.'}
        columns={[
          { key: 'when', label: 'When', render: (row) => formatDateTime(row.raw.createdAt) },
          { key: 'who', label: 'Who', render: (row) => (row.raw.actor ? `${row.raw.actor.name} (${row.raw.actor.role.toLowerCase()})` : '—') },
          { key: 'action', label: 'Action', render: (row) => <code style={{ fontSize: '0.75rem' }}>{row.raw.action}</code> },
          { key: 'ip', label: 'IP', render: (row) => row.raw.ipAddress ?? '—' },
          {
            key: 'actions',
            label: '',
            render: (row) => (
              <button type="button" className="btn btn--outline" style={small} onClick={() => setOpen(row.raw)}>
                <Eye size={14} /> Details
              </button>
            ),
          },
        ]}
        rows={rows}
      />
      {pages > 1 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center' }}>
          <button type="button" className="btn btn--outline" style={small} disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </button>
          <span style={{ color: '#a8a49b', fontSize: '0.85rem' }}>
            Page {page} of {pages}
          </span>
          <button type="button" className="btn btn--outline" style={small} disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      )}
      <Modal isOpen={Boolean(open)} title={open?.action ?? ''} onClose={() => setOpen(null)}>
        {open && (
          <div style={{ display: 'grid', gap: 8, fontSize: '0.85rem' }}>
            <p>
              <strong>Who:</strong> {open.actor ? `${open.actor.name} · ${open.actor.email}` : '—'}
            </p>
            <p>
              <strong>When:</strong> {formatDateTime(open.createdAt)} · <strong>IP:</strong> {open.ipAddress ?? '—'}
            </p>
            {open.entityId && (
              <p>
                <strong>Target id:</strong> <code>{open.entityId}</code>
              </p>
            )}
            <pre style={{ background: '#16130d', padding: 12, borderRadius: 8, overflowX: 'auto', fontSize: '0.78rem' }}>
              {JSON.stringify(open.details ?? {}, null, 2)}
            </pre>
          </div>
        )}
      </Modal>
    </>
  );
}

// Admins only: suspicious-activity flags from the fraud checks, and the activity log.
export default function AdminSecurityPage() {
  const [tab, setTab] = useState('fraud');
  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Security</h1>
          <p className="dash-page__subtitle">Suspicious voting / sign-up activity and the log of every admin change.</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button type="button" className={`btn ${tab === 'fraud' ? 'btn--gold' : 'btn--outline'}`} onClick={() => setTab('fraud')}>
          <ShieldAlert size={16} /> Fraud flags
        </button>
        <button type="button" className={`btn ${tab === 'audit' ? 'btn--gold' : 'btn--outline'}`} onClick={() => setTab('audit')}>
          <Activity size={16} /> Activity log
        </button>
      </div>
      {tab === 'fraud' ? <FraudTab /> : <AuditTab />}
    </div>
  );
}
