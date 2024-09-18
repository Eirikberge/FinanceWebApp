import { useEffect, useState } from 'react';
import { FetchCalendarInfo } from '../services/StockCalendarInfoService';
import { StockCalendarInfoDto } from '../dtos/StockCalendarInfoDto';
import { eachDayOfInterval, endOfMonth, format, getISOWeek, startOfMonth, startOfWeek, endOfWeek, isSameDay, parseISO, getDay, addMonths, subMonths, isToday } from 'date-fns';
import { nb } from 'date-fns/locale';
import "../styleSheets/Calendar.css";
import useStockHoldings from '../hooks/useStockHoldings';
import useStockCalendarInfoList from '../hooks/useStockCalendarInfoList';
import { Link } from 'react-router-dom';

const WEEKDAYS = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];

interface CalendarProps {
    view: "week" | "month";
}

function CalendarComponent({ view }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const weekNumber = getISOWeek(currentDate);
    const firstMondayOfWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
    const lastSundayOfWeek = endOfWeek(currentDate, { weekStartsOn: 1 });
    const daysInWeek = eachDayOfInterval({ start: firstMondayOfWeek, end: lastSundayOfWeek });
    const [calendarInfoList, setCalendarInfoList] = useState<StockCalendarInfoDto[]>([]);

    const holdings = useStockHoldings();
    const stockCalendarInfoList = useStockCalendarInfoList();

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if (holdings.length > 0) {
            fetchCalenderInformation(holdings);
        }
    }, [currentDate, holdings]);

    const capitalizeFirstLetter = (string: string): string => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);
    const monthAndYear = format(currentDate, "MMMM yyyy", { locale: nb });
    const capitalizedMonthAndYear = capitalizeFirstLetter(monthAndYear);

    const daysInMonth = eachDayOfInterval({
        start: firstDayOfMonth,
        end: lastDayOfMonth,
    });

    let startingDayIndex = getDay(firstDayOfMonth);
    if (startingDayIndex === 0) {
        startingDayIndex = 6;
    } else {
        startingDayIndex -= 1;
    }

    const fetchData = () => {
        const filteredList = stockCalendarInfoList.filter(item =>
            holdings.some(holding => holding.stockSymbol === item.symbol)
        );

        setCalendarInfoList(filteredList);
    }

    const fetchCalenderInformation = async (holdings: any[]) => {
        // Denne må utbedres slik at den har alle data fra denne og neste/forrige måned
        const format = (date: Date) => date.toISOString().split('T')[0]; // YYYY-MM-DD format
        try {
            const list = await FetchCalendarInfo(format(firstDayOfMonth), format(lastDayOfMonth));
            const filteredList = list.filter(item =>

                holdings.some(holding => holding.stockSymbol === item.symbol)
            );

            setCalendarInfoList(filteredList);
        } catch (error) {
            console.error("Error getting stock info:", error);
        }
    };

    const header = () => {
        if (view === "month") {
            return <h2>{capitalizedMonthAndYear}</h2>
        }
        if (view === "week") {
            return <h3>Uke: {weekNumber}</h3>
        }
        else return null
    }

    const goToPreviousMonth = () => {
        const newDate = subMonths(currentDate, 1);
        setCurrentDate(newDate);
    };

    const goToNextMonth = () => {
        const newDate = addMonths(currentDate, 1);
        setCurrentDate(newDate);
    };


    return (
        <div className="calendar-container">
            {view === "month" && (
                <div>
                    <div className='calendar-header'>
                        <button onClick={goToPreviousMonth}>◀︎</button>
                        {header()}
                        <button onClick={goToNextMonth}>►</button>
                    </div>
                    <br />
                    <div className="calendar-grid">
                        {WEEKDAYS.map((day) => (
                            <div key={day} className="calendar-day-header">
                                {day}
                            </div>
                        ))}
                        {Array.from({ length: startingDayIndex }).map((_, index) => (
                            <div key={`empty-${index}`} className="calendar-day empty"></div>
                        ))}
                        {daysInMonth.map((day, index) => (
                            <div
                                key={index}
                                className={`calendar-day ${isToday(day) ? "today" : ""}`}
                            >                                <div className="date">{format(day, "d")}</div>
                                <div className="calendarInfo">
                                    {calendarInfoList
                                        .filter(event => isSameDay(parseISO(event.date), day))
                                        .map((event, eventIndex) => (
                                            <div key={`${event.symbol}-${event.date}-${eventIndex}`}>
                                                <div>
                                                    {event.symbol}
                                                    <br />
                                                    Q:{event.quarter}
                                                    <br />
                                                    <Link to={`/quarterlyreport?symbol=${event.symbol}&date=${event.date}`}>Kvartalsrapport: tbc</Link>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {view === "week" && (
                <div>
                    <div className='calendar-header'>
                        {header()}
                    </div>
                    <div className="calendar-grid">
                        {WEEKDAYS.map((day) => (
                            <div key={day} className="calendar-day-header">
                                {day}
                            </div>
                        ))}
                        {daysInWeek.map((day, index) => (
                            <div
                                key={index}
                                className={`calendar-day ${isToday(day) ? "today" : ""}`}
                            >                                     <div className="date">{format(day, "d")}</div>
                                <div className="calendarInfo">
                                    {calendarInfoList
                                        .filter(event => isSameDay(parseISO(event.date), day))
                                        .map((event, eventIndex) => (
                                            <div key={`${event.symbol}-${event.date}-${eventIndex}`}>
                                                <div>
                                                    {event.symbol}
                                                    <br />
                                                    Q:{event.quarter}
                                                    <br />
                                                    <a href={`/quarterlyreport?symbol=${event.symbol}&date=${event.date}`}>Kvartalsrapport: tbc</a>                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CalendarComponent;