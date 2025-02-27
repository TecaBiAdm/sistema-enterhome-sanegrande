import React from "react";
import styles from './Wave.module.css'

const Wave = () => {
    return (
        <div class={styles.ocean}>
            <div class={styles.wave}></div>
            <div class={styles.wave}></div>
        </div>
    );
};

export default Wave;
