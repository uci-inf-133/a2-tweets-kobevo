class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        const str = this.text.toLowerCase();

        if (str.startsWith("just completed") || str.includes("complete") || str.includes("post")) {
            return "completed_event";
        }

        if (str.includes("live") || str.includes("watch") || str.includes("right now") || str.includes("now")) {
            return "live_event";
        }

        if (str.includes("new") || str.includes("personal best") || str.includes("record") || str.includes("best") || str.includes("fastest")) {
            return "achievement";
        }
        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
       let str = this.text
                    .replace(/#RunKeeper/gi, "")
                    .replace(/https?:\/\/\S+/g, "")
                    .trim();

        if (this.text.toLowerCase().startsWith("just completed") || this.text.toLowerCase().startsWith("just posted")) {
            const parts = this.text.split(/-|—/);
            return parts.length > 1 && parts[1].trim().length > 0;
        }

        return true;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        let str = this.text
                    .replace(/#RunKeeper/gi, "")
                    .replace(/https?:\/\/\S+/g, "")
                    .trim();

        const parts = this.text.split(/-|—/);
        return parts[1].trim();
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        
        const str = this.text.toLowerCase();

        const activities = [
            "walk", "bike", "hike", "swim", "row", "elliptical", "ski", "yoga", "run"
        ];

        for (let i = 0; i < activities.length; ++i) {
            if (str.includes(activities[i])) {
                return activities[i];
            }
        }

        return "other";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }

        const str = this.text.toLowerCase();

        //TODO: prase the distance from the text of the tweet
        const match = str.match(/([\d.]+\s*(mi|km))/i);

        if (!match) return 0;

        let distance = parseFloat(match[1]);
        const unit = match[2].toLowerCase();
        if (unit == "km") distance = distance / 1.609;
        return distance;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return `
            <tr>
                <th scope="row"> ${rowNumber}</th>
                <td> ${this.activityType} </td>
                <td> ${this.text} </td>
            </tr>
        `;
    }
}