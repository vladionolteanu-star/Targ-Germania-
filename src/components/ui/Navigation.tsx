"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export const Navigation = () => {
    const pathname = usePathname();

    const navItems = [
        { label: "Acasă", href: "/" },
        { label: "Categorii", href: "/categories" },
        { label: "Prezentare", href: "/prezentare" },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
            <div className="flex justify-between items-center px-6 lg:px-12 py-4 relative z-10 w-full">
                {/* Logo */}
                <Link href="/">
                    <span className="font-display text-2xl lg:text-3xl tracking-tighter uppercase text-white hover:text-accent transition-colors duration-300 relative group">
                        EuroShop
                        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full"></span>
                    </span>
                </Link>

                {/* Links */}
                <ul className="flex gap-8 items-center font-sans text-sm tracking-widest uppercase text-white/70">
                    {navItems.map((item) => (
                        <li key={item.label}>
                            <Link href={item.href} className="relative group hover:text-white transition-colors">
                                {item.label}
                                {pathname === item.href && (
                                    <motion.div
                                        layoutId="underline"
                                        className="absolute -bottom-2 left-0 right-0 h-[1px] bg-accent"
                                    />
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};
