import Link from "next/link";
import { Backdrop } from "@/components/fx/Backdrop";

export default function NotFound() {
    return (
        <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
            <Backdrop />
            <div className="relative z-10 flex flex-col items-center">
                <h1 className="glitch text-[clamp(4rem,20vw,12rem)] font-bold leading-none text-ivory" data-text="404">404</h1>
                <p className="mt-6 text-lg"><span className="text-marigold">&gt;</span> path not found <span lang="hi" className="text-dim">/ रास्ता नहीं मिला</span></p>
                <p className="mt-2 max-w-md text-sm text-dim">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
                <Link href="/" className="btn btn--primary diya mt-10">$ cd ~</Link>
                <p className="meta mt-12">err_code: 404 {"//"} status: not_found</p>
            </div>
        </main>
    );
}
