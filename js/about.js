function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	

	const tweetSorted = tweet_array.sort((a,b)=> {
		if (a.time < b.time) return -1;
		if (a.time > b.time) return 1;
		return 0;
	})

	const earliest = tweetSorted[0].time;
	const latest = tweetSorted[tweet_array.length - 1].time;

	const options = {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	}

	document.getElementById('firstDate').innerText = earliest.toLocaleDateString('en-US', options);
	document.getElementById('lastDate').innerText = latest.toLocaleDateString('en-US', options);

	let completed_event = 0;
	let live_event = 0;
	let achievement = 0;
	let miscellaneous = 0;

	tweet_array.forEach(twt => {
		switch (twt.source) {
			case "completed_event":
				completed_event++;
				break;
			case "live_event":
				live_event++;
				break;
			case "achievement":
				achievement++;
				break;
			case "miscellaneous":
				miscellaneous++;
				break;
		}
	});

	const total = tweet_array.length;
	document.querySelectorAll(".completedEvents").forEach(e => {
		e.innerText = completed_event;
	});
	document.querySelector(".completedEventsPct").innerText = ((completed_event / total) * 100).toFixed(2) + "%";

	document.querySelector(".liveEvents").innerText = live_event;
	document.querySelector(".liveEventsPct").innerText = ((live_event / total) * 100).toFixed(2) + "%";
	
	document.querySelector(".achievements").innerText = achievement;
	document.querySelector(".achievementsPct").innerText = ((achievement / total) * 100).toFixed(2) + "%";

	document.querySelector(".miscellaneous").innerText = miscellaneous;
	document.querySelector(".miscellaneousPct").innerText = ((miscellaneous / total) * 100).toFixed(2) + "%";
	
	const written = tweet_array.filter(twt => twt.written).length;
	document.querySelector(".written").innerText = written;
	document.querySelector(".writtenPct").innerText = ((written / total) * 100).toFixed(2) + "%";
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});