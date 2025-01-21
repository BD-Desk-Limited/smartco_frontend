"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

const companyData = { //company information, name, id, logoUrl, authorizationToken, etc.  to be fetched from local storage.
  name: "Sample Company",
  id: "company-id",
  logoUrl: "https://drive.google.com/file/d/1FVTyo3fMwaGTdSraEoFUxXUtOPD0aD7O/view?usp=drive_link",
  authorizationToken:"",
}
const deviceIsAuthorized = true; //device is authorized to use the app, to be fetched from the server(sends the token to the server to check if the device is authorized for use by the company with the company id)

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if(companyData.authorizationToken&&deviceIsAuthorized){
        router.push("/pages/splash/splash3");
      }else{
        router.push("/pages/auth/login");
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen min-w-full bg-brand-blue flex items-center justify-center overflow-hidden relative">
      <motion.h1
        className="text-white text-5xl font-bold"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 3 }}
      >
        <Image src="/assets/logo_long.png" alt="Logo" width={400} height={400} />
      </motion.h1>
      <div className="absolute bottom-[-20vh] left-[-10vw]">
        <Image src="/assets/brand_mark1.png" alt="Logo" width={450} height={450} />
      </div>
      <div className="absolute bottom-[25vh] right-[-10vw]">
        <Image src="/assets/brand_mark1.png" alt="Logo" width={450} height={450} />
      </div>
    </div>
  );
}