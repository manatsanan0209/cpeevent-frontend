import { Input } from "@nextui-org/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white drop-shadow-lg sm:rounded-lg flex justify-center flex-1">
        <div className="flex flex-col gap-3 mx-auto lg:w-1/2 p-6 sm:p-12">
          <Input></Input>
        </div>
        <div className="flex-1 lg:flex w-1/2">
          <div className="bg-purple-400 w-full"></div>
        </div>
      </div>
    </div>
  );
}
