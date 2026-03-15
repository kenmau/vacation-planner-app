import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Trips</h2>
        <Link href="/wizard-1">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Trip
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-muted-foreground">No trips yet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Create your first trip to get started planning your vacation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
