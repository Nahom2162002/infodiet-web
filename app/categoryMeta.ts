export const CATEGORY_META: Record<string, { label: string; short: string; letter: string; hue: number }> = {
    news:          { label: 'News & Politics',       short: 'News',   letter: 'N',  hue: 250 },
    social:        { label: 'Social Media',          short: 'Social', letter: 'S',  hue: 320 },
    entertainment: { label: 'Entertainment',         short: 'Ent.',   letter: 'E',  hue: 300 },
    educational:   { label: 'Educational',           short: 'Edu.',   letter: 'Ed', hue: 140 },
    shopping:      { label: 'Shopping',               short: 'Shop',   letter: 'Sh', hue: 70  },
    forums:        { label: 'Forums & Communities',  short: 'Forums', letter: 'F',  hue: 200 },
    gaming:        { label: 'Gaming',                 short: 'Gaming', letter: 'G',  hue: 280 },
    other:         { label: 'Other',                  short: 'Other',  letter: 'O',  hue: 230 },
};

export const CATEGORY_ORDER = ['news', 'social', 'entertainment', 'educational', 'shopping', 'forums', 'gaming', 'other'];
