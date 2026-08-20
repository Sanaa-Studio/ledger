export type Env = 
    | {
        appEnv: "development";
        databaseUrl: string;
    }
    | {
        appEnv: "test";
        databaseUrl: string;
    }
    | {
        appEnv: "beta";
        databaseUrl: string;
        databaseCaCertificate: string;
    }
    | {
        appEnv: "production";
        databaseUrl: string;
        databaseCaCertificate: string
    };