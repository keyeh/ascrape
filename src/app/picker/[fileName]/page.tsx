
import Picker from "./picker";
export default async function PickerPage({
  params,
}: {
  params: Promise<{ fileName: string }>;
}) {
  let { fileName } = await params;
  return <Picker fileName={fileName} />
    
}