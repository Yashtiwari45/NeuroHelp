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
    name: "Dr. Sarah Chen",
    role: "Lead AI Researcher",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    bio: "Specializing in deep learning and medical image analysis with over 10 years of experience in AI applications for healthcare.",
    social: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "mailto:sarah@example.com"
    }
  },
  {
    name: "Dr. Michael Rodriguez",
    role: "Neurologist",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    bio: "Board-certified neurologist with expertise in neurodegenerative diseases and early detection of Alzheimer's disease.",
    social: {
      linkedin: "https://linkedin.com",
      email: "mailto:michael@example.com"
    }
  },
  {
    name: "Emma Thompson",
    role: "ML Engineer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    bio: "Focused on developing and optimizing machine learning models for medical image analysis and diagnosis.",
    social: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "mailto:emma@example.com"
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