export type Env = 
    | {
        appEnv: "development",
        port: number,
        frontendUrl: string,
        databaseUrl: string,
    }
    | {
        appEnv: "test",
        port: number,
        frontendUrl: string,
        databaseUrl: string,
    }
    | {
        appEnv: "beta",
        port: number,
        frontendUrl: string,
        databaseUrl: string,
        databaseCaCertificate: string
    }
    | {
        appEnv: "production",
        port: number,
        frontendUrl: string,
        databaseUrl: string,
        databaseCaCertificate: string
    }