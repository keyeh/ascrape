import ScraperPage from "./ScraperPage";

export default async function Scrape({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year, month } = await params;
  return <ScraperPage year={year} month={month} />;
}
