import Picker from "./picker";
export default async function PickerPage({
  params,
}: {
  params: Promise<{ fileName: string }>;
}) {
  const { fileName } = await params;
  return <Picker fileName={fileName} />;
}
