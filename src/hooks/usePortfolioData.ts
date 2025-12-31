import portfolioData from '@/data/portfolio.json';

export interface PortfolioData {
    personal: {
        name: string;
        initials: string;
        role: string;
        phone: string;
        company: string;
        location: string;
        email: string;
        tagline: string;
        bio: {
            paragraphs: string[];
            currentStatus: {
                role: string;
                company: string;
                location: string;
                learning: string[];
                coffee_level: string;
            };
        };
    };
    hero: {
        greeting: string;
        headline: string;
        subheadline: string[];
        cta: Array<{
            text: string;
            href: string;
            variant: 'primary' | 'secondary';
            download?: string;
        }>;
        terminal: {
            initialMessages: string[];
            modalMessages: string[];
        };
    };
    about: {
        sectionNumber: string;
        title: string;
    };
    skills: {
        sectionNumber: string;
        title: string;
        categories: Array<{
            category: string;
            items: string[];
        }>;
    };
    projects: {
        sectionNumber: string;
        title: string;
        items: Array<{
            title: string;
            description: string;
            tech: string[];
            type: string;
            link: string;
        }>;
    };
    experience: {
        sectionNumber: string;
        title: string;
        items: Array<{
            company: string;
            role: string;
            period: string;
            description: string[];
        }>;
    };
    contact: {
        sectionNumber: string;
        title: string;
        subtitle: string;
        description: string;
    };
    social: {
        github: string;
        linkedin: string;
        twitter?: string;
    };
    terminal: {
        commands: Record<string, string | string[]>;
    };
    navbar: {
        links: Array<{
            name: string;
            href: string;
        }>;
    };
    footer: {
        text: string;
    };
}

export const usePortfolioData = () => {
    const data = portfolioData as PortfolioData;

    // Interpolate template strings like {name} and {company}
    const interpolate = (str: string): string => {
        return str.replace(/{(\w+)}/g, (_, key) => {
            return (data.personal as any)[key] || '';
        });
    };

    // Interpolate HTML strings (for subheadlines, bio, etc.)
    const interpolateHTML = (str: string): string => {
        let result = interpolate(str);
        // Handle HTML tags
        result = result.replace(/<strong>/g, '').replace(/<\/strong>/g, '');
        result = result.replace(/<em>/g, '').replace(/<\/em>/g, '');
        return result;
    };

    return {
        data,
        interpolate,
        interpolateHTML,
    };
};
