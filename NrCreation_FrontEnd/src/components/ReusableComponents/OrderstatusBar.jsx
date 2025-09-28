import { motion } from "framer-motion";
import { CheckCircle, Clock, Truck, PackageCheck } from "lucide-react";

const stepIcons = {
  PENDING: Clock,
  CONFIRMED: CheckCircle,
  SHIPPED: Truck,
  DELIVERED: PackageCheck,
};

const steps = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];

const OrderStatusBar = ({ status }) => {
  console.log("status : ", status);
  const statusIndex = steps.indexOf(status);
  const progressWidth = (statusIndex / (steps.length - 1)) * 100;

  return (
    <div className="w-full relative mt-4 mb-6">
      {/* Background line (gray) */}
      <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full" />

      {/* Progress line (animated) */}
      <motion.div
        className="absolute top-5 left-0 h-1 bg-[#871845] rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progressWidth}%` }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* Steps */}
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const isCompleted = index < statusIndex;
          const isActive = index === statusIndex;
          const Icon = stepIcons[step];

          return (
            <motion.div
              key={step}
              className="flex flex-col items-center z-10"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              {/* Circle with icon */}
              <motion.div
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 shadow-md ${
                  isCompleted
                    ? "bg-[#871845] border-[#871845]"
                    : isActive
                    ? "border-[#871845] bg-white"
                    : "border-gray-300 bg-white"
                }`}
                animate={{
                  scale: isActive ? [1, 1.1, 1] : 1,
                  transition: { repeat: isActive ? Infinity : 0, duration: 1 },
                }}
              >
                <Icon
                  size={20}
                  className={`${
                    isCompleted
                      ? "text-white"
                      : isActive
                      ? "text-[#871845]"
                      : "text-gray-400"
                  }`}
                />
              </motion.div>

              {/* Label */}
              <p
                className={`mt-2 text-sm font-medium ${
                  isCompleted || isActive ? "text-[#871845]" : "text-gray-400"
                }`}
              >
                {step}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusBar;