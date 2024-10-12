import { Input,Button} from "@nextui-org/react";
import { RxAvatar } from "react-icons/rx";


export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white drop-shadow-lg sm:rounded-lg flex justify-center flex-1">
        <div className="flex flex-col gap-3 mx-auto lg:w-1/2 p-6 sm:p-12">
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-semibold mb-6 text-zinc-500 text-center">Welcome to CPE EVO!</h1>
          <h1 className="text-m font-semibold mb-6 text-zinc-400 text-center">The best community of all for us, "CPEs." </h1>
        </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 lg:flex w-1/2 justify-center items-center">
          <div className="bg-white w-2/3 h-2/3 shadow-2xl rounded-xl p-8 flex flex-col justify-center items-center">
            {/* User Icon */}
            <RxAvatar className="w-24 h-24 mb-6" />

            {/* Sign In */}
            <h2 className="text-2xl font-bold text-zinc-600 mb-6">Sign in</h2>
            <div className="w-full max-w-sm flex flex-col gap-4">
              <label className="text-zinc-600 font-medium">Username</label>
                <Input/>
              <label className="text-zinc-600 font-medium">Password</label>
                <Input/>
                  <button className="bg-violet-800 hover:bg-violet-900 text-white font-bold py-2 px-4 rounded-full">
                    Sing in
                  </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
