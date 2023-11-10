import MainFrame from "@/app/components/base/MainFrame"

export interface LayoutProps {
    children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
    return <MainFrame>
        {children}
    </MainFrame>
}