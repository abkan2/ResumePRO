import React from "react";

const ResumeTemplate3 = ({ resumeData }) => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.profile}>
          <img
            src={resumeData?.ProfileImage || 'default-profile.png'}
            alt="Profile"
            style={styles.profileImage}
          />
          <h1 style={styles.name}>{resumeData?.Name || 'Your Name'}</h1>
        </div>
        <div style={styles.contactInfo}>
          <p>{resumeData?.Address || 'Your Address'}</p>
          <p>Email: {resumeData?.Email || 'your.email@example.com'}</p>
          <p>Phone: {resumeData?.Phone || 'Your Phone Number'}</p>
        </div>
      </header>

      {resumeData?.AboutMe && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>About Me</h2>
          <p>{resumeData.AboutMe || 'About me section not provided.'}</p>
        </section>
      )}

      {resumeData?.CompanyName && resumeData?.WhyCompany && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Why {resumeData.CompanyName || 'This Company'}?</h2>
          <p>{resumeData.WhyCompany || 'Reason for applying not provided.'}</p>
        </section>
      )}

      {resumeData?.WhyMe && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Why Me?</h2>
          <p>{resumeData.WhyMe || 'Reasons why you are a good fit not provided.'}</p>
        </section>
      )}

      <footer style={styles.footer}>
        <p>Sincerely,</p>
        <p>{resumeData?.Name || 'Your Name'}</p>
      </footer>
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "2px solid #ccc",
    paddingBottom: "10px",
    marginBottom: "20px",
  },
  profile: {
    display: "flex",
    alignItems: "center",
  },
  profileImage: {
    borderRadius: "50%",
    width: "80px",
    height: "80px",
    marginRight: "15px",
  },
  name: {
    fontSize: "28px",
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
    fontSize: "22px",
    color: "#4c6b94",
    borderBottom: "2px solid #4c6b94",
    marginBottom: "10px",
  },
  footer: {
    textAlign: "center",
    marginTop: "30px",
    fontSize: "18px",
  },
};

export default ResumeTemplate3;
