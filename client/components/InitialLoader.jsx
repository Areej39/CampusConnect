import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";

const InitialLoader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center">

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg"
        >
          <CalendarDays size={30} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-5 text-2xl font-bold text-slate-900"
        >
          Campus<span className="text-emerald-600">Connect</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-5 flex gap-1.5"
        >
          <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-600 [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-600 [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-600" />
        </motion.div>

      </div>
    </div>
  );
};

export default InitialLoader;