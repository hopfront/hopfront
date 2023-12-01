export interface OAuth2Scope {
    code: string
    description: string
}

export const getScopesFromRecord = (record: Record<string, string>): OAuth2Scope[] => {
    return Object.keys(record).map(scopeCode => {
        return {
            code: scopeCode,
            description: record[scopeCode]
        } as OAuth2Scope
    });
}
