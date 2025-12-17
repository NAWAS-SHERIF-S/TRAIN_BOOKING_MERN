import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={hover ? { y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' } : {}}
            className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
