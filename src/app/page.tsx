import fs from "fs";
import Link from "next/link";
import path from "path";

export default async function Home() {
  const directoryPath = path.join(process.cwd(), "data"); // Change this to your target directory
  const files = await fs.promises.readdir(directoryPath);

  return (
    <div>
      <h1>Directory Listing</h1>
      <ul>
        {files.map((filename, index) => (
          <li key={index}>
            <Link
              href={{
                pathname: `/picker/${filename}`,
              }}
            >
              {filename}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
