import { Button } from "@/components/ui/button"
import { Bot } from "lucide-react"
import Link from "next/link";


export const metadata = {
  title: 'Privacy Policy',
}

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

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>

        <section className="mb-8">
          <h3 className="font-semibold mt-4">Last updated: September 22nd 2025
            <p/>Applies to: “Telegram Calendar Bot”</h3>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Who we are</h2>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li> Operator/Publisher: Telegram Calendar Bot </li>
            <li> Website: https://telegramcalendarbot.com/ </li>
            <li> Privacy contact: takvimbot@gmail.com </li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">What this policy covers</h2>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li> This policy explains what personal data the Bot processes, why we process it, how we store and share it, and the choices you have. It also includes the disclosures required for apps that access Google user data via OAuth. </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">What the Bot does</h2>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li> You message the Bot in Telegram (e.g., “tomorrow at 2pm meet John”, or send an image). The Bot uses AI to interpret your text or image and then creates a Google Calendar event in the calendar you've selected. </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Data we process</h2>

          <h3 className="font-semibold mt-4">From Telegram (you → Bot)</h3>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>Message content you send to the Bot (text and, if you choose, images/screenshots used to extract event info).</li>
            <li>Telegram user ID and chat ID processed transiently to respond; we do not retain parsed event text or raw messages after processing.</li>
          </ul>

          <h3 className="font-semibold mt-4">From Google (via OAuth)</h3>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>Your calendar list (to let you pick a calendar).</li>
            <li>Events on the selected calendar only as needed to avoid duplicates and perform edits you request.</li>
            <li>Event write access to create/update events you ask us to create.</li>
          </ul>

          <h3 className="font-semibold mt-4">Technical/ops data</h3>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>Non‑PII operational logs and metrics (e.g., timestamps, status/error codes) used for reliability and abuse prevention. We do not log user IDs or chat IDs.</li>
          </ul>

          <p className="mt-4 text-gray-700">We do not sell personal data and do not use Google user data for ads or ad targeting. We follow Google’s API Services User Data Policy and Limited Use requirements.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">OAuth scopes &amp; why we need them</h2>
          <p className="text-gray-700">We request only the minimum scopes necessary for the features you expect:</p>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>https://www.googleapis.com/auth/calendar.calendarlist.readonly — read your list of calendars (so you can choose where to add an event).</li>
            <li>https://www.googleapis.com/auth/calendar.events — create and update events on calendars you can access (to add/edit events you ask for).</li>
          </ul>
          <p className="mt-3 text-gray-700">These are sensitive scopes and therefore undergo Google’s standard verification; we request the narrowest scopes that enable the described functionality.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">AI processing (natural language &amp; images)</h2>
          <p className="text-gray-700">To interpret your instructions (and optional images you send), we call OpenAI. We send only the minimum text/image content needed to parse your request into event details. We do not send OpenAI any details about our users, and do not identify user in request.</p>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>Provider: OpenAI API.</li>
            <li>Model training: Per OpenAI’s policy, API inputs/outputs are not used to train models by default; opting‑in is required. We do not opt in.</li>
            <li>Provider retention: OpenAI may retain API inputs/outputs for up to 30 days to operate the service and detect abuse; zero‑data‑retention endpoints exist for qualifying use cases. (This retention is at the provider layer and separate from our storage.)</li>
            <li>Our retention: We do not retain parsed event text or raw messages/images after processing.</li>
          </ul>
          <p className="mt-3 text-gray-700">Please avoid sending sensitive content unless necessary to fulfill your request.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Authentication tokens (refresh tokens)</h2>
          <p className="text-gray-700">When you connect Google, we receive tokens to call the Calendar API for you.</p>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>Storage: Refresh tokens are stored encrypted at rest in our database; encryption keys/secrets are managed in AWS Secrets Manager; the service runs in AWS us‑east‑1.</li>
            <li>Transport: TLS enforced in transit.</li>
            <li>Access controls: Least‑privilege service roles; secrets isolated from code.</li>
            <li>Retention: We keep refresh tokens until you revoke access.</li>
            <li>Deletion: We delete your refresh token when you revoke access or when you request deletion (see “Your controls” below).</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Data retention</h2>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>Refresh tokens: retained until revoked.</li>
            <li>Parsed event text / raw messages / images: not retained after processing.</li>
            <li>Operational logs: non‑PII only; retained for routine operations for two weeks.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Your choices &amp; controls</h2>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>Revoke Google access any time: In your Google Account → Security → Third‑party access, remove the app; this invalidates our tokens.</li>
            <li>Delete your data with us: Send the Telegram command <code className="bg-gray-100 p-1 rounded">/delete</code>. We will delete your stored refresh token and any user‑level preferences, and deactivate your access. Telegram will retain your chat history, but we will not have access to it.</li>
            <li>Contact: You can also email <a href="takvimbot@gmail.com" className="text-emerald-600">takvimbot@gmail.com</a> for privacy requests.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Security</h2>
          <p className="text-gray-700">We use industry‑standard measures: TLS in transit; encryption at rest for refresh tokens; key material in AWS Secrets Manager; role‑based access; and reasonable monitoring/alerting. We also adhere to Google’s Limited Use rules for Google user data.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">International transfers</h2>
          <p className="text-gray-700">Processing occurs in AWS us‑east‑1 (United States). If you access the Bot from outside the U.S., your data may be transferred to the U.S. We apply the safeguards required by applicable law.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Children’s privacy</h2>
          <p className="text-gray-700">Minimum age: 13+ globally; if you are in the EEA/UK, you must be 16+ (or the age required by your country). The Bot is not directed to children. (Do not use the Bot if you are under the applicable age.)</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Changes to this policy</h2>
          <p className="text-gray-700">We will update this policy as needed and keep the “Last updated” date current. If changes materially affect how we use Google user data, we’ll obtain any required consent and update our disclosures.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Contact</h2>
          <p className="text-gray-700"><a href="takvimbot@gmail.com" className="text-emerald-600">takvimbot@gmail.com</a><br />
            <a href="https://telegramcalendarbot.com/" className="text-emerald-600">https://telegramcalendarbot.com</a></p>
        </section>

      </div>
    </div>
  )
}