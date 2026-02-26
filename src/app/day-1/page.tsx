import { getDay1Data, getAllMedia } from "@/data/day1";
import { EditProvider } from "@/components/admin/EditProvider";
import { DayOneContent } from "./DayOneContent";

export default function DayOneArchive() {
    const categories = getDay1Data();
    const totalItems = categories.flatMap(c => c.items).length;

    return (
        <EditProvider initialData={categories}>
            <DayOneContent totalItems={totalItems} />
        </EditProvider>
    );
}
