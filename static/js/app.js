/*
interactive dashboard to explore the Belly Button Biodiversity dataset
(http://robdunnlab.com/projects/belly-button-biodiversity/), 
which catalogs the microbes that colonize human navels.

The dataset reveals that a small handful of microbial species 
(also called operational taxonomic units, or OTUs, in the study) 
were present in more than 70% of people,
 while the rest were relatively rare. */


            //  Step 1: Plotly 


// 1. Use the D3 library to read in `samples.json`.
//  d3.json("../../data/samples.json").then(function(data) {console.log(data)});
// OR let data = d3.json("../../data/samples.json");
//console.log(data); 

// 2. Create a horizontal bar chart with a dropdown menu to display the top 
// 10 OTUs found in that individual.

/*  Use `sample_values` as the values for the bar chart.
    Use `otu_ids` as the labels for the bar chart.
   Use `otu_labels` as the hovertext for the chart.
    ![bar Chart](Images/hw01.png)
*/
function buildBarChart(sample)
{
    //console.log(sample)
    //let data = d3.json("../../data/samples.json");
    //console.log(data); 

    d3.json("../../data/samples.json").then((data) => {
        // grab the sample values
        let sampleData = data.samples;
        //console.log(sampleData);

        // filter based on the value of the sample (shows 1 result in an array)
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);
        //console.log(result);    

        // access index 0 from the array
        let resultData = result[0];
        //console.log(resultData); 
        
        // get the otu_IDS
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values
        /*console.log(otu_ids);
        console.log(otu_labels);  
        console.log(sample_values); */

        // Bar Cahrt / get the yTicks
        let yTicks = otu_ids.slice(0, 10).map(id => `OTU ${id}`); //console.log(yTicks);
        let xValues = sample_values.slice(0, 10); //console.log(xValues);
        let textLabels = otu_labels.slice(0,10); // console.log(textLabels);

        let barChart = {
        y: yTicks.reverse(),
        x: xValues.reverse(),
        text: textLabels.reverse(),
        type: "bar",
        orientation: "h"
        }

        let layout = {
            title: "Top 10 Belly Button Bacteria"
        };

        Plotly.newPlot("bar", [barChart], layout);

});
}



/* 3. Create a bubble chart that displays each sample.
* Use `otu_ids` for the x values.
* Use `sample_values` for the y values.
* Use `sample_values` for the marker size.
* Use `otu_ids` for the marker colors.
* Use `otu_labels` for the text values.
![Bubble Chart](Images/bubble_chart.png)*/

function buildBubbleChart(sample)
{
//console.log(sample)
    //let data = d3.json("../../data/samples.json");
    //console.log(data); 

    d3.json("../../data/samples.json").then((data) => {
        // grab the sample values
        let sampleData = data.samples;
        //console.log(sampleData);

        // filter based on the value of the sample (shows 1 result in an array)
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);
        //console.log(result);    

        // access index 0 from the array
        let resultData = result[0];
        //console.log(resultData); 
        
        // get the otu_IDS
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values
        /*console.log(otu_ids);
        console.log(otu_labels);  
        console.log(sample_values); */

        // Bar Cahrt / get the yTicks
        //let yTicks = otu_ids.slice(0, 10).map(id => `OTU ${id}`); //console.log(yTicks);
        //let xValues = sample_values.slice(0, 10); //console.log(xValues);
        //let textLabels = otu_labels.slice(0,10); // console.log(textLabels);

        let bubbleChart = {
        y: sample_values,
        x: otu_ids,
        text: otu_labels,
        mode: "markers",
        marker:{
            size: sample_values,
            color: otu_ids,
            colorscale: "Earth"
        }
        }

        let layout = {
            title: "Bacteria Cultures Per Sample",
            hovermode: "closest",
            xaxis: {title: "OUT_ID"}
        };

        Plotly.newPlot("bubble", [bubbleChart], layout);

});
}



// 4. Display the sample metadata, i.e., an individual's demographic information.
function demoInfo(sample){

    //console.log(sample);
    d3.json("../../data/samples.json").then((data) => {
        // grab the meta-data
        let metaData = data.metadata;
        // console.log(metaData);

        // filter based on the value of the sample (shows 1 result in an array)
        let result = metaData.filter(sampleResult => sampleResult.id == sample);
        //console.log(result);    

        // access index 0 from the array
        
        let resultData = result[0];
        //console.log(resultData); 

        // clear the meta-data otu and clears the html otu
        d3.select("#sample-metadata").html("");

        // use object.enries to get the value key pairs 
        Object.entries(resultData).forEach(([key, value])=>{
            // add to the selected panel
            d3.select("#sample-metadata")
            .append("h5").text(`${key}: ${value}`);
        });

});
}


// 5. Display each key-value pair from the metadata JSON object somewhere on the page. [hw](Images/hw03.png)

// 6. Update all of the plots any time that a new sample is selected.

/* Additionally, you are welcome to create any layotu that you would like for your dashboard. 
An example dashboard is shown below: ![hw](Images/hw02.png) */

function initialize()
{
    //let data = d3.json("../../data/samples.json");
    //console.log(data);  
// access dropdown selector from the index.html file
    var select = d3.select("#selDataset");

d3.json("../../data/samples.json").then((data) => {
    let sampleNames = data.names;
    //console.log(sampleNames);

// ARRAY

    sampleNames.forEach((sample) => {
        select.append("option").text(sample).property("value", sample);    
    });

    // pass the info through the 1st sample 
    let sample1 = sampleNames[0];
    // call the func. to the meta-data
    demoInfo(sample1); 
    // call the function build the chart
    buildBarChart(sample1);
     // call function to call the bubble chart
    buildBubbleChart(sample1);
});

}


// funtcion that updates the dashboard 
function optionChanged(item){

    // call the update metadata
    demoInfo(item); //console.log(item);
    // call the function build the chart
    buildBarChart(item);
    // call function to call the bubble chart
    buildBubbleChart(item);


}



initialize();




/* Adapt the Gauge Chart from <https://plot.ly/javascript/gauge-charts/> 
to plot the weekly washing frequency of the individual. */

//  You will need to modify the example gauge code to account for values ranging from 0 through 9.

//  Update the chart whenever a new sample is selected. ![Weekly Washing Frequency Gauge](Images/gauge.png)

// ## Deployment

// Deploy your app to a free static page hosting service, such as GitHub Pages. 
//Submit the links to your deployment and your GitHub repo.*/
