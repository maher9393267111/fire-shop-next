import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { useAuth } from "./index";
import { useDispatch } from "react-redux";
import { setCart } from "../store/global";

import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  onSnapshot,
  orderBy,
  limit,
  query,
  where,
  FieldPath,
  updateDoc,
  arrayUnion,
  startAt,
  endAt,
  equalTo,
} from "firebase/firestore";

import { toast } from "react-toastify";
import { auth, db } from "../firebase";

const cartContext = createContext();

export const Cart = () => {
  return useContext(cartContext);
};

const allContext = ({ children }) => {
  const { userinfo } = useAuth();

  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const [totalprice, setTotalprice] = useState(0);
  const [cartexecute, setCartexecute] = useState(false);
  const [cartinfo, setCartinfo] = useState([]);

  // add product to current user cart

  const addtocart = async (product) => {
    console.log("📌📌📌📌");
    setCartexecute(!cartexecute);
    // console.log("product", product.id);

    const userpath = doc(db, "usmaher", `${userinfo?.email}`);
    const cart = await (await getDoc(userpath)).data()?.cart;
    // console.log("cart", cart); // cart is an array itis working

    const exist = cart?.filter(
      (item) =>
        // indexof is used to check if the item is already in the cart
        item.id === product.id
    );
    console.log("exist", exist);

    if (exist?.length === 0 || exist === []) {
        console.log("product is notexist in cart add it", exist);

      // console.log(checexist);

      // product.quantity = 1;

      const productdata = {
        id: product.id,
        name: product.name,
        quantity: 1,
        price: product.price,
        image: product.images[0].image,
      };
      await updateDoc(userpath, {
        cart: arrayUnion(productdata), // ArrayUnion is used to add the product to the cart
        //[...cart, product],
        totalprice: cart?.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        ),
      }).then(async () => {
        const cart = await (await getDoc(userpath)).data()?.cart;
        console.log("✔✔✔✔✔✔✔✔✔");
        toast.success("Product added to cart");
        await updateDoc(userpath, {
          totalprice: cart?.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
          ),
        });

        const totalprice = await (await getDoc(userpath)).data()?.totalprice;

        setCartexecute(!cartexecute);

        // dispatch(setCart({ cart: cart, total: totalprice }));
        // update totla price
      });

      // setChecexist(true);

      // total price of the cart
      const totalpriced = cart.reduce((acc, item) => {
        return acc + item.price * item.quantity;
      }, 0);
      setTotalprice(totalpriced);
      console.log("totalprice when addddddd to cart -------->", totalprice);
    }

    // if exist.length is not 0 and product is exist in the cart  //
    else {
      // console.log("product is exist in cart remove it  ", exist);

      await updateDoc(userpath, {
        cart: cart?.filter((item) => item.id !== product.id), // delete product from cart if exist

        // onother option  increase the quantity of the product if exist

        // make loop to all cart products and increase the quantity  where product id is equal to the product id in the cart

        // cart: cart.map((item) => {
        //   if (item.id === product.id) {
        //     item.quantity += 1;
        //   }
        //   return item;
        // }),
      });

      const cartdecrease = await (await getDoc(userpath)).data()?.cart;

      await updateDoc(userpath, {
        totalprice: cartdecrease?.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        ),
      });

      // total price of the cart
