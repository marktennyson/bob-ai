import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ChatPage from "@/components/ChatPage";
import type { UserSession } from "@/interfaces";
import type { NextPage } from "next";

const Page: NextPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/");
  }

  return <ChatPage userSession={session as UserSession} />;
};

export default Page;
