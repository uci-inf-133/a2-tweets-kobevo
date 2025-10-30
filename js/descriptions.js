function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	tweet_array = runkeeper_tweets
		.map(twt => new Tweet(twt.text, twt.created_at))
		.filter(twt => twt.written && twt.source == "completed_event");
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table

	document.getElementById("textFilter").addEventListener("input", (e) => {
		const search = e.target.value.toLowerCase();
		const table = document.getElementById("tweetTable");
		const count = document.getElementById("searchCount");
		document.getElementById("searchText").innerText = e.target.value;

		if (search.trim() == "") {
			table.innerHTML = "";
			count.innerText = 0;
			return;
		}

		const filter = tweet_array.filter(twt => 
			twt.text.toLowerCase().includes(search)
		);

		count.innerText = filter.length;

		table.innerHTML = filter
			.map((twt, index) => twt.getHTMLTableRow(index + 1))
			.join("");

	})

}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});