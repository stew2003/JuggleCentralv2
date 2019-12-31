/* eslint-disable import/no-extraneous-dependencies */
const casual = require('casual')
const moment = require('moment')
const pool = require('./queries/connection')
const userController = require('./queries/users')
const patternController = require('./queries/patterns')

const uniquify = (array) => {
  return [...new Set(array)]
}

// random user data
const random = {
  names: uniquify([
    'Alexandra Wiley',
    'Lizbeth Flores',
    'Tara Wilkinson',
    'Jolie Morgan',
    'Karlee Mccormick',
    'Brisa Trujillo',
    'Makenzie Sellers',
    'Anabelle Horton',
    'Ramiro Pratt',
    'Callie Gibson',
    'Rebecca Henderson',
    'Naomi Hill',
    'Jayce Benton',
    'Ramon Payne',
    'Giovani Ellison',
    'Libby Gonzalez',
    'Reagan Moran',
    'Abdiel Santos',
    'Kyler Alvarez',
    'Rayne Woodward',
    'Teagan Osborn',
    'Hana Cobb',
    'Pablo Mcfarland',
    'Andy Winters',
    'Marley Davies',
    'Arely Berger',
    'Kianna Boyle',
    'Rashad Crane',
    'Mary Foley',
    'Yaretzi Schultz',
    'Anderson Mora',
    'Bernard Mcknight',
    'Adeline Potts',
    'Angelica Robbins',
    'Salvador Ballard',
    'Tate Franklin',
    'Emerson Myers',
    'Samuel Sexton',
    'Aniyah Maxwell',
    'Tatum Gould',
    'Justine Baxter',
    'Corbin Giles',
    'Jamar Allison',
    'Jaidyn Kane',
    'Nico Graves',
    'Lilianna Hernandez',
    'Breanna Pratt',
    'Zoe Branch',
    'Marianna Huffman',
    'Davin Lopez',
    'Henry Hebert',
    'Anabella George',
    'Darion Fritz',
    'Demetrius Mckinney',
    'Madelynn Stewart',
    'Jaylene Summers',
    'Kayla Cline',
    'Krystal Schaefer',
    'Rogelio Keller',
    'Garrett West',
    'Alyssa Mcconnell',
    'Evan Chang',
    'Alejandro Gonzales',
    'Tomas Barnes',
    'Eve Hubbard',
    'Asher Mccall',
    'Louis Hess',
    'Avah Knox',
    'Gustavo Munoz',
    'Kai Yates',
    'Meadow Hodge',
    'Beau Byrd',
    'Cristina Booker',
    'Angelina Church',
    'Duncan Lucas',
    'Ari Beard',
    'Kole Blevins',
    'Adison Mason',
    'Jessie Shelton',
    'Troy Franco',
    'Livia Vincent',
    'Preston Nunez',
    'Susan Johnston',
    'Harper Brady',
    'Scarlet Moses',
    'Kale Garrison',
    'Belen Blake',
    'Jerimiah Robles',
    'Damaris Berry',
    'Mekhi Faulkner',
    'Ainsley Mata',
    'Katrina Gibbs',
    'Lucian Hudson',
    'Jeramiah Cuevas',
    'Brady Thornton',
    'Vincent Ball',
    'Makai Jefferson',
    'Micheal Mccann',
    'Fiona Tyler',
    'Bo Smith'
  ]),
  emails: uniquify([
    'ahuillet@live.com',
    'larry@comcast.net',
    'melnik@outlook.com',
    'emmanuel@verizon.net',
    'calin@att.net',
    'guialbu@outlook.com',
    'meder@live.com',
    'wildfire@gmail.com',
    'ralamosm@att.net',
    'daveed@gmail.com',
    'schwaang@mac.com',
    'ilial@optonline.net',
    'glenz@gmail.com',
    'munson@me.com',
    'dougj@gmail.com',
    'ubergeeb@outlook.com',
    'amimojo@msn.com',
    'keijser@att.net',
    'dawnsong@msn.com',
    'ryanshaw@optonline.net',
    'dowdy@optonline.net',
    'telbij@live.com',
    'heine@aol.com',
    'kjohnson@gmail.com',
    'ilyaz@gmail.com',
    'evilopie@msn.com',
    'rcwil@gmail.com',
    'chaki@aol.com',
    'daveewart@icloud.com',
    'subir@icloud.com',
    'mbalazin@att.net',
    'credmond@gmail.com',
    'gordonjcp@optonline.net',
    'mhanoh@mac.com',
    'maikelnai@me.com',
    'kaiser@sbcglobal.net',
    'goresky@me.com',
    'emcleod@optonline.net',
    'kdawson@yahoo.com',
    'jespley@verizon.net',
    'henkp@optonline.net',
    'kwilliams@hotmail.com',
    'pdbaby@hotmail.com',
    'squirrel@msn.com',
    'chlim@live.com',
    'bartak@me.com',
    'fatelk@aol.com',
    'oracle@sbcglobal.net',
    'suresh@live.com',
    'techie@yahoo.ca',
    'cumarana@live.com',
    'bigmauler@optonline.net',
    'gtewari@outlook.com',
    'jshirley@verizon.net',
    'aardo@verizon.net',
    'hachi@icloud.com',
    'rnewman@outlook.com',
    'sburke@optonline.net',
    'brainless@me.com',
    'shaffei@optonline.net',
    'kspiteri@comcast.net',
    'mgreen@sbcglobal.net',
    'uncle@me.com',
    'ideguy@comcast.net',
    'seasweb@yahoo.ca',
    'roamer@optonline.net',
    'cremonini@msn.com',
    'nelson@icloud.com',
    'zeitlin@icloud.com',
    'bachmann@optonline.net',
    'itstatus@live.com',
    'tskirvin@att.net',
    'dawnsong@hotmail.com',
    'jlbaumga@yahoo.ca',
    'sartak@verizon.net',
    'boein@yahoo.com',
    'ehood@optonline.net',
    'rbarreira@verizon.net',
    'sburke@yahoo.ca',
    'ovprit@hotmail.com',
    'iapetus@icloud.com',
    'fraser@gmail.com',
    'panolex@optonline.net',
    'sarahs@comcast.net',
    'jugalator@outlook.com',
    'jschauma@sbcglobal.net',
    'aprakash@optonline.net',
    'sacraver@mac.com',
    'william@optonline.net',
    'agapow@att.net',
    'lamprecht@icloud.com',
    'kohlis@live.com',
    'horrocks@icloud.com',
    'mfburgo@aol.com',
    'jrkorson@comcast.net',
    'leocharre@aol.com',
    'nwiger@msn.com',
    'ateniese@msn.com',
    'sravani@att.net',
    'trieuvan@yahoo.com'
  ]),
  patterns: uniquify([
    'Alex',
    "Al's Slide",
    'Arrow of Asai',
    'Backcrosses',
    'Boston Mess',
    'Cherry Picker',
    'Boston Shuffle',
    "Burke's Slam",
    "Peter's Shuffle",
    'Box',
    'Bizarre Box',
    'Broken Box',
    'Burst Box',
    'Extended Box',
    "Gilligan's Box",
    "Karas' Box",
    "Luke's Shuffle",
    'N-Box',
    'Inverted Box',
    "Penman's Box",
    'Swap Box',
    'Switched Box',
    'Threaded Box',
    'True Box',
    'Underarm Box',
    "Burke's Barrage",
    'Takeouts',
    'Cascade',
    'Reverse Cascade',
    'High-Low Var.',
    'Chops',
    'Reverse Chops',
    'Columns',
    'Box Variation',
    'Crossunder',
    'Infinity',
    "Matt's Mess",
    'Overthrow Var.',
    'Rainbow Cross',
    'Reverse Crossunder',
    'Reverse Infinity',
    'Shower Variation',
    'Shuffle-Switch',
    'Crossed-Arm Cascade',
    'Reverse Variation',
    "David's Dilemma",
    'Fake Columns',
    'Yo-Yo',
    'Oy-Oy',
    'Factory',
    'Crossed-Arm Var.',
    "Relf's Factory",
    'Reverse Factory',
    'Zebra Factory',
    'Flying Disco Drop',
    'Follow',
    'Forklift',
    'Frantic Cascade',
    'Frostbite',
    'Georgian Scuffle',
    'Symmetric Var.',
    'Georgian Shuffle',
    'Buffalo Shuffle',
    'Davenport Shuffle',
    'Singapore Shuffle',
    'Symmetric Var.',
    'Grace',
    'Half-Shower',
    'Hands of Time',
    "Harrison's Hang",
    'Icelandic Shuffle',
    'Inverted Shower',
    'Jeanne',
    "Juggler's Tennis",
    "Kato's Crux",
    'King of Hearts',
    'Kingston Shuffle',
    'Kraken',
    'Levels',
    "Luke's Lobotomy",
    "Maka's Mess",
    "Mangham's Mangle",
    "Marden's Marvel",
    "Mike's Mess",
    'Mills Mess',
    '441 Mills Mess',
    '531 Mills Mess',
    'Charley',
    'Fake Mess',
    'Flipped Mess',
    "Flo's Mess",
    'Half-Mess',
    'Reverse Mills Mess',
    'Mills Mess Shower',
    "Nelson's Nemesis",
    'Olas',
    'Compressed Olas',
    "Orka's Mess",
    'Pendulum Drop',
    "Penman's Pandemonium",
    "Relf's Revenge",
    "Relf's Revenge 6",
    "Relf's Rubensteins",
    "Ripley's Rainbow",
    "Rolf's Wave",
    "Romeo's Revenge",
    "Rubenstein's Revenge",
    'Sandbox Shuffle',
    'Frances',
    'Shower',
    'Broken Shower',
    'Crossed-Arm Shower',
    'High-Low Var.',
    'Reverse Crossed-Arm Shower',
    'Swap Variation',
    'Underarm Var.',
    'Shower Cascade',
    'Shuffle',
    'Low Shuffle',
    "Shuffler's Mess",
    'Snake',
    'Statue of Liberty',
    'Takearound',
    'Three In One',
    "Tom's Trick",
    'Triazzle',
    'Truffle Shuffle',
    'Weave',
    'Orinoco Flow',
    'Windmill',
    'Chop Shower',
    '423',
    'The W',
    '441 (Half-Box)',
    'Reverse 441',
    '531'
  ]),
  gifs: uniquify([
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/3-ball_cascade_movie.gif/100px-3-ball_cascade_movie.gif',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Douche3b.gif/100px-Douche3b.gif',
    'https://vignette.wikia.nocookie.net/juggle/images/4/41/51_200.gif/revision/latest?cb=20120610183333',
    'https://vignette.wikia.nocookie.net/juggle/images/7/7e/40_out_200.gif/revision/latest?cb=20120609011200',
    'https://vignette.wikia.nocookie.net/juggle/images/e/e5/3_rev_200.gif/revision/latest?cb=20120708181911',
    'https://vignette.wikia.nocookie.net/juggle/images/3/33/44_sync_rev_200.gif/revision/latest?cb=20120708183841',
    'https://vignette.wikia.nocookie.net/juggle/images/8/8c/5O3I_200.gif/revision/latest?cb=20120612192808',
    'https://vignette.wikia.nocookie.net/juggle/images/5/5f/3O3I_200.gif/revision/latest?cb=20120612192529'
  ])
}

