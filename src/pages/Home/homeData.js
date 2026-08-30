export const highlights = [
  {
    title: 'Report Found Items Only',
    text: 'Found something missing in public? Post details so true Indian owners can claim it.',
  },
  {
    title: 'Public Claim Proofs',
    text: 'Claimants must submit proof details to verify true ownership.',
  },
  {
    title: 'Scammer & Fraud Tracking',
    text: 'False claims get publicly flagged on the Scammer Leaderboard.',
  },
]

export const steps = [
  'Create an account to report a found item or claim your property.',
  'Found an item? Post the Pexels photo, Indian location, and description.',
  'True owners verify ownership proof; scammers are publicly flagged on the Scammer Wall.',
]

export const scammerLeaderboard = [
  {
    id: 's-1',
    fullName: 'Rohan Verma',
    username: '@rohan_v99',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
    failedClaimsCount: 4,
    reason: 'Fake Amazon Invoice & Unmatched Serial #',
    status: 'Flagged Scammer 🚨'
  },
  {
    id: 's-2',
    fullName: 'Karan Malhotra',
    username: '@karan_m',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
    failedClaimsCount: 3,
    reason: 'Incorrect Wallet Contents & Brand',
    status: 'Suspicious Claimant ⚠️'
  },
  {
    id: 's-3',
    fullName: 'Vikramaditya Singh',
    username: '@vikram_s',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200',
    failedClaimsCount: 2,
    reason: 'Failed Engraving Verification',
    status: 'Under Review 🛑'
  }
]

export const samplePosts = [
  {
    id: 'post-1',
    type: 'FOUND',
    title: 'Titan Leather Wallet & Delhi Metro Smart Card',
    description: 'Found a brown bi-fold Titan leather wallet containing a Delhi Metro Smart Card near Connaught Place Metro station Gate 2 bench. Initial engraving PS on inner fold.',
    location: 'Connaught Place Metro Station, New Delhi',
    timeAgo: '2 hours ago',
    finder: {
      name: 'Priya Sharma',
      handle: '@priya_s',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    image: 'https://images.pexels.com/photos/915915/pexels-photo-915915.jpeg?auto=compress&cs=tinysrgb&w=800',
    claims: [
      {
        id: 'claim-1',
        user: 'Aarav Mehta',
        avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200',
        time: '1 hour ago',
        status: 'PENDING_VERIFICATION',
        note: 'Lost my brown Titan wallet near Gate 2 at 2 PM! Has my Delhi Metro pass ending in #4092 and HDFC debit card.'
      },
      {
        id: 'claim-2',
        user: 'Ananya Iyer',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
        time: '30 mins ago',
        status: 'UNDER_REVIEW',
        note: 'Might be my brother’s wallet. It has an initial PS stamp inside.'
      }
    ],
    comments: [
      {
        id: 'c-1',
        user: 'Rajesh Kumar',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
        time: '1h 45m ago',
        text: 'Did you hand it over to Delhi Metro CISF security desk or holding safe?'
      },
      {
        id: 'c-2',
        user: 'Priya Sharma',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
        time: '1h 30m ago',
        text: 'Holding it safely! Please submit claim proof above with exact card details so we can arrange meet.'
      }
    ]
  },
  {
    id: 'post-2',
    type: 'FOUND',
    title: 'Royal Enfield Bike Key & Brass Ring',
    description: 'Found a set of keys on a brass ring with a Royal Enfield leather key fob while walking near Bandra West Carter Road promenade.',
    location: 'Bandra West Promenade, Mumbai',
    timeAgo: '4 hours ago',
    finder: {
      name: 'Vikramaditya Reddy',
      handle: '@vikram_r',
      avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    image: 'https://images.pexels.com/photos/101808/pexels-photo-101808.jpeg?auto=compress&cs=tinysrgb&w=800',
    claims: [
      {
        id: 'claim-3',
        user: 'Siddharth Kapoor',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=200',
        time: '2 hours ago',
        status: 'PENDING_VERIFICATION',
        note: 'Dropped my RE Meteor keys near Carter Road juice center at 5:30 PM! Key ring has a brown leather strap.'
      }
    ],
    comments: [
      {
        id: 'c-3',
        user: 'Sneha Kulkarni',
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200',
        time: '3 hours ago',
        text: 'Handed to nearby police booth or holding onto it?'
      }
    ]
  },
  {
    id: 'post-3',
    type: 'FOUND',
    title: 'OnePlus Wireless Earbuds & Charging Case',
    description: 'Found white OnePlus Nord wireless earbuds in a charging case on Platform 1 bench at Hitec City Metro Station.',
    location: 'Hitec City Metro Station, Hyderabad',
    timeAgo: '6 hours ago',
    finder: {
      name: 'Sneha Kulkarni',
      handle: '@sneha_k',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=800',
    claims: [],
    comments: [
      {
        id: 'c-4',
        user: 'Sneha Kulkarni',
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200',
        time: '5 hours ago',
        text: 'Found on bench at 9 AM. True owner please claim above with Bluetooth name / serial number proof!'
      }
    ]
  }
]
