import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { analytics } from '../firebase'
import { useEffect,useState } from 'react'
import { getAnalytics, logEvent } from "firebase/analytics"
import Layout from '../components/layout'
import { useAuth } from '../context'
import {useSelector,useDispatch} from 'react-redux'
import {setProducts,setName} from '../store/global'
export default function Home({}) {

const [newproducts, setNewProducts] = useState([])
const [bestSellerProducts, setBestSellerProducts] = useState([])
const {ProductsBY} = useAuth()

const dispatch = useDispatch()
useEffect(() => {
const analytics = getAnalytics();
logEvent(analytics, "screen_view", {
  firebase_screen: "Home",
});
}, []);


useEffect(() => {

ProductsBY('createdAt').then(res=>{
  console.log(' new Products--->',res)
  setNewProducts(res)
})

}, [])


useEffect(() => {

  ProductsBY('sold').then(res=>{
    console.log('Best seller Products--->',res)
    setBestSellerProducts(res)
  })
  
  }, [])
  





  return (
    <div  className='mt-4'>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>


<Layout
    title="FullStack React Node MongoDB Ecommerce App"
    description="Node React E-commerce App"

>

<div>

</div>


</Layout>


     
    </div>
  )
}
