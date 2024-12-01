import React from "react";
import PropTypes from 'prop-types';

const ZeyiFanResume = ({ resumeData }) => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.name}>{resumeData?.Name || 'Your Name'}</h1>
        <p>{resumeData?.Tagline || 'Your Tagline'}</p>
      </header>

      {resumeData?.Contacts && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Contacts</h2>
          <ul style={styles.list}>
            <li>
              <strong>Phone:</strong> {resumeData.Contacts?.Phone || 'Your Phone Number'}
            </li>
            <li>
              <strong>Email:</strong> {resumeData.Contacts?.Email || 'your.email@example.com'}
            </li>
            <li>
              <strong>Website:</strong>{" "}
              {resumeData.Contacts?.Website ? (
                <a href={resumeData.Contacts.Website} target="_blank" rel="noopener noreferrer">
                  {resumeData.Contacts.Website}
                </a>
              ) : (
                'Your Website'
              )}
            </li>
            <li>
              <strong>GitHub:</strong>{" "}
              {resumeData.Contacts?.GitHub ? (
                <a href={resumeData.Contacts.GitHub} target="_blank" rel="noopener noreferrer">
                  {resumeData.Contacts.GitHub}
                </a>
              ) : (
                'Your GitHub'
              )}
            </li>
            <li>
              <strong>LinkedIn:</strong>{" "}
              {resumeData.Contacts?.LinkedIn ? (
                <a href={resumeData.Contacts.LinkedIn} target="_blank" rel="noopener noreferrer">
                  {resumeData.Contacts.LinkedIn}
                </a>
              ) : (
                'Your LinkedIn'
              )}
            </li>
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

      {resumeData?.Education && resumeData.Education.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Education</h2>
          <ul style={styles.list}>
            {resumeData.Education.map((edu, index) => (
              <li key={index} style={styles.listItem}>
                <strong>{edu?.Degree || 'Degree not provided'}</strong>, {edu?.Field || 'Field not provided'} - {edu?.Institution || 'Institution not provided'} ({edu?.Dates || 'Dates not provided'})
              </li>
            ))}
          </ul>
        </section>
      )}

      {resumeData?.Experience && resumeData.Experience.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Work Experience</h2>
          {resumeData.Experience.map((exp, index) => (
            <div key={index} style={styles.experience}>
              <h3>
                {exp?.Position || 'Position not provided'} at {exp?.Company || 'Company not provided'}
              </h3>
              <p>{exp?.Dates || 'Dates not provided'}</p>
              {exp?.Responsibilities && exp.Responsibilities.length > 0 ? (
                <ul style={styles.list}>
                  {exp.Responsibilities.map((resp, idx) => (
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

      {resumeData?.Projects && resumeData.Projects.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Projects</h2>
          {resumeData.Projects.map((project, index) => (
            <div key={index} style={styles.projectItem}>
              <h3>{project?.Name || 'Project Name not provided'}</h3>
              <p>{project?.Description || 'Description not provided.'}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

ZeyiFanResume.propTypes = {
  resumeData: PropTypes.shape({
    Name: PropTypes.string,
    Tagline: PropTypes.string,
    Contacts: PropTypes.shape({
      Phone: PropTypes.string,
      Email: PropTypes.string,
      Website: PropTypes.string,
      GitHub: PropTypes.string,
      LinkedIn: PropTypes.string,
    }),
    Skills: PropTypes.arrayOf(PropTypes.string),
    Education: PropTypes.arrayOf(
      PropTypes.shape({
        Degree: PropTypes.string,
        Field: PropTypes.string,
        Institution: PropTypes.string,
        Dates: PropTypes.string,
      })
    ),
    Experience: PropTypes.arrayOf(
      PropTypes.shape({
        Position: PropTypes.string,
        Company: PropTypes.string,
        Dates: PropTypes.string,
        Responsibilities: PropTypes.arrayOf(PropTypes.string),
      })
    ),
    Projects: PropTypes.arrayOf(
      PropTypes.shape({
        Name: PropTypes.string,
        Description: PropTypes.string,
      })
    ),
  }),
};

ZeyiFanResume.defaultProps = {
  resumeData: {
    Name: 'Your Name',
    Tagline: 'Your Tagline',
    Contacts: {
      Phone: 'Your Phone Number',
      Email: 'your.email@example.com',
      Website: 'Your Website',
      GitHub: 'Your GitHub',
      LinkedIn: 'Your LinkedIn',
    },
    Skills: [],
    Education: [],
    Experience: [],
    Projects: [],
  },
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
  list: {
    listStyleType: "circle",
    paddingLeft: "20px",
  },
  listItem: {
    marginBottom: "10px",
  },
  experience: {
    marginBottom: "20px",
  },
  projectItem: {
    marginBottom: "20px",
  },
};

export default ZeyiFanResume;
