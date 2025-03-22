import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

const Breadcrumbs = ({ items }) => {
    return (
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            {items.map((item, index) => (
                <div key={item.path} className="flex items-center">
                    {index > 0 && <ChevronRight className="w-4 h-4 mx-2" />}
                    {index === items.length - 1 ? (
                        <span className="text-[#871845] font-medium">{item.label}</span>
                    ) : (
                        <Link
                            to={item.path}
                            className="hover:text-[#871845] transition-colors"
                        >
                            {item.label}
                        </Link>
                    )}
                </div>
            ))}
        </nav>
    )
}

export default Breadcrumbs 