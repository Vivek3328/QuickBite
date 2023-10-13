import React from 'react'
import AddItem from '../components/AddItem'
import styles from "../components/styles/RestaurantHome.module.css"
import ItemCard from '../components/ItemCard'

export default function RestaurantHome() {
    return (
        <>
            <div className={styles.main}>
                <div className={styles.name}>Restaurant name</div>
                <div className={styles.add}><AddItem /></div>
            </div>
            <div className={styles.card}>
            <div className='row'>
                <div className="col md-4">
                    <ItemCard />

                </div>

                <div className="col md-4">
                    <ItemCard />

                </div>

                <div className="col md-4">
                    <ItemCard />

                </div>

                <div className="col md-4">
                    <ItemCard />

                </div>

                <div className="col md-4">
                    <ItemCard />

                </div>

                <div className="col md-4">
                    <ItemCard />

                </div>

                <div className="col md-4">
                    <ItemCard />

                </div>

                <div className="col md-4">
                    <ItemCard />

                </div>

            </div>
            </div>
        </>
    )
}
