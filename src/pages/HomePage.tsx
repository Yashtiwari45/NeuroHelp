import React from 'react';
import { Brain, ArrowRight, Activity, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Early Detection for Better Lives
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Advanced AI-powered Alzheimer's disease detection system helping healthcare professionals 
          make early and accurate diagnoses.
        </p>
        <Link
          to="/predict"
          className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Start Analysis
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Key Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-gray-800/50 rounded-xl p-6">
          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
            <Brain className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Advanced AI Analysis</h3>
          <p className="text-gray-400">
            State-of-the-art machine learning models trained on extensive medical datasets
          </p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-6">
          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Early Detection</h3>
          <p className="text-gray-400">
            Identify potential signs of Alzheimer's disease in its earliest stages
          </p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-6">
          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
            <Activity className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">High Accuracy</h3>
          <p className="text-gray-400">
            Precise predictions backed by continuous model improvements
          </p>
        </div>
      </section>

      {/* About Disease Section */}
      <section className="bg-gray-800/50 rounded-xl p-8 space-y-6">
        <h2 className="text-3xl font-bold">Understanding Alzheimer's Disease</h2>
        
        <div className="space-y-6 text-gray-300">
          <p>
            Alzheimer's disease (AD) is a progressive neurodegenerative disease. Though best known for its role 
            in declining memory function, symptoms also include: difficulty thinking and reasoning, making judgements 
            and decisions, and planning and performing familiar tasks.
          </p>
          
          <div className="border-l-4 border-blue-500 pl-6 py-2">
            <h3 className="text-xl font-semibold mb-2">Why Early Detection Matters</h3>
            <p className="text-gray-400">
              Early detection of Alzheimer's disease is paramount because it offers the best chance for effective 
              treatment and improved quality of life. Identifying the condition at its onset allows for timely 
              interventions, which can slow its progression and enable individuals and their families to plan 
              for the future.
            </p>
          </div>

          <h3 className="text-xl font-semibold mb-2">Project Purpose</h3>
          <p className="text-gray-400">
            Our mission is to develop a cutting-edge machine learning model for the early prediction of 
            Alzheimer's disease. By leveraging advanced AI techniques, we aim to create a reliable tool 
            that can identify individuals at risk, enabling better patient care and supporting the 
            development of potential interventions.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Ready to Start?</h2>
        <p className="text-gray-400">
          Navigate through our system to learn more and make predictions
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/predict"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Make Prediction
          </Link>
          <Link
            to="/team"
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Meet Our Team
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;