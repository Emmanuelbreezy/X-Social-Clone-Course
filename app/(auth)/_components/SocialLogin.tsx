"use client";
import { Button } from "@/components/ui/button";
import { doSocialLogin } from "../../actions/auth.action";
import GoogleLogo from "@/public/assets/google-logo.svg";

const SocialLogin = () => {
  return (
    <form action={doSocialLogin}>
      <Button
        variant="outline"
        className="shadow-sm dark:bg-white gap-2 w-full h-10 text-base !text-[#3c4043] font-medium p-1 rounded-full"
        type="submit"
        name="action"
        value="google"
      >
        <GoogleLogo />
        Sign in with Google
      </Button>

      {/* <button
        className="bg-black text-white p-1 rounded-md m-1 text-lg"
        type="submit"
        name="action"
        value="github"
      >
        Sign In With GitHub
      </button> */}
    </form>
  );
};

export default SocialLogin;