toast.warning("Product removed from cart");
console.log("✖✖✖✖✖✖✖✖✖");

      const cartafterdelete = await (await getDoc(userpath)).data()?.cart;
      const totalpricedafterfelete = await (await getDoc(userpath)).data()
        ?.totalprice;

      toast.success(`total priced is ${totalpricedafterfelete}`);

    //   dispatch(
    //     setCart({ cart: cartafterdelete, total: totalpricedafterfelete })
    //   );

      setCartexecute(!cartexecute);
    }
  };

  useEffect(() => {
    cartdata();
    console.log("cartdata👁👁 👁👁👁👁");
  }, []);

  const cartdata = async () => {
    const userpath = doc(db, "usmaher", `${userinfo?.email}`);
    const cart = await (await getDoc(userpath)).data()?.cart;

    const totalprice = await (await getDoc(userpath)).data()?.totalprice;

    const obj = { cart: cart, total: totalprice };

setCartinfo(obj);

    return obj;
  };

  // update product quantity in cart when user click on + or - button

  const increasequantity = async (product, quantity = 1) => {
    console.log("product", product);

    const userpath = doc(db, "usmaher", `${userinfo?.email}`);
    const procuctpath = doc(db, "Pro3", product.id);
    const Quantity = await (await getDoc(procuctpath)).data()?.quantity;

    console.log("Quantity---☢️☢️☢️☢️☢️☢️", Quantity);

    const cart = await (await getDoc(userpath)).data()?.cart;

    const totalprice = await (await getDoc(userpath)).data()?.totalprice;

    // find this product in the cart and increse  the quantity

    const increseproduct = cart?.find((item) => item.id === product.id);

    // increase the quantity of the product

    //

    if (increseproduct?.quantity < Quantity) {
      increseproduct.quantity += quantity;
    }

    console.log("increseproduct----->", increseproduct.quantity);

    updateDoc(userpath, {
      cart: cart?.map((item) => {
        if (item.id === product.id) {
          return increseproduct;
        }
        return item;
      }),
      totalprice: cart?.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ),
    }).then(async () => {
      const cart = await (await getDoc(userpath)).data()?.cart;
      const totalprice = await (await getDoc(userpath)).data()?.totalprice;

    //  dispatch(setCart({ cart: cart, total: totalprice }));
      // update totla price

      setCartexecute(!cartexecute);

      toast.success(`total priced is ${totalprice}`);
    });
  };

  const Decreasequantity = async (product, quantity = 1) => {
    console.log("product", product);

    const userpath = doc(db, "usmaher", `${userinfo?.email}`);
    const cart = await (await getDoc(userpath)).data()?.cart;

    const totalprice = await (await getDoc(userpath)).data()?.totalprice;

    // find this product in the cart and increse  the quantity

    const increseproduct = cart?.find((item) => item.id === product.id);

    // increase the quantity of the product

    if (increseproduct.quantity > 1) {
      increseproduct.quantity -= quantity;
    }

    console.log("increseproduct----->", increseproduct.quantity);

    updateDoc(userpath, {
      cart: cart?.map((item) => {
        if (item.id === product.id) {
          return increseproduct;
        }
        return item;
      }),
      totalprice: cart?.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ),
    }).then(async () => {
      const cart = await (await getDoc(userpath)).data()?.cart;
      const totalprice = await (await getDoc(userpath)).data()?.totalprice;

     // dispatch(setCart({ cart: cart, total: totalprice }));
      // update totla price

      setCartexecute(!cartexecute);

      toast.success(`total priced is ${totalprice}`);
    });
  };

  // delete product from cart

  const deleteProduct = async (product) => {
    const userpath = doc(db, "usmaher", `${userinfo?.email}`);
    const cart = await (await getDoc(userpath)).data()?.cart;
    const totalprice = await (await getDoc(userpath)).data()?.totalprice;

    // find this product in the cart and  delete it

    const deleteproduct = cart?.find((item) => item.id === product.id);

    // delete the product from cart
    cart.splice(cart.indexOf(deleteproduct), 1);

    // update total price
    const totalpriced = cart.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    // update cart in the database
    updateDoc(userpath, {
      cart: cart,
      totalprice: totalpriced,
    }).then(async () => {
      const cart = await (await getDoc(userpath)).data()?.cart;
      const totalprice = await (await getDoc(userpath)).data()?.totalprice;

      //dispatch(setCart({ cart: cart, total: totalprice }));
      // update totla price

      setCartexecute(!cartexecute);

      toast.success(`total priced is ${totalprice}`);
    });
  };

  const value = {
    addtocart,
    cartdata,
    increasequantity,
    Decreasequantity,
    deleteProduct,
    setCartinfo,
    cartinfo
  };
  return <cartContext.Provider {...{ value }}>{children}</cartContext.Provider>;
};

export default allContext;

