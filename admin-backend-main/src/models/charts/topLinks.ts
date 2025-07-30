import { prisma } from "../../libs/prisma";

export const fetchTopLinks = async () => {
    const links: { url: string, count: number }[] = await prisma.link.findMany({
        select: {
            url: true,
            count: true
        },
        orderBy: {
            count: 'desc'
        },
        take: 10
    });

    const result = links.map((link, index) => {
        return {
            id: index + 1,
            text: link.url,
            count: link.count
        }
    });
    return result
};
