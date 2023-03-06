import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Order } from "./Order";
import { OrderList } from "./OrderList";

interface FormValues {
  totalCharged: number;
  orderedAt: string;
}
export const OrderLookupForm = () => {
  const queryClient = useQueryClient();

  const { handleSubmit, register } = useForm<FormValues>();

  const { mutate, data } = useMutation({
    mutationFn: (formValues: FormValues) => {
      return axios
        .get("/api/v1/orders", { params: formValues })
        .then((resp) => resp.data as Order[]);
    },
  });
  const onSubmit = useCallback((data: FormValues) => {
    console.log(data);
    mutate(data);
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="totalCharged">Total Charged</label>
          <input
            type="text"
            inputMode="numeric"
            id="totalCharged"
            {...register("totalCharged")}
          />
        </div>
        <div>
          <label htmlFor="orderedAt">Ordered At</label>
          <input type="date" id="orderedAt" {...register("orderedAt")} />
        </div>
        <div>
          <input type="submit" value="Look It Up" />
        </div>
      </form>
      {data && <OrderList orders={data} />}
    </>
  );
};
