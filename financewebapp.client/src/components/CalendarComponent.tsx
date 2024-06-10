import { eachDayOfInterval, endOfMonth, format, getISOWeek, startOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { getDay } from 'date-fns/getDay';
import { nb } from 'date-fns/locale'; // nb står for norsk bokmål
import "../styleSheets/Calendar.css"

const WEEKDAYS = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];

interface CalendarProps {
    view: "week" | "month";
}

function CalendarComponent({ view }: CalendarProps) {

    const weekNumber = getWeekNumber(new Date());
    const firstMondayOfWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    const lastSundayOfWeek = endOfWeek(new Date(), { weekStartsOn: 1 });
    const daysInWeek = eachDayOfInterval({ start: firstMondayOfWeek, end: lastSundayOfWeek });

    function getWeekNumber(date: Date): number {
        return getISOWeek(date);
    }

    const currentDate = new Date();
    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);
    const monthAndYear = format(currentDate, "MMMM yyyy", { locale: nb });
    const capitalizedMonthAndYear = capitalizeFirstLetter(monthAndYear);

    const daysInMonth = eachDayOfInterval({
        start: firstDayOfMonth,
        end: lastDayOfMonth,
    })

    let startingDayIndex = getDay(firstDayOfMonth);

    if (startingDayIndex === 0) {
        startingDayIndex = 6;
    } else {
        startingDayIndex -= 1;
    }

    function capitalizeFirstLetter(string: string): string {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <div className="calendar-container">
            {view === "month" && (
                <div>
                    <h2 style={{ textAlign: 'center' }}>{capitalizedMonthAndYear}</h2>
                    <div className="calendar-grid">
                        {WEEKDAYS.map((day) => (
                            <div key={day} className="calendar-day-header">
                                {day}
                            </div>
                        ))}
                        {Array.from({ length: startingDayIndex }).map((_, index) => {
                            return <div key={`empty-${index}`} className="calendar-day empty"></div>
                        })}
                        {daysInMonth.map((day, index) => {
                            return <div key={index} className="calendar-day">{format(day, "d")}</div>;
                        })}
                    </div>
                </div>
            )}
            {view === "week" && (
                <div>
                    <h2 style={{ textAlign: 'center' }}>Uke: {weekNumber}</h2>

                    <div className="calendar-grid">
                        {WEEKDAYS.map((day) => (
                            <div key={day} className="calendar-day-header">
                                {day}
                            </div>
                        ))}
                        {daysInWeek.map((day, index) => {
                            return <div key={index} className="calendar-day">{format(day, "d")}</div>;
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarComponent;