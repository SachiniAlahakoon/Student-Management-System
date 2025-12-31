export default function SubjectManagement() {
  return (
    <div className="card">
      <div className="card-header">
        <h3>SUBJECT MANAGEMENT</h3>
        <button className="green">ADD NEW SUBJECT</button>
      </div>

      <input type="text" placeholder="ENTER SUBJECT ID" />

      <div className="button-group">
        <button className="blue">Preview</button>
        <button className="red">Delete Subject</button>
      </div>

      <div className="preview-box">
        <p><b>History</b></p>
        <p>Mr. Ranasinghe</p>
        <p>Subject ID: 56748</p>
        <p>Teacher ID: 88345</p>
      </div>
    </div>
  );
}
