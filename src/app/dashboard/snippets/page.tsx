import Snippets from "@/components/Snippets";
import { Button } from "@/components/ui/button";
import { Plus} from "lucide-react";
import Link from "next/link";

const page = async () => {

  return (
    <div className="px-6 py-6 ">
      <div className="flex justify-between items-center">
        <p className="font-bold text-lg">My Snippets</p>
        <Button className="flex items-center gap-2" asChild>
          <Link href="/dashboard/snippets/new">
            <Plus></Plus>
            <span className="inline">Create New</span>
          </Link>
        </Button>
      </div>
      <div className="mt-8 ">
        <Snippets></Snippets>
      </div>
    </div>
  );
};

export default page;
