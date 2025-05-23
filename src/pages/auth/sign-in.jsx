import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/loader";
import { auth, userRef } from "@/lib/firebase";
import normalizeFirebaseErrorMessage from "@/utils/firebase-errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({
    message: "Enter a valid email",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

function SignInForm() {
  const navigate = useNavigate();
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmittingForm(true);
    setError("");
    try {
      const q = query(userRef,where("role","==","admin"))
      const querySnapShot= await getDocs(q)
      if(!querySnapShot.empty)
      await signInWithEmailAndPassword(auth, data.email, data.password);

      navigate("/");
    } catch (error) {
      console.log(error)
      const friendlyMessage = normalizeFirebaseErrorMessage(error.code) 
      setError(friendlyMessage);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="max-w-lg bg-white px-5 py-8 rounded-xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="my-5">
            <h5 className="text-primary">Sign In</h5>
            <p className="text-neutral-500">
              Enter your credentials to use LockIt Admin
            </p>
          </div>
          {error && (
            <div className="mb-4 text-sm bg-red-200 px-4 py-2 rounded-md">
              <p className="text-center">{error}</p>
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input type="email" {...register("email")} />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Input type="password" {...register("password")} />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <p className="w-fit mt-5 text-sm text-neutral-600 hover:text-red-500 hover:underline hover:underline-offset-4 hover:text-foreground ease duration-150">
            <Link to={`/forgot-password`}>Forgot Password?</Link>
          </p>
          <br />
          <Button
            type="submit"
            className="w-full"
            size={"sm"}
            disabled={isSubmittingForm}
          >
            {isSubmittingForm ? <Loader /> : <div>Sign In</div>}
          </Button>
          <p className="text-sm text-neutral-600 mt-4">
            By signing in, you agree to the{" "}
            <span className="text-primary hover:underline font-semibold ease duration-150 cursor-pointer">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-primary hover:underline font-semibold ease duration-150 cursor-pointer">
              Privacy Policy
            </span>
            .
          </p>
          <p className="text-sm text-neutral-600 mt-2">
            Don&apos;t have an account?{" "}
            <span className="font-semibold text-primary">
              <Link to={`/sign-up`} className="hover:underline">
                Sign Up
              </Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignInForm;
