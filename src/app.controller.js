
import { connectDB } from "./DB/connection.js";
import authRouter from "./modules/auth/auth.controller.js"
import cors from"cors" ;

export function bootstrap(app , express){
    app.use(cors({origin:"http://localhost:5173"}));
    app.use(express.json());
    app.use("/auth" , authRouter);
    connectDB();
}

