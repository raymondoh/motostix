import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { ClientSessionDebug } from "@/components/debug/client-session";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw } from "lucide-react";

export default async function DebugSessionPage() {
  // Only show this in development
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }
  // Get session using your auth helper
  const session = await auth();

  const copyToClipboard = `
    // Client-side function to copy text
    function copyToClipboard(text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          const button = document.activeElement;
          if (button) {
            button.innerText = 'Copied!';
            setTimeout(() => {
              button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy w-4 h-4 mr-2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>Copy';
            }, 2000);
          }
        })
        .catch(err => console.error('Failed to copy: ', err));
    }
  `;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="py-8 w-full">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold">Session Debug Page</h1>
              <Badge
                variant="outline"
                className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700">
                Development Only
              </Badge>
            </div>
            <div className="w-12 h-0.5 bg-primary my-4"></div>
            <p className="text-muted-foreground text-center max-w-2xl">
              This page displays session information for debugging purposes. It's only available in development mode.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="server" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="server">Server Session</TabsTrigger>
                <TabsTrigger value="client">Client Session</TabsTrigger>
              </TabsList>

              <TabsContent value="server" className="space-y-6">
                <div className="bg-white dark:bg-gray-800 border rounded-lg shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between border-b p-4">
                    <h2 className="text-lg font-semibold">Server Session Data</h2>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="text-xs" onClick="window.location.reload()">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={`copyToClipboard(${JSON.stringify(JSON.stringify(session, null, 2))})`}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>
                  <pre className="bg-gray-50 dark:bg-gray-900 text-black dark:text-gray-200 p-4 overflow-auto max-h-96 text-sm">
                    {JSON.stringify(session, null, 2)}
                  </pre>
                </div>

                <div className="bg-white dark:bg-gray-800 border rounded-lg shadow-sm overflow-hidden">
                  <div className="border-b p-4">
                    <h2 className="text-lg font-semibold">Authentication Status</h2>
                  </div>
                  <div className="p-4">
                    {session ? (
                      <div className="text-green-600 dark:text-green-400 space-y-2">
                        <p className="font-medium flex items-center">
                          <span className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-2 text-green-600 dark:text-green-400">
                            ✓
                          </span>
                          Authenticated
                        </p>
                        <div className="ml-8 space-y-1">
                          <p>
                            <span className="font-medium">Email:</span> {session.user?.email}
                          </p>
                          <p>
                            <span className="font-medium">Role:</span> {session.user?.role || "Not specified"}
                          </p>
                          <p>
                            <span className="font-medium">User ID:</span> {session.user?.id}
                          </p>
                          <p>
                            <span className="font-medium">Name:</span> {session.user?.name || "Not specified"}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-red-600 dark:text-red-400 space-y-2">
                        <p className="font-medium flex items-center">
                          <span className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mr-2 text-red-600 dark:text-red-400">
                            ✗
                          </span>
                          Not authenticated
                        </p>
                        <p className="ml-8">You are not logged in.</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="client">
                {process.env.NODE_ENV === "development" && <ClientSessionDebug />}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Add the copy function */}
      <script dangerouslySetInnerHTML={{ __html: copyToClipboard }} />
    </main>
  );
}
