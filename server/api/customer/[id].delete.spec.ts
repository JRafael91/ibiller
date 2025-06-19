// server/api/customer/[id].delete.spec.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { H3Event, defineEventHandler, setResponseStatus, sendNoContent } from 'h3';
import { eq } from 'drizzle-orm';

// Modules to test
import deleteHandler from './[id].delete';
import listHandler from '../customer.get'; // Adjusted path for customer GET endpoint

// Mock '~/server/utils/db'
const mockDBUpdateReturning = vi.fn();
const mockDBUpdateWhere = vi.fn(() => ({ returning: mockDBUpdateReturning }));
const mockDBUpdateSet = vi.fn(() => ({ where: mockDBUpdateWhere }));
const mockDBUpdate = vi.fn(() => ({ set: mockDBUpdateSet }));

const mockDBSelectFrom = vi.fn();
const mockDBSelectWhere = vi.fn(() => ({ /* any further chain? e.g. .orderBy() if used */ })); // Assuming GET might have where
const mockDBSelect = vi.fn(() => ({ from: mockDBSelectFrom, where: mockDBSelectWhere })); // Simplified for now

const mockUseDB = vi.fn(() => ({
	update: mockDBUpdate,
	select: mockDBSelect,
	// Add other methods like .delete() or .insert() if they were part of other tests not shown here
}));

vi.mock('~/server/utils/db', async (importOriginal) => {
	const original = await importOriginal();
	return {
		...original, // Spread original exports
		useDB: mockUseDB,
		tables: { // Keep original tables structure or mock if its structure is complex/dynamic
			customer: {
				id: 'customer_id_col', // Mock column names if they differ from keys or are complex
				deletedAt: 'deleted_at_col',
				active: 'active_col',
				businessName: 'business_name_col',
				// Add any other fields that might be used in queries or returned
			},
		},
		// eq: eq, // use original eq
	};
});


// Mock 'h3' event utilities if needed for more complex scenarios,
// but for now, we'll call handlers directly with a mock event.
const mockSetResponseStatus = vi.fn();
const mockCreateError = vi.fn((options) => new Error(options.statusMessage || 'Error'));

vi.mock('h3', async (importOriginal) => {
    const original = await importOriginal();
    return {
        ...original,
        setResponseStatus: mockSetResponseStatus,
        createError: mockCreateError,
        // Mock other H3 utilities if they are used by the handlers
        // For example, if getQuery or readBody are used.
    };
});


