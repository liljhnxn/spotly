// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Spotly
 * @notice Decentralized place-discovery platform where users share interesting places,
 * hidden gems, and locations worth visiting.
 */
contract Spotly {
    struct Place {
        uint256 id;
        address author;
        string name;
        string location;
        string description;
        string category;
        string imageUrl; // optional
        uint256 createdAt;
        uint256 favouriteCount;
        bool exists;
        bool isRemoved;
    }

    // Counters
    uint256 private _placeIdCounter;
    uint256 public totalPlaces; // active places count
    uint256 public totalFavourites; // total favourites count across all active places

    // Mappings
    // placeId => Place
    mapping(uint256 => Place) public places;

    // user => placeId => isFavourite
    mapping(address => mapping(uint256 => bool)) public hasFavourited;

    // user => list of favourited placeIds
    mapping(address => uint256[]) private _userFavourites;

    // Events
    event PlaceSubmitted(
        uint256 indexed placeId,
        address indexed author,
        string name,
        string category,
        uint256 timestamp
    );

    event PlaceFavourited(
        uint256 indexed placeId,
        address indexed user,
        uint256 timestamp
    );

    event PlaceUnfavourited(
        uint256 indexed placeId,
        address indexed user,
        uint256 timestamp
    );

    event PlaceRemoved(
        uint256 indexed placeId,
        address indexed author,
        uint256 timestamp
    );

    // Custom errors
    error EmptyField(string field);
    error PlaceNotFound(uint256 placeId);
    error PlaceAlreadyRemoved(uint256 placeId);
    error NotPlaceAuthor(uint256 placeId, address caller);
    error AlreadyFavourited(uint256 placeId, address user);
    error NotFavourited(uint256 placeId, address user);

    /**
     * @notice Submits a new place to Spotly.
     * @param name Name of the place (required)
     * @param location Geographical location or address (required)
     * @param description Narrative description or why it's worth visiting (required)
     * @param category One of the platform categories (required)
     * @param imageUrl Optional photo/image link
     * @return placeId The assigned unique identifier of the place
     */
    function submitPlace(
        string calldata name,
        string calldata location,
        string calldata description,
        string calldata category,
        string calldata imageUrl
    ) external returns (uint256) {
        if (bytes(name).length == 0) revert EmptyField("name");
        if (bytes(location).length == 0) revert EmptyField("location");
        if (bytes(description).length == 0) revert EmptyField("description");
        if (bytes(category).length == 0) revert EmptyField("category");

        _placeIdCounter++;
        uint256 placeId = _placeIdCounter;

        places[placeId] = Place({
            id: placeId,
            author: msg.sender,
            name: name,
            location: location,
            description: description,
            category: category,
            imageUrl: imageUrl,
            createdAt: block.timestamp,
            favouriteCount: 0,
            exists: true,
            isRemoved: false
        });

        totalPlaces++;

        emit PlaceSubmitted(placeId, msg.sender, name, category, block.timestamp);
        return placeId;
    }

    /**
     * @notice Allows an author to remove their submitted place.
     * @param placeId Identifier of the place to remove
     */
    function removePlace(uint256 placeId) external {
        Place storage place = places[placeId];
        if (!place.exists) revert PlaceNotFound(placeId);
        if (place.isRemoved) revert PlaceAlreadyRemoved(placeId);
        if (place.author != msg.sender) revert NotPlaceAuthor(placeId, msg.sender);

        place.isRemoved = true;
        totalPlaces--;

        // Decrement global favourites by this place's favourite count
        if (totalFavourites >= place.favouriteCount) {
            totalFavourites -= place.favouriteCount;
        } else {
            totalFavourites = 0;
        }

        emit PlaceRemoved(placeId, msg.sender, block.timestamp);
    }

    /**
     * @notice Saves a place to caller's favourites.
     * @param placeId Identifier of the place to favourite
     */
    function saveFavourite(uint256 placeId) external {
        Place storage place = places[placeId];
        if (!place.exists || place.isRemoved) revert PlaceNotFound(placeId);
        if (hasFavourited[msg.sender][placeId]) revert AlreadyFavourited(placeId, msg.sender);

        hasFavourited[msg.sender][placeId] = true;
        _userFavourites[msg.sender].push(placeId);
        place.favouriteCount++;
        totalFavourites++;

        emit PlaceFavourited(placeId, msg.sender, block.timestamp);
    }

    /**
     * @notice Removes a place from caller's favourites.
     * @param placeId Identifier of the place to unfavourite
     */
    function unsaveFavourite(uint256 placeId) external {
        Place storage place = places[placeId];
        if (!place.exists) revert PlaceNotFound(placeId);
        if (!hasFavourited[msg.sender][placeId]) revert NotFavourited(placeId, msg.sender);

        hasFavourited[msg.sender][placeId] = false;
        if (place.favouriteCount > 0) {
            place.favouriteCount--;
        }
        if (totalFavourites > 0) {
            totalFavourites--;
        }

        // Clean up from user favourites array
        uint256[] storage userFavs = _userFavourites[msg.sender];
        uint256 len = userFavs.length;
        for (uint256 i = 0; i < len; i++) {
            if (userFavs[i] == placeId) {
                userFavs[i] = userFavs[len - 1];
                userFavs.pop();
                break;
            }
        }

        emit PlaceUnfavourited(placeId, msg.sender, block.timestamp);
    }

    /**
     * @notice Returns all active (non-removed) places.
     */
    function getAllPlaces() external view returns (Place[] memory) {
        uint256 count = totalPlaces;
        Place[] memory activePlaces = new Place[](count);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= _placeIdCounter; i++) {
            if (places[i].exists && !places[i].isRemoved) {
                activePlaces[currentIndex] = places[i];
                currentIndex++;
                if (currentIndex == count) break;
            }
        }

        return activePlaces;
    }

    /**
     * @notice Returns total submissions count historically.
     */
    function getTotalSubmissionsCount() external view returns (uint256) {
        return _placeIdCounter;
    }

    /**
     * @notice Returns all active places favourited by a specific user.
     */
    function getUserFavourites(address user) external view returns (Place[] memory) {
        uint256[] storage userFavs = _userFavourites[user];
        uint256 count = 0;
        for (uint256 i = 0; i < userFavs.length; i++) {
            uint256 pid = userFavs[i];
            if (places[pid].exists && !places[pid].isRemoved && hasFavourited[user][pid]) {
                count++;
            }
        }

        Place[] memory favPlaces = new Place[](count);
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < userFavs.length; i++) {
            uint256 pid = userFavs[i];
            if (places[pid].exists && !places[pid].isRemoved && hasFavourited[user][pid]) {
                favPlaces[currentIndex] = places[pid];
                currentIndex++;
            }
        }
        return favPlaces;
    }

    /**
     * @notice Returns whether a specific user has favourited a specific place.
     */
    function isFavourite(address user, uint256 placeId) external view returns (bool) {
        return hasFavourited[user][placeId];
    }

    /**
     * @notice Returns a single place by ID.
     */
    function getPlace(uint256 placeId) external view returns (Place memory) {
        Place memory place = places[placeId];
        if (!place.exists) revert PlaceNotFound(placeId);
        return place;
    }
}

