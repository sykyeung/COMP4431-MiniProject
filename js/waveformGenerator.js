// This object represent the waveform generator
var WaveformGenerator = {
    // The generateWaveform function takes 4 parameters:
    //     - type, the type of waveform to be generated
    //     - frequency, the frequency of the waveform to be generated
    //     - amp, the maximum amplitude of the waveform to be generated
    //     - duration, the length (in seconds) of the waveform to be generated
    generateWaveform: function(type, frequency, amp, duration) {
        var nyquistFrequency = sampleRate / 2; // Nyquist frequency
        var totalSamples = Math.floor(sampleRate * duration); // Number of samples to generate
        var result = []; // The temporary array for storing the generated samples

        switch(type) {
            case "sine-time": // Sine wave, time domain
                for (var i = 0; i < totalSamples; ++i) {
                    var currentTime = i / sampleRate;
                    result.push(amp * Math.sin(2.0 * Math.PI * frequency * currentTime));
                }
                break;

            case "square-time": // Square wave, time domain
                /**
                * TODO: Complete this generator
                **/
                
                var oneCycle = sampleRate / frequency;
                var halfCycle = oneCycle / 2;
                
                for (var i = 0; i < totalSamples; ++i) {    
                        var pos = i % parseInt(oneCycle);
                        if (pos < halfCycle)
                            result.push(amp);
                        else    
                            result.push(-amp); // (-1 * amp)
                    
                }

                break;

            case "square-additive": // Square wave, additive synthesis
                /**
                * TODO: Complete this generator
                **/

                for (var i = 0; i < totalSamples; ++i) {
                    var t = i / sampleRate;
                    var sample = 0;
                    var k = 1;

                    while (k * frequency < nyquistFrequency){
                        sample += ((1.0 / k) * Math.sin(2 * Math.PI * k * frequency * t)) * amp;
                        k += 2;
                    }

                    result.push(sample);
                }

                break;

            case "sawtooth-time": // Sawtooth wave, time domain
                /**
                * TODO: Complete this generator
                **/

                var oneCycle = sampleRate/frequency;

                for (var i = 0; i < totalSamples; ++i) {
                    var pos = i % parseInt(oneCycle);
                    var frac = pos / oneCycle;
                 
                    result.push((2 * (1.0 - frac) - 1) * amp);
                }

                break;

            case "sawtooth-additive": // Sawtooth wave, additive synthesis
                /**
                * TODO: Complete this generator
                **/

                for (var i = 0; i < totalSamples; ++i) {
                    var t = i / sampleRate;
                    var sample = 0;
                    var k = 1;

                    while (k * frequency < nyquistFrequency) {
                        sample += ((1.0 / k) * Math.sin(2 * Math.PI * k * frequency * t)) * amp;
                        k += 1;
                    }

                    result.push(sample);
                }

                break;

            case "triangle-additive": // Triangle wave, additive synthesis
                /**
                * TODO: Complete this generator
                **/

               for (var i = 0; i < totalSamples; ++i) {
                   var t = i / sampleRate;
                   var sample = 0;
                   var k = 1;

                   while (k * frequency < nyquistFrequency) {
                       sample += ((1.0 / (k * k)) * Math.cos(2 * Math.PI * k * frequency * t)) * amp;                
                       k += 2;
                   }

                   result.push(sample);
                }

                break;

            case "karplus-strong": // Karplus-Strong algorithm
                /**
                * TODO: Complete this generator
                **/

                // Obtain all the required parameters
                var base = $("#karplus-base>option:selected").val();
                var b = parseFloat($("#karplus-b").val());
                var delay = parseInt($("#karplus-p").val());
                
                var sample = [];
                var kuseFreq = $("#karplus-use-freq").prop("checked");            
                var p;

                if (kuseFreq) {
                    p = parseInt(sampleRate/frequency);
                } else {
                    p = delay;
                }
                
                if (base == "white-noise") {       // white noise
                    for (var i = 0; i < totalSamples; ++i) {
                        if (i <= p) {
                            sample[i] = ((Math.random() * 2 - 1) * amp);
                        } else if (Math.random() < b) {
                            sample[i] = 0.5 * (sample[i - p] + sample[i - p - 1]);
                        } else {
                            sample[i] = -0.5 * (sample[i - p] + sample[i - p - 1]);
                        }
                        result.push(sample[i]);                    
                    }
                } else {    // sawtooth wave                    
                    for (var i = 0; i < totalSamples; ++i) {                        
                        var frac = parseFloat(i / p);
                        
                        if (i <= p) {
                            sample[i] = (2 * (1.0 - frac) - 1) * amp;
                        } else if (Math.random() < b) {
                            sample[i] = 0.5 * (sample[i - p] + sample[i - p - 1]);
                        } else {
                            sample[i] = -0.5 * (sample[i - p] + sample[i - p - 1]);
                        }
                        result.push(sample[i]); 
                    }
                }
                break;

            case "white-noise": // White noise
                /**
                * TODO: Complete this generator
                **/ 

                for (var i = 0; i < totalSamples; ++i) {
                    result.push((Math.random() * 2 - 1) * amp);
                }

                break;

            case "customized-additive-synthesis": // Customized additive synthesis
                /**
                * TODO: Complete this generator
                **/

                // Obtain all the required parameters
				var harmonics = [];
				for (var h = 1; h <= 10; ++h) {
                    harmonics.push($("#additive-f" + h).val());
				}

                
                for (var i = 0; i < totalSamples; ++i) {
                    var t = i / sampleRate;
                    var sample = 0;
                    var k = 1;
 
                    while ((k <= 10) && (k * frequency < nyquistFrequency)){
                        sample += (harmonics[k-1] * Math.sin(2 * Math.PI * k * frequency * t)) * amp;
                        k += 1;
                    }

                    result.push(sample);
                }

                break;

            case "fm": // FM
                /**
                * TODO: Complete this generator
                **/

                // Obtain all the required parameters
                var useADSR = $("#fm-use-adsr").prop("checked");
                var useFreq = $("#fm-use-freq-multiplier").prop("checked");
                
                if (useFreq) {
                    var carrierFrequency = parseFloat($("#fm-carrier-frequency").val());
                    var modulationFrequency = parseFloat($("#fm-modulation-frequency").val());
                } else {
                    var carrierFrequency = parseInt($("#fm-carrier-frequency").val());
                    var modulationFrequency = parseInt($("#fm-modulation-frequency").val());
                }
               
                var carrierAmplitude = parseFloat($("#fm-carrier-amplitude").val());
                var modulationAmplitude = parseFloat($("#fm-modulation-amplitude").val());

                if (useADSR) { // Obtain the ADSR parameters
                    var attackDuration = parseFloat($("#fm-adsr-attack-duration").val()) * sampleRate;
                    var decayDuration = parseFloat($("#fm-adsr-decay-duration").val()) * sampleRate;
                    var releaseDuration = parseFloat($("#fm-adsr-release-duration").val()) * sampleRate;
                    var sustainLevel = parseFloat($("#fm-adsr-sustain-level").val()) / 100.0;   
                }


                for (var i = 0; i < totalSamples; ++i) {
                    var t = i / sampleRate;
                    var tempam = 0;
                    var tempfc = 0;
                    var tempfm = 0;

                    if (useFreq) {
                        tempfc = carrierFrequency * frequency;
                        tempfm = modulationFrequency * frequency;
                    } else {
                        tempfc = carrierFrequency;
                        tempfm = modulationFrequency;
                    }

                    if (useADSR) {               
                        if (i < attackDuration) {     // Attack Section         
                            tempam = modulationAmplitude * (i / attackDuration);  
                        } else if (i < attackDuration + decayDuration) {    // Decay Section
                            tempam = modulationAmplitude * lerp(sustainLevel, 1, (1 - (i - attackDuration)/decayDuration));
                        } else if (i < totalSamples - releaseDuration) {    // Sustain Section                                  
                            tempam = modulationAmplitude * sustainLevel;
                        } else {      // Release Section
                            tempam = modulationAmplitude * (sustainLevel * (1 - (i - totalSamples + releaseDuration)/releaseDuration));
                        }                       
                    } else {
                        tempam = modulationAmplitude;
                    }

                    result.push(carrierAmplitude * Math.sin(2.0 * Math.PI * tempfc * t + tempam * Math.sin(2.0 * Math.PI * tempfm * t)));
                
                }

                break;

            case "repeating-narrow-pulse": // Repeating narrow pulse
                var cycle = Math.floor(sampleRate / frequency);
                for (var i = 0; i < totalSamples; ++i) {
                    if(i % cycle === 0) {
                        result.push(amp * 1.0);
                    } else if(i % cycle === 1) {
                        result.push(amp * -1.0);
                    } else {
                        result.push(0.0);
                    }
                }
                break;

            default:
                break;
        }

        return result;
    }
};
