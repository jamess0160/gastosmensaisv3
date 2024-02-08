import styles from './ResumeItem.module.css'
import Link from "next/link";

interface ResumeItemProps {
    Name: string
    Value: number
    href: string
    color?: string
}

export default function ResumeItem({ Name, Value, href, color }: ResumeItemProps) {
    return (
        <Link href={href} style={{ textDecoration: "none", color: "white" }}>
            <div className={styles.resumeItem} style={color ? { backgroundColor: color } : undefined}>
                <div>{Name}</div>
                <div>R$ {Value.toFixed(2)}</div>
            </div>
        </Link>
    )
}