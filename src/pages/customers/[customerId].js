import React, { Fragment, useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";
import Cookies from "js-cookie";
import axios from "axios";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Popup from "@/components/Popup";
import Spinner from "@/components/Spinner";
import configSettings from "@/config";
import useSession from "@/hooks/user/get-session";

const Customer = () => {
  const { data: session, isLoading } = useSession();

  const [customer, setCustomer] = useState();

  const [customerInspections, setCustomerInspections] = useState([]);

  const [inspections, setInspections] = useState([]);

  const [inspection, setInspection] = useState();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [startInspectionModal, setStartInspectionModal] = useState(false);

  const [isPopup, setIsPopup] = useState(false);
  const [popupDetail, setPopupDetail] = useState();
  const [isSpinner, setIsSpinner] = useState(false);

  const router = useRouter();

  const getCustomerInspections = async (customerId) => {
    try {
      setIsSpinner(true);
      const result = await axios.get(
        configSettings.serverUrl + `/getCustomerInspections/${customerId}`,

        {
          headers: {
            "access-token": Cookies.get("access-token"),
          },
        }
      );

      setIsSpinner(false);

      const response = result.data;

      setCustomerInspections(response.data);
    } catch (error) {
      setIsSpinner(false);
    }
  };

  const startInspection = async () => {
    try {
      setIsSpinner(true);
      await axios.post(
        configSettings.serverUrl + "/startCustomerInspection",
        {
          customer: router.query.customerId,
          creator: session?.data?.email,
          name: inspection?.name,
          inspection: inspection?._id,
          status: "In progress",
        },
        {
          headers: {
            "access-token": Cookies.get("access-token"),
          },
        }
      );

      setIsSpinner(false);

      setInspection();

      setStartInspectionModal(false);

      setPopupDetail({
        type: "Success",
        text: "Inspection has been successfully started",
      });

      setIsPopup(true);

      setTimeout(function () {
        setIsPopup(false);
      }, 4000);

      getCustomerInspections(router.query.customerId);
    } catch (error) {
      setIsSpinner(false);
    }
  };

  const getInspections = async () => {
    try {
      setIsSpinner(true);
      const result = await axios.get(
        configSettings.serverUrl + "/getInspections",

        {
          headers: {
            "access-token": Cookies.get("access-token"),
          },
        }
      );

      setIsSpinner(false);

      const response = result.data;

      setInspections(response.data);

      if (response.data) {
        setInspection(response.data[0]);
      }
    } catch (error) {
      setIsSpinner(false);
    }
  };

  const getCustomer = async (customerId) => {
    try {
      setIsSpinner(true);
      const result = await axios.get(
        configSettings.serverUrl + `/getCustomer/${customerId}`,
        {
          headers: {
            "access-token": Cookies.get("access-token"),
          },
        }
      );

      const response = result.data;

      setCustomer(response.data);

      setIsSpinner(false);
    } catch (error) {
      setIsSpinner(false);
      router.push("/customers");
    }
  };

  useEffect(() => {
    if (router.query.customerId) {
      getCustomer(router.query.customerId);
      getCustomerInspections(router.query.customerId);
    }
    getInspections();
  }, [router.query.customerId]);

  useEffect(() => {
    if (!session && !isLoading) {
      router.push("/login");
    }
  }, [session, isLoading]);

  return (
    <>
      <Head>
        <title>Customer - Inspections - Safe Solar</title>
        <meta name="description" content="M2M SOFTWARES" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="lg:pl-72">
        <Navbar setSidebarOpen={setSidebarOpen} />
           {/* inner sidebar */}
        <div className="w-40 h-screen bg-white text-black p-5 fixed">
          <ul className="text-sm">
            <li className="mb-3">
              <a href="#">Kunddetaljer</a>
            </li>
            <li className="mb-3">
              <a href="#">Produkter</a>
            </li>
            <li className="mb-3">
              <a href="#">Dokument</a>
            </li>
          </ul>
        </div>
        <main className="pt-4 pb-10 ml-40">
          {/* page header */}

          <div className="flex items-center px-4 sm:px-6 lg:px-8">
            <div className="flex-auto">
              <h1 className="text-xl leading-6 text-gray-500">
                Customers {" > "} {customer?.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center mt-8 px-4 sm:px-6 lg:px-8">
            <div className="flex-auto">
              <h1 className="text-3xl leading-6 text-gray-900">
                Customer Inspections
              </h1>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                type="button"
                className="flex w-full text-white justify-center rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-3 text-sm outline-none transition-all duration-500 btn-animation hover:from-secondary hover:to-primary"
                onClick={() => {
                  setStartInspectionModal(true);
                }}
              >
                Start Inspection
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
                            Creator
                          </th>

                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {customerInspections.map((inspection, index) => (
                          <tr
                            key={index}
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() => {
                              if (inspection.status === "Completed") {
                                router.push(
                                  `/inspection-report/${inspection?._id}`
                                );
                              } else {
                                router.push(
                                  `/customer-inspections/${inspection?._id}`
                                );
                              }
                            }}
                          >
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {index + 1}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {inspection.name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {inspection.creator}
                            </td>

                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {inspection.status}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* start inspection modal */}

      <Transition.Root show={startInspectionModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => {
            setStartInspectionModal(false);
            setInspection();
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
                      Start Inspection
                    </h1>
                  </div>

                  <div className="col-span-full mt-4">
                    <label
                      htmlFor="street-address"
                      className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                    >
                      Select Inspection
                    </label>

                    <select
                      name="inspection"
                      className="block w-full rounded-md border-0 p-[10px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 outline-none max-w-[350px]"
                      onChange={(e) => {
                        setInspection({
                          _id: e.target.value,
                          name: e.target.options[e.target.selectedIndex].text,
                        });
                      }}
                      value={inspection?._id}
                    >
                      {inspections?.map((inspection) => {
                        return (
                          <option key={inspection._id} value={inspection?._id}>
                            {inspection?.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="mt-6">
                    <button
                      type="button"
                      className="flex w-full text-white justify-center rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-3 text-sm outline-none transition-all duration-500 btn-animation hover:from-secondary hover:to-primary"
                      onClick={startInspection}
                    >
                      Start
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

export default Customer;
