import { fanProfile } from '../fanDashboardData';

export default function ProfileSection() {
  return (
    <div>
      <div className="dash-header">
        <h1>Profile</h1>
        <p>Manage the details tied to your fan account.</p>
      </div>

      <form className="dash-form" onSubmit={(e) => e.preventDefault()}>
        <label>
          Full name
          <input type="text" defaultValue={fanProfile.name} />
        </label>
        <label>
          Email
          <input type="email" defaultValue={fanProfile.email} />
        </label>
        <label>
          Phone
          <input type="tel" defaultValue={fanProfile.phone} />
        </label>
        <label>
          Member since
          <input type="text" defaultValue={fanProfile.joined} disabled />
        </label>
        <button type="submit" className="btn btn--gold">Save Changes</button>
      </form>
    </div>
  );
}
