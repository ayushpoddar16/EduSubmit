import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  Award, 
  CheckCircle, 
  ArrowRight, 
  Star, 
  Shield, 
  Clock, 
  TrendingUp,
  FileText,
  User,
  GraduationCap,
  Lightbulb,
  Target,
  Zap,
  Heart,
  Play
} from 'lucide-react';

// Mock AuthContext hook for demonstration
const useAuth = () => {
  return { user: null };
};

const HomePage = () => {
  const { user } = useAuth();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [stats, setStats] = useState({
    students: 1247,
    teachers: 89,
    assignments: 3421,
    completedSubmissions: 8934
  });

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "High School Teacher",
      image: "👩‍🏫",
      text: "EduSubmit has revolutionized how I assign and grade student work. The anti-cheating features ensure academic integrity while the interface makes grading efficient and fair."
    },
    {
      name: "Michael Chen",
      role: "Computer Science Student",
      image: "👨‍🎓",
      text: "I love how EduSubmit encourages original thinking by preventing copy-paste. It's helped me become a better writer and improved my problem-solving skills."
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "University Professor",
      image: "👩‍🎓",
      text: "The detailed feedback system and grade tracking make it easy to monitor student progress. My students are more engaged and their work quality has improved significantly."
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Academic Integrity",
      description: "Advanced anti-cheating measures including disabled copy-paste to ensure original work"
    },
    {
      icon: Zap,
      title: "Real-time Grading",
      description: "Instant feedback system with detailed comments and suggestions for improvement"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Comprehensive analytics for both students and teachers to monitor academic growth"
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Foster better teacher-student communication through integrated feedback systems"
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Animate stats on load
  useEffect(() => {
    const animateStats = () => {
      const targets = { students: 1247, teachers: 89, assignments: 3421, completedSubmissions: 8934 };
      const duration = 2000;
      const steps = 60;
      const increment = duration / steps;

      let current = { students: 0, teachers: 0, assignments: 0, completedSubmissions: 0 };
      
      const timer = setInterval(() => {
        Object.keys(targets).forEach(key => {
          const target = targets[key];
          const step = target / steps;
          current[key] = Math.min(current[key] + step, target);
        });
        
        setStats({...current});
        
        if (current.students >= targets.students) {
          clearInterval(timer);
          setStats(targets);
        }
      }, increment);
    };

    setTimeout(animateStats, 500);
  }, []);

  if (user) {
    const dashboardPath = user.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard';
    window.location.href = dashboardPath;
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-xl">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  EduSubmit
                </h1>
                <p className="text-xs text-gray-500">Academic Excellence Platform</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <a
                href="/login"
                className="text-gray-600 hover:text-purple-600 font-medium transition-colors duration-200"
              >
                Login
              </a>
              <a
                href="/signup"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-indigo-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Lightbulb className="h-4 w-4" />
              <span>Revolutionizing Academic Submissions</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Where Learning Meets
              <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Academic Integrity
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Empower educators and students with our comprehensive assignment submission platform. 
              Features anti-cheating measures, real-time grading, and detailed progress tracking for enhanced academic excellence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <a
                href="/signup"
                className="group bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center space-x-2"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <button className="group flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-semibold text-lg transition-colors duration-200">
                <div className="bg-white rounded-full p-3 shadow-lg group-hover:shadow-xl transition-shadow">
                  <Play className="h-6 w-6" fill="currentColor" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{Math.floor(stats.students).toLocaleString()}+</div>
                <div className="text-gray-600 font-medium">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">{Math.floor(stats.teachers)}+</div>
                <div className="text-gray-600 font-medium">Educators</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{Math.floor(stats.assignments).toLocaleString()}+</div>
                <div className="text-gray-600 font-medium">Assignments</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">{Math.floor(stats.completedSubmissions).toLocaleString()}+</div>
                <div className="text-gray-600 font-medium">Submissions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Education
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to create, submit, and grade assignments while maintaining academic integrity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-2xl border border-purple-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple, Secure, Effective
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in minutes with our intuitive three-step process
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* For Teachers */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-purple-100">
              <div className="text-center mb-6">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">For Teachers</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Create Assignments</h4>
                    <p className="text-gray-600 text-sm">Design and publish assignments with custom requirements and deadlines</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Review Submissions</h4>
                    <p className="text-gray-600 text-sm">Access all student submissions in one organized dashboard</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Grade & Feedback</h4>
                    <p className="text-gray-600 text-sm">Provide detailed grades and constructive feedback instantly</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Students */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-indigo-100">
              <div className="text-center mb-6">
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">For Students</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">View Assignments</h4>
                    <p className="text-gray-600 text-sm">Browse available assignments with clear instructions and deadlines</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Submit Original Work</h4>
                    <p className="text-gray-600 text-sm">Write and submit assignments with anti-cheating protections</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Track Progress</h4>
                    <p className="text-gray-600 text-sm">Monitor grades and receive detailed feedback for improvement</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-8 rounded-2xl text-white">
              <div className="text-center mb-6">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Key Benefits</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0" />
                  <span className="text-sm">Enhanced Academic Integrity</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0" />
                  <span className="text-sm">Improved Writing Skills</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0" />
                  <span className="text-sm">Real-time Communication</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0" />
                  <span className="text-sm">Comprehensive Analytics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0" />
                  <span className="text-sm">Time-Saving Automation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Loved by Educators & Students
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our community is saying about their EduSubmit experience
            </p>
          </div>

          <div className="relative bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl p-8 lg:p-12">
            <div className="text-center">
              <div className="text-6xl mb-4">{testimonials[currentTestimonial].image}</div>
              <blockquote className="text-xl text-gray-700 mb-6 max-w-3xl mx-auto italic">
                "{testimonials[currentTestimonial].text}"
              </blockquote>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  {testimonials[currentTestimonial].name}
                </h4>
                <p className="text-purple-600 font-medium">
                  {testimonials[currentTestimonial].role}
                </p>
              </div>
            </div>

            {/* Testimonial indicators */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === currentTestimonial ? 'bg-purple-600' : 'bg-purple-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Academic Experience?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of educators and students who are already experiencing the future of academic submissions
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/signup"
              className="group bg-white text-purple-600 hover:bg-gray-50 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center space-x-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
            
            <a
              href="/login"
              className="text-white border-2 border-white hover:bg-white hover:text-purple-600 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200"
            >
              Sign In
            </a>
          </div>

          <div className="mt-8 text-purple-200 text-sm">
            <Heart className="h-4 w-4 inline mr-1" />
            Trusted by educators worldwide • No credit card required
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-xl">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">EduSubmit</h3>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Empowering the future of education through secure, innovative assignment submission and grading platform.
              </p>
              <div className="flex space-x-4">
                <div className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors">
                  <Star className="h-5 w-5" />
                </div>
                <div className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors">
                  <Heart className="h-5 w-5" />
                </div>
                <div className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors">
                  <Users className="h-5 w-5" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">For Teachers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">For Students</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EduSubmit. All rights reserved. Built with ❤️ for educators and students worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;