const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const offset = -7 * 60; // Offset in minutes
    date.setMinutes(date.getMinutes() + offset);

    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour24: true,
        timeZone: 'UTC',
    };
    
    // @ts-ignore
    return date.toLocaleString('en-US', options).replace(',', '');
};

export {formatDate}
