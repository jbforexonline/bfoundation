import { eventTickets } from '../fanDashboardData';

export default function EventTicketsSection() {
  return (
    <div>
      <div className="dash-header">
        <h1>Event Tickets</h1>
        <p>Tickets you've booked for BFOUNDATION events.</p>
      </div>

      {eventTickets.length === 0 ? (
        <div className="dash-empty">No tickets booked yet.</div>
      ) : (
        <div className="dash-table">
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Date</th>
                <th>Venue</th>
                <th>Seat</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {eventTickets.map((t) => (
                <tr key={t.id}>
                  <td>{t.event}</td>
                  <td>{t.date}</td>
                  <td>{t.venue}</td>
                  <td>{t.seat}</td>
                  <td><span className="dash-badge dash-badge--good">{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
