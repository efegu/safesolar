import React, { Fragment } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";
import {
    Cog6ToothIcon,
    UsersIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import SpeedIcon from '@mui/icons-material/Speed';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import logo from "../public/images/logo.png";
import useSession from "@/hooks/user/get-session";

const navigation = [
    {
        name: "Overview",
        href: "/",
        icon: SpeedIcon,
        current: true,
    },
    {
        name: "Inspections",
        href: "/inspections",
        icon: ContentPasteSearchIcon,
        current: true,
    },
    {
        name: "Completed Inspections",
        href: "/completed-inspections",
        icon: FactCheckOutlinedIcon,
        current: false,
    },
    {
        name: "Upcoming Inspections",
        href: "/upcoming-inspections",
        icon: FactCheckOutlinedIcon,
        current: false,
    },
    { name: "Customers", href: "/customers", icon: UsersIcon, current: false },
    {
        name: "Create Customer",
        href: "/create-customer",
        icon: GroupAddOutlinedIcon,
        current: false,
    },
     {
        name: "Products",
        href: "/products",
        icon: Inventory2Icon,
        current: false,
    },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const { data: session, isLoading } = useSession();

    const router = useRouter();

    return (
        <>
            {/* mobile sidebar */}
            <Transition.Root show={sidebarOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50 lg:hidden"
                    onClose={setSidebarOpen}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-900/80" />
                    </Transition.Child>

                    <div className="fixed inset-0 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                        <button
                                            type="button"
                                            className="-m-2.5 p-2.5"
                                            onClick={() =>
                                                setSidebarOpen(false)
                                            }
                                        >
                                            <span className="sr-only">
                                                Close sidebar
                                            </span>
                                            <XMarkIcon
                                                className="h-6 w-6 text-white"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>
                                </Transition.Child>
                                {/* Sidebar component, swap this element with another sidebar if you like */}
                                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-800 px-6 pb-4">
                                    <div className="mt-3 ml-[-20px] mb-3">
                                        <Image
                                            className="h-20 w-auto"
                                            src={logo}
                                            alt="Safe Solar"
                                        />
                                    </div>
                                    <nav className="flex flex-1 flex-col">
                                        <ul
                                            role="list"
                                            className="flex flex-1 flex-col gap-y-7"
                                        >
                                            <li>
                                                <ul
                                                    role="list"
                                                    className="-mx-2 space-y-4"
                                                >
                                                    {navigation.map((item) => (
                                                        <li key={item.name}>
                                                            <Link
                                                                href={item.href}
                                                                className={classNames(
                                                                    item.current
                                                                        ? "bg-primary text-white"
                                                                        : "text-indigo-200 hover:text-white hover:bg-primary",
                                                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all duration-100"
                                                                )}
                                                            >
                                                                <item.icon
                                                                    className={classNames(
                                                                        item.current
                                                                            ? "text-white"
                                                                            : "text-indigo-200 group-hover:text-white",
                                                                        "h-6 w-6 shrink-0"
                                                                    )}
                                                                    aria-hidden="true"
                                                                />
                                                                {item.name}
                                                            </Link>
                                                        </li>
                                                    ))}

                                                    {session?.data.type ===
                                                        "Admin" && (
                                                        <li>
                                                            <Link
                                                                href="/sub-admins"
                                                                className={classNames(
                                                                    router.pathname ===
                                                                        "/sub-admins"
                                                                        ? "bg-primary text-white"
                                                                        : "text-indigo-200 hover:text-white hover:bg-primary",
                                                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all duration-100"
                                                                )}
                                                            >
                                                                <AdminPanelSettingsOutlinedIcon
                                                                    className={classNames(
                                                                        router.pathname ===
                                                                            "/sub-admins"
                                                                            ? "text-white"
                                                                            : "text-indigo-200 group-hover:text-white",
                                                                        "h-6 w-6 shrink-0"
                                                                    )}
                                                                    aria-hidden="true"
                                                                />
                                                                Manage Sub
                                                                Admins
                                                            </Link>
                                                        </li>
                                                    )}
                                                </ul>
                                            </li>

                                            <li className="mt-auto">
                                                <Link
                                                    href="/account-settings"
                                                    className={classNames(
                                                        router.pathname ===
                                                            "/account-settings"
                                                            ? "bg-primary text-white"
                                                            : "text-indigo-200 hover:text-white hover:bg-primary",
                                                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all duration-100"
                                                    )}
                                                >
                                                    <Cog6ToothIcon
                                                        className="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
                                                        aria-hidden="true"
                                                    />
                                                    Settings
                                                </Link>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Static sidebar for desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-800 px-6 pb-4">
                    <div className="mt-3 ml-[-20px] mb-3">
                        <Image
                            className="h-20 w-auto"
                            src={logo}
                            alt="Safe Solar"
                        />
                    </div>
                    <nav className="flex flex-1 flex-col">
                        <ul
                            role="list"
                            className="flex flex-1 flex-col gap-y-7"
                        >
                            <li>
                                <ul role="list" className="-mx-2 space-y-4">
                                    {navigation.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                className={classNames(
                                                    router.pathname ===
                                                        item.href
                                                        ? "bg-primary text-white"
                                                        : "text-indigo-200 hover:text-white hover:bg-primary",
                                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all duration-100"
                                                )}
                                            >
                                                <item.icon
                                                    className={classNames(
                                                        router.pathname ===
                                                            item.href
                                                            ? "text-white"
                                                            : "text-indigo-200 group-hover:text-white",
                                                        "h-6 w-6 shrink-0"
                                                    )}
                                                    aria-hidden="true"
                                                />
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}

                                    {session?.data.type === "Admin" && (
                                        <li>
                                            <Link
                                                href="/sub-admins"
                                                className={classNames(
                                                    router.pathname ===
                                                        "/sub-admins"
                                                        ? "bg-primary text-white"
                                                        : "text-indigo-200 hover:text-white hover:bg-primary",
                                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all duration-100"
                                                )}
                                            >
                                                <AdminPanelSettingsOutlinedIcon
                                                    className={classNames(
                                                        router.pathname ===
                                                            "/sub-admins"
                                                            ? "text-white"
                                                            : "text-indigo-200 group-hover:text-white",
                                                        "h-6 w-6 shrink-0"
                                                    )}
                                                    aria-hidden="true"
                                                />
                                                Manage Sub Admins
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                            </li>

                            <li className="mt-auto">
                                <Link
                                    href="/account-settings"
                                    className={classNames(
                                        router.pathname === "/account-settings"
                                            ? "bg-primary text-white"
                                            : "text-indigo-200 hover:text-white hover:bg-primary",
                                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all duration-100"
                                    )}
                                >
                                    <Cog6ToothIcon
                                        className={`${
                                            router.pathname ===
                                                "/account-settings" &&
                                            "text-white"
                                        } h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white`}
                                        aria-hidden="true"
                                    />
                                    Account Settings
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
