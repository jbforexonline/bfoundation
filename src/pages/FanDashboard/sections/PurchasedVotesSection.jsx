import { Link } from 'react-router-dom';
import { purchasedVotes } from '../fanDashboardData';

export default function PurchasedVotesSection() {
  return (
    <div>
      <div className="dash-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1>Purchased Votes</h1>
          <p>Vote packages you've bought.</p>
        </div>
        <Link to="/vote" className="btn btn--outline">Buy more votes</Link>
      </div>

      <div className="dash-table">
        <table>
          <thead>
            <tr>
              <th>Package</th>
              <th>Votes</th>
              <th>Price</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {purchasedVotes.map((p) => (
              <tr key={p.id}>
                <td>{p.package}</td>
                <td>{p.votes}</td>
                <td>{p.price}</td>
                <td>{p.date}</td>
                <td><span className="dash-badge dash-badge--good">{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
