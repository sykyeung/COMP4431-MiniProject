function drawGraph(graphYLabels, audioSequence, sampleRate){
    
    var canvas = document.getElementById("adsr-graph");
    var context = canvas.getContext("2d")
    
    // get Attributes
    var graphCanvasWidth = canvas.getAttribute("width");
    var graphCanvasHeight = canvas.getAttribute("height");
    
    // Clear Canvas
    context.clearRect(0,0, graphCanvasWidth, graphCanvasHeight);
    
    // Initialize Axis
    var start_x_axis = 10.0;
    var start_y_axis = graphCanvasHeight - 10.0;
    var end_x_axis = graphCanvasWidth - 10.0;
    var end_y_axis = 10.0;
    
    context.beginPath();
    context.lineWidth = "1";
    context.strokeStyle = "gray";
    
    // Horizontal Line
    context.moveTo(start_x_axis, start_y_axis);
    context.lineTo(end_x_axis, start_y_axis);
    
    // Vertical Line
    context.moveTo(start_x_axis, start_y_axis);
    context.lineTo(start_x_axis, end_y_axis); 
    context.stroke();
    
    // Content of Axis
    context.fillText("ADSR Multiplier", 5, 5);
    
    context.fillText("0", 5, graphCanvasHeight - 5.0);
    
    context.textAlign= "right";
    context.fillText("seconds", graphCanvasWidth - 5.0, graphCanvasHeight - 5.0);
    
    // Make sure lengths are correct
    if (graphYLabels.length != audioSequence.data.length){
        return;
    }
    
    // Set ending point
    var ending_point_x = end_x_axis - 5.0;
    var point_for_1_mult = end_y_axis + 5.0;
    
    var totalDuration = audioSequence.data.length / sampleRate;
    
    context.textAlign = "center";
    context.fillText(totalDuration.toString(), ending_point_x , start_y_axis + 5.0);
    
    context.fillText("1.0", start_x_axis - 5.0, point_for_1_mult);
    
    // Draw line for 1.0 Multiplier
    context.beginPath();
    context.lineWidth = "1";
    context.strokeStyle = "gray";
    context.moveTo(start_x_axis, point_for_1_mult);
    context.lineTo(end_x_axis, point_for_1_mult);
    context.stroke();
    
    // Set Line graph properties
    context.beginPath();
    context.lineWidth = "2";
    context.strokeStyle = "black";
    context.moveTo(start_x_axis, start_y_axis);
    
    var graph_width_diff = ending_point_x - start_x_axis;
    var graph_height_diff = start_y_axis - point_for_1_mult;
    
    // Draw Line
    for (var i = 0; i < graphYLabels.length; i ++){
        var x_cor = start_x_axis + parseFloat(i) / parseFloat(graphYLabels.length) * graph_width_diff;
        var y_cor = start_y_axis - graph_height_diff * graphYLabels[i];
        
        context.lineTo(x_cor, y_cor);
    }
    
    
    context.stroke();
}