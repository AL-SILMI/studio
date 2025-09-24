import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function WelcomeCard() {
  return (
    <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Welcome to CogniScreen</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          This is your personal dashboard for monitoring cognitive health.
          Start by completing a cognitive task or analyzing your speech.
        </p>
      </CardContent>
    </Card>
  );
}
