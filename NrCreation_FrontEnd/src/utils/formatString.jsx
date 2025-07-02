const formatDate = (date_field) => {
    const date = new Date(date_field);
    // Extract day, month, year, hours, minutes, seconds
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
    const year = date.getFullYear().toString().slice(-2); // Get last 2 digits of the year
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    // Format to dd/mm/yy hh:mm:ss
    if (date_field)
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    else
        return null
}

export { formatDate }