const NUM_USERS = 35
const NUM_ADMINS = 5
const NUM_PATTERNS = 30

const P_BIO = 0.7
const P_DESCRIP = 0.8
const P_GIF = 0.75
const P_VIDEO = 0.45
const PARTICIPATION = 0.6 // percent participation in each pattern of users
const MAX_NUM_ATTEMPTS = 50 // max number of attempts at a given pattern

if (NUM_USERS + NUM_ADMINS > random.names.length)
  throw new Error('Too many users requested.')
if (NUM_PATTERNS > random.patterns.length)
  throw new Error('Too many patterns requested.')

// get a random date string
const randomTime = () => {
  return moment()
    .subtract(Math.floor(Math.random() * 12), 'months')
    .subtract(Math.floor(Math.random() * 30), 'days')
    .subtract(Math.floor(Math.random() * 30), 'hours')
    .subtract(Math.floor(Math.random() * 30), 'minutes')
    .format('YYYY-MM-DD HH:mm:ss')
}

// get a random actual juggling pattern GIF
const randomGIF = () => {
  return random.gifs[Math.floor(Math.random() * random.gifs.length)]
}

// generate a list of random users
const generateUsers = () => {
  const possible = []
  for (let i = 0; i < random.names.length; i++) {
    possible.push(i)
  }

  const users = []

  // for the requested amount of users
  for (let i = 0; i < NUM_USERS + NUM_ADMINS; i++) {
    // choose random index in possible indices
    const rand = Math.floor(Math.random() * possible.length)

    const name = random.names[possible[rand]]

    // add new random user [name, email, bio, isAdmin]
    users.push([
      randomTime(),
      name,
      random.emails[possible[rand]],
      Math.random() < P_BIO ? casual.sentence : null,
      i < NUM_ADMINS
    ])

    // remove the index as a possibility
    possible.splice(rand, 1)
  }

  return users
}

// generate random patterns
const generatePatterns = () => {
  const possible = []
  for (let i = 0; i < random.patterns.length; i++) {
    possible.push(i)
  }

  const patterns = []

  // for each requested pattern
  for (let i = 0; i < NUM_PATTERNS; i++) {
    // choose random index in possible indices
    const rand = Math.floor(Math.random() * possible.length)

    // [timeCreated, name, description, numObjects, GIF]
    patterns.push([
      randomTime(),
      random.patterns[possible[rand]],
      Math.random() < P_DESCRIP ? casual.sentence : null,
      Math.floor(Math.random() * 13) + 2,
      Math.random() < P_GIF ? randomGIF() : null
    ])

    // remove index as possibility
    possible.splice(rand, 1)
  }

  return patterns
}

// generate random records, assuming users and patterns already exist in DB
const generateRecords = async () => {
  // get users
  try {
    const users = await userController.getAll()
    const patterns = await patternController.getAll()
    const records = []

    // for each user
    for (let u = 0; u < users.length; u++) {
      for (let p = 0; p < patterns.length; p++) {
        // if user participating in this pattern
        if (Math.random() < PARTICIPATION) {
          const catchAttempts = Math.floor(Math.random() * MAX_NUM_ATTEMPTS) + 5
          const timeAttempts = Math.floor(Math.random() * MAX_NUM_ATTEMPTS) + 5

          let catchScore =
            Math.floor(Math.random() * 20) + patterns[p].numObjects
          const timeScore = {
            hours: 0,
            minutes: 1,
            seconds: 0
          }

          // for each of this user's catch attempts
          for (let r = 0; r < catchAttempts; r++) {
            const timeRecorded = randomTime()

            // add random record
            records.push([
              users[u].uid,
              patterns[p].uid,
              r === catchAttempts - 1,
              catchScore,
              null,
              timeRecorded,
              Math.random() < P_VIDEO ? casual.url : null
            ])

            // increase catch score randomly
            catchScore += Math.floor(Math.random() * 20)
          }

          // for each of this user's time attempts at this pattern
          for (let r = 0; r < timeAttempts; r++) {
            const timeRecorded = randomTime()

            // add random record
            records.push([
              users[u].uid,
              patterns[p].uid,
              r === timeAttempts - 1,
              null,
              `${timeScore.hours}:${timeScore.minutes}:${timeScore.seconds}`,
              timeRecorded,
              Math.random() < P_VIDEO ? casual.url : null
            ])

            // increase seconds of time score randomly
            timeScore.seconds += Math.floor(Math.random() * 60)

            // keep track of time accordingly
            if (timeScore.seconds >= 60) {
              timeScore.seconds %= 60
              timeScore.minutes++

              if (timeScore.minutes >= 60) {
                timeScore.hours++
              }
            }
          }
        }
      }
    }
    return records
  } catch (err) {
    throw err
  }
}

