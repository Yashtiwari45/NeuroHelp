import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  social: {
    github?: string;
    linkedin?: string;
    email?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    name: "Vedant Kohad",
    role: "Lead AI Researcher",
    image: "public/Vedant.jpg",
    bio: "Specializing in deep learning and medical image analysis with over 10 years of experience in AI applications for healthcare.",
    social: {
      github: "https://github.com/kohadved",
      linkedin: "https://www.linkedin.com/in/vedant-kohad/",
      email: "mailto:kohadvd@rknec.edu"
    }
  },
  {
    name: "Ayush Lochan",
    role: "UI Designer and Backend Developer",
    image: "public/Ayush.jpg",
    bio: "Passionate about web development and machine learning, focusing on using AI to create innovative, impactful applications that solve real-world problems. Always exploring new technologies to drive progress.",
    social: {
      github: "https://github.com/AyushLochan",
      linkedin: "https://www.linkedin.com/in/ayush-lochan-9b63a4276/",
      email: "mailto:ayushlochan4u@gmail.com"
    }
  },
  {
    name: "Yogeshwar Tiwari",
    role: "Learner in Web Development & Machine Learning",
    image: "public/Yogeshwar.jpg",
    bio: "Passionate about web development and machine learning, actively exploring AI-driven solutions with a focus on creating impactful and innovative applications.",
    social: {
      github: "https://github.com/Yashtiwari45",
      linkedin: "https://www.linkedin.com/in/yogeshwar-tiwari-a62645265/",
      email: "mailto:yasht3439@gmail.com"
  }
},{
    name: "Aditya Chaple",
    role: "Database Manager",
    image: "public/Aditya.jpg",
    bio: "Experienced Database Manager skilled in optimizing and managing data systems to ensure efficiency and security. Passionate about leveraging data to drive informed decision-making and business growth.",
    social: {
      github: "https://github.com/aditya-chaple",
      linkedin: "https://www.linkedin.com/in/aditya-rajesh-chaple/",
      email: "mailto:chaplear@rknec.edu"
    }
  }
];

function TeamPage() {
  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Our Team</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Meet our dedicated team of experts working to advance early detection of Alzheimer's disease
          through artificial intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member) => (
          <div key={member.name} className="bg-gray-800/50 rounded-xl overflow-hidden">
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-blue-400">{member.role}</p>
              </div>
              <p className="text-gray-400">{member.bio}</p>
              <div className="flex gap-4">
                {member.social.github && (
                  <a
                    href={member.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {member.social.linkedin && (
                  <a
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {member.social.email && (
                  <a
                    href={member.social.email}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamPage;