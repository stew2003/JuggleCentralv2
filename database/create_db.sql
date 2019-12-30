-- all system users
CREATE TABLE users (
	uid INT NOT NULL AUTO_INCREMENT,
	timeCreated DATETIME,
	realName VARCHAR(64),
	name VARCHAR(64),
	email VARCHAR(64) UNIQUE,
	bio TEXT,
	isAdmin TINYINT(1) DEFAULT 0,
	score INT DEFAULT 0,			-- holistic measure of user's juggling skill
	userRank INT,					-- user's position in the leaderboard sorted / pooled by user score
	PRIMARY KEY (uid)
);

-- create index on users' names for search engine
CREATE FULLTEXT INDEX userIndex ON users(name);

-- juggling patterns
CREATE TABLE patterns (
	uid INT NOT NULL AUTO_INCREMENT,
	timeCreated DATETIME,
	name VARCHAR(32) UNIQUE,
	description TEXT,
	numObjects INT,					-- number of objects used in this pattern
	GIF VARCHAR(512),
	difficulty FLOAT,				-- relative difficulty of this pattern
	avgHighScoreCatch FLOAT,		-- average high score for catches in this pattern
	avgHighScoreTime FLOAT,			-- average high score for time in this pattern (ms)
	PRIMARY KEY (uid)
);

-- create index on pattern names & descriptions for search engine
CREATE FULLTEXT INDEX patternIndex ON patterns(name, description);

-- all reported attempts at events
CREATE TABLE records (
	uid INT NOT NULL AUTO_INCREMENT,
	userUID INT,
	patternUID INT,
	isPersonalBest TINYINT(1) DEFAULT 0,	-- is this record the user's personal best for this pattern (and for this scoring method)?
	score FLOAT,							-- ratio of this user's high score to the pattern high score
	recordRank INT,							-- position of this record in this pattern leaderboard sorted / pooled by duration / catches
	catches INT,							-- number of catches in this attempt (catch-based)
	duration TIME,							-- duration of this attempt (time-based)
	timeRecorded DATETIME,					-- when the record was added
	video VARCHAR(512),
	FOREIGN KEY (userUID) REFERENCES users(uid) ON DELETE CASCADE,
	FOREIGN KEY (patternUID) REFERENCES patterns(uid) ON DELETE CASCADE,
	PRIMARY KEY (uid)
);