describe('Customer API Endpoints', () => {
	let mockEvent: H3Event;

	beforeEach(() => {
		vi.clearAllMocks(); // Clears mock call history

		// Setup a generic mock event for each test
		// @ts-ignore
		mockEvent = {
			context: {
				params: {},
				// user: { businessId: "test-business-id" } // if auth/user context is needed
			},
			node: {
				req: {},
				res: { statusCode: 200, statusMessage: '', end: vi.fn(), writeHead: vi.fn(), write: vi.fn() },
			} as any, // Mocking req/res parts for h3 internals if they touch it
			// Mock other event properties/methods if used by handlers
			// e.g., getQuery, readBody
		} as H3Event;

        // Reset h3 utility mocks for response handling
        mockSetResponseStatus.mockImplementation((event, status) => {
            event.node.res.statusCode = status;
        });
        mockCreateError.mockImplementation(err => {
            const error = new Error(err.statusMessage || 'error');
            // @ts-ignore
            error.statusCode = err.statusCode;
            return error;
        });
	});

    afterEach(() => {
        vi.restoreAllMocks(); // Restores original implementations
    });

	describe('DELETE /api/customer/{id} (Soft Delete)', () => {
		it('should successfully soft delete a customer and return 200', async () => {
			const customerId = 'cust_123';
			const mockUpdatedCustomer = { id: customerId, deletedAt: new Date(), active: false };

			// @ts-ignore
			mockEvent.context.params.id = customerId;
			mockDBUpdateReturning.mockResolvedValueOnce([mockUpdatedCustomer]); // Simulate returning the updated customer

			const result = await deleteHandler(mockEvent);

			expect(mockUseDB).toHaveBeenCalled();
			expect(mockDBUpdate).toHaveBeenCalledWith(vi.paths.tables.customer); // Using vi.paths for mocked table
			expect(mockDBUpdateSet).toHaveBeenCalledWith({
				deletedAt: expect.any(Date),
				active: false,
			});
			expect(mockDBUpdateWhere).toHaveBeenCalledWith(eq(vi.paths.tables.customer.id, customerId));
			expect(mockDBUpdateReturning).toHaveBeenCalledWith({id: vi.paths.tables.customer.id});

            expect(mockSetResponseStatus).not.toHaveBeenCalled(); // Success implies default 200 or what handler sets itself
			expect(result).toEqual({
				message: 'Cliente desactivado correctamente',
				customer: mockUpdatedCustomer,
			});
            expect(mockEvent.node.res.statusCode).toBe(200); // Check final status code
		});

		it('should return 404 if the customer to soft delete is not found', async () => {
			const nonExistentId = 'cust_nonexistent';
			// @ts-ignore
			mockEvent.context.params.id = nonExistentId;
			mockDBUpdateReturning.mockResolvedValueOnce([]); // Simulate customer not found

			const result = await deleteHandler(mockEvent);

			expect(mockDBUpdateSet).toHaveBeenCalledWith({
				deletedAt: expect.any(Date),
				active: false,
			});
			expect(mockDBUpdateWhere).toHaveBeenCalledWith(eq(vi.paths.tables.customer.id, nonExistentId));
			expect(mockSetResponseStatus).toHaveBeenCalledWith(mockEvent, 404);
			expect(result).toEqual({ message: 'Cliente no encontrado' });
		});

        it('should return 400 if customer ID is not provided', async () => {
            // @ts-ignore
            mockEvent.context.params.id = undefined; // No ID

            const result = await deleteHandler(mockEvent);

            expect(mockSetResponseStatus).toHaveBeenCalledWith(mockEvent, 400);
            expect(result).toEqual({ message: 'Identificador de cliente no proporcionado' });
            expect(mockDBUpdate).not.toHaveBeenCalled();
        });

		it('should return 500 if a database error occurs during soft delete', async () => {
			const customerId = 'cust_456';
			// @ts-ignore
			mockEvent.context.params.id = customerId;
			const dbError = new Error('Database connection error');
			mockDBUpdateReturning.mockRejectedValueOnce(dbError); // Simulate a DB error

            const result = await deleteHandler(mockEvent);

			expect(mockDBUpdateWhere).toHaveBeenCalledWith(eq(vi.paths.tables.customer.id, customerId));
            expect(mockSetResponseStatus).toHaveBeenCalledWith(mockEvent, 500);
			expect(result).toEqual({ message: 'Error al desactivar el cliente' });
		});
	});

	describe('GET /api/customer (List Customers)', () => {
		it('should not return soft-deleted customers in the customer list', async () => {
			const activeCustomer = { customer_id_col: 'cust_789', active_col: true, deleted_at_col: null, business_name_col: 'Active Corp' };
			// Soft-deleted customer (should be filtered out by the handler's logic if it includes `where(eq(tables.customer.active, true))`)
			// const softDeletedCustomer = { id: 'cust_123', active: false, deletedAt: new Date(), businessName: 'Inactive Inc.' };

            // Mock the DB select call for the list handler
            // This mock assumes the get handler itself applies the active=true filter.
			mockDBSelectFrom.mockReturnValueOnce([activeCustomer]); // Simulate DB returning only active customers
            // If listHandler itself doesn't have a where clause for active, this test is different.
            // Assuming listHandler is like: db.select().from(tables.customer).where(eq(tables.customer.active, true)) (or similar)

            // @ts-ignore (If businessId is needed for the list handler from auth)
            // mockEvent.context.user = { businessId: "test-business-id" };

			const result = await listHandler(mockEvent);

			expect(mockUseDB).toHaveBeenCalled();
			expect(mockDBSelect).toHaveBeenCalledWith({
                id: vi.paths.tables.customer.id,
                businessName: vi.paths.tables.customer.businessName,
                commercialName: vi.paths.tables.customer.commercialName,
                rfc: vi.paths.tables.customer.rfc,
                email: vi.paths.tables.customer.email,
                phone: vi.paths.tables.customer.phone,
                active: vi.paths.tables.customer.active,
                createdAt: vi.paths.tables.customer.createdAt,
                deletedAt: vi.paths.tables.customer.deletedAt,
            }); // Check if select is called
			expect(mockDBSelectFrom).toHaveBeenCalledWith(vi.paths.tables.customer);
            // This assertion depends on how listHandler filters for active customers.
            // If it explicitly adds `where(eq(tables.customer.active, true))`:
            // expect(mockDBSelectWhere).toHaveBeenCalledWith(eq(vi.paths.tables.customer.active, true));
            // For now, we assume the mockDBSelectFrom directly returns filtered data as if the WHERE clause was applied.

			expect(result).toEqual([activeCustomer]); // Only active customer should be returned
			expect(result.some(c => c.customer_id_col === 'cust_123')).toBe(false);
		});
	});
});
```
