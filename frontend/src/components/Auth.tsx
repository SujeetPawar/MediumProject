import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignupInput } from "@sujeet_17/common";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const Auth = ({ type }: { type: "signin" | "signup" }) => {
  const navigate = useNavigate();
  const [postInputs, setPostInputs] = useState<SignupInput>({
    username: "",
    password: "",
    name: "",
  });

  async function sendRequest() {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/${type === "signin" ? "signin" : "signup"}`,
        postInputs
      );
      const {jwt} = response.data;    
      localStorage.setItem("token", jwt);
      navigate("/blogs");
    } catch (e) {
      console.log("backend fetch call missed")
    }
  }

  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <div>
          <div className="px-10 ">
            <div className="text-3xl font-extrabold">
              {type === "signin" ? "Hello! Welcome Back" : "Create an account"}
            </div>
            <div className="text-slate-400 text-center">
              {type === "signin"
                ? "Don't have an account?"
                : "Already have an account?"}
              <Link to={type === "signin" ? "/signup" : "/signin"}>
                <span className="underline font-light pl-1">
                  {type === "signin" ? "Sign Up" : "/Sign In"}
                </span>
              </Link>
            </div>
          </div>
          <div className="pt-4">
            {type === "signup" ? (
              <LabelledInput
                label="Username"
                placeholder="Sujeet Pawar"
                onchange={(e) => {
                  setPostInputs({
                    ...postInputs,
                    name: e.target.value,
                  });
                }}
              />
            ) : null}
            <LabelledInput
              label="Email"
              placeholder="suje@gmail.com"
              onchange={(e) => {
                setPostInputs({
                  ...postInputs,
                  username: e.target.value,
                });
              }}
            />
            <LabelledInput
              label="Password"
              type={"password"}
              placeholder="abc@123@"
              onchange={(e) => {
                setPostInputs({
                  ...postInputs,
                  password: e.target.value,
                });
              }}
            />
            <button
              onClick={sendRequest}
              type="button"
              className=" w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 mt-8"
            >
              {type === "signup" ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface LabelledInputType {
  label: string;
  placeholder: string;
  onchange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

function LabelledInput({
  label,
  placeholder,
  onchange,
  type,
}: LabelledInputType) {
  return (
    <div>
      <label className="block mb-2 text-sm  font-semibold pt-4  text-black">
        {label}
      </label>
      <input
        type={type || "text"}
        id="first_name"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-ring-sky-600 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        onChange={onchange}
        required
      />
    </div>
  );
}
