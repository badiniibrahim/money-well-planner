"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Shield,
  TrendingUp,
  PieChart,
  Wallet,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  Star,
  Users,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white">
      {/* Header/Navigation */}
      <header className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-900/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Wallet className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                BudgetPro
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a
                href="#features"
                className="text-slate-300 hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="text-slate-300 hover:text-white transition-colors"
              >
                Testimonials
              </a>
              <a
                href="#pricing"
                className="text-slate-300 hover:text-white transition-colors"
              >
                Pricing
              </a>
              <a
                href="#faq"
                className="text-slate-300 hover:text-white transition-colors"
              >
                FAQ
              </a>
            </nav>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-slate-300 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Sign Up Free
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div
              className="md:w-1/2 space-y-6"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Take Control of Your{" "}
                <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                  Financial Future
                </span>
              </h1>
              <p className="text-xl text-slate-300">
                Smart budgeting, expense tracking, and financial insights all in
                one place. Achieve your financial goals with BudgetPro.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl">
                  Get Started Free
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 px-8 py-6 text-lg rounded-xl"
                >
                  See How It Works
                </Button>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-10 w-10 rounded-full border-2 border-slate-900 bg-gradient-to-br from-slate-700 to-slate-800`}
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-slate-400">
                    Trusted by 10,000+ users
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur-lg opacity-30"></div>
                <div className="relative bg-gradient-to-b from-slate-900 to-slate-800 border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                    alt="Financial Dashboard"
                    className="w-full h-auto rounded-t-2xl opacity-90"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-400">
                          Monthly Overview
                        </p>
                        <p className="text-xl font-bold text-white">
                          $3,240 Saved
                        </p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-blue-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features for Your Finances
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Everything you need to manage your money effectively, all in one
              place.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Wallet className="h-6 w-6 text-emerald-400" />,
                title: "Income Tracking",
                description:
                  "Easily track all your income sources in one place with detailed categorization and analytics.",
              },
              {
                icon: <CreditCard className="h-6 w-6 text-rose-400" />,
                title: "Expense Management",
                description:
                  "Monitor your spending habits with smart categorization and real-time alerts for budget overruns.",
              },
              {
                icon: <PieChart className="h-6 w-6 text-blue-400" />,
                title: "Budget Planning",
                description:
                  "Create custom budgets based on your income and financial goals with our intuitive planning tools.",
              },
              {
                icon: <TrendingUp className="h-6 w-6 text-amber-400" />,
                title: "Investment Tracking",
                description:
                  "Keep an eye on your investments and see how they're performing over time with detailed analytics.",
              },
              {
                icon: <BarChart3 className="h-6 w-6 text-purple-400" />,
                title: "Financial Reports",
                description:
                  "Generate comprehensive reports to understand your financial health and make informed decisions.",
              },
              {
                icon: <Shield className="h-6 w-6 text-indigo-400" />,
                title: "Secure & Private",
                description:
                  "Your financial data is encrypted and secure. We never share your information with third parties.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-b from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-xl p-6 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="h-12 w-12 rounded-lg bg-slate-800 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How BudgetPro Works
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Get started in minutes and take control of your finances with
              these simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Connect Your Accounts",
                description:
                  "Securely link your bank accounts and credit cards to automatically import transactions.",
              },
              {
                step: "02",
                title: "Set Your Budget",
                description:
                  "Create personalized budgets based on your income, expenses, and financial goals.",
              },
              {
                step: "03",
                title: "Track & Optimize",
                description:
                  "Monitor your spending, receive insights, and optimize your finances to reach your goals faster.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="bg-gradient-to-b from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-xl p-8 h-full">
                  <div className="text-5xl font-bold text-blue-500/20 mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-slate-400">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-8 w-8 text-blue-500/20" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Join thousands of satisfied users who have transformed their
              financial lives with BudgetPro.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Small Business Owner",
                image:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80",
                quote:
                  "BudgetPro has completely changed how I manage both my personal and business finances. The insights are invaluable!",
              },
              {
                name: "Michael Chen",
                role: "Software Engineer",
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80",
                quote:
                  "I've tried many finance apps, but BudgetPro stands out with its intuitive interface and powerful analytics. Highly recommend!",
              },
              {
                name: "Emily Rodriguez",
                role: "Marketing Director",
                image:
                  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=388&q=80",
                quote:
                  "Since using BudgetPro, I've saved over $5,000 and finally paid off my credit card debt. The goal tracking feature is a game-changer!",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-b from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-sm text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-300 italic">"{testimonial.quote}"</p>
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Choose the plan that works best for your financial needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Free",
                price: "$0",
                description: "Perfect for getting started with basic budgeting",
                features: [
                  "Income & expense tracking",
                  "Basic budget creation",
                  "Up to 2 financial accounts",
                  "Monthly financial summary",
                  "Mobile app access",
                ],
                cta: "Get Started",
                popular: false,
              },
              {
                name: "Premium",
                price: "$9.99",
                period: "per month",
                description:
                  "Advanced features for serious financial management",
                features: [
                  "Everything in Free",
                  "Unlimited financial accounts",
                  "Debt payoff planning",
                  "Savings goals & tracking",
                  "Advanced financial reports",
                  "Bill reminders & alerts",
                  "Priority support",
                ],
                cta: "Start 14-Day Free Trial",
                popular: true,
              },
              {
                name: "Family",
                price: "$19.99",
                period: "per month",
                description: "Manage finances for the entire household",
                features: [
                  "Everything in Premium",
                  "Up to 5 user accounts",
                  "Shared budget management",
                  "Family financial goals",
                  "Expense splitting",
                  "Financial education resources",
                  "Dedicated support",
                ],
                cta: "Start 14-Day Free Trial",
                popular: false,
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                className={`relative bg-gradient-to-b from-slate-800/50 to-slate-800/30 border ${
                  plan.popular ? "border-blue-500/50" : "border-slate-700/50"
                } rounded-xl p-8`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-slate-400 ml-1">{plan.period}</span>
                  )}
                </div>
                <p className="text-slate-400 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-slate-700 hover:bg-slate-600"
                  } text-white`}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-300">
              Find answers to common questions about BudgetPro.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "Is my financial data secure?",
                answer:
                  "Absolutely. We use bank-level 256-bit encryption to protect your data. We never store your bank credentials, and your information is never sold to third parties.",
              },
              {
                question: "Can I connect all my financial accounts?",
                answer:
                  "Yes, BudgetPro supports connections with over 10,000 financial institutions worldwide, including banks, credit cards, investment accounts, and loan providers.",
              },
              {
                question: "How does the free trial work?",
                answer:
                  "Our 14-day free trial gives you full access to all Premium features. No credit card is required to start, and you can downgrade to the Free plan at any time if you decide not to continue.",
              },
              {
                question: "Can I export my financial data?",
                answer:
                  "Yes, you can export your data in CSV or PDF format at any time. Your data always belongs to you, and we make it easy to access and download.",
              },
              {
                question: "Is there a mobile app available?",
                answer:
                  "Yes, BudgetPro is available on iOS and Android devices. Your data syncs seamlessly between all your devices.",
              },
              {
                question: "How do I cancel my subscription?",
                answer:
                  "You can cancel your subscription at any time from your account settings. If you cancel, you'll still have access to Premium features until the end of your billing period.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-b from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
                <p className="text-slate-400">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80')] opacity-10 bg-cover bg-center"></div>
            <div className="relative py-16 px-8 md:py-24 md:px-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Ready to Transform Your Finances?
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
                Join thousands of users who have already taken control of their
                financial future with BudgetPro.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg rounded-xl">
                  Get Started Free
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl"
                >
                  Schedule a Demo
                </Button>
              </div>
              <p className="mt-6 text-blue-100 text-sm">
                No credit card required. Free forever plan available.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Wallet className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  BudgetPro
                </span>
              </div>
              <p className="text-slate-400 mb-4 max-w-xs">
                Empowering you to take control of your finances with smart
                budgeting and expense tracking.
              </p>
              <div className="flex space-x-4">
                {["twitter", "facebook", "instagram", "linkedin"].map(
                  (social) => (
                    <a
                      key={social}
                      href="#"
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <span className="sr-only">{social}</span>
                      <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center">
                        <Users className="h-4 w-4" />
                      </div>
                    </a>
                  )
                )}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Product</h3>
              <ul className="space-y-2">
                {["Features", "Pricing", "Testimonials", "FAQ"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                {["About", "Blog", "Careers", "Press", "Contact"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                {["Terms", "Privacy", "Cookies", "Licenses", "Settings"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
          <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2025 BudgetPro. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-slate-400 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white text-sm transition-colors"
              >
                Cookies Settings
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
