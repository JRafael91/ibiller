export interface Customer {
	id: string;
	businessName: string;
	commercialName: string;
	rfc: string | null;
	address: string | null;
	zip: string | null;
	city: string | null;
	state: string | null;
	country: string | null;
	email: string | null;
	phone: string | null;
	active: boolean;
	businessId: string;
	createdAt: string;
}
