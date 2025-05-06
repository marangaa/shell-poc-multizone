import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      // First time JWT is created (user just signed in)
      if (user) {
        token.userId = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("Attempting authentication with credentials:", 
            { username: credentials?.username });
          
          const response = await fetch("https://api.gopluto.co/v0/account/loginuser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.username,
              password: credentials?.password,
              request_domain: "level1",
              request_country: "254710000189",
              request_state: "254710000189@email.com",
              request_town: ">42200211xrdt",
              platform: "Teddies trial",
              version: "nice teddies trial",
              telco: "Kenya",
              devicemanufacturer: "Teddies trial",
              devicemodel: "nice teddies trial",
              sim_serial_no: "Kenya",
              sim_number: "Kenya"
            }),
          });

          const data = await response.json();
          console.log("API response:", JSON.stringify(data));

          // Check if the API response is successful
          if (response.ok && data && data.CODE === 1 && data.status === "SUCCESS") {
            // Return a standardized user object with the correct API fields
            return {
              username: data.API_USERNAME,
              API_PASSWORD: data.API_PASSWORD,
              COUNTRY: data.COUNTRY,
              CURRENCY: data.CURRENCY,
              JOIN_CODE: data.JOIN_CODE, 
              recipient_id: data.RECIPIENT_ID,
              KEY_TIME: data.KEY_TIME,
              ...data // Include all data from the response
            };
          }
          
          // Return null instead of throwing an error for invalid credentials
          console.log("Authentication failed - Invalid credentials");
          return null;
        } catch (error) {
          console.error("Authentication error:", error);
          // Return null instead of throwing an error
          return null;
        }
      },
    }),
  ],
});
