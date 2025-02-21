import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import axios from "axios";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Popup from "@/components/Popup";
import Spinner from "@/components/Spinner";
import configSettings from "@/config";
import useSession from "@/hooks/user/get-session";

const CreateCustomer = () => {
    const { data: session, isLoading } = useSession();

    const [customer, setCustomer] = useState();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [isPopup, setIsPopup] = useState(false);
    const [popupDetail, setPopupDetail] = useState();
    const [isSpinner, setIsSpinner] = useState(false);

    const router = useRouter();

    let name, value;

    const handleInput = (e) => {
        name = e.target.name;
        value = e.target.value;
        setCustomer({ ...customer, [name]: value });
    };

    const createCustomer = async () => {
        try {
            setIsSpinner(true);
            await axios.post(
                configSettings.serverUrl + "/createCustomer",
                {
                    name: customer?.name,
                    email: customer?.email,
                    phone: customer?.phone,
                    address: customer?.address,
                    postalCode: customer?.postalCode,
                    city: customer?.city,
                },
                {
                    headers: {
                        "access-token": Cookies.get("access-token"),
                    },
                }
            );

            setCustomer();

            setIsSpinner(false);

            setPopupDetail({
                type: "Success",
                text: "Customer has been successfully created",
            });

            setIsPopup(true);

            setTimeout(function () {
                setIsPopup(false);
                router.push("/customers");
            }, 2000);
        } catch (error) {
            setIsSpinner(false);
            if (error.response.status === 400) {
                setPopupDetail({
                    type: "Warning",
                    text: error.response.data.message,
                });

                setIsPopup(true);

                setTimeout(function () {
                    setIsPopup(false);
                }, 4000);
            }
        }
    };

    useEffect(() => {
        if (!session && !isLoading) {
            router.push("/login");
        }
    }, [session, isLoading]);

    return (
        <>
            <Head>
                <title>Create Customer - Safe Solar</title>
                <meta name="description" content="M2M SOFTWARES" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div className="lg:pl-72">
                <Navbar setSidebarOpen={setSidebarOpen} />
                <main className="py-10">
                    {/* page header */}

                    <div className="flex items-center px-4 sm:px-6 lg:px-8">
                        <div className="flex-auto">
                            <h1 className="text-3xl leading-6 text-gray-900">
                                Create Customer
                            </h1>
                        </div>
                    </div>

                    {/* page body */}
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="mt-10">
                            <div className="col-span-full mt-4">
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                                >
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    autoComplete="off"
                                    className="block w-full rounded-md border-0 p-[10px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 outline-none max-w-[350px]"
                                    value={customer?.name}
                                    onChange={handleInput}
                                />
                            </div>

                            <div className="col-span-full mt-4">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                                >
                                    Email Address
                                </label>

                                <input
                                    type="text"
                                    name="email"
                                    autoComplete="email"
                                    className="block w-full rounded-md border-0 p-[10px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 outline-none max-w-[350px]"
                                    value={customer?.email}
                                    onChange={handleInput}
                                />
                            </div>

                            <div className="col-span-full mt-4">
                                <label
                                    htmlFor="phone"
                                    className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                                >
                                    Phone Number
                                </label>

                                <input
                                    type="text"
                                    name="phone"
                                    autoComplete="off"
                                    className="block w-full rounded-md border-0 p-[10px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 outline-none max-w-[350px]"
                                    value={customer?.phone}
                                    onChange={handleInput}
                                />
                            </div>

                            <div className="col-span-full mt-4">
                                <label
                                    htmlFor="address"
                                    className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                                >
                                    Address
                                </label>

                                <input
                                    type="text"
                                    name="address"
                                    autoComplete="off"
                                    className="block w-full rounded-md border-0 p-[10px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 outline-none max-w-[350px]"
                                    value={customer?.address}
                                    onChange={handleInput}
                                />
                            </div>

                            <div className="col-span-full mt-4">
                                <label
                                    htmlFor="postalCode"
                                    className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                                >
                                    Postal Code
                                </label>

                                <input
                                    type="text"
                                    name="postalCode"
                                    autoComplete="street-address"
                                    className="block w-full rounded-md border-0 p-[10px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 outline-none max-w-[350px]"
                                    value={customer?.postalCode}
                                    onChange={handleInput}
                                />
                            </div>

                            <div className="col-span-full mt-4">
                                <label
                                    htmlFor="city"
                                    className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                                >
                                    City
                                </label>

                                <input
                                    type="text"
                                    name="city"
                                    autoComplete="off"
                                    className="block w-full rounded-md border-0 p-[10px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 outline-none max-w-[350px]"
                                    value={customer?.city}
                                    onChange={handleInput}
                                />
                            </div>

                            <div className="col-span-full mt-6 w-40">
                                <button
                                    type="button"
                                    className="flex w-full text-white justify-center rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-3 text-sm outline-none transition-all duration-500 btn-animation hover:from-secondary hover:to-primary"
                                    onClick={createCustomer}
                                >
                                    Create Customer
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {isSpinner && (
                <>
                    <div className="absolute w-full h-screen top-0 left-0 bg-black opacity-50 z-[60]"></div>
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

export default CreateCustomer;
