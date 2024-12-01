import React from "react";
import PropTypes from 'prop-types';

const ResumeTemplate2 = ({ resumeData }) => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.name}>{resumeData?.Name || 'Your Name'}</h1>
        <div style={styles.contactInfo}>
          <p>{resumeData?.Address || 'Your Address'}</p>
          <p>Email: {resumeData?.Email || 'your.email@example.com'}</p>
          <p>Phone: {resumeData?.Phone || 'Your Phone Number'}</p>
        </div>
      </header>

      {resumeData?.Education ? (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Education</h2>
          <p>{resumeData.Education || 'Education details not provided.'}</p>
        </section>
      ) : null}

      {resumeData?.Experience && resumeData.Experience.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Experience</h2>
          <ul style={styles.list}>
            {resumeData.Experience.map((item, index) => (
              <li key={index} style={styles.listItem}>
                <strong>{item?.Role || 'Role not provided'}</strong> - {item?.Company || 'Company not provided'} ({item?.Location || 'Location not provided'}, {item?.Dates || 'Dates not provided'})
                <p>{item?.Description || 'Description not provided.'}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {resumeData?.Projects && resumeData.Projects.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Projects</h2>
          <ul style={styles.list}>
            {resumeData.Projects.map((project, index) => (
              <li key={index} style={styles.listItem}>
                <strong>{project?.Title || 'Project Title not provided'}</strong> ({project?.Dates || 'Dates not provided'})
                <p>{project?.Description || 'Description not provided.'}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {resumeData?.Additional && resumeData.Additional.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Additional</h2>
          <ul style={styles.list}>
            {resumeData.Additional.map((item, index) => (
              <li key={index} style={styles.listItem}>
                {item || 'Additional information not provided.'}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

ResumeTemplate2.propTypes = {
  resumeData: PropTypes.shape({
    Name: PropTypes.string,
    Address: PropTypes.string,
    Email: PropTypes.string,
    Phone: PropTypes.string,
    Education: PropTypes.string,
    Experience: PropTypes.arrayOf(
      PropTypes.shape({
        Role: PropTypes.string,
        Company: PropTypes.string,
        Location: PropTypes.string,
        Dates: PropTypes.string,
        Description: PropTypes.string,
      })
    ),
    Projects: PropTypes.arrayOf(
      PropTypes.shape({
        Title: PropTypes.string,
        Dates: PropTypes.string,
        Description: PropTypes.string,
      })
    ),
    Additional: PropTypes.arrayOf(PropTypes.string),
  }),
};

ResumeTemplate2.defaultProps = {
  resumeData: {
    Name: 'Your Name',
    Address: 'Your Address',
    Email: 'your.email@example.com',
    Phone: 'Your Phone Number',
    Education: 'Education details not provided.',
    Experience: [],
    Projects: [],
    Additional: [],
  },
};



const styles = {
  container: {
    fontFamily: "Georgia, serif",
    margin: "20px auto",
    padding: "20px",
    maxWidth: "800px",
    backgroundColor: "#f9f9f9",
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
    listStyleType: "none",
    padding: "0",
  },
  listItem: {
    marginBottom: "10px",
  },
};

export default ResumeTemplate2;
