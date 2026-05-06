import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  CheckSquare,
  Send,
  Shield,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const scrollToFeatures = () => {
    document.getElementById("features-section").scrollIntoView({
      behavior: "smooth",
    });
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const features = [
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Work together effectively with real-time collaboration tools that keep everyone in sync.",
    },
    {
      icon: CheckSquare,
      title: "Task Management",
      description:
        "Organize, prioritize, and track tasks with powerful management tools and workflows.",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description:
        "Monitor progress with detailed charts and get insights into team performance.",
    },
  ];

  const processSteps = [
    {
      icon: Shield,
      title: "Create an account",
      description:
        "Get started in seconds by signing up for your free ProjX account.",
    },
    {
      icon: UserPlus,
      title: "Invite your team",
      description:
        "Add your team members and start collaborating on projects together.",
    },
    {
      icon: Send,
      title: "Get things done",
      description:
        "Create projects, assign tasks, and track progress to boost productivity.",
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-center p-6 max-w-7xl mx-auto relative z-10"
      >
        <div className="flex items-center space-x-3">
          <div className="size-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <CheckSquare className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold tracking-tight">ProjX</span>
        </div>
        <div className="flex items-center space-x-6">
          <Link to="/sign-in" className="text-sm font-semibold hover:text-primary transition-colors">
            Log In
          </Link>
          <Link to="/sign-up">
            <Button className="h-10 px-6 rounded-xl shadow-lg shadow-primary/20">
              Get Started
            </Button>
          </Link>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
          <motion.div {...fadeInUp} className="space-y-10">
            <div className="space-y-6 text-center lg:text-left">
              <h1 className="text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
                Master your workflow with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">ProjX</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                The modern task management platform that helps teams organize,
                track, and collaborate more effectively.
              </p>
            </div>

            <div className="flex space-x-4">
              <Link to="/sign-up">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Try for free
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToFeatures}
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:border-gray-400 transition-colors"
              >
                See Features
              </motion.button>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <CheckSquare className="w-4 h-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckSquare className="w-4 h-4 text-green-500" />
                <span>Free plan available</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckSquare className="w-4 h-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full max-w-md lg:max-w-none"
            >
              <div className="rounded-2xl shadow-2xl overflow-hidden">
                <img
                  src="/image.png"
                  alt="ProjX Dashboard"
                  className="w-full h-auto object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-blue-600 font-medium mb-4">OUR FEATURES</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to manage tasks effectively
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our powerful features make it easy to organize and deliver
              projects on time.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-blue-600 font-medium mb-4">HOW IT WORKS</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple process, powerful results
            </h2>
            <p className="text-xl text-gray-600">
              Get started in minutes and see improved team productivity.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center space-y-6"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                  <step.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              Ready to boost your team's productivity?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join thousands of teams that love ProjX and get things done,
              together.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/sign-up">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Get started free
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-blue-400 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Contact us
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <CheckSquare className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">ProjX</span>
              </div>
              <p className="text-gray-400">
                Task management and team collaboration.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2025 ProjX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
