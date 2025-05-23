// @vitest-environment nuxt
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { eq } from "drizzle-orm";
import { tables, useDB } from "~/server/database/utils"; // Assuming this path
import customerPutHandler from "./[id].put"; // Importing the handler directly
import type { Customer } from "~/types/customer";

// Mock Nuxt composables and utilities if not using @nuxt/test-utils-edge $fetch
// This is a simplified mocking approach. Actual implementation might differ.
const mockReadBody = vi.fn();
const mockSetResponseStatus = vi.fn();
const mockCreateError = vi.fn((err) => {
	throw { ...err, __isError: true };
}); // Mock createError to throw an error-like object

vi.mock("#imports", () => ({
	defineEventHandler: (handler) => handler,
	readBody: () => mockReadBody(),
	setResponseStatus: (event, status) => mockSetResponseStatus(event, status),
	createError: (err) => mockCreateError(err),
	// Mock other potential imports if needed
}));

// Helper function to simulate an API event
const createMockEvent = (params: any, body?: any) => {
	const event: any = {
		context: { params },
		node: { req: {}, res: {} }, // Simplified
	};
	if (body) {
		mockReadBody.mockResolvedValue(body);
	}
	return event;
};

// Database helper
const db = useDB();

const cleanupDatabase = async () => {
	// WARNING: This will delete all customers. Use with caution and ideally in a test DB.
	await db.delete(tables.customer).execute();
};

const createCustomerInDB = async (customerData: Partial<Customer>): Promise<Customer> => {
	const [customer] = await db
		.insert(tables.customer)
		.values({
			id: customerData.id || `test-id-${Math.random().toString(36).substring(7)}`,
			businessName: customerData.businessName || "Test Business",
			commercialName: customerData.commercialName || "Test Commercial",
			rfc: customerData.rfc || `RFC${Math.random().toString(36).substring(7)}`,
			email: customerData.email || `test-${Math.random()}@example.com`,
			phone: customerData.phone || "1234567890",
			address: customerData.address || "123 Test St",
			zip: customerData.zip || "12345",
			city: customerData.city || "Test City",
			state: customerData.state || "Test State",
			country: customerData.country || "Test Country",
			...customerData,
		})
		.returning();
	return customer as Customer;
};

