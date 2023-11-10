import { Box } from "@mui/joy";

type ThreeDotsLoaderProps = {
    size?: number;
    color?: string;
};

export default function ThreeDotsLoader({ size = 10, color = 'black' }: ThreeDotsLoaderProps) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000000 }}>
            <Box
                sx={{
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: color,
                    borderRadius: '50%',
                    animation: 'bounce 0.5s ease-in-out infinite',
                    animationDelay: '0s',
                }}
            ></Box>
            <Box
                sx={{
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: color,
                    borderRadius: '50%',
                    animation: 'bounce 0.5s ease-in-out infinite',
                    animationDelay: '0.1s',
                    ml: 2,
                }}
            ></Box>
            <Box
                sx={{
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: color,
                    borderRadius: '50%',
                    animation: 'bounce 0.5s ease-in-out infinite',
                    animationDelay: '0.2s',
                    ml: 2,
                }}
            ></Box>

            <style jsx global>{`
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-5px);
            }
          }
        `}</style>
        </Box>
    );
};