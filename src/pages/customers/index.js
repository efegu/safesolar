import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import axios from "axios";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Popup from "@/components/Popup";
import Spinner from "@/components/Spinner";
import configSettings from "@/config";
import Link from "next/link";
import useSession from "@/hooks/user/get-session";

const Customers = () => {
    const { data: session, isLoading } = useSession();

    const [customers, setCustomers] = useState([]);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [isPopup, setIsPopup] = useState(false);
    const [popupDetail, setPopupDetail] = useState();
    const [isSpinner, setIsSpinner] = useState(false);

    const router = useRouter();

    const getAllCustomers = async () => {
        try {
            setIsSpinner(true);
            const result = await axios.get(
                configSettings.serverUrl + "/getCustomers",

                {
                    headers: {
                        "access-token": Cookies.get("access-token"),
                    },
                }
            );

            setIsSpinner(false);

            const response = result.data;

            setCustomers(response.data);
        } catch (error) {
            setIsSpinner(false);
        }
    };

    useEffect(() => {
        getAllCustomers();
    }, []);

    useEffect(() => {
        if (!session && !isLoading) {
            router.push("/login");
        }
    }, [session, isLoading]);

    return (
        <>
            <Head>
                <title>Customers - Safe Solar</title>
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
                                Manage Customers
                            </h1>
                        </div>
                        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                            <button
                                type="button"
                                className="flex w-full text-white justify-center rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-3 text-sm outline-none transition-all duration-500 btn-animation hover:from-secondary hover:to-primary"
                                onClick={() => {
                                    router.push("/create-customer");
                                }}
                            >
                                Create Customer
                            </button>
                        </div>
                    </div>

                    {/* page body */}
                    <div className="px-4 sm:px-6 lg:px-8">
                        {/* Table */}
                        <div className="mt-4 flow-root">
                            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                        <table className="min-w-full divide-y divide-gray-300">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th
                                                        scope="col"
                                                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                                    >
                                                        SNO
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                                    >
                                                        Name
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                    >
                                                        Email
                                                    </th>

                                                    <th
                                                        scope="col"
                                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                    >
                                                        Phone
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                    >
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {customers.map(
                                                    (customer, index) => (
                                                        <tr
                                                            key={customer.email}
                                                            className="cursor-pointer hover:bg-gray-100"
                                                        >
                                                            <td
                                                                className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                                                                onClick={() => {
                                                                    router.push(
                                                                        `/customers/${customer?._id}`
                                                                    );
                                                                }}
                                                            >
                                                                {index + 1}
                                                            </td>
                                                            <td
                                                                className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                                                                onClick={() => {
                                                                    router.push(
                                                                        `/customers/${customer?._id}`
                                                                    );
                                                                }}
                                                            >
                                                                {customer.name}
                                                            </td>
                                                            <td
                                                                className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                                                                onClick={() => {
                                                                    router.push(
                                                                        `/customers/${customer?._id}`
                                                                    );
                                                                }}
                                                            >
                                                                {customer.email}
                                                            </td>

                                                            <td
                                                                className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                                                                onClick={() => {
                                                                    router.push(
                                                                        `/customers/${customer?._id}`
                                                                    );
                                                                }}
                                                            >
                                                                {customer.phone}
                                                            </td>

                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                <Link
                                                                    href={`/edit-customer/${customer._id}`}
                                                                    className="text-indigo-600 hover:text-indigo-900"
                                                                >
                                                                    Edit
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
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

export default Customers;
