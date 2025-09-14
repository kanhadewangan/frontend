import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle, Zap, Shield, Sparkles } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">NoteMaster</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-100">
            ✨ Your thoughts, organized beautifully
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 text-balance">
            Capture Ideas,
            <br />
            <span className="text-blue-600">Create Magic</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto text-pretty">
            Transform your scattered thoughts into organized brilliance. NoteMaster helps you capture, organize, and
            access your ideas whenever inspiration strikes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                Start Taking Notes
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
            >
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-6 border-slate-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Lightning Fast</h3>
            <p className="text-slate-600">
              Capture thoughts instantly with our streamlined interface. No delays, no friction—just pure productivity.
            </p>
          </Card>

          <Card className="p-6 border-slate-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Secure & Private</h3>
            <p className="text-slate-600">
              Your notes are encrypted and protected. Focus on creating while we handle the security.
            </p>
          </Card>

          <Card className="p-6 border-slate-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Smart Organization</h3>
            <p className="text-slate-600">
              Intelligent categorization and search help you find exactly what you need, when you need it.
            </p>
          </Card>
        </div>

        {/* Pricing Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Choose Your Plan</h2>
          <p className="text-slate-600 mb-12">Start free, upgrade when you're ready for more</p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="p-8 border-slate-200 relative">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Free</h3>
                <div className="text-4xl font-bold text-slate-900 mb-4">$0</div>
                <p className="text-slate-600 mb-6">Perfect for getting started</p>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-slate-700">Up to 3 notes</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-slate-700">Basic organization</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-slate-700">Mobile access</span>
                  </li>
                </ul>
                <Link href="/signup">
                  <Button className="w-full bg-transparent" variant="outline">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Pro Plan */}
            <Card className="p-8 border-blue-200 relative bg-blue-50">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white">
                Most Popular
              </Badge>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Pro</h3>
                <div className="text-4xl font-bold text-slate-900 mb-4">
                  $9<span className="text-lg text-slate-600">/month</span>
                </div>
                <p className="text-slate-600 mb-6">For serious note-takers</p>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-slate-700">Unlimited notes</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-slate-700">Advanced search</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-slate-700">Priority support</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-slate-700">Export options</span>
                  </li>
                </ul>
                <Link href="/signup">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Start Pro Trial</Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-slate-900">NoteMaster</span>
            </div>
            <div className="text-sm text-slate-600">© 2024 NoteMaster. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
