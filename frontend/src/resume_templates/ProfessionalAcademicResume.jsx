import React from "react";
import PropTypes from 'prop-types';

const ProfessionalAcademicResume = ({ resumeData }) => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.name}>
          {resumeData?.Name || 'Your Name'}, {resumeData?.Degree || 'Your Degree'}
        </h1>
        <p>
          Email: {resumeData?.Email || 'your.email@example.com'} | 
          LinkedIn:{" "}
          {resumeData?.LinkedIn ? (
            <a href={resumeData.LinkedIn} target="_blank" rel="noopener noreferrer">
              {resumeData.LinkedIn}
            </a>
          ) : (
            'Your LinkedIn'
          )} | 
          Website:{" "}
          {resumeData?.Website ? (
            <a href={resumeData.Website} target="_blank" rel="noopener noreferrer">
              {resumeData.Website}
            </a>
          ) : (
            'Your Website'
          )}
        </p>
      </header>

      {resumeData?.EmploymentHistory && resumeData.EmploymentHistory.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Employment History</h2>
          <ul style={styles.list}>
            {resumeData.EmploymentHistory.map((job, index) => (
              <li key={index} style={styles.listItem}>
                <strong>{job?.Title || 'Title not provided'}</strong> at {job?.Organization || 'Organization not provided'} ({job?.Dates || 'Dates not provided'})
                <p>{job?.Description || 'Description not provided.'}</p>
              </li>
            ))}
          </ul>
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
                <span>{edu?.Institution || 'Institution not provided'}</span> ({edu?.Dates || 'Dates not provided'})
                <p>Thesis: {edu?.Thesis || 'Thesis not provided.'}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {resumeData?.Publications && resumeData.Publications.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Research Publications</h2>
          <ul style={styles.list}>
            {resumeData.Publications.map((pub, index) => (
              <li key={index} style={styles.listItem}>
                <strong>{pub?.Title || 'Title not provided'}</strong>
                <p>{pub?.Authors || 'Authors not provided'} ({pub?.Year || 'Year not provided'})</p>
                <p>
                  {pub?.Link ? (
                    <a href={pub.Link} target="_blank" rel="noopener noreferrer">
                      {pub.Link}
                    </a>
                  ) : (
                    'Link not provided'
                  )}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

ProfessionalAcademicResume.propTypes = {
  resumeData: PropTypes.shape({
    Name: PropTypes.string,
    Degree: PropTypes.string,
    Email: PropTypes.string,
    LinkedIn: PropTypes.string,
    Website: PropTypes.string,
    EmploymentHistory: PropTypes.arrayOf(
      PropTypes.shape({
        Title: PropTypes.string,
        Organization: PropTypes.string,
        Dates: PropTypes.string,
        Description: PropTypes.string,
      })
    ),
    Education: PropTypes.arrayOf(
      PropTypes.shape({
        Degree: PropTypes.string,
        Field: PropTypes.string,
        Institution: PropTypes.string,
        Dates: PropTypes.string,
        Thesis: PropTypes.string,
      })
    ),
    Publications: PropTypes.arrayOf(
      PropTypes.shape({
        Title: PropTypes.string,
        Authors: PropTypes.string,
        Year: PropTypes.string,
        Link: PropTypes.string,
      })
    ),
  }),
};

ProfessionalAcademicResume.defaultProps = {
  resumeData: {
    Name: 'Your Name',
    Degree: 'Your Degree',
    Email: 'your.email@example.com',
    LinkedIn: 'Your LinkedIn',
    Website: 'Your Website',
    EmploymentHistory: [],
    Education: [],
    Publications: [],
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

export default ProfessionalAcademicResume;
