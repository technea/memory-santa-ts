function withValidProperties(properties: Record<string, undefined | string | string[]>) {
return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) => (Array.isArray(value) ? value.length > 0 : !!value))
);
}

export async function GET() {
const URL = process.env.NEXT_PUBLIC_URL as string;
return Response.json({
  "accountAssociation": {
    "header": "dummy",
    "payload": "dummy",
    "signature": "dummy"
  },
  "miniapp": {
    "version": "1",
    "name": "Memory Santa Game",
    "homeUrl": URL,
    "iconUrl": `${URL}/favicon.ico`,
    "splashImageUrl": `${URL}/favicon.ico`,
    "splashBackgroundColor": "#0052FF",
    "subtitle": "Christmas Memory Challenge",
    "description": "Play the Base Memory game and earn rewards!",
    "primaryCategory": "social",
    "tags": ["game", "base", "santa"]
  }
});