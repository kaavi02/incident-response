import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getRecentActivity } from "@/actions/incidents";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const recentActivity = await getRecentActivity();

  return (
    <>
      <Sidebar />
      <div className="pl-64 flex flex-col min-h-screen">
        <TopNav recentActivity={recentActivity} />
        <main className="flex-1 p-6 relative">{children}</main>
      </div>
    </>
  );
}
