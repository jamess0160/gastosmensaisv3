import styles from './ResumeItem.module.css'
import Link from "next/link";

interface ResumeItemProps {
    Name: string
    Value: number
    href?: string
    color?: string
}

export default function ResumeItem({ Name, Value, href, color = "#232323" }: ResumeItemProps) {

    let defaultClass = styles.resumeItem + " pt-2 pb-6 px-6"

    if (href) {
        return (
            <Link href={href} className='max-md:w-full' style={{ textDecoration: "none", color: "white" }}>
                <div className={defaultClass + "  max-md:!w-full max-md:!h-auto"} style={{ backgroundColor: color }}>
                    <div className='w-fit m-auto font-light'>{Name}</div>
                    <div className='w-fit m-auto mt-3 md:pt-3 font-bold'>R$ {Value.toFixed(2)}</div>
                </div>
            </Link>
        )
    }

    return (
        <div className={defaultClass} style={{ backgroundColor: color, height: "auto" }}>
            <div className='w-fit font-light text-gray-300'>{Name}</div>
            <div className='w-fit m-auto mt-3 font-bold'>R$ {Value.toFixed(2)}</div>
        </div>
    )
}