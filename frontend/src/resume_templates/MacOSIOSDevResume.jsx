import React from "react";

const MacOSIOSDeveloperResume = ({ resumeData }) => {
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
          {resumeData?.["Contact Information"]?.LinkedIn && (
            <p>
              LinkedIn:{" "}
              <a
                href={resumeData["Contact Information"].LinkedIn}
                target="_blank"
                rel="noopener noreferrer"
              >
                {resumeData["Contact Information"].LinkedIn}
              </a>
            </p>
          )}
        </div>
      </header>

      {/* About Section */}
      {resumeData?.About && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>About</h2>
          <p>{resumeData.About || 'About section not provided.'}</p>
        </section>
      )}

      {/* Relevant Work Section */}
      {resumeData?.RelevantWork && resumeData.RelevantWork.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Relevant Work</h2>
          {resumeData.RelevantWork.map((work, index) => (
            <div key={index} style={styles.workItem}>
              <h3>
                {work?.Role || 'Role not provided'} at {work?.Company || 'Company not provided'}
              </h3>
              <p>{work?.Dates || 'Dates not provided'}</p>
              <p>{work?.Description || 'Description not provided.'}</p>
            </div>
          ))}
        </section>
      )}

      {/* Projects Section */}
      {resumeData?.Projects && resumeData.Projects.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Projects</h2>
          {resumeData.Projects.map((project, index) => (
            <div key={index} style={styles.projectItem}>
              <h3>{project?.Name || 'Project Name not provided'}</h3>
              <p>{project?.Dates || 'Dates not provided'}</p>
              <p>{project?.Description || 'Description not provided.'}</p>
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
    marginBottom: "20px",
  },
  name: {
    fontSize: "28px",
    fontWeight: "bold",
    margin: "0",
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
  workItem: {
    marginBottom: "20px",
  },
  projectItem: {
    marginBottom: "20px",
  },
};

export default MacOSIOSDeveloperResume;
