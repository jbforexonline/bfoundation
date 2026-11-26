import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, MapPin, Calendar, QrCode } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Notice from '../../components/ui/Notice';
import useApi from '../../hooks/useApi';
import { api, formatDateTime, titleCase } from '../../api/client';
import '../../components/dashboard/DashboardPage.scss';

const TONE = { VALID: 'success', USED: 'neutral', CANCELLED: 'danger', EVENT_CANCELLED: 'danger' };
const LABEL = { VALID: 'Confirmed', USED: 'Checked in', CANCELLED: 'Cancelled', EVENT_CANCELLED: 'Event cancelled' };

export default function FanEventTicketsPage() {
  const { data, error, loading } = useApi('/tickets', { limit: 100 });
  const [qr, setQr] = useState(null); // ticket with qrCode
  const [qrError, setQrError] = useState('');
  const tickets = data?.tickets ?? [];

  const showQr = async (t) => {
    setQrError('');
    try {
      const res = await api(`/tickets/${t.id}`);
      setQr(res.ticket);
    } catch (err) {
      setQrError(err.message);
    }
  };

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Event Tickets</h1>
          <p className="dash-page__subtitle">Tickets you've claimed for upcoming BFOUNDATION events. Show the QR code at the entrance.</p>
        </div>
      </div>

      <Notice tone="error">{error?.message || qrError}</Notice>

      {loading ? (
        <p style={{ color: '#a8a49b' }}>Loading tickets…</p>
      ) : tickets.length === 0 ? (
        <p style={{ color: '#a8a49b' }}>
          No tickets yet — check the <Link to="/events" style={{ color: '#f0a93a' }}>Events page</Link> to see what's coming up.
        </p>
      ) : (
        <div className="dash-page__list">
          {tickets.map((t) => (
            <div className="dash-item" key={t.id}>
              <div className="dash-item__icon">
                <Ticket size={18} />
              </div>
              <div className="dash-item__body">
                <p className="dash-item__title">
                  {t.event.name} · {t.ticketType.name}
                </p>
                <p className="dash-item__meta">
                  <Calendar size={12} style={{ verticalAlign: -2, marginRight: 4 }} />
                  {formatDateTime(t.event.startsAt)}
                  {'  ·  '}
                  <MapPin size={12} style={{ verticalAlign: -2, margin: '0 4px 0 2px' }} />
                  {t.event.location}
                </p>
                <p className="dash-item__meta">Ticket code: {t.code}</p>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Badge tone={TONE[t.status]}>{LABEL[t.status] ?? titleCase(t.status)}</Badge>
                <button type="button" className="btn btn--outline" style={{ padding: '6px 12px', fontSize: '0.78rem' }} onClick={() => showQr(t)}>
                  <QrCode size={14} /> QR code
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={Boolean(qr)} title={qr ? qr.event.name : ''} onClose={() => setQr(null)}>
        {qr && (
          <div style={{ textAlign: 'center' }}>
            <img src={qr.qrCode} alt={`QR code for ticket ${qr.code}`} style={{ display: 'block', margin: '0 auto', width: 260, maxWidth: '100%', background: '#fff', borderRadius: 8, padding: 8 }} />
            <p style={{ marginTop: 12, fontWeight: 700, letterSpacing: 1 }}>{qr.code}</p>
            <p style={{ color: '#a8a49b', fontSize: '0.85rem' }}>
              {qr.ticketType.name} · {formatDateTime(qr.event.startsAt)} · {qr.event.location}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
