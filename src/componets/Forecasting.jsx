import * as tfvis from '@tensorflow/tfjs-vis';
import * as tf from '@tensorflow/tfjs';
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient.js";

export default function Forecasting() {
    function createModel() {
        const model = tf.sequential();
        model.add(tf.layers.dense({inputShape: [1], units: 1, useBias: true}));
        model.add(tf.layers.dense({units: 1, useBias: true}));
        return model;
    }

    const model = createModel();
    tfvis.show.modelSummary({name: 'Model Summary'}, model);

    useEffect(() => {
        async function consult() {
            const { data, error } = await supabase.from('measurements').select('*');
            let datos = data.map((d, index) => ({
                x: index,
                y: d.temperature,
            }));

            function convertToTensor(datos) {
                return tf.tidy(() => {
                    tf.util.shuffle(datos);

                    const inputs = datos.map(d => d.x);
                    const labels = datos.map(d => d.y);

                    const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
                    const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

                    const inputMax = inputTensor.max();
                    const inputMin = inputTensor.min();
                    const labelMax = labelTensor.max();
                    const labelMin = labelTensor.min();

                    const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
                    const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));

                    return {
                        inputs: normalizedInputs,
                        labels: normalizedLabels,
                        inputMax,
                        inputMin,
                        labelMax,
                        labelMin,
                    };
                });
            }

            async function trainModel(model, inputs, labels) {
                model.compile({
                    optimizer: tf.train.adam(),
                    loss: tf.losses.meanSquaredError,
                    metrics: ['mse'],
                });

                const batchSize = 32;
                const epochs = 50;

                return await model.fit(inputs, labels, {
                    batchSize,
                    epochs,
                    shuffle: true,
                    callbacks: tfvis.show.fitCallbacks(
                        { name: 'Training Performance' },
                        ['loss', 'mse'],
                        { height: 200, callbacks: ['onEpochEnd'] }
                    )
                });
            }

            const tensorData = convertToTensor(datos);
            const {inputs, labels} = tensorData;

            await trainModel(model, inputs, labels);
            console.log('Done Training');

            function testModel(model, inputData, normalizationData) {
                const {inputMax, inputMin, labelMin, labelMax} = normalizationData;

                const [xs, preds] = tf.tidy(() => {
                    const xs = tf.linspace(0, 1, 100);
                    const preds = model.predict(xs.reshape([100, 1]));

                    const unNormXs = xs
                        .mul(inputMax.sub(inputMin))
                        .add(inputMin);

                    const unNormPreds = preds
                        .mul(labelMax.sub(labelMin))
                        .add(labelMin);

                    return [unNormXs.dataSync(), unNormPreds.dataSync()];
                });

                const predictedPoints = Array.from(xs).map((val, i) => ({
                    x: val,
                    y: preds[i],
                }));

                const originalPoints = inputData.map(d => ({
                    x: d.x, y: d.y,
                }));

                tfvis.render.scatterplot(
                    {name: 'Predicciones vs Original'},
                    {values: [originalPoints, predictedPoints], series: ['original', 'predecidos']},
                    {
                        xLabel: 'Dia',
                        yLabel: 'Temperatura',
                        height: 300
                    }
                );
            }

            testModel(model, datos, tensorData);
        }
        consult();
    }, []);

    return (
        <>
            <p>Forecasting component</p>
        </>
    );
}
