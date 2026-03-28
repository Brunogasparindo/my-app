import React, { useState } from 'react';
import { useOrders, useCreateOrder } from '../hooks/useApi';
import PermissionGuard from '../components/guards/PermissionGuard';
import { useAuth } from '../context/AuthContext';

/**
 * Example Orders Page
 * Demonstrates using the custom hooks for data fetching with TanStack Query
 */
export const Orders: React.FC = () => {
  const [page, setPage] = useState(0);
  const { data: ordersList, isLoading, error } = useOrders(page, 20);
  const createOrderMutation = useCreateOrder();

  const handleCreateOrder = async () => {
    try {
      const newOrder = {
        // Your order data here
        customerId: 'CUST001',
        amount: 100.0,
        items: [],
      };
      await createOrderMutation.mutateAsync(newOrder);
      // The hook will automatically invalidate queries and refetch data
    } catch (err) {
      console.error('Failed to create order:', err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Orders</h1>

      <PermissionGuard requiredPermission="CREATE_ORDER">
        <button
          onClick={handleCreateOrder}
          disabled={createOrderMutation.isPending}
          style={{
            marginBottom: '20px',
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {createOrderMutation.isPending ? 'Creating...' : 'Create New Order'}
        </button>
      </PermissionGuard>

      {isLoading && <p>Loading orders...</p>}
      {error && <p style={{ color: 'red' }}>Error loading orders</p>}

      {ordersList && (
        <>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginBottom: '20px',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>
                  ID
                </th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>
                  Customer
                </th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>
                  Amount
                </th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {ordersList.content?.map((order: any) => (
                <tr key={order.id}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{order.id}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {order.customerId}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>${order.amount}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <button
                      style={{
                        padding: '5px 10px',
                        marginRight: '5px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      View
                    </button>
                    <PermissionGuard requiredPermission="UPDATE_ORDER">
                      <button
                        style={{
                          padding: '5px 10px',
                          marginRight: '5px',
                          backgroundColor: '#ffc107',
                          color: 'black',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        Edit
                      </button>
                    </PermissionGuard>
                    <PermissionGuard requiredPermission="DELETE_ORDER">
                      <button
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
                    </PermissionGuard>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              style={{
                marginRight: '10px',
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Previous
            </button>
            <span style={{ marginRight: '10px' }}>Page {page + 1}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={!ordersList.hasMore}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;
