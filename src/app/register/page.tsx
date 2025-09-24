"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { postData } from "@/lib/fatching";
import { toast } from "react-toastify";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
};

type RegisterResponse = {
  status: number;
};

export default function RegisterPage() {
  const { register, handleSubmit } = useForm<RegisterForm>();
  const router = useRouter();

  const mutation = useMutation<RegisterResponse, string, RegisterForm>({
    mutationFn: async (data: RegisterForm) =>
      postData<RegisterForm, RegisterResponse>("api/register", data),
    onSuccess: () => {
      router.push("/login");
    },

    onError: async (error) => {
      console.log(error);

      toast.error(error);
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen grid place-items-center bg-slate-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm bg-white p-6 rounded-2xl shadow space-y-4"
      >
        <h1 className="text-xl font-semibold">Register</h1>

        <div className="space-y-1">
          <label className="text-sm">Name</label>
          <input
            className="w-full border rounded p-2"
            placeholder="Your name"
            {...register("name", { required: true })}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm">Email</label>
          <input
            type="email"
            className="w-full border rounded p-2"
            placeholder="you@example.com"
            {...register("email", { required: true })}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm">Password</label>
          <input
            type="password"
            className="w-full border rounded p-2"
            {...register("password", { required: true, minLength: 6 })}
          />
        </div>

        <button
          disabled={mutation.isPending}
          className="w-full rounded bg-blue-600 text-white py-2 disabled:opacity-60"
        >
          {mutation.isPending ? "Registering..." : "Register"}
        </button>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
