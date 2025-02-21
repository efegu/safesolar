import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import axios from "axios";

import logo from "../../public/images/logo.png";
import Popup from "@/components/Popup";
import Spinner from "@/components/Spinner";
import configSettings from "@/config";
import useSession from "@/hooks/user/get-session";

const Login = () => {
    const { data: session } = useSession();

    const [credentials, setCredentials] = useState();

    const [isPopup, setIsPopup] = useState(false);
    const [popupDetail, setPopupDetail] = useState();
    const [isSpinner, setIsSpinner] = useState(false);

    const router = useRouter();

    let name, value;

    const handleInput = (e) => {
        name = e.target.name;
        value = e.target.value;
        setCredentials({ ...credentials, [name]: value });
    };

    const loginUser = async () => {
        if (!credentials?.email || !credentials.password) {
            setPopupDetail({
                type: "Warning",
                text: "Please enter email and password first",
            });

            setIsPopup(true);

            setTimeout(function () {
                setIsPopup(false);
            }, 4000);

            return;
        }

        try {
            setIsSpinner(true);
            const result = await axios.post(
                configSettings.serverUrl + "/login",
                {
                    email: credentials?.email,
                    password: credentials?.password,
                }
            );

            const response = result.data;

            Cookies.set("access-token", response.data, { expires: 7 });

            setIsSpinner(false);

            setCredentials();

            setPopupDetail({
                type: "Success",
                text: "Your account has been successfully logged in",
            });

            setIsPopup(true);

            setTimeout(function () {
                setIsPopup(false);
                router.push("/inspections");
            }, 4000);
        } catch (error) {
            setIsSpinner(false);
            if (error.response.status === 400) {
                setPopupDetail({
                    type: "Warning",
                    text: error.response.data.error,
                });

                setIsPopup(true);

                setTimeout(function () {
                    setIsPopup(false);
                }, 4000);
            }
        }
    };

    useEffect(() => {
        if (session) {
            router.push("/inspections");
        }
    }, [session]);

    return (
        <>
            <Head>
                <title>Login - Safe Solar</title>
                <meta name="description" content="M2M SOFTWARES" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex items-center justify-center w-full h-screen">
                <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        <Image
                            src={logo}
                            alt="safe solar"
                            className="mx-auto h-32 w-auto"
                        />
                    </div>

                    <div className="mt-3 sm:mx-auto sm:w-full sm:max-w-[480px]">
                        <div className="bg-white px-6 py-12 shadow rounded-lg sm:px-12">
                            <h2 className="text-center mb-5 text-2xl font-bold leading-9 tracking-tight text-gray-800">
                                Login to Your Account
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        Email address
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            onChange={handleInput}
                                            className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        Password
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            onChange={handleInput}
                                            className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <button
                                        className="flex w-full text-white justify-center rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-3 text-sm outline-none transition-all duration-500 btn-animation hover:from-secondary hover:to-primary"
                                        onClick={loginUser}
                                    >
                                        Login
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isSpinner && (
                <>
                    <div className="absolute w-full h-screen top-0 left-0 bg-black opacity-50"></div>
                    <Spinner />
                </>
            )}

            <Popup
                type={popupDetail?.type}
                text={popupDetail?.text}
                isPopup={isPopup}
            />
        </>
    );
};

export default Login;
