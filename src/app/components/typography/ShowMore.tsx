import { Box, Link, Typography, TypographySystem } from '@mui/joy';
import { useEffect, useRef, useState } from 'react';

interface ShowMoreProps {
    text: string;
    numberOfLines?: number;
    level: keyof TypographySystem;
    sx?: {};
}

export default function ShowMore({ text, numberOfLines = 7, level, sx }: ShowMoreProps) {
    const [expanded, setExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);

    const ref = useRef<HTMLDivElement>(null);
    const displayText = text;

    useEffect(() => {
        if (ref.current) {
            const element = ref.current;
            if (element.scrollHeight > element.clientHeight) {
                setIsOverflowing(true);
            }
        }
    }, [ref])

    const toggleExpanded = () => {
        setExpanded(!expanded); 
    };

    if (!text) {
        return null;
    }

    return (
        <Box>
            <Typography
                ref={ref}
                level={level}
                sx={{
                    ...sx,
                    overflowY: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: (expanded ? 0 : numberOfLines),
                    WebkitBoxOrient: 'vertical'
                }}>
                {displayText}
            </Typography>
            {isOverflowing && <Link
                type="button"
                sx={{ marginLeft: '4px', textDecorationColor: 'primary.400' }}
                title={expanded ? 'Show less' : 'Show more'}
                onClick={toggleExpanded}>
                <Typography level="body-xs" sx={{ color: 'primary.400' }}>{expanded ? 'Show Less' : 'Show More'}</Typography>
            </Link>}
        </Box >
    );
};
