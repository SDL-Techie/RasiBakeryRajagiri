


import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import './BackupRestore.css'

const BackupRestore = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loadingBackup, setLoadingBackup] = useState(false);
  const [loadingRestore, setLoadingRestore] = useState(false);

  const handleBackup = async () => {
    try {
      setLoadingBackup(true);

      const response = await axios.get(
        "http://localhost:4000/api/v1/backup",
        {
          responseType: "blob"
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");

      link.href = url;
      link.download = `backup-${Date.now()}.json`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      toast.success("Database backup downloaded as JSON");
    } catch (error) {
      toast.error("Backup failed");
    } finally {
      setLoadingBackup(false);
    }
  };

  const handleRestore = async () => {
    if (!file) {
      toast.error("Please select backup file");
      return;
    }

    if (!file.name.endsWith('.json')) {
      toast.error("Please select a valid JSON backup file");
      return;
    }

    try {
      setLoadingRestore(true);

      const formData = new FormData();

      formData.append("file", file);

      const res = await axios.post(
        "http://localhost:4000/api/v1/restore",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      toast.success(res.data.message);
      setFile(null);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        "Restore failed"
      );
    } finally {
      setLoadingRestore(false);
    }
  };

//   return (
//     <div style={{ padding: "30px" }}>
//       <h2>Database Backup & Restore</h2>

//       <br />

//       <button
//         onClick={handleBackup}
//         disabled={loadingBackup}
//       >
//         {loadingBackup
//           ? "Creating Backup..."
//           : "Download Backup (JSON)"}
//       </button>

//       <hr style={{ margin: "30px 0" }} />

//       <input
//         type="file"
//         accept=".json"
//         onChange={(e) =>
//           setFile(e.target.files?.[0] || null)
//         }
//       />

//       <br />
//       <br />

//       <button
//         onClick={handleRestore}
//         disabled={loadingRestore}
//       >
//         {loadingRestore
//           ? "Restoring..."
//           : "Restore Database"}
//       </button>
//     </div>
//   );

return (
  <div className="backup-restore-container">
    <h2>Database Backup & Restore</h2>
    <p className="subtitle">Securely export your data records or recover structural point backups.</p>

    <div className="backup-section">
      <p className="section-title">Database Export</p>
      <button
        className="btn-backup"
        onClick={handleBackup}
        disabled={loadingBackup}
      >
        {loadingBackup ? "Creating Backup..." : "Download Backup (JSON)"}
      </button>
    </div>

    <hr className="divider" />

    <div className="restore-section">
      <p className="section-title">Database Import</p>
      <div className="file-upload-wrapper">
        <input
          type="file"
          accept=".json"
          className="file-upload-input"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      <button
        className="btn-restore"
        onClick={handleRestore}
        disabled={loadingRestore}
      >
        {loadingRestore ? "Restoring..." : "Restore Database"}
      </button>
    </div>
  </div>
);

};

export default BackupRestore;