import React from "react";
import { Order } from "./Order";

export const OrderList = ({ orders }: { orders: Order[] }) => {
  const orderListItems = orders.map((order) => {
    const orderItems = order.orderItems.map((item) => {
      return (
        <li key={item.id}>
          {item.totalCharged} {item.name}
        </li>
      );
    });
    return (
      <div key={order.id}>
        <h2>{order.orderId}</h2>
        <ul>{orderItems}</ul>
      </div>
    );
  });
  return <div>{orderListItems}</div>;
};
