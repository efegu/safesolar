import React, { useState, useEffect } from "react";
import Head from "next/head";
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

    const [adminDetails, setAdminDetails] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [popupDetail, setPopupDetail] = useState();

    const [isSpinner, setIsSpinner] = useState(false);

    const [isPopup, setIsPopup] = useState(false);

    let name, value;

    const handleInput = (e) => {
        name = e.target.name;
        value = e.target.value;
        setAdminDetails({ ...adminDetails, [name]: value });
    };

    const updateAccountSettings = async () => {
        setIsSpinner(true);
        try {
            await axios.put(
                configSettings.serverUrl + "/updateSettings",
                {
                    currentPassword: adminDetails.currentPassword,
                    newPassword: adminDetails.newPassword,
                    confirmPassword: adminDetails.confirmPassword,
                },
                {
                    headers: {
                        "access-token": Cookies.get("access-token"),
                    },
                }
            );

            setIsSpinner(false);

            setAdminDetails({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

            setPopupDetail({
                type: "Success",
                text: "Settings has been successfully updated",
            });

            setIsPopup(true);

            setTimeout(function () {
                setIsPopup(false);
            }, 4000);
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
                <title>Account Settings - Safe Solar</title>
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
                                Account Settings
                            </h1>
                        </div>
                    </div>

                    {/* page body */}
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="mt-10">
                            <div className="col-span-full mt-4">
                                <label
                                    htmlFor="currentPassword"
                                    className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                                >
                                    Current Password
                                </label>

                                <input
                                    type="password"
                                    name="currentPassword"
                                    autoComplete="off"
                                    className="block w-full rounded-md border-0 p-[10px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 outline-none max-w-[350px]"
                                    value={adminDetails?.currentPassword}
                                    onChange={handleInput}
                                />
                            </div>

                            <div className="col-span-full mt-4">
                                <label
                                    htmlFor="newPassword"
                                    className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                                >
                                    New Password
                                </label>

                                <input
                                    type="password"
                                    name="newPassword"
                                    autoComplete="off"
                                    className="block w-full rounded-md border-0 p-[10px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 outline-none max-w-[350px]"
                                    value={adminDetails?.newPassword}
                                    onChange={handleInput}
                                />
                            </div>

                            <div className="col-span-full mt-4">
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                                >
                                    Confirm Password
                                </label>

                                <input
                                    type="password"
                                    name="confirmPassword"
                                    autoComplete="off"
                                    className="block w-full rounded-md border-0 p-[10px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 outline-none max-w-[350px]"
                                    value={adminDetails?.confirmPassword}
                                    onChange={handleInput}
                                />
                            </div>

                            <div className="col-span-full mt-6 w-40">
                                <button
                                    type="button"
                                    className="flex w-full text-white justify-center rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-3 text-sm outline-none transition-all duration-500 btn-animation hover:from-secondary hover:to-primary"
                                    onClick={updateAccountSettings}
                                >
                                    Update Settings
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
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

export default CreateCustomer;
