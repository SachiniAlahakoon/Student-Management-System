export default function ProfileManagement() {
  return (
    <div className="card">
      <div className="card-header">
        <h3>PROFILE MANAGEMENT</h3>
        <button className="green">CREATE NEW PROFILE</button>
      </div>

      <input type="text" placeholder="ENTER USER ID" />

      <div className="button-group">
        <button className="blue">Preview</button>
        <button className="red">Delete Profile</button>
      </div>

      <div className="preview-box">
        <p><b>N.M. Perera</b></p>
        <p>Student</p>
        <p>User ID: 234567</p>
      </div>
    </div>
  );
}
