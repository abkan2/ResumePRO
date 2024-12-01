import React from "react";
import PropTypes from 'prop-types';

const ResearchResume = ({ resumeData }) => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.name}>{resumeData?.Name || 'Your Name'}</h1>
        <p>
          Email: {resumeData?.Email || 'your.email@example.com'} | 
          Phone: {resumeData?.Phone || 'Your Phone Number'} | 
          Address: {resumeData?.Address || 'Your Address'}
        </p>
        <p>
          LinkedIn:{" "}
          {resumeData?.LinkedIn ? (
            <a href={resumeData.LinkedIn} target="_blank" rel="noopener noreferrer">
              {resumeData.LinkedIn}
            </a>
          ) : (
            'Your LinkedIn'
          )}
        </p>
        <p>
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

      {resumeData?.ResearchInterests && resumeData.ResearchInterests.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Research Interests</h2>
          <ul style={styles.list}>
            {resumeData.ResearchInterests.map((interest, index) => (
              <li key={index} style={styles.listItem}>
                {interest || 'Interest not provided'}
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
                {edu?.Institution || 'Institution not provided'} ({edu?.Dates || 'Dates not provided'})
              </li>
            ))}
          </ul>
        </section>
      )}

      {resumeData?.ResearchExperience && resumeData.ResearchExperience.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Research Experience</h2>
          {resumeData.ResearchExperience.map((experience, index) => (
            <div key={index} style={styles.experience}>
              <h3>
                {experience?.Title || 'Title not provided'} at {experience?.Organization || 'Organization not provided'}
              </h3>
              <p>{experience?.Dates || 'Dates not provided'}</p>
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

ResearchResume.propTypes = {
  resumeData: PropTypes.shape({
    Name: PropTypes.string,
    Email: PropTypes.string,
    Phone: PropTypes.string,
    Address: PropTypes.string,
    LinkedIn: PropTypes.string,
    Website: PropTypes.string,
    ResearchInterests: PropTypes.arrayOf(PropTypes.string),
    Education: PropTypes.arrayOf(
      PropTypes.shape({
        Degree: PropTypes.string,
        Field: PropTypes.string,
        Institution: PropTypes.string,
        Dates: PropTypes.string,
      })
    ),
    ResearchExperience: PropTypes.arrayOf(
      PropTypes.shape({
        Title: PropTypes.string,
        Organization: PropTypes.string,
        Dates: PropTypes.string,
        Responsibilities: PropTypes.arrayOf(PropTypes.string),
      })
    ),
    Skills: PropTypes.arrayOf(PropTypes.string),
  }),
};

ResearchResume.defaultProps = {
  resumeData: {
    Name: 'Your Name',
    Email: 'your.email@example.com',
    Phone: 'Your Phone Number',
    Address: 'Your Address',
    LinkedIn: 'Your LinkedIn',
    Website: 'Your Website',
    ResearchInterests: [],
    Education: [],
    ResearchExperience: [],
    Skills: [],
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

export default ResearchResume;
