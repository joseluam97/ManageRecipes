export const getListCountries = async () => {
    const res = await fetch('https://restcountries.com/v3.1/all?fields=name,flags,cca2');
    const data = await res.json();
    if (data.status !== 400) {
        const formatted = data?.map((c) => ({
            label: c.name.common,
            flag: c.flags?.svg || c.flags?.png,
        })).sort((a, b) => a.label.localeCompare(b.label));
        return formatted;
    }
    return [];
};