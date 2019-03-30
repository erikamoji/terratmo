$(function () {
    
    const missingKeyErrorMsg = `
        <div>
            No key found.<br>
            This demo will not work without a key.<br>
            Create a script.js file with the following code:.
        </div>
        <div style="color:red; padding-left: 20px;">
        var getKey = function(){<br>
            &nbsp; &nbsp; return "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";<br>
        }
        </div>
        <div>where xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx is your Azure Face API key</div>`
    
    var outputDiv = $("#OutputDiv");
    try {
        var subscriptionKey = getKey();
    }
    catch(err) {
        outputDiv.html(missingKeyErrorMsg);
    }


	$("#AnalyzeButton").click(function(){

        var subscriptionKey = getKey() || "Copy your Subscription key here";
        var textToAnalyze = $("#phraseDiv").val();

        var webSvcUrl = "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment";

        outputDiv.text("Thinking...");

        $.ajax({
            type: "POST",
            url: webSvcUrl,
            headers: { "Ocp-Apim-Subscription-Key": subscriptionKey },
            contentType: "application/json",
            data: '{"documents": [ { "language": "en", "id": "text01",  "text": "'+ textToAnalyze + '" }]}'
        }).done(function (data) {
			if (data.errors.length > 0) {
                outputDiv.html("Error: " + data.errors[0]);
			}
            else if (data.documents.length > 0) {
				var score = data.documents[0].score;
				if (score > 0.5){
					outputText = "Your current empathy score = " + score.toFixed(2)
						+ "<br>"
						+ "Wow! This conversation is going great! Keep up the good work.";
					$("#PositiveImage").css("display", "block");
					$("#NegativeImage").css("display", "none");
				}
				else{
                    outputText = "Your current empathy score = " + score.toFixed(2)
						+ "<br>"
						+ "Sounds like you might need help. Would you like to escalate this issue?";
					$("#PositiveImage").css("display", "none");
					$("#NegativeImage").css("display", "block");
				}
                outputDiv.html(outputText);
            }
            else {
                outputDiv.text("No text to analyze.");
				$("#PositiveImage").css("display", "none");
				$("#NegativeImage").css("display", "none");
            }

        }).fail(function (err) {
            $("#OutputDiv").text("ERROR! " + err.responseText);
			$("#PositiveImage").css("display", "none");
			$("#NegativeImage").css("display", "none");
        });
		
   });


});

