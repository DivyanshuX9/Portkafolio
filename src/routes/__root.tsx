import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
    HeadContent,
    Link,
    Outlet,
    Scripts,
    createRootRouteWithContext,
    useRouter,
} from "@tanstack/react-router";

  import { Nav } from "@/components/site/Nav";
import { SeasonProvider } from "@/components/site/SeasonContext";
import { SeasonalBackdrop } from "@/components/site/SeasonalBackdrop";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <p className="eyebrow">404</p>
        <h1 className="display-lg mt-4">Page not found.</h1>
        <p className="body-lg mt-4">The page you're looking for doesn't exist.</p>
        <Link to="/" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-foreground underline-offset-4 hover:underline">
          ← Back home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <p className="eyebrow">Error</p>
        <h1 className="display-lg mt-4">Something went wrong.</h1>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Divyanshu Sharma — Software engineer & product builder" },
      { name: "description", content: "Software engineer focused on AI systems, scalable web applications, and exceptional user experiences." },
      { name: "author", content: "Divyanshu Sharma" },
      { property: "og:title", content: "Divyanshu Sharma — Software engineer & product builder" },
      { property: "og:description", content: "Software engineer focused on AI systems, scalable web applications, and exceptional user experiences." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Divyanshu Sharma — Software engineer & product builder" },
      { name: "twitter:description", content: "Software engineer focused on AI systems, scalable web applications, and exceptional user experiences." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Space+Grotesk:wght@300..700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <SeasonProvider>
      <QueryClientProvider client={queryClient}>
        <SeasonalBackdrop />
        <Nav />
        <div className="relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Outlet />
        </div>
      </QueryClientProvider>
    </SeasonProvider>
  );
}
