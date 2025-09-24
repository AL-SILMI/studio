import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, FileAudio, Mic } from "lucide-react"

export function NewSpeechAnalysisCard() {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Mic className="h-5 w-5 text-primary" />
                    <span>Speech Analysis</span>
                </CardTitle>
                <CardDescription>
                    Record audio, upload a file, or enter a transcript for AI analysis of cognitive indicators.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
                <Tabs defaultValue="audio" className="flex-grow flex flex-col">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="audio">
                            <Mic className="mr-2 h-4 w-4"/>
                            Audio
                        </TabsTrigger>
                        <TabsTrigger value="transcript">
                            <Edit className="mr-2 h-4 w-4" />
                            Transcript
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="audio" className="flex-grow flex flex-col items-center justify-center text-center p-6 space-y-4">
                        <FileAudio className="h-16 w-16 text-muted-foreground/50" />
                        <p className="text-muted-foreground text-sm">Record your voice reading the sentence, or upload an audio file.</p>
                        <div className="w-full text-center p-4 border-l-4 border-primary bg-accent/50 rounded-r-lg">
                            <p className="italic text-foreground">The library is a quiet place to read and study.</p>
                        </div>
                    </TabsContent>
                    <TabsContent value="transcript" className="flex-grow flex flex-col items-center justify-center text-center p-6">
                         <p className="text-muted-foreground">Transcript analysis coming soon.</p>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
