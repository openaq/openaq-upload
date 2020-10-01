import React, { useState, useEffect } from 'react';
import api from '../services/openaq-api'

function PageFooter() {

    const [measurements, setMeasurements] = useState(0);

    useEffect(() => {
        api.getTotalMeasurements()
            .then(data => {
                try {
                    const measurement = data | data.meta | data.meta.found;
                    if (measurement) {
                        setMeasurements(measurement)
                    }
                } catch (e) {
                    console.log('Could not retrieve measurement', e)
                }
            })
    })


    return (
        <footer className='page__footer' role='contentinfo'>
            <p className='copyright'>
                {measurements} measurements captured with <span className='heart'></span> by the <a href='https://openaq.org/' title='Visit the OpenAQ website'>OpenAQ</a> team.
            </p>
        </footer>
    );
}


module.exports = PageFooter;
