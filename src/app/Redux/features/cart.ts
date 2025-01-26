import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define the initial state using that type
interface CartItem {
  id: string;
  color: string;
  size: string;
  qty: number;
  uuid: number;
}

export const cartSlice = createSlice({
  name: 'products',
  initialState: [] as CartItem[],
  reducers: {
    // add to cart functionality
    add(state, action: PayloadAction<CartItem>) {
      let uuid = Math.floor(1000 + Math.random() * 9000);
      let newobj = { ...action.payload, uuid };
      state.push(newobj);
    },
    // delete from cart
    remove(state, { payload }: PayloadAction<number>) {
      return state.filter((val) => val.uuid !== payload);
    },
    // addition of item
    addition(state, action: PayloadAction<CartItem>) {
      let obj = state.find(
        (val) =>
          val.id === action.payload.id &&
          val.color === action.payload.color &&
          val.size === action.payload.size
      );
      if (obj) {
        ++obj.qty;
        let newState = state.filter((val) => val.id !== obj.id);
        state = [...newState, obj];
        return;
      }
    },
    // subtraction of item
    subraction(state, action: PayloadAction<CartItem>) {
      let obj = state.find(
        (val) =>
          val.id === action.payload.id &&
          val.color === action.payload.color &&
          val.size === action.payload.size
      );
      if (obj !== undefined) {
        --obj.qty;
        let newState = state.filter((val) => val.uuid !== obj.uuid);
        state = [...newState, obj];
        return;
      }
    },
  },
});

export const { add, remove, subraction, addition } = cartSlice.actions;

export default cartSlice.reducer;
