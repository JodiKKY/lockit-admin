import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function ActivityPage() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h3>Activity</h3>
      </div>
      <div>
        <Table>
          <TableCaption>A list of your room activity.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="table-cell">ID</TableHead>
              <TableHead className="table-cell">Room Name</TableHead>
              <TableHead className="table-cell">Status</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </div>
    </div>
  );
}

export default ActivityPage;
