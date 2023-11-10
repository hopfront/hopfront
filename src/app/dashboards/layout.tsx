import MainFrame from "../components/base/MainFrame";

export interface LayoutProps {
    children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
    return <MainFrame>
        {children}
    </MainFrame>
}