import { Briefcase, MessageCircle, Search, TrendingUp, Users } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ChatBot from '../pages/ChatBot';

function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };


  return (
    <div className="min-h-screen">

      {/* Header with Background Video */}
      <header className="relative w-full h-screen overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src="video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="relative z-10 flex flex-col justify-center items-center text-white text-center h-full px-4 bg-black bg-opacity-40">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Find the Perfect Freelance Services for Your Business
          </h1>
          <p className="text-xl mb-8 max-w-2xl">
            Connect with talented freelancers and get your projects done with confidence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:text-black-600 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/jobs"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:text-black-600 transition-colors"
            >
              Browse Jobs
            </Link>
          </div>
          {/* Floating Chatbot Button */}
          <div className="fixed bottom-5 right-5 z-50">
            <button
              onClick={toggleChat}
              className="bg-black-600 text-white p-4 rounded-full shadow-lg hover:bg-black-700 transition-colors"
            >
              <MessageCircle className="w-6 h-6" />
            </button>

            {isChatOpen && <ChatBot onClose={toggleChat} />}
          </div>

        </div>
      </header>

      {/* Features Section */}
      <section className="pt-12 pb-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature Items */}
            {[
              { icon: Search, title: 'Find Talent', desc: 'Browse through our pool of skilled freelancers and find the perfect match for your project' },
              { icon: Briefcase, title: 'Post Projects', desc: 'Create detailed project listings and receive proposals from interested freelancers' },
              { icon: TrendingUp, title: 'Get Work Done', desc: 'Collaborate efficiently and achieve your project goals with our secure platform' }
            ].map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="bg-black-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-black-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Mindlancer Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Mindlancer?</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* For Businesses */}
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-black-600">For Businesses</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3"><Briefcase className="w-5 h-5 text-black-600" />Access to top-tier freelance talent across 100+ skills</li>
                <li className="flex items-start gap-3"><TrendingUp className="w-5 h-5 text-black-600" />Streamlined hiring process with smart matching</li>
                <li className="flex items-start gap-3"><Users className="w-5 h-5 text-black-600" />Secure payments and project management tools</li>
              </ul>
            </div>
            {/* For Freelancers */}
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-black-600">For Freelancers</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3"><Search className="w-5 h-5 text-black-600" />Find quality projects that match your skills</li>
                <li className="flex items-start gap-3"><Briefcase className="w-5 h-5 text-black-600" />Build your portfolio with diverse projects</li>
                <li className="flex items-start gap-3"><TrendingUp className="w-5 h-5 text-black-600" />Grow your career with our success tools</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of businesses and freelancers who trust Mindlancer
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/post-job" className="bg-black-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-black-700 transition-colors">
                Post a Job
              </Link>
              <Link to="/signup" className="bg-white text-black-600 border-2 border-black-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Become a Freelancer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Chatbot Button */}
      <div className="fixed bottom-5 right-5">
        <button
          onClick={toggleChat}
          className="bg-black-600 text-white p-4 rounded-full shadow-lg hover:bg-black-700 transition-colors"
        >
          <MessageCircle className="w-6 h-6" />
        </button>

        {isChatOpen && (
          <div className="bg-white p-4 rounded-lg shadow-lg w-72 mt-4">
            <h4 className="font-semibold mb-2">Chat with us!</h4>
            <p className="text-gray-600 text-sm mb-2">Hi there! How can I help you today?</p>
            <input
              type="text"
              placeholder="Type a message..."
              className="border rounded w-full px-2 py-1 text-sm"
            />
          </div>
        )}
      </div>

    </div>
  );
}

export default HomePage;