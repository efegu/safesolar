// components/InspectionCalendar.js
import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const InspectionCalendar = ({ inspections }) => {
    const events = inspections?.map((inspection) => ({
        title: (
            <>
                {inspection.customerName}
                <br />
                {inspection.inspectionName}
                <br />
                {inspection.creator}
                <br />
            </>
        ),
        start: new Date(inspection.date),
        end: new Date(inspection.date),
    }));

    const eventStyleGetter = (event, start, end, isSelected) => {
        const backgroundColor = "#2a56a1";

        const style = {
            backgroundColor,
            borderRadius: "0px",
            opacity: 0.8,
            color: "white",
            border: "0px",
            display: "block",
        };

        return {
            style,
        };
    };

    const CustomTimeHeader = () => {
        // Return an empty component or null to hide the time header
        return null;
    };

    return (
        <div>
            <Calendar
                localizer={localizer}
                views={["month", "agenda"]}
                components={{
                    timeHeader: CustomTimeHeader,
                }}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "1000px", overflowY: "scroll" }}
                eventPropGetter={eventStyleGetter}
            />
        </div>
    );
};

export default InspectionCalendar;
