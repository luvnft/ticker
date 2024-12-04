export async function GET() {
    const appUrl = "https://www.tickertool.xyz";
  
    const config = {
      accountAssociation: {
        header:
          "eyJmaWQiOjg5MTkxNCwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDRmYzg1YjUzN2FkYzE4RmYzNTRhMzJDNkUxM0JCRGNEZDk0YTZEMDEifQ",
        payload: "eyJkb21haW4iOiJ3d3cudGlja2VydG9vbC54eXoifQ",
        signature:
          "MHg3MjcwNTEzMGVkZmU2OGRiZTkzMTY1NDliZDUyNmQ4NGJhZTU3N2Y5NmMzMDMwYjU4ZDk0ODg1ZDIzNDY5NmQxMjEwNzMwZTdmYzk1NmE1YTM5YzZiOTAwMzdmN2Q3YjQwMDQ3MzFmZWYxYTE4MDVjMWJhY2MzOTEwNDcwNGFkZDFi",
      },
      frame: {
        version: "0.1.0",
        name: "Ticker Tool",
        iconUrl: `${appUrl}/splash.png`,
        splashImageUrl: `${appUrl}/splash.png`,
        splashBackgroundColor: "#1f1f1f",
        homeUrl: appUrl,
      },
    };
  
    return Response.json(config);
  }