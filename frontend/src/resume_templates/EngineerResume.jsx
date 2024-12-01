import React from "react";

const EngineerResume = ({ resumeData }) => {
  return (
    <div style={styles.container}>
      {/* Header Section */}
      <header style={styles.header}>
        <h1 style={styles.name}>{resumeData?.Name || 'Your Name'}</h1>
        <div style={styles.contactInfo}>
          <p>Email: {resumeData?.["Contact Information"]?.Email || 'your.email@example.com'}</p>
          <p>Phone: {resumeData?.["Contact Information"]?.Phone || 'Your Phone Number'}</p>
          <p>
            Website:{" "}
            <a
              href={resumeData?.["Contact Information"]?.Website || '#'}
              target="_blank"
              rel="noopener noreferrer"
            >
              {resumeData?.["Contact Information"]?.Website || 'Your Website'}
            </a>
          </p>
          <p>
            LinkedIn:{" "}
            <a
              href={resumeData?.["Contact Information"]?.LinkedIn || '#'}
              target="_blank"
              rel="noopener noreferrer"
            >
              {resumeData?.["Contact Information"]?.LinkedIn || 'Your LinkedIn'}
            </a>
          </p>
        </div>
      </header>

      {/* About Section */}
      {resumeData?.About && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>About</h2>
          <p>{resumeData.About || 'About section not provided.'}</p>
        </section>
      )}

      {/* Professional Experience Section */}
      {resumeData?.Experience && resumeData.Experience.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Professional Experience</h2>
          {resumeData.Experience.map((experience, index) => (
            <div key={index} style={styles.experience}>
              <h3>
                {experience?.Role || 'Role not provided'} at {experience?.Company || 'Company not provided'}
              </h3>
              <p>
                {experience?.Location || 'Location not provided'} | {experience?.Dates || 'Dates not provided'}
              </p>
              {experience?.Responsibilities && experience.Responsibilities.length > 0 ? (
                <ul style={styles.list}>
                  {experience.Responsibilities.map((resp, idx) => (
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

      {/* Education Section */}
      {resumeData?.Education && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Education</h2>
          <div style={styles.education}>
            <p>
              <strong>{resumeData.Education.Degree || 'Degree not provided'}</strong>, {resumeData.Education.Field || 'Field not provided'}
            </p>
            <p>
              {resumeData.Education.Institution || 'Institution not provided'}, {resumeData.Education.Location || 'Location not provided'}
            </p>
            <p>Duration: {resumeData.Education.Dates || 'Dates not provided'}</p>
            <p>GPA: {resumeData.Education.GPA || 'GPA not provided'}</p>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {resumeData?.Skills && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Skills</h2>
          <div style={styles.skills}>
            <p>
              <strong>Programming Languages:</strong> {resumeData.Skills["Programming Languages"]?.join(", ") || 'N/A'}
            </p>
            <p>
              <strong>Frameworks & Tools:</strong> {resumeData.Skills["Frameworks Tools"]?.join(", ") || 'N/A'}
            </p>
            <p>
              <strong>Software:</strong> {resumeData.Skills.Software?.join(", ") || 'N/A'}
            </p>
            <p>
              <strong>Relevant Coursework:</strong> {resumeData.Skills["Relevant Coursework"]?.join(", ") || 'N/A'}
            </p>
          </div>
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
    borderBottom: "2px solid #ccc",
    paddingBottom: "10px",
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
    color: "#4c6b94",
    borderBottom: "2px solid #4c6b94",
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

export default EngineerResume;