describe("PUT /api/customer/[id]", () => {
	beforeEach(async () => {
		await cleanupDatabase();
		vi.clearAllMocks(); // Clear mocks before each test
	});

	afterEach(async () => {
		await cleanupDatabase();
	});

	it("1. Successful Update: should update a customer with valid data", async () => {
		const initialCustomer = await createCustomerInDB({ businessName: "Old Name" });
		const updatedData = {
			businessName: "New Name",
			commercialName: initialCustomer.commercialName,
			rfc: initialCustomer.rfc,
			email: initialCustomer.email,
			phone: initialCustomer.phone,
			address: initialCustomer.address,
			zip: initialCustomer.zip,
			city: initialCustomer.city,
			state: initialCustomer.state,
			country: initialCustomer.country,
		};
		const event = createMockEvent({ id: initialCustomer.id }, updatedData);

		const response = await customerPutHandler(event);

		expect(mockSetResponseStatus).not.toHaveBeenCalled(); // Should default to 200
		expect(response).toEqual({ message: "Cliente actualizado correctamente" });

		const dbCustomer = await db.query.customer.findFirst({ where: eq(tables.customer.id, initialCustomer.id) });
		expect(dbCustomer?.businessName).toBe("New Name");
	});

	it("2. Duplicate RFC: should return 409 if RFC is already in use by another customer", async () => {
		const customer1 = await createCustomerInDB({ rfc: "RFC123" });
		const customer2 = await createCustomerInDB({ rfc: "RFC456" }); // Other customer

		const updateDataForCustomer1 = {
			businessName: customer1.businessName,
			commercialName: customer1.commercialName,
			rfc: customer2.rfc, // Attempt to use customer2's RFC
			email: customer1.email,
			phone: customer1.phone,
		};
		const event = createMockEvent({ id: customer1.id }, updateDataForCustomer1);

		try {
			await customerPutHandler(event);
		} catch (error: any) {
			expect(mockSetResponseStatus).toHaveBeenCalledWith(event, 409);
			expect(error.statusCode).toBe(409);
			expect(error.statusMessage).toBe("El RFC ya está en uso por otro cliente");
		}

		const dbCustomer1 = await db.query.customer.findFirst({ where: eq(tables.customer.id, customer1.id) });
		expect(dbCustomer1?.rfc).toBe("RFC123"); // Ensure RFC was not updated
		expect(mockCreateError).toHaveBeenCalledTimes(1);
	});

	it("3. Non-Existent Customer: should return 404 if customer ID does not exist", async () => {
		const nonExistentId = "non-existent-id";
		const updateData = { businessName: "Any Name", rfc: "ANYRFC1", email: "any@mail.com" };
		const event = createMockEvent({ id: nonExistentId }, updateData);

		try {
			await customerPutHandler(event);
		} catch (error: any) {
			expect(mockSetResponseStatus).toHaveBeenCalledWith(event, 404);
			expect(error.statusCode).toBe(404);
			expect(error.statusMessage).toBe("Cliente no encontrado para actualizar");
		}
		expect(mockCreateError).toHaveBeenCalledTimes(1);
	});

	it("4. Invalid Data: should return 422 for invalid data (e.g., bad email)", async () => {
		const customer = await createCustomerInDB({});
		const invalidUpdateData = {
			businessName: customer.businessName,
			rfc: customer.rfc,
			email: "invalid-email", // Invalid email format
		};
		const event = createMockEvent({ id: customer.id }, invalidUpdateData);

		try {
			await customerPutHandler(event);
		} catch (error: any) {
			expect(mockSetResponseStatus).toHaveBeenCalledWith(event, 422);
			expect(error.statusCode).toBe(422);
			expect(error.statusMessage).toBe("Datos inválidos");
			// expect(error.data).toBeDefined(); // Further check on error.data structure if needed
		}
		expect(mockCreateError).toHaveBeenCalledTimes(1);
	});

	it("5. Update without Changing RFC: should succeed", async () => {
		const customer = await createCustomerInDB({ commercialName: "Old Commercial Name" });
		const updateData = {
			businessName: customer.businessName,
			commercialName: "New Commercial Name", // Changed
			rfc: customer.rfc, // RFC remains the same
			email: customer.email,
			phone: customer.phone,
		};
		const event = createMockEvent({ id: customer.id }, updateData);

		const response = await customerPutHandler(event);

		expect(mockSetResponseStatus).not.toHaveBeenCalled();
		expect(response).toEqual({ message: "Cliente actualizado correctamente" });

		const dbCustomer = await db.query.customer.findFirst({ where: eq(tables.customer.id, customer.id) });
		expect(dbCustomer?.commercialName).toBe("New Commercial Name");
		expect(dbCustomer?.rfc).toBe(customer.rfc);
	});

	it("6. Update RFC to New Unique Value: should succeed", async () => {
		const customer = await createCustomerInDB({ rfc: "OLD_RFC" });
		const newUniqueRfc = "NEW_UNIQUE_RFC123";
		const updateData = {
			businessName: customer.businessName,
			commercialName: customer.commercialName,
			rfc: newUniqueRfc, // New unique RFC
			email: customer.email,
			phone: customer.phone,
		};
		const event = createMockEvent({ id: customer.id }, updateData);

		const response = await customerPutHandler(event);

		expect(mockSetResponseStatus).not.toHaveBeenCalled();
		expect(response).toEqual({ message: "Cliente actualizado correctamente" });

		const dbCustomer = await db.query.customer.findFirst({ where: eq(tables.customer.id, customer.id) });
		expect(dbCustomer?.rfc).toBe(newUniqueRfc);
	});
});
