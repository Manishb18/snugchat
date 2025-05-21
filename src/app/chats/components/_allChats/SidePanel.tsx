import {motion} from "framer-motion"

export default function SidePanel({close} : {close : ()=>void}) {
  return (
    <motion.div
            key="slide-panel"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 bg-black bg-opacity-60 z-50 flex justify-end"
          >
            <div className="h-full bg-black text-white p-4 ">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">New Conversation</h2>
                <button
                  className="text-white text-xl cursor-pointer"
                  onClick={close}
                >
                  ✕
                </button>
              </div>
              {/* Content for new conversation goes here */}
              <p>
                This panel can have search, users list, group creation, etc.
              </p>
            </div>
          </motion.div>
  )
}
