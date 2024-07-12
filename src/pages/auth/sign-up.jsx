import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/loader";
import { auth, db } from "@/lib/firebase";
import normalizeFirebaseErrorMessage from "@/utils/firebase-errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import Logo from "../../assets/logo.svg";


const formSchema = z.object({
  displayName: z.string().min(5, {
    message: "Name must be more than 5 characters",
  }),
  email: z.string().email({
    message: "Enter a valid email",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

function SignUpForm() {
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: data.displayName,
      });

      const usersRef = collection(db, "users");

      await addDoc(usersRef, {
        name: data.displayName,
        email: data.email,
        role:"admin",
        uid: userCredential.user.uid,
      });

      navigate("/sign-in");
      toast.success("User signed up successfully!");
    } catch (error) {
      console.error("Error signing up:", error);
      const friendlyMessage = normalizeFirebaseErrorMessage(error.code);
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
            <img src={Logo} alt="logo" className="w-8 h-8 mb-2" />
            <h5 className="text-primary">Sign Up</h5>
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
              Full Name
            </label>
            <Input type="text" {...register("displayName")} />
            {errors.displayName && (
              <p className="mt-2 text-sm text-red-600">
                {errors.displayName.message}
              </p>
            )}
          </div>
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
          <Button
            type="submit"
            className="w-full"
            size="sm"
            disabled={isSubmittingForm}
          >
            {isSubmittingForm ? <Loader /> : "Sign Up"}
          </Button>
          <p className="text-sm text-neutral-600 mt-4">
            By signing up, you agree to the{" "}
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
            Already have an account?{" "}
            <span className="font-semibold text-primary">
              <Link to="/sign-in" className="hover:underline">
                Sign In
              </Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUpForm;
