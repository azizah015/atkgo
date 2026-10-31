require("dotenv").config();

const express = require("express");

const mysql = require("mysql2/promise");

const app = express();

app.use(express.json());

const db = mysql.createPool({

    host: process.env.DB_HOST,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME,

    port: Number(process.env.DB_PORT) || 3306

});

app.get("/api/test-db", async (req, res) => {

    try {

        const [rows] = await db.query("SELECT DATABASE() AS database_name");

        res.json({

            status: "berhasil",

            pesan: "Database ATKGO.ID terhubung!",

            database: rows[0].database_name

        });

    } catch (error) {

        console.error(error.message);

        res.status(500).json({

            status: "gagal",

            pesan: "Koneksi database gagal."

        });

    }

});

app.listen(process.env.PORT || 3000, () => {

    console.log("Backend berjalan di http://localhost:3000");

});