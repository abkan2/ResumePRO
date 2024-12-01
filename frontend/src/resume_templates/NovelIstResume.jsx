import PropTypes from 'prop-types';
import React from 'react';

// Wrap the component with React.forwardRef to forward the ref to the DOM node
const NovelistResume = React.forwardRef(({ resumeData }, ref) => {
  // Mapping of section names to their render functions
  const sectionRenderers = {
    "Contact Information": renderContactInformation,
    Summary: renderSummary,
    Education: renderEducation,
    Skills: renderSkills,
    Experience: renderExperience,
    Projects: renderProjects,
    Awards: renderAwards, // Example of a new section
    // Add more section renderers here as needed
  };

  return (
    <div ref={ref} style={styles.container}>
      {/* Header Section */}
      <header style={styles.header}>
        <h1 style={styles.name}>{resumeData?.Name || 'Your Name'}</h1>
        <h2 style={styles.title}>{resumeData?.Title || 'Your Title'}</h2>
      </header>

      {/* Dynamically Render Sections */}
      {Object.entries(resumeData).map(([sectionName, sectionData]) => {
        if (sectionName === "Name" || sectionName === "Title") return null; // Skip header data
        const renderSection = sectionRenderers[sectionName] || renderGenericSection;
        return renderSection(sectionName, sectionData);
      })}
    </div>
  );
});


// Section Renderers

function renderContactInformation(sectionName, data) {
  return (
    <section key={sectionName} style={styles.contactSection}>
      <h3 style={styles.sectionTitle}>Contact Information</h3>
      <ul style={styles.contactList}>
        <li><strong>Address:</strong> {data.Address || 'Your Address'}</li>
        <li><strong>Email:</strong> <a href={`mailto:${data.Email}`}>{data.Email || 'your.email@example.com'}</a></li>
        <li><strong>Phone:</strong> <a href={`tel:${data.Phone}`}>{data.Phone || '123-456-7890'}</a></li>
        {data.LinkedIn && (
          <li><strong>LinkedIn:</strong> <a href={data.LinkedIn} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
        )}
        {data.GitHub && (
          <li><strong>GitHub:</strong> <a href={data.GitHub} target="_blank" rel="noopener noreferrer">GitHub</a></li>
        )}
      </ul>
    </section>
  );
}

function renderSummary(sectionName, data) {
  return (
    <section key={sectionName} style={styles.summarySection}>
      <h3 style={styles.sectionTitle}>Summary</h3>
      <p>{data}</p>
    </section>
  );
}

function renderEducation(sectionName, data) {
  return (
    <section key={sectionName} style={styles.educationSection}>
      <h3 style={styles.sectionTitle}>Education</h3>
      {Array.isArray(data) ? data.map((edu, index) => (
        <div key={index} style={styles.educationItem}>
          <h4 style={styles.educationDegree}>{edu.Degree || 'Degree'}</h4>
          <p style={styles.educationDetails}>
            {edu.University || 'University Name'}, {edu.Location || 'Location'}<br />
            {edu.Duration || 'Duration'}<br />
            GPA: {edu.GPA || 'GPA'}
          </p>
        </div>
      )) : (
        <div style={styles.educationItem}>
          <h4 style={styles.educationDegree}>{data.Degree || 'Degree'}</h4>
          <p style={styles.educationDetails}>
            {data.University || 'University Name'}, {data.Location || 'Location'}<br />
            {data.Duration || 'Duration'}<br />
            GPA: {data.GPA || 'GPA'}
          </p>
        </div>
      )}
    </section>
  );
}

