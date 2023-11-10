import { ApiSpec } from "@/app/lib/dto/ApiSpec";
import { parseOperations } from "@/app/lib/openapi/utils";
import { Email, FindInPage, Gavel, Terminal } from "@mui/icons-material";
import { Box } from "@mui/joy";
import Card from '@mui/joy/Card';
import Link from '@mui/joy/Link';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import { useRouter } from 'next/navigation';

type ApiCardProps = {
    api: ApiSpec
    href: string;
};

export default function ApiCard({
    api,
    href
}: ApiCardProps) {
    const router = useRouter();

    return (
        <Card
            variant="outlined"
            orientation="horizontal"
            sx={{
                transition: '250ms all',
                padding: {
                    xs: 0,
                    sm: 2,
                },
                boxShadow: 'none',
                borderRadius: 'sm',
                '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
            }}
        >
            <Stack
                sx={{
                    padding: {
                        xs: 2,
                        sm: 0,
                    },
                }}
                spacing={1}
                flex={1}
            >
                <Box>
                    <Typography color="primary" fontSize="sm" fontWeight="lg">
                        {`OpenAPI ${api.document.info.version === 'v0' ? '' : api.document.info.version}`}
                    </Typography>
                    <Link
                        fontWeight="md"
                        fontSize="lg"
                        onClick={() => router.push(href)}
                        overlay
                        underline="none"
                        sx={{ color: 'text.primary' }}
                    >
                        {api.document.info.title}
                    </Link>
                </Box>

                {api.document.info.termsOfService &&
                    <Link sx={{ width: 'fit-content' }} href={api.document.info.termsOfService}>
                        Terms of Service
                    </Link>}

                <Stack spacing={3} direction="row">
                    <Typography startDecorator={<Terminal />} sx={{ flexGrow: 1 }}>
                        {parseOperations(api.document.paths, api).length} Operations
                    </Typography>
                    {api.document.info.license &&
                        <Typography startDecorator={<Gavel />}>
                            {api.document.info.license.name}
                        </Typography>}

                    {api.document.externalDocs &&
                        <Typography startDecorator={<FindInPage />}>
                            <Link
                                href={api.document.externalDocs.url}>{api.document.externalDocs.description}
                            </Link>
                        </Typography>}

                    {api.document.info.contact &&
                        <Typography startDecorator={<Email />}>
                            {api.document.info.contact.email}
                        </Typography>}
                </Stack>
            </Stack>
        </Card>
    );
}
