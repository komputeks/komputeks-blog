export const metadata = {
  title: "Komputeks Blog",
  description: "Modern full-stack technology blog",
  manifest: "/manifest.json",
  themeColor: "#0070f3",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0070f3" />
      </head>
      <body>{children}</body>
    </html>
  );
}
