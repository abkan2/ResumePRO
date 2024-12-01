import React from 'react';

const AndyResume = ({ resumeData }) => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.name}>{resumeData?.Name || 'Your Name'}</h1>
        <div style={styles.contactInfo}>
          <p>Phone: {resumeData?.Phone || 'Your Phone Number'}</p>
          <p>Email: {resumeData?.Email || 'Your Email'}</p>
          <p>Address: {resumeData?.Address || 'Your Address'}</p>
          <p>
            Website:{' '}
            <a href={resumeData?.Website || '#'} target="_blank" rel="noopener noreferrer">
              {resumeData?.Website || 'Your Website'}
            </a>
          </p>
        </div>
      </header>

      {resumeData?.PersonalData && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Personal Data</h2>
          <p>Name: {resumeData.PersonalData.Name || 'Name not provided'}</p>
          <p>Place of Birth: {resumeData.PersonalData.Birthplace || 'Not provided'}</p>
          <p>Date of Birth: {resumeData.PersonalData.Birthdate || 'Not provided'}</p>
          <p>Status: {resumeData.PersonalData.Status || 'Not provided'}</p>
        </section>
      )}

      {resumeData?.Education && resumeData.Education.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Education</h2>
          <ul style={styles.list}>
            {resumeData.Education.map((edu, index) => (
              <li key={index} style={styles.listItem}>
                <strong>{edu.Degree || 'Degree not provided'}</strong>, {edu.Field || 'Field not provided'}
                <br />
                {edu.Institution || 'Institution not provided'} ({edu.Dates || 'Dates not provided'})
              </li>
            ))}
          </ul>
        </section>
      )}

      {resumeData?.Experience && resumeData.Experience.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Experience</h2>
          {resumeData.Experience.map((job, index) => (
            <div key={index} style={styles.experience}>
              <h3>
                {job.Role || 'Role not provided'} at {job.Company || 'Company not provided'}
              </h3>
              <p>{job.Dates || 'Dates not provided'}</p>
              <p>{job.Description || 'Description not provided'}</p>
            </div>
          ))}
        </section>
      )}

      {/* Add more sections as needed, using similar patterns */}
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

export default AndyResume;
