export const PUBLIC = {
    main: "/main-report/",
    top_salling_product: "main-top-salling-product-report",
    daly_sale: "main-daily-sales-report",
};

export const SALE = {
    main: "/order-main-report/",
    top_salling_product: "main-top-salling-product-report",
    daly_sale: "main-daily-sales-report",
};

export const FINANCIAL = {
    main: "/main-financial-report/",
    top_salling_product: "main-daily-financial-report",
    daly_sale: "main-daily-expense-report",
};

export const BRANCH = {
    main: "/main-branch-report/",
    daly_financial: "/main-daily-financial-report/",
    branch_stock: "/main-branch-stock-report/",
};



export const SINGLE_BRANCH = {
    main: (id: number) => `/singal-branch-report/${id}/`,
    branch_transaction: (id: number) => `/singal-branch-transaction-report/${id}/`,
    branch_stock: (id: number) => `/singal-branch-stock-report/${id}/`,
};

