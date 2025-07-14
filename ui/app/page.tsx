import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MessageCircle, Sparkles, Clock, Zap, Shield, ArrowRight, Bot, CheckCircle } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">CalendarBot</span>
          </div>
          <Button variant="outline" size="sm">
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Calendar Assistant
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Never miss an event.
            <br />
            <span className="text-emerald-500">Just tell your bot.</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform natural language into calendar events instantly. Our Telegram bot uses advanced AI to understand
            your messages and seamlessly add events to your Google Calendar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8">
              <MessageCircle className="w-5 h-5 mr-2" />
              Start on Telegram
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 bg-transparent">
              Watch Demo
            </Button>
          </div>

          <div className="mt-12 text-sm text-gray-500">
            <p>✓ Free to use • ✓ No registration required • ✓ Secure & Private</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Intelligent calendar management</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powered by advanced AI and seamlessly integrated with Google Calendar
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Natural Language Processing</h3>
                <p className="text-gray-600 leading-relaxed">
                  Simply type "Meeting with John tomorrow at 3pm" and watch it transform into a perfectly formatted
                  calendar event.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Google Calendar Sync</h3>
                <p className="text-gray-600 leading-relaxed">
                  Direct integration with Google Calendar API ensures your events are instantly synced across all your
                  devices.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Instant Response</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get immediate confirmation when events are added. No waiting, no delays – just instant calendar
                  updates.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How it works</h2>
            <p className="text-lg text-gray-600">Three simple steps to automated calendar management</p>
          </div>

          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  1
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect your Google Calendar</h3>
                <p className="text-gray-600">
                  Securely link your Google Calendar account with our bot using OAuth authentication. Your data stays
                  private and secure.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  2
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Send natural messages</h3>
                <p className="text-gray-600">
                  Type your events naturally in Telegram: "Lunch with Sarah next Friday at noon" or "Team standup every
                  Monday at 9am".
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  3
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Events automatically added</h3>
                <p className="text-gray-600">
                  Our AI processes your message, extracts event details, and instantly creates the event in your Google
                  Calendar with confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why choose CalendarBot?</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Time-saving automation</h3>
                <p className="text-gray-600">
                  No more manual calendar entry. Save hours every week with intelligent event creation.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Smart date recognition</h3>
                <p className="text-gray-600">
                  Understands relative dates like "tomorrow", "next week", and "in 2 hours".
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Privacy focused</h3>
                <p className="text-gray-600">
                  Your calendar data is never stored. All processing happens in real-time and securely.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Always available</h3>
                <p className="text-gray-600">
                  Access your calendar assistant 24/7 directly from Telegram on any device.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ready to automate your calendar?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have simplified their scheduling with CalendarBot. Get started in less than 2
            minutes.
          </p>

          <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8">
            <MessageCircle className="w-5 h-5 mr-2" />
            Start Using CalendarBot
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <div className="mt-8 flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Secure & Private
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Setup in 2 minutes
            </div>
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Free to use
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">CalendarBot</span>
            </div>

            <div className="flex space-x-8 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Support
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center text-sm text-gray-500">
            <p>&copy; 2024 CalendarBot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
