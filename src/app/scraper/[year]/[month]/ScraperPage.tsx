"use client";
import { useState } from "react";
import { clearLog, getLog, scrapeIt } from "./actions";
import { useInterval } from "usehooks-ts";
export default function ScraperPage({
  year,
  month,
}: {
  year: string;
  month: string;
}) {
  const [content, setContent] = useState("");

  const logName = `${year}-${month}.log`;

  useInterval(
    async () => {
      setContent(await getLog(logName));
    },
    500 // Delay in milliseconds or null to stop it
  );

  return (
    <div>
      <h2>
        {year}-{month} Scraper
      </h2>
      <p>Note: will override existing json and picks!!!</p>
      <button
        onClick={() => {
          scrapeIt(year, month);
        }}
      >
        Start!
      </button>
      <button onClick={() => clearLog(logName)}>clear log</button>
      <hr />
      <pre>{content}</pre>
    </div>
  );
}
