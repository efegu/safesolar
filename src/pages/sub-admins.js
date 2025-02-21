import React, { Fragment, useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Cookies from "js-cookie";
import configSettings from "@/config";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Popup from "@/components/Popup";
import Spinner from "@/components/Spinner";
import useSession from "@/hooks/user/get-session";

const SubAdmins = () => {
    const { data: session, isLoading } = useSession();

    const [subAdmins, setSubAdmins] = useState([]);
    const [subAdmin, setSubAdmin] = useState();
    const [selectedSubAdmin, setSelectedSubAdmin] = useState();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [createSubAminModal, setCreateSubAminModal] = useState(false);
    const [confirmationModal, setConfirmationModla] = useState(false);

    const [isPopup, setIsPopup] = useState(false);
    const [popupDetail, setPopupDetail] = useState();
    const [isSpinner, setIsSpinner] = useState(false);

    const router = useRouter();

    let name, value;

    const handleInput = (e) => {
        name = e.target.name;
        value = e.target.value;
        setSubAdmin({ ...subAdmin, [name]: value });
    };

    const validateSubAdmin = () => {
        if (
            !subAdmin?.name ||
            !subAdmin?.email ||
            !subAdmin?.password ||
            !subAdmin?.conPassword
        ) {
            setPopupDetail({
                type: "Warning",
                text: "Please fill all the fields first",
            });

            setIsPopup(true);

            setTimeout(function () {
                setIsPopup(false);
            }, 4000);

            return;
        } else if (subAdmin?.password !== subAdmin?.conPassword) {
            setPopupDetail({
                type: "Warning",
                text: "Password does not match",
            });

            setIsPopup(true);

            setTimeout(function () {
                setIsPopup(false);
            }, 4000);
            return;
        }

        return true;
    };

    const createSubAdmin = async () => {
        const isValid = validateSubAdmin();

        if (isValid) {
            try {
                setIsSpinner(true);
                await axios.post(
                    configSettings.serverUrl + "/createUser",
                    {
                        name: subAdmin?.name,
                        email: subAdmin?.email,
                        password: subAdmin?.password,
                        type: "Sub Admin",
                    },
                    {
                        headers: {
                            "access-token": Cookies.get("access-token"),
                        },
                    }
                );

                setSubAdmin();

                setCreateSubAminModal(false);

                setIsSpinner(false);

                setPopupDetail({
                    type: "Success",
                    text: "Sub Admin has been successfully created",
                });

                setIsPopup(true);

                setTimeout(function () {
                    setIsPopup(false);
                }, 4000);

                getAllSubAdmins();
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
        }
    };

    const deleteSubAdmin = async () => {
        try {
            setIsSpinner(true);
            await axios.delete(
                configSettings.serverUrl +
                    `/deleteSubAdmin/${selectedSubAdmin}`,
                {
                    headers: {
                        "access-token": Cookies.get("access-token"),
                    },
                }
            );

            setSelectedSubAdmin();

            setConfirmationModla(false);

            setIsSpinner(false);

            setPopupDetail({
                type: "Success",
                text: "Sub Admin has been successfully deleted",
            });

            setIsPopup(true);

            setTimeout(function () {
                setIsPopup(false);
            }, 4000);

            getAllSubAdmins();
        } catch (error) {
            setIsSpinner(false);
        }
    };

    const getAllSubAdmins = async () => {
        try {
            setIsSpinner(true);
            const result = await axios.get(
                configSettings.serverUrl + "/getSubAdmins",

                {
                    headers: {
                        "access-token": Cookies.get("access-token"),
                    },
                }
            );

            setIsSpinner(false);

            const response = result.data;

            setSubAdmins(response.data);
        } catch (error) {
            setIsSpinner(false);
        }
    };

    useEffect(() => {
        getAllSubAdmins();
    }, []);

    useEffect(() => {
        if (!session && !isLoading) {
            router.push("/login");
        } else if (session && !isLoading) {
            if (session?.data.type !== "Admin") {
                router.push("/inspections");
            }
        }
    }, [session, isLoading]);

    return (
        <>
            <Head>
                <title>Sub Admins - Safe Solar</title>
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
                                Manage Sub Admins
                            </h1>
                        </div>
                        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                            <button
                                type="button"
                                className="flex w-full text-white justify-center rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-3 text-sm outline-none transition-all duration-500 btn-animation hover:from-secondary hover:to-primary"
                                onClick={() => {
                                    setCreateSubAminModal(true);
                                }}
                            >
                                Create Sub Admin
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
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {subAdmins.map(
                                                    (subAdmin, index) => (
                                                        <tr
                                                            key={subAdmin.email}
                                                            className="cursor-pointer hover:bg-gray-100"
                                                        >
                                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                                {index + 1}
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                {subAdmin.name}
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                {subAdmin.email}
                                                            </td>

                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                <DeleteOutlineIcon
                                                                    className="text-red-400 cursor-pointer"
                                                                    onClick={() => {
                                                                        setSelectedSubAdmin(
                                                                            subAdmin._id
                                                                        );
                                                                        setConfirmationModla(
                                                                            true
                                                                        );
                                                                    }}
                                                                />
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

            {/* Create sub admin modal */}

            <Transition.Root show={createSubAminModal} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50"
                    onClose={() => {
                        setCreateSubAminModal(false);
                        setSubAdmin();
                    }}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                    <div className="mb-8">
                                        <h1 className="text-2xl leading-6 text-gray-900">
                                            Create Sub Admin
                                        </h1>
                                    </div>

                                    <div className="col-span-full mt-4">
                                        <label
                                            htmlFor="street-address"
                                            className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                                        >
                                            Name
                                        </label>

                                        <input
                                            type="text"
                                            name="name"
                                            autoComplete="off"
                                            className="block w-full rounded-md border-0 p-[10px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 outline-none max-w-[350px]"
                                            onChange={handleInput}
                                            value={subAdmin?.name}
                                        />
                                    </div>

                                    <div className="col-span-full mt-4">
                                        <label
                                            htmlFor="street-address"
                                            className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                                        >
                                            Email Address
                                        </label>

                                        <input
                                            type="text"
                                            name="email"
                                            autoComplete="email"
                                            className="block w-full rounded-md border-0 p-[10px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 outline-none max-w-[350px]"
                                            onChange={handleInput}
                                            value={subAdmin?.email}
                                        />
                                    </div>

                                    <div className="col-span-full mt-4">
                                        <label
                                            htmlFor="street-address"
                                            className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                                        >
                                            Password
                                        </label>

                                        <input
                                            type="password"
                                            name="password"
                                            className="block w-full rounded-md border-0 p-[10px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 outline-none max-w-[350px]"
                                            onChange={handleInput}
                                            value={subAdmin?.password}
                                        />
                                    </div>

                                    <div className="col-span-full mt-4">
                                        <label
                                            htmlFor="street-address"
                                            className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                                        >
                                            Confirm Password
                                        </label>

                                        <input
                                            type="password"
                                            name="conPassword"
                                            className="block w-full rounded-md border-0 p-[10px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 outline-none max-w-[350px]"
                                            onChange={handleInput}
                                            value={subAdmin?.conPassword}
                                        />
                                    </div>

                                    <div className="mt-6">
                                        <button
                                            type="button"
                                            className="flex w-full text-white justify-center rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-3 text-sm outline-none transition-all duration-500 btn-animation hover:from-secondary hover:to-primary"
                                            onClick={createSubAdmin}
                                        >
                                            Create
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* confirm delete sub admin modal */}

            <Transition.Root show={confirmationModal} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50"
                    onClose={() => {
                        setConfirmationModla(false);
                    }}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                    <div>
                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                            <ShieldExclamationIcon
                                                className="h-6 w-6 text-blue-600"
                                                aria-hidden="true"
                                            />
                                        </div>
                                        <div className="mt-3 text-center sm:mt-5">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-base font-semibold leading-6 text-gray-900 mb-5"
                                            >
                                                Are you sure you want to delete
                                                this Sub Admin
                                            </Dialog.Title>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-5 sm:mt-6">
                                        <button
                                            type="button"
                                            className="flex w-full text-white justify-center rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-2 text-sm outline-none"
                                            onClick={() =>
                                                setConfirmationModla(false)
                                            }
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="button"
                                            className="ml-3 inline-flex w-full justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm outline-none"
                                            onClick={deleteSubAdmin}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

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

export default SubAdmins;
