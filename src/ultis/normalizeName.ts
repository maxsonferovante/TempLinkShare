

export function normalizeName(name: string) {
    return name.replace(/ /g, '_').replace(/[^a-zA-Z0-9.]/g, '');
}