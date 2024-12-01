import React from "react";

const ResumeTemplate1 = ({ resumeData }) => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.name}>{resumeData?.Name || 'Your Name'}</h1>
          <p>
            {resumeData?.Title || 'Your Title'} - {resumeData?.Location || 'Your Location'}
          </p>
        </div>
        <div style={styles.contactInfo}>
          <p>Email: {resumeData?.Email || 'your.email@example.com'}</p>
          <p>Phone: {resumeData?.Phone || 'Your Phone Number'}</p>
        </div>
      </header>

      {resumeData?.Status && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Status</h2>
          <p>{resumeData.Status || 'Status not provided.'}</p>
        </section>
      )}

      {resumeData?.Skills && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Skills</h2>
          <p>{resumeData.Skills || 'Skills not provided.'}</p>
        </section>
      )}

      {resumeData?.Interests && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Interests</h2>
          <p>{resumeData.Interests || 'Interests not provided.'}</p>
        </section>
      )}

      {resumeData?.Summary && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Summary</h2>
          <p>{resumeData.Summary || 'Summary not provided.'}</p>
        </section>
      )}

      {resumeData?.Experience && resumeData.Experience.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Experience</h2>
          <ul style={styles.list}>
            {resumeData.Experience.map((item, index) => (
              <li key={index} style={styles.listItem}>
                <strong>{item?.Role || 'Role not provided'}</strong> at {item?.Company || 'Company not provided'} ({item?.Dates || 'Dates not provided'})
                <p>{item?.Description || 'Description not provided.'}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {resumeData?.Education && resumeData.Education.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Education</h2>
          <ul style={styles.list}>
            {resumeData.Education.map((item, index) => (
              <li key={index} style={styles.listItem}>
                <strong>{item?.Degree || 'Degree not provided'}</strong> - {item?.Field || 'Field not provided'} ({item?.Dates || 'Dates not provided'})
                <p>{item?.Institution || 'Institution not provided'}</p>
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
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "2px solid #ccc",
    paddingBottom: "10px",
    marginBottom: "20px",
  },
  name: {
    fontSize: "32px",
    fontWeight: "bold",
    margin: "0",
  },
  contactInfo: {
    textAlign: "right",
  },
  section: {
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "20px",
    color: "#4c6b94",
    borderBottom: "2px solid #4c6b94",
    marginBottom: "10px",
  },
  list: {
    listStyleType: "none",
    padding: "0",
  },
  listItem: {
    marginBottom: "10px",
  },
};

export default ResumeTemplate1;
