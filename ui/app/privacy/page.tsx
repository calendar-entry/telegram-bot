import { Button } from "@/components/ui/button"
import { Bot } from "lucide-react"
import Link from "next/link";


export default function Privacy() {
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
                    <Link href="https://t.me/NaturalLanguageCalendarBot">
                        <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </header>

            <section className="py-20 px-4">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">CalendarBot Privacy Policy</h2>
                    </div>

                    {/* <div className="space-y-12">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect your Google Calendar</h3>
                                <p className="text-gray-600">
                                    Securely link your Google Calendar account with the bot using OAuth authentication. Your data stays
                                    private and secure.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Send a message</h3>
                                <p className="text-gray-600">
                                    Type information about your event: "Lunch with Sarah next Friday at noon" or send an image containing a handwritten note or image flier.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Events automatically added</h3>
                                <p className="text-gray-600">
                                    Our AI processes your message, extracts event details, and instantly creates the event in your Google
                                    Calendar.
                                </p>
                            </div>
                        </div>
                    </div> */}
                </div>
            </section>
        </div>
    );
}