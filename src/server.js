const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const app = require("./app.js");
dotenv.config();
const PORT = process.env.PORT || 4200;
async function bootstrap() {
try {
await connectDB();
app.listen(PORT, () => {
console.log(` Servidor rodando na porta ${PORT}`);
});
} catch (err) {
console.error(" Falha ao iniciar o servidor", err);
process.exit(1);
}
}
bootstrap();