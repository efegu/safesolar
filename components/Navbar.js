import React, { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Menu, Transition } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Avatar } from "@mui/material";
import Cookies from "js-cookie";

import Popup from "./Popup";
import Spinner from "./Spinner";
import useSession from "@/hooks/user/get-session";

const Navbar = ({ setSidebarOpen }) => {
    const { data: session } = useSession();

    const [isPopup, setIsPopup] = useState(false);
    const [popupDetail, setPopupDetail] = useState();
    const [isSpinner, setIsSpinner] = useState(false);

    const router = useRouter();

    const signOutUser = () => {
        Cookies.remove("access-token");

        setPopupDetail({
            type: "Success",
            text: "Your account has been successfully logged out",
        });

        setIsPopup(true);

        setTimeout(function () {
            setIsPopup(false);
            router.push("/login");
        }, 2000);
    };

    return (
        <>
            <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                <button
                    type="button"
                    className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                    onClick={() => setSidebarOpen(true)}
                >
                    <span className="sr-only">Open sidebar</span>
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Separator */}
                <div
                    className="h-6 w-px bg-gray-900/10 lg:hidden"
                    aria-hidden="true"
                />

                <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end">
                    <div className="flex items-center gap-x-4 lg:gap-x-6">
                        {/* Profile dropdown */}
                        <Menu as="div" className="relative">
                            <Menu.Button className="-m-1.5 flex items-center p-1.5">
                                <span className="sr-only">Open user menu</span>
                                <Avatar className="h-8 w-8 rounded-full bg-gray-50" />
                                <span className="hidden lg:flex lg:items-center">
                                    <span
                                        className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                                        aria-hidden="true"
                                    >
                                        {session?.data?.name}
                                    </span>
                                    <ChevronDownIcon
                                        className="ml-2 h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </span>
                            </Menu.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                                    <Menu.Item>
                                        <div
                                            className="block px-3 py-1 text-sm leading-6 text-gray-900 cursor-pointer hover:bg-gray-50"
                                            onClick={() => {
                                                router.push(
                                                    "/account-settings"
                                                );
                                            }}
                                        >
                                            Settings
                                        </div>
                                    </Menu.Item>

                                    <Menu.Item>
                                        <div
                                            className="block px-3 py-1 text-sm leading-6 text-gray-900 cursor-pointer hover:bg-gray-50"
                                            onClick={signOutUser}
                                        >
                                            Sign out
                                        </div>
                                    </Menu.Item>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>
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

export default Navbar;
