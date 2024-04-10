class Coffee {
    /**
     * @type {Object} metadata - the metadata object
     * @property {string} delimiter - the delimiter used in the CSV
     * @property {string} linebreak - the linebreak used in the CSV
     * @property {boolean} aborted - whether the parsing was aborted
     * @property {boolean} truncated - whether the parsing was truncated
     * @property {number} cursor - whe cursor position in the CSV
     * @property {string[]} fields - the fields in the CSV
     */
    static metadata = null;

    static countryUrlMap = {
        "United States": "https://static.miraheze.org/twowwiki/8/84/USA_flag.webp",
        "Canada": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Canada-flag.webp/1056px-Canada-flag.webp.png?20230905145706",
        "Hong Kong": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Flag_of_Hong_Kong.svg/1599px-Flag_of_Hong_Kong.svg.png?20210907030021",
        "Hawai'i": "https://upload.wikimedia.org/wikipedia/commons/c/cc/Flag_of_Hawaii.png",
        "Taiwan": "https://upload.wikimedia.org/wikipedia/commons/7/72/Flag_of_the_Republic_of_China.svg",
        "England": "https://upload.wikimedia.org/wikipedia/commons/b/be/Flag_of_England.svg",
        "Australia": "https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Australia_%28converted%29.svg",
        "Guatemala": "https://upload.wikimedia.org/wikipedia/commons/e/ec/Flag_of_Guatemala.svg",
        "Japan": "https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Japan.svg",
        "China": "https://upload.wikimedia.org/wikipedia/commons/f/fa/Flag_of_the_People%27s_Republic_of_China.svg",
        "Kenya": "https://upload.wikimedia.org/wikipedia/commons/4/49/Flag_of_Kenya.svg",
        "New Taiwan": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Flag_of_World_Taiwanese_Congress.svg/2880px-Flag_of_World_Taiwanese_Congress.svg.png",
        undefined: "https://upload.wikimedia.org/wikipedia/commons/5/50/Flag_with_question_mark.svg"
    };

    static roastToPic = {
        "Medium-Light": "/public/medium-light-roast.jpg",
        "Medium": "/public/medium-roast.jpg",
        "Light": "/public/light-roast.jpg",
        "Medium-Dark": "/public/dark-roast.jpeg",
        "Dark": "/public/extra-dark-roast.jpeg",
        undefined: "https://upload.wikimedia.org/wikipedia/commons/5/50/Flag_with_question_mark.svg"
    }
    

    /**
     * Sets the metadata object
     * @param {Object} metadataObject 
     */
    set metadata(metadataObject){
        Coffee.metadata = metadataObject;
    }

    /**
     * Sets the metadata object
     * @param {Object} coffee - the coffee data object
     * @param {boolean} userCreated - flag for if client user created Coffee object
     */
    constructor(coffee, userCreated = false){
        this.usdPrice = coffee['100g_USD'];
        this.countryLocation = coffee.loc_country;
        this.name = coffee.name;
        this.origin = coffee.origin;
        this.rating = coffee.rating;
        this.review = coffee.review;
        this.reviewDate = new Date(coffee.review_date);
        this.roast = coffee.roast;
        this.roaster = coffee.roaster;
        this.userCreated = userCreated;
    }

    getUsdPrice() {
        return '$' + this.usdPrice;
    }
    
    get imageUrl(){
        return Coffee.countryUrlMap[this.countryLocation];
    }

    get roastImageUrl(){
        return Coffee.roastToPic[this.roast];
    }

    getRating(){
        return `${this.rating} / 100`;
    }
}