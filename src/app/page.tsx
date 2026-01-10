import fs from "fs";
import Link from "next/link";
import path from "path";
import "./page.css";

let years: number[] = [];
for (let i = 2024; i <= new Date().getFullYear(); i++) {
  years.push(i);
}

export const dynamic = "force-dynamic";
export default async function Home() {
  const directoryPath = path.join(process.cwd(), "data"); // Change this to your target directory
  const files = await fs.promises.readdir(directoryPath);

  return (
    <div>
      <h1>Directory Listing</h1>
      <table>
        <tbody>
          {years.map((year) =>
            createMonths()
              .reverse()
              .map((month: any) => {
                month = month.toLocaleString("en-US", {
                  minimumIntegerDigits: 2,
                  useGrouping: false,
                });
                if (year === 2024 && month < 7) return null;
                const filename = `${year}-${month}.json`;
                return (
                  <tr key={filename}>
                    <td>
                      {year}-{month}
                    </td>
                    {files.includes(filename) && (
                      <>
                        <td>
                          <Link
                            href={{
                              pathname: `/picker/${filename}`,
                            }}
                          >
                            <button>Picker</button>
                          </Link>
                        </td>
                        <td>
                          <Link
                            href={{
                              pathname: `/picked/${filename}`,
                            }}
                          >
                            <button>Picked</button>
                          </Link>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })
          )}
        </tbody>
      </table>
    </div>
  );
}

function createMonths(N = 12) {
  let a = [];
  for (let i = 1; i <= N; i++) {
    a.push(i);
  }
  return a;
}
