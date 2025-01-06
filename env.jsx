const fs = require("fs");
const path = require("path");

// Configurations
const WORDS_PER_MINUTE = 35; // Typing speed per word
const CHARS_PER_SECOND = (WORDS_PER_MINUTE * 5) / 60; // Roughly 5 characters per word
const DELAY_PER_CHAR = 1000 / CHARS_PER_SECOND;
const DELETE_PERCENTAGE = 0; // 10% of the text will be deleted each time

// Sample text to write, modify as needed
const File =`// "use client"
// import { useAuth, SignOutButton } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// export default function Home() {
//   const { isLoaded, isSignedIn } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (isLoaded && !isSignedIn) {
//       router.replace("/");
//     }
//   }, [isLoaded, isSignedIn, router]);

//   return (
//     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//       <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
//         <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
//           <li className="mb-2">
//             Get started by editing{" "}
//             <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
//               src/app/page.tsx
//             </code>
//             .
//           </li>
//           <li>Save and see your changes instantly.</li>
//           <SignOutButton />
//         </ol>
//       </main>
//     </div>
//   );
// }


'use client'

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Profile } from "@/components/Profile";

export default function Home() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  // if (!isLoaded || !isSignedIn) {
  //   return (
  //     <div className="min-h-screen p-8 font-sans">
  //       <main className="pt-16">
  //         <div className="text-center">
  //           <h1 className="text-2xl font-bold mb-4">Sign In to view the Dashboard</h1>
  //           <SignInButton />
  //         </div>
  //       </main>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen p-8 font-sans flex justify-center items-start bg-background">
      <div className="w-full max-w-4xl md:px-8 relative">

        {/* Custom vertical borders */}
        <div className="absolute left-0 top-8 bottom-0 hidden lg:flex flex-col gap-[4px]">
          {[...Array(100)].map((_, i) => (
            <div key={i} className="h-[14px] w-[1px] bg-border" />
          ))}
        </div>
        <div className="absolute right-0 top-8 bottom-0 hidden lg:flex flex-col gap-[4px]">
          {[...Array(100)].map((_, i) => (
            <div key={i} className="h-[14px] w-[0.5px] bg-border" />
          ))}
        </div>

        <div className="space-y-8">
          <div className="flex justify-end mb-8">
           <Profile />
          </div>

          <main className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-semibold mb-4 text-primary">Your Dashboard</h2>
              <p className="text-muted-foreground">
                Here&apos;s an overview of what you can do with this.
              </p>
            </div>

            <div className="flex">
                      {[...Array(80)].map((_, i) => (
                        <div key={i} className="h-[1px] w-[8px] bg-border mx-[2px]" />
                      ))}
                    </div>

            <div className="space-y-0">
              {["Coming Soon", "Coming Soon", "Coming Soon", "Coming Soon"].map((section, index) => (
                <div key={index} className="relative py-8">
                  {index !== 0 && (
                    <div className="absolute top-0 left-0 right-0 flex">
                      {[...Array(80)].map((_, i) => (
                        <div key={i} className="h-[1px] w-[8px] bg-border mx-[2px]" />
                      ))}
                    </div>
                  )}
                  
                  <div className="p-8 bg-card rounded-lg">
                    <h3 className="font-medium mb-2 text-foreground text-xl">{section}</h3>
                    <p className="text-muted-foreground h-20">⚒️ Work in Progress </p>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

`



const Text = File.split(""); // Splitting into characters

let isRunning = true;

async function typeEffect(filePath) {
    try {
        let content = ""; // start with an empty content

        while (isRunning) {
            // Simulate typing character by character
            for (const char of Text) {
                if (!isRunning) break;

                content += char;
                fs.writeFileSync(filePath, content); // write to file progressively
                process.stdout.write(char); // display in terminal
                await delay(DELAY_PER_CHAR);
            }

            if (!isRunning) break;

            // Delete a portion of the text once fully typed
            let charsToKeep = Math.floor(content.length * (1 - DELETE_PERCENTAGE));
            content = content.slice(-charsToKeep);
            fs.writeFileSync(filePath, content);
            console.log("\nDeleted a portion of the text...");

            // Wait a bit before starting the next cycle
            await delay(1000);
        }
    } catch (error) {
        console.error("Error during typing effect:", error);
    }
}

// Helper function to create delays
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Start the typing effect
const filePath = path.join(__dirname, "./app/page.tsx");
console.log("Starting typing effect... Press CTRL+C to stop.");
typeEffect(filePath);

// Handle graceful exit
process.on("SIGINT", () => {
    console.log("\nStopping typing effect...");
    isRunning = false;
});
