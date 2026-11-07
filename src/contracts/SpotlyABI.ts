export const SPOTLY_ABI = [
  {
    inputs: [
      { internalType: "string", name: "field", type: "string" }
    ],
    name: "EmptyField",
    type: "error"
  },
  {
    inputs: [
      { internalType: "uint256", name: "placeId", type: "uint256" }
    ],
    name: "PlaceNotFound",
    type: "error"
  },
  {
    inputs: [
      { internalType: "uint256", name: "placeId", type: "uint256" }
    ],
    name: "PlaceAlreadyRemoved",
    type: "error"
  },
  {
    inputs: [
      { internalType: "uint256", name: "placeId", type: "uint256" },
      { internalType: "address", name: "caller", type: "address" }
    ],
    name: "NotPlaceAuthor",
    type: "error"
  },
  {
    inputs: [
      { internalType: "uint256", name: "placeId", type: "uint256" },
      { internalType: "address", name: "user", type: "address" }
    ],
    name: "AlreadyFavourited",
    type: "error"
  },
  {
    inputs: [
      { internalType: "uint256", name: "placeId", type: "uint256" },
      { internalType: "address", name: "user", type: "address" }
    ],
    name: "NotFavourited",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "placeId", type: "uint256" },
      { indexed: true, internalType: "address", name: "author", type: "address" },
      { indexed: false, internalType: "string", name: "name", type: "string" },
      { indexed: false, internalType: "string", name: "category", type: "string" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" }
    ],
    name: "PlaceSubmitted",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "placeId", type: "uint256" },
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" }
    ],
    name: "PlaceFavourited",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "placeId", type: "uint256" },
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" }
    ],
    name: "PlaceUnfavourited",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "placeId", type: "uint256" },
      { indexed: true, internalType: "address", name: "author", type: "address" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" }
    ],
    name: "PlaceRemoved",
    type: "event"
  },
  {
    inputs: [],
    name: "getAllPlaces",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "address", name: "author", type: "address" },
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "location", type: "string" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "string", name: "category", type: "string" },
          { internalType: "string", name: "imageUrl", type: "string" },
          { internalType: "uint256", name: "createdAt", type: "uint256" },
          { internalType: "uint256", name: "favouriteCount", type: "uint256" },
          { internalType: "bool", name: "exists", type: "bool" },
          { internalType: "bool", name: "isRemoved", type: "bool" }
        ],
        internalType: "struct Spotly.Place[]",
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "placeId", type: "uint256" }
    ],
    name: "getPlace",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "address", name: "author", type: "address" },
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "location", type: "string" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "string", name: "category", type: "string" },
          { internalType: "string", name: "imageUrl", type: "string" },
          { internalType: "uint256", name: "createdAt", type: "uint256" },
          { internalType: "uint256", name: "favouriteCount", type: "uint256" },
          { internalType: "bool", name: "exists", type: "bool" },
          { internalType: "bool", name: "isRemoved", type: "bool" }
        ],
        internalType: "struct Spotly.Place",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getTotalSubmissionsCount",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" }
    ],
    name: "getUserFavourites",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "address", name: "author", type: "address" },
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "location", type: "string" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "string", name: "category", type: "string" },
          { internalType: "string", name: "imageUrl", type: "string" },
          { internalType: "uint256", name: "createdAt", type: "uint256" },
          { internalType: "uint256", name: "favouriteCount", type: "uint256" },
          { internalType: "bool", name: "exists", type: "bool" },
          { internalType: "bool", name: "isRemoved", type: "bool" }
        ],
        internalType: "struct Spotly.Place[]",
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" },
      { internalType: "uint256", name: "placeId", type: "uint256" }
    ],
    name: "isFavourite",
    outputs: [
      { internalType: "bool", name: "", type: "bool" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "placeId", type: "uint256" }
    ],
    name: "removePlace",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "placeId", type: "uint256" }
    ],
    name: "saveFavourite",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "location", type: "string" },
      { internalType: "string", name: "description", type: "string" },
      { internalType: "string", name: "category", type: "string" },
      { internalType: "string", name: "imageUrl", type: "string" }
    ],
    name: "submitPlace",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "totalFavourites",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalPlaces",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "placeId", type: "uint256" }
    ],
    name: "unsaveFavourite",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const;

