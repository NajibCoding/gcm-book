export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};

export interface Service {
    id: number;
    name: string;
    slug: string;
    description: string;
    base_price: number;
    is_bookable: boolean;
    is_invoiceable: boolean;
    is_active: boolean;
}

export interface Booking {
    id: number;
    booking_code: string;
    service: Service;
    service_id: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    vehicle_details: Record<string, string> | null;
    scheduled_at: string;
    queue_number: number;
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
    notes: string | null;
    promo_id: number | null;
    created_at: string;
    invoice?: Invoice | null;
}

export interface Invoice {
    id: number;
    invoice_number: string;
    booking: Booking | null;
    booking_id: number | null;
    customer_name: string;
    customer_email: string;
    subtotal: number;
    discount_amount: number;
    tax_amount: number;
    total: number;
    status: 'draft' | 'sent' | 'paid' | 'cancelled';
    notes: string | null;
    paid_at: string | null;
    items: InvoiceItem[];
    payment: Payment | null;
    payments?: Payment[];
    created_at: string;
}

export interface InvoiceItem {
    id: number;
    description: string;
    qty: number;
    unit_price: number;
    total: number;
}

export interface Payment {
    id: number;
    order_id: string;
    payment_method: string;
    amount: number;
    fee: number;
    total_payment: number;
    qr_string: string | null;
    expired_at: string | null;
    status: 'pending' | 'paid' | 'completed' | 'cancelled' | 'expired' | 'failed';
    completed_at: string | null;
    created_at: string;
}

export interface Promo {
    id: number;
    code: string;
    name: string;
    description: string;
    discount_type: 'percent' | 'fixed';
    discount_value: number;
    min_order: number;
    min_booking: number;
    max_usage: number | null;
    used_count: number;
    valid_from: string;
    valid_until: string;
    is_active: boolean;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: { url: string | null; label: string; active: boolean }[];
}

