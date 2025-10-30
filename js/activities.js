function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	tweet_array.forEach(twt => {
		twt.dayOfWeek = twt.time.toLocaleDateString("en-US", {weekday: "long"});
	});

	const activityMap = new Map();

	const weekday = {
		count: 0,
		totalDist: 0
	};
	const weekend = {
		count: 0,
		totalDist: 0
	};

	tweet_array.forEach(twt => {
		const key = twt.activityType;
		if (key == "unknown") return;

		if (!activityMap.has(key)) {
			activityMap.set(key, [1, twt.distance]);
		} else {
			const [count, distance] = activityMap.get(key);
			const newAvg = (distance * count + twt.distance) / (count + 1);
			activityMap.set(key, [count + 1, newAvg]);
		}
		
		if (twt.dayOfWeek == "Saturday" || twt.dayOfWeek == "Sunday") {
			weekend.count++;
			weekend.totalDist += twt.distance;
		} else {
			weekday.count++;
			weekday.totalDist += twt.distance;
		}
	});

	const activitiesSorted = Array.from(activityMap.entries()).sort((a,b)=> b[1][0]-a[1][0]);
	const topThree = activitiesSorted.slice(0,3);

	document.getElementById("numberActivities").innerText = activityMap.size;
	document.getElementById("firstMost").innerText = topThree[0][0];
	document.getElementById("secondMost").innerText = topThree[1][0];
	document.getElementById("thirdMost").innerText = topThree[2][0];

	const topThreeSortedByAvgDist = topThree.sort((a,b)=> b[1][1]-a[1][1]);
	// console.log(topThreeSortedByAvgDist);

	document.getElementById("longestActivityType").innerText = topThreeSortedByAvgDist[0][0];
	document.getElementById("shortestActivityType").innerText = topThreeSortedByAvgDist[2][0];
	document.getElementById("weekdayOrWeekendLonger").innerText = ((weekday.totalDist/weekday.count) > (weekend.totalDist/weekend.count)) ? " the weekdays" : "the weekends";


	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": tweet_array.filter(twt => twt.activityType != "unknown")
	  },
	  //TODO: Add mark and encoding
		"mark": "bar",
		"encoding": {
			"x": {
				"field": "activityType", 
				"type": "nominal", 
				"title": "Activity Type",
				"sort": "-y"
			},
			"y": {
				"aggregate": "count", 
				"type": "quantitative", 
				"title": "Number of Tweets"
			}
		}
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.

	const topThreeArray = tweet_array.filter(twt => 
		topThree.map(a => a[0]).includes(twt.activityType))
		.map(twt => ({
			activityType: twt.activityType,
			dayOfWeek: twt.dayOfWeek,
			distance: twt.distance
		}));


	// console.log(topThreeArray);

	const distancesByWeekSpec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "Distances by Day of Week for Top 3 Activities.",
	  "data": {
	    "values": topThreeArray
	  },
	  //TODO: Add mark and encoding
		"mark": "point",
		"encoding": {
			"x": {
				"field": "dayOfWeek", 
				"type": "ordinal", 
				"title": "Day of the Week",
				"sort": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
			},
			"y": {
				"field": "distance", 
				"type": "quantitative", 
				"title": "Distance"
			},
			"color": {
				"field": "activityType", "type": "nominal", "title": "Activity"
			}
		}
	}

	vegaEmbed('#distanceVis', distancesByWeekSpec, {actions:false});

	const distancesAggMeanSpec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "Mean Distances by Day of Week for Top 3 Activities.",
	  "data": {
	    "values": topThreeArray
	  },
	  //TODO: Add mark and encoding
		"mark": "point",
		"encoding": {
			"x": {
				"field": "dayOfWeek", 
				"type": "ordinal", 
				"title": "Day of the Week",
				"sort": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
			},
			"y": {
				"aggregate": "mean", 
				"field": "distance",
				"type": "quantitative", 
				"title": "Mean Distance"
			}, 
			"color": {
				"field": "activityType", "type": "nominal", "title": "Activity"
			}

		}
	}

	let aggregate = false;
	document.getElementById("aggregate").addEventListener("click", () => {
		aggregate = !aggregate;
		const spec = aggregate ? distancesAggMeanSpec : distancesByWeekSpec;
		const text = aggregate ? "all Activities" : "means";
		document.getElementById("aggregate").innerText = "Show " + text;
		vegaEmbed('#distanceVis', spec, {actions:false});
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});