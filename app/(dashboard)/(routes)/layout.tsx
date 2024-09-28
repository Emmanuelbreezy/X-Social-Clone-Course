import React, { Fragment, ReactNode } from "react";
import { redirect } from "next/navigation";
import Sidebar from "../_components/Sidebar";
import Rightbar from "../_components/Rightbar";
import EditProfileModal from "../_components/EditProfileModal";
import { checkUserSubscription } from "@/app/actions/subcription";
import { PLAN_TYPE } from "@/constants/pricing-plans";
// import Logo from "@/components/logo";
// import { Spinner } from "@/components/spinner";
import { auth } from "@/lib/auth";
import { CurrentUserProvider } from "@/context/currentuser-provider";
import { ModalProvider } from "@/context/modal-provider";

async function MainLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  const plan = await checkUserSubscription();
  const isPro = plan === PLAN_TYPE.PRO ? true : false;
  // if (status === "loading") {
  //   return (
  //     <div className="flex flex-col h-screen items-center w-full justify-center">
  //       <Logo width="70px" height="70px" />
  //       <Spinner size="icon" />
  //     </div>
  //   );
  // }

  // if (!session?.user?.email) {
  //   return redirect("/");
  // }

  // if (!user) {
  //   return (
  //     <div className="flex flex-col h-screen items-center w-full justify-center">
  //       <Logo width="70px" height="70px" />
  //       <Spinner size="icon" />
  //     </div>
  //   );
  // }

  if (!session) {
    return redirect("/");
  }

  return (
    <CurrentUserProvider>
      <Fragment>
        <ModalProvider />
        <EditProfileModal />
        <div className="h-screen">
          <div className="container h-full mx-auto xl:px-30 max-w-7xl">
            <div className="flex items-start justify-center h-full">
              <div className="shrink-0 flex-[0.1]  lg:flex-[0.28] relative">
                <Sidebar {...{ isPro }} />
              </div>
              <div className="flex flex-row h-screen flex-1 gap-0 lg:gap-8">
                <main className="!bg-background lg:max-w-[600px] relative h-screen flex-1 flex lg:flex-[0.95] ">
                  <hr className="w-[1px] fixed h-screen bg-[#eee] dark:bg-[rgb(47,51,54)]" />
                  <div className="w-full">{children}</div>
                  <hr className="w-[1px] fixed right-0 lg:right-[calc(100%-71%)]  xl:right-[calc(100%-66%)] top-0 h-screen bg-[#eee] dark:bg-[rgb(47,51,54)]" />
                </main>
                <div className="hidden lg:flex shrink-0 relative h-screen">
                  <Rightbar {...{ isPro }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    </CurrentUserProvider>
  );
}

export default MainLayout;
