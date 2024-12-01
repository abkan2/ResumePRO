import React from "react";

const CiesResume = ({ resumeData }) => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.name}>{resumeData?.Name || 'Your Name'}</h1>
        <div style={styles.contactInfo}>
          <p>Email: {resumeData?.Email || 'your.email@example.com'}</p>
          <p>Phone: {resumeData?.Phone || 'Your Phone Number'}</p>
          <p>
            GitHub:{" "}
            <a
              href={resumeData?.GitHub || '#'}
              target="_blank"
              rel="noopener noreferrer"
            >
              {resumeData?.GitHub || 'Your GitHub'}
            </a>
          </p>
          <p>
            LinkedIn:{" "}
            <a
              href={resumeData?.LinkedIn || '#'}
              target="_blank"
              rel="noopener noreferrer"
            >
              {resumeData?.LinkedIn || 'Your LinkedIn'}
            </a>
          </p>
        </div>
      </header>

      {resumeData?.Summary && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Summary</h2>
          <p>{resumeData.Summary || 'Summary not provided.'}</p>
        </section>
      )}

      {resumeData?.Experience && resumeData.Experience.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Experience</h2>
          {resumeData.Experience.map((job, index) => (
            <div key={index} style={styles.experience}>
              <h3>
                {job?.Role || 'Role not provided'} at {job?.Company || 'Company not provided'}
              </h3>
              <p>
                {job?.Location || 'Location not provided'} | {job?.Dates || 'Dates not provided'}
              </p>
              {job?.Responsibilities && job.Responsibilities.length > 0 ? (
                <ul style={styles.list}>
                  {job.Responsibilities.map((resp, idx) => (
                    <li key={idx} style={styles.listItem}>
                      {resp || 'Responsibility not provided'}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Responsibilities not provided.</p>
              )}
            </div>
          ))}
        </section>
      )}

      {resumeData?.Education && resumeData.Education.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Education</h2>
          <ul style={styles.list}>
            {resumeData.Education.map((edu, index) => (
              <li key={index} style={styles.listItem}>
                <strong>{edu?.Degree || 'Degree not provided'}</strong>, {edu?.Field || 'Field not provided'}
                <br />
                {edu?.Institution || 'Institution not provided'} ({edu?.Dates || 'Dates not provided'})
              </li>
            ))}
          </ul>
        </section>
      )}

      {resumeData?.Skills && resumeData.Skills.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Skills</h2>
          <ul style={styles.list}>
            {resumeData.Skills.map((skill, index) => (
              <li key={index} style={styles.listItem}>
                {skill || 'Skill not provided'}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    margin: "20px auto",
    padding: "20px",
    maxWidth: "800px",
    backgroundColor: "#ffffff",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  name: {
    fontSize: "28px",
    fontWeight: "bold",
    margin: "0",
  },
  contactInfo: {
    textAlign: "center",
    marginTop: "10px",
  },
  section: {
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "22px",
    color: "#333",
    borderBottom: "2px solid #333",
    marginBottom: "10px",
  },
  list: {
    listStyleType: "disc",
    paddingLeft: "20px",
  },
  listItem: {
    marginBottom: "10px",
  },
  experience: {
    marginBottom: "20px",
  },
};

export default CiesResume;