function renderSkills(sectionName, data) {
  return (
    <section key={sectionName} style={styles.skillsSection}>
      <h3 style={styles.sectionTitle}>Skills</h3>
      <div style={styles.skillsContainer}>
        {Object.entries(data).map(([category, skills], index) => (
          <div key={index} style={styles.skillCategory}>
            <h4 style={styles.skillCategoryTitle}>{category}</h4>
            <ul style={styles.skillList}>
              {skills.map((skill, idx) => (
                <li key={idx} style={styles.skillItem}>{skill}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function renderExperience(sectionName, data) {
  return (
    <section key={sectionName} style={styles.experienceSection}>
      <h3 style={styles.sectionTitle}>Experience</h3>
      {data.map((exp, index) => (
        <div key={index} style={styles.experienceItem}>
          <h4 style={styles.experiencePosition}>{exp.Position || 'Position'}</h4>
          <p style={styles.experienceDetails}>
            {exp.Company || 'Company Name'}, {exp.Location || 'Location'}<br />
            {exp.Duration || 'Duration'}
          </p>
          {exp.Director && <p style={styles.experienceDirector}><strong>Director:</strong> {exp.Director}</p>}
          {exp.Mentor && <p style={styles.experienceDirector}><strong>Mentor:</strong> {exp.Mentor}</p>}
          {exp.Responsibilities && exp.Responsibilities.length > 0 && (
            <ul style={styles.responsibilityList}>
              {exp.Responsibilities.map((resp, idx) => (
                <li key={idx} style={styles.responsibilityItem}>{resp}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </section>
  );
}

function renderProjects(sectionName, data) {
  return (
    <section key={sectionName} style={styles.projectsSection}>
      <h3 style={styles.sectionTitle}>Projects</h3>
      {data.map((project, index) => (
        <div key={index} style={styles.projectItem}>
          <h4 style={styles.projectTitle}>{project.Title || 'Project Title'}</h4>
          <p style={styles.projectDetails}>
            {project.Location || 'Location'}<br />
            {project.Role || 'Role'}
          </p>
          {project.Technologies && project.Technologies.length > 0 && (
            <p><strong>Technologies:</strong> {project.Technologies.join(', ')}</p>
          )}
          {project.Description && project.Description.length > 0 && (
            <ul style={styles.projectDescriptionList}>
              {project.Description.map((desc, idx) => (
                <li key={idx} style={styles.projectDescriptionItem}>{desc}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </section>
  );
}

function renderAwards(sectionName, data) {
  return (
    <section key={sectionName} style={styles.awardsSection}>
      <h3 style={styles.sectionTitle}>Awards</h3>
      {data.map((award, index) => (
        <div key={index} style={styles.awardItem}>
          <h4 style={styles.awardTitle}>{award.Title || 'Award Title'}</h4>
          <p style={styles.awardDetails}>
            {award.IssuingOrganization || 'Issuing Organization'}<br />
            {award.Date || 'Date'}
          </p>
          {award.Description && (
            <p style={styles.awardDescription}>{award.Description}</p>
          )}
        </div>
      ))}
    </section>
  );
}

function renderGenericSection(sectionName, data) {
  return (
    <section key={sectionName} style={styles.genericSection}>
      <h3 style={styles.sectionTitle}>{sectionName}</h3>
      {Array.isArray(data) ? (
        <ul style={styles.genericList}>
          {data.map((item, index) => (
            <li key={index} style={styles.genericItem}>{item}</li>
          ))}
        </ul>
      ) : typeof data === 'object' ? (
        <pre style={styles.genericPre}>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>{data}</p>
      )}
    </section>
  );
}

// PropTypes

NovelistResume.propTypes = {
  resumeData: PropTypes.shape({
    Name: PropTypes.string,
    Title: PropTypes.string,
    "Contact Information": PropTypes.shape({
      Address: PropTypes.string,
      Email: PropTypes.string,
      Phone: PropTypes.string,
      LinkedIn: PropTypes.string,
      GitHub: PropTypes.string,
    }),
    Summary: PropTypes.string,
    Education: PropTypes.oneOfType([
      PropTypes.shape({
        University: PropTypes.string,
        Location: PropTypes.string,
        Duration: PropTypes.string,
        Degree: PropTypes.string,
        GPA: PropTypes.string,
      }),
      PropTypes.arrayOf(
        PropTypes.shape({
          University: PropTypes.string,
          Location: PropTypes.string,
          Duration: PropTypes.string,
          Degree: PropTypes.string,
          GPA: PropTypes.string,
        })
      ),
    ]),
    Skills: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
    Experience: PropTypes.arrayOf(
      PropTypes.shape({
        Position: PropTypes.string,
        Location: PropTypes.string,
        Company: PropTypes.string,
        Duration: PropTypes.string,
        Director: PropTypes.string,
        Mentor: PropTypes.string,
        Responsibilities: PropTypes.arrayOf(PropTypes.string),
      })
    ),
    Projects: PropTypes.arrayOf(
      PropTypes.shape({
        Title: PropTypes.string,
        Location: PropTypes.string,
        Role: PropTypes.string,
        Technologies: PropTypes.arrayOf(PropTypes.string),
        Description: PropTypes.arrayOf(PropTypes.string),
      })
    ),
    Awards: PropTypes.arrayOf(
      PropTypes.shape({
        Title: PropTypes.string,
        IssuingOrganization: PropTypes.string,
        Date: PropTypes.string,
        Description: PropTypes.string,
      })
    ),
    // Add PropTypes for any additional sections here
  }),
};

// Default Props

NovelistResume.defaultProps = {
  resumeData: {
    Name: 'Your Name',
    Title: 'Your Title',
    "Contact Information": {
      Address: 'Your Address',
      Email: 'your.email@example.com',
      Phone: '123-456-7890',
      LinkedIn: 'LinkedIn URL',
      GitHub: 'GitHub URL',
    },
    Summary: 'Your professional summary goes here.',
    Education: [
      {
        University: 'University Name',
        Location: 'Location',
        Duration: 'Duration',
        Degree: 'Degree',
        GPA: 'GPA',
      },
      // Add more education entries if needed
    ],
    Skills: {
      "Programming Languages": ["Python", "C#", "JavaScript", "HTML", "CSS", "React.js"],
      "Frameworks & Tools": ["Unity", "React.js", "Visual Studio Code", "Google Colab", "Figma", "Vite", "Firebase"],
      "Software": ["Microsoft Word", "Microsoft PowerPoint"],
      "Relevant Coursework": ["Data Structures Algorithms", "Intro to Data Science", "Discrete Mathematics", "Game Development", "Human-Computer Interaction (HCI)", "Database Design", "Operating Systems"]
    },
    Experience: [],
    Projects: [],
    Awards: [
      {
        Title: 'Best Novelist Award',
        IssuingOrganization: 'Literary Guild',
        Date: '2023',
        Description: 'Awarded for outstanding contributions to modern literature.',
      },
      // Add more awards as needed
    ],
    // Add default data for any additional sections here
  },
};

// Styles

const styles = {
  container: {
    fontFamily: "Georgia, serif",
    margin: "20px auto",
    padding: "20px",
    maxWidth: "800px",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  name: {
    fontSize: "32px",
    fontWeight: "bold",
    margin: "0",
  },
  title: {
    fontSize: "20px",
    color: "#555",
    margin: "5px 0 0 0",
  },
  sectionTitle: {
    fontSize: "22px",
    color: "#333",
    borderBottom: "2px solid #333",
    marginBottom: "10px",
  },
  contactSection: {
    marginBottom: "20px",
  },
  contactList: {
    listStyleType: "none",
    paddingLeft: "0",
  },
  summarySection: {
    marginBottom: "20px",
  },
  educationSection: {
    marginBottom: "20px",
  },
  educationItem: {
    marginBottom: "10px",
  },
  educationDegree: {
    fontSize: "18px",
    margin: "0",
  },
  educationDetails: {
    margin: "5px 0 0 0",
    fontSize: "16px",
    color: "#555",
  },
  skillsSection: {
    marginBottom: "20px",
  },
  skillsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
  },
  skillCategory: {
    flex: "1 1 200px",
  },
  skillCategoryTitle: {
    fontSize: "18px",
    marginBottom: "5px",
  },
  skillList: {
    listStyleType: "disc",
    paddingLeft: "20px",
    margin: "0",
  },
  skillItem: {
    marginBottom: "5px",
  },
  experienceSection: {
    marginBottom: "20px",
  },
  experienceItem: {
    marginBottom: "15px",
  },
  experiencePosition: {
    fontSize: "18px",
    margin: "0",
  },
  experienceDetails: {
    margin: "5px 0 0 0",
    fontSize: "16px",
    color: "#555",
  },
  experienceDirector: {
    margin: "5px 0 0 0",
    fontSize: "16px",
    color: "#555",
  },
  responsibilityList: {
    listStyleType: "disc",
    paddingLeft: "20px",
    marginTop: "5px",
  },
  responsibilityItem: {
    marginBottom: "5px",
  },
  projectsSection: {
    marginBottom: "20px",
  },
  projectItem: {
    marginBottom: "15px",
  },
  projectTitle: {
    fontSize: "18px",
    margin: "0",
  },
  projectDetails: {
    margin: "5px 0 0 0",
    fontSize: "16px",
    color: "#555",
  },
  projectDescriptionList: {
    listStyleType: "disc",
    paddingLeft: "20px",
    marginTop: "5px",
  },
  projectDescriptionItem: {
    marginBottom: "5px",
  },
  awardsSection: {
    marginBottom: "20px",
  },
  awardItem: {
    marginBottom: "15px",
  },
  awardTitle: {
    fontSize: "18px",
    margin: "0",
  },
  awardDetails: {
    margin: "5px 0 0 0",
    fontSize: "16px",
    color: "#555",
  },
  awardDescription: {
    marginTop: "5px",
    fontSize: "16px",
    color: "#555",
  },
  genericSection: {
    marginBottom: "20px",
  },
  genericList: {
    listStyleType: "disc",
    paddingLeft: "20px",
  },
  genericItem: {
    marginBottom: "5px",
  },
  genericPre: {
    backgroundColor: "#f4f4f4",
    padding: "10px",
    borderRadius: "4px",
    overflowX: "auto",
  },
};

export default NovelistResume;