const main = async () => {
  try {
    await pool.query(
      `DELETE FROM users; ALTER TABLE users AUTO_INCREMENT = 1;
      DELETE FROM patterns; ALTER TABLE patterns AUTO_INCREMENT = 1;
      DELETE FROM records; ALTER TABLE records AUTO_INCREMENT = 1;`
    )
    await pool.query(
      `INSERT INTO users (timeCreated, name, email, bio, isAdmin) VALUES
        (NOW(), "Thomas Castleman", "thomascastleman0@gmail.com", "I am a jugl", 1),
        (NOW(), "Stewart Morris", "stewshadow@gmail.com", "I am a juggler", 1);`
    )

    // generate random user profiles
    const users = generateUsers()

    // generate random juggling patterns
    const patterns = generatePatterns()

    // insert generated profiles
    process.stdout.write(
      `Adding ${NUM_USERS + NUM_ADMINS} random user profiles... `
    )
    await pool.query(
      'INSERT INTO users (timeCreated, name, email, bio, isAdmin) VALUES ?;',
      [users]
    )
    console.log('Done.')

    // insert generated patterns
    process.stdout.write(`Adding ${NUM_PATTERNS} random juggling patterns... `)
    await pool.query(
      'INSERT INTO patterns (timeCreated, name, description, numObjects, GIF) VALUES ?;',
      [patterns]
    )
    console.log('Done.')

    process.stdout.write('Adding random records... ')
    const records = await generateRecords()
    await pool.query(
      'INSERT INTO records (userUID, patternUID, isPersonalBest, catches, duration, timeRecorded, video) VALUES ?;',
      [records]
    )
    console.log('Done.')
    console.log('Test data complete.')
    process.exit(0)
  } catch (err) {
    throw err
  }
}

main()
