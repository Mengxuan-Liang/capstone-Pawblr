import { Link } from "react-router-dom";
import { FaLinkedin } from "react-icons/fa";
import { FaGithubSquare } from "react-icons/fa";
import './About.css'


function About() {
  return (
    <div id="container-developers-footer">
      <div className="container-developers-columns">
        <h3 style={{ fontSize: "1.5rem" }}>Mengxuan  Liang</h3>
        <span style={{ color: "gray", fontSize: "0.75rem" }}>Full-Stack Developer</span>
        <Link
          to="https://www.linkedin.com/in/mengxuan-liang-a53615119"
          target="_blank"
          style={{ display: "flex", alignItems: "center", gap: "3px" }}
        >
          <FaLinkedin /> linkedin.com/in/mengxuan-liang-a53615119
        </Link>
        <Link to="https://github.com/Mengxuan-Liang"
          target="_blank"
          style={{ display: "flex", alignItems: "center", gap: "3px" }}
        >
          <FaGithubSquare /> github.com/Mengxuan-Liang
        </Link>
      </div>
    </div>
  );
}


export default About;
