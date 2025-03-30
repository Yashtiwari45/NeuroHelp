import { useState, useEffect } from 'react';
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
  }, {
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

const extendedTeamMembers = [...teamMembers, ...teamMembers.slice(0, 3)];

const TeamPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const maxIndex = teamMembers.length;

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          return nextIndex >= maxIndex ? 0 : nextIndex;
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isPaused, maxIndex]);

  const memberCardStyle = "bg-gray-800/50 rounded-xl overflow-hidden flex flex-col h-full transition-all duration-500";

  return (
    <div className="space-y-12 py-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Our Team</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Meet our dedicated team of experts working to advance early detection of Alzheimer's disease
          through artificial intelligence.
        </p>
      </div>

      <div
        className="relative max-w-6xl mx-auto px-4"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${(currentIndex * (100 / 3))}%)` }}
          >
            {extendedTeamMembers.map((member, index) => (
              <div
                key={index}
                className="w-1/3 flex-shrink-0 p-2"
              >
                <div className={memberCardStyle}>
                  <div className="relative pb-2/3">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-3 flex flex-col flex-grow">
                    <div>
                      <h3 className="text-lg font-semibold">{member.name}</h3>
                      <p className="text-blue-400 text-sm">{member.role}</p>
                    </div>
                    <p className="text-gray-400 text-sm flex-grow">{member.bio}</p>
                    <div className="flex gap-3 mt-auto">
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
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-6">
          {teamMembers.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 mx-1 rounded-full ${currentIndex === index ? 'bg-blue-500' : 'bg-gray-400'} transition-colors duration-300`}
              aria-label={`Show team members starting from position ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
