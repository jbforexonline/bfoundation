import { voteHistory } from '../fanDashboardData';

export default function VoteHistorySection() {
  return (
    <div>
      <div className="dash-header">
        <h1>Vote History</h1>
        <p>Every vote you've cast, most recent first.</p>
      </div>

      {voteHistory.length === 0 ? (
        <div className="dash-empty">You haven't voted yet.</div>
      ) : (
        <div className="dash-table">
          <table>
            <thead>
              <tr>
                <th>Contestant</th>
                <th>Category</th>
                <th>Votes</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {voteHistory.map((v) => (
                <tr key={v.id}>
                  <td>{v.contestant}</td>
                  <td>{v.category}</td>
                  <td>{v.votes}</td>
                  <td>{v.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
