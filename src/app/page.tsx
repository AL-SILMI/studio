import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, Mic, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Logo } from './logo';
import { Header } from '@/components/header';

export default function LandingPage() {
  return (
    <>
      <Header />
      <div className="flex flex-col">
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-accent/50">
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                <div className="flex flex-col justify-center space-y-4">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter text-primary sm:text-5xl xl:text-6xl/none">
                      Early Dementia Detection, Powered by AI
                    </h1>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                      CogniScreen offers a simple, non-invasive way to screen
                      for early signs of cognitive decline using advanced AI
                      analysis of speech, memory, and behavior.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <Button asChild size="lg">
                      <Link href="/dashboard">Get Started Now</Link>
                    </Button>
                  </div>
                </div>
                <Image
                  src="https://picsum.photos/seed/1/600/400"
                  width={600}
                  height={400}
                  alt="Hero"
                  data-ai-hint="brain health"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                />
              </div>
            </div>
          </section>
          <section id="features" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                    Our Assessments
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    A Multi-Faceted Approach
                  </h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    We analyze multiple cognitive functions to provide a
                    comprehensive and reliable risk assessment.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
                <Card>
                  <CardHeader className="gap-2">
                    <Mic className="h-8 w-8 text-primary" />
                    <CardTitle>Speech Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    Our AI analyzes speech patterns, including pauses, word
                    choice, and sentence structure, for subtle indicators of
                    cognitive change.
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="gap-2">
                    <BrainCircuit className="h-8 w-8 text-primary" />
                    <CardTitle>Cognitive Tasks</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    Engage in simple, gamified tasks designed to assess
                    short-term memory, attention, and other key cognitive
                    functions.
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="gap-2">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                    <CardTitle>Overall Risk Score</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    Receive a consolidated risk score based on all assessments,
                    providing a clear, actionable overview of your cognitive
                    health.
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Take the First Step Towards Understanding Your Cognitive
                  Health
                </h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Early awareness is key. Get your confidential assessment
                  today.
                </p>
              </div>
              <div className="mx-auto w-full max-w-sm space-y-2">
                <Button asChild size="lg" className="w-full">
                  <Link href="/dashboard">Start Your Free Screening</Link>
                </Button>
              </div>
            </div>
          </section>
        </main>
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
          <p className="text-xs text-muted-foreground">
            &copy; 2024 CogniScreen. All rights reserved.
          </p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link
              href="#"
              className="text-xs hover:underline underline-offset-4"
              prefetch={false}
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-xs hover:underline underline-offset-4"
              prefetch={false}
            >
              Privacy
            </Link>
          </nav>
        </footer>
      </div>
    </>
  );
}
