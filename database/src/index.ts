import * as fs from 'fs';
import pg from 'pg';
import * as url from 'url';

const config = {
    user: "avnadmin",
    password: "<redacted>",
    host: "sanaa-postgres-sanaa-studio.l.aivencloud.com",
    port: 16981,
    database: "defaultdb",
    ssl: {
        rejectUnauthorized: true,
        ca: `-----BEGIN CERTIFICATE-----
MIIERDCCAqygAwIBAgIUfyGPHTKFLkMM5JOY10olNQ8duUQwDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvMzA1YjRkZDQtNzQ4ZC00Yjk0LTg5NmItYzYzNTcxZWVm
Zjg2IFByb2plY3QgQ0EwHhcNMjYwODA2MjE0NzA3WhcNMzYwODAzMjE0NzA3WjA6
MTgwNgYDVQQDDC8zMDViNGRkNC03NDhkLTRiOTQtODk2Yi1jNjM1NzFlZWZmODYg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBANd9AZDj
vaNTR3A8HqcdgptR9/UcVwENtyfJaa1h6J2vTZT0AES5NgGhv+4T7MIIdBqdE5+h
pMY/B/7EY4T6d+lkSFAEpSW3RC8Qm6vYbrHVueiX2vOCjHbxwACPVJcF6CZ33gWQ
UnL7dPs4rELY2QXSsrKhjiUtPTR4W/7qfPQ8ELn8LRFoqHqFjCt7qoitTy4nJZRy
mbsk1imde4ubU6G7okXOPJtdpT8w7uMc3C3FJx/if0rnbWOOLiL708RIKQB0QLA0
LzElqMJaKr8K3ieWtxnn7hbjEnM3Og+sSC2whbNxDmDWSyTydVVUkFDzuw4hJzjT
nHW1jCWyvQpP/zZs2A9Zw4WxIpk6dosa0R1k/lXENEMtkxpjve4AftJC3j4oPI67
Jolwvu1YsVwW5Z8Wu++bqBCVwOKI8moAx6OAGoFCATa6MMZz08FkAdX3F2l1w6I0
2OKH/i2lHElcE0KBKQAn3SDYaYDaaqGWFF6Ao98aLsqnmyLz8feXcsSN/QIDAQAB
o0IwQDAdBgNVHQ4EFgQUzgnd3grcR3v7393/ISWxjDw40sUwEgYDVR0TAQH/BAgw
BgEB/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAC2raRB5NlpM
uxcSZLp8lTMZN7RWwZ+bdR1+8AZogx0Q54sgshA3ZK3FavjjC/px/Gp3BmcFtxuw
SCKlW4UGSjL1k33D8qeyMj1L+tFhhOHVw2vNW2JN5UzdqDADWjGs/0Do84nf4+E3
vMajLfN2XHMVRBW8KYGVTuGNiuWqvfxqBtD6Fpgkp29RK/zkkc+20tp2FaSXFr5c
g2TwB7jAJ+ENphpTvV6RMAEUE2Slvxr/Abn2Oy5jM0eASoj+9e3mcyPBk3O9VzD0
EH60ddwyrgeSH+Qk4kXFjbGD/2RAPjtXfpQe3J70mtRikFtrBuyTWuHx3zVb50tu
OgnRjLwsHMdLYua1UFPcs4njTb7KEKNPKaDo0zbBQgWj7mpLFlJLUmNM2NRxMXMK
QDFRWHlDEL6sOShbIoTL8qjjxLrw4KnIIflHTIT83LTrE5c1tDpPBQ3OfqSJ+EF2
QGVmMc7gGi60ulqxa4SNnQUdZvAe97WubXyDq+jHlctgIhGCS1vtAQ==
-----END CERTIFICATE-----`,
    },
};

const client = new pg.Client(config);

async function run(){
    try {
        await client.connect();
        const result = await client.query("SELECT VERSION()");
        console.log(result.rows[0]);
    } catch(err) {
        console.error("Database error:", err);
    } finally{
        await client.end();
    }
} 

run();