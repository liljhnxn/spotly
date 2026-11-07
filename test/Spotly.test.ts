import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;
import { Spotly } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("Spotly Smart Contract", function () {
  let spotly: Spotly;
  let owner: HardhatEthersSigner;
  let alice: HardhatEthersSigner;
  let bob: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, alice, bob] = await ethers.getSigners();
    const SpotlyFactory = await ethers.getContractFactory("Spotly");
    spotly = (await SpotlyFactory.deploy()) as Spotly;
    await spotly.waitForDeployment();
  });

  describe("Deployment", function () {
    it("should initialize with zero places and zero favourites", async function () {
      expect(await spotly.totalPlaces()).to.equal(0);
      expect(await spotly.totalFavourites()).to.equal(0);
      expect(await spotly.getTotalSubmissionsCount()).to.equal(0);
      const places = await spotly.getAllPlaces();
      expect(places.length).to.equal(0);
    });
  });

  describe("Submitting Places", function () {
    it("should allow a user to submit a place with an image URL", async function () {
      const tx = await spotly.connect(alice).submitPlace(
        "Kinkaku-ji (Golden Pavilion)",
        "Kyoto, Japan",
        "A Zen Buddhist temple covered in gold leaf, reflecting seamlessly on the mirror pond.",
        "Hidden Gems",
        "https://images.unsplash.com/photo-1503899036084-c55cdd92da26"
      );

      await expect(tx)
        .to.emit(spotly, "PlaceSubmitted")
        .withArgs(1, alice.address, "Kinkaku-ji (Golden Pavilion)", "Hidden Gems", (val: any) => typeof val === "bigint" || typeof val === "number");

      expect(await spotly.totalPlaces()).to.equal(1);
      expect(await spotly.getTotalSubmissionsCount()).to.equal(1);

      const place = await spotly.getPlace(1);
      expect(place.id).to.equal(1);
      expect(place.name).to.equal("Kinkaku-ji (Golden Pavilion)");
      expect(place.location).to.equal("Kyoto, Japan");
      expect(place.description).to.equal("A Zen Buddhist temple covered in gold leaf, reflecting seamlessly on the mirror pond.");
      expect(place.category).to.equal("Hidden Gems");
      expect(place.imageUrl).to.equal("https://images.unsplash.com/photo-1503899036084-c55cdd92da26");
      expect(place.author).to.equal(alice.address);
      expect(place.favouriteCount).to.equal(0);
      expect(place.isRemoved).to.be.false;
      expect(place.exists).to.be.true;
    });

    it("should allow a user to submit a place without an image URL (optional)", async function () {
      await spotly.connect(bob).submitPlace(
        "Le Panoramic",
        "Chamonix, France",
        "A mountaintop dining spot with 360-degree views of Mont-Blanc.",
        "Restaurants",
        "" // optional empty image URL
      );

      const place = await spotly.getPlace(1);
      expect(place.imageUrl).to.equal("");
      expect(place.author).to.equal(bob.address);
    });

    it("should revert if required fields are empty", async function () {
      await expect(
        spotly.connect(alice).submitPlace("", "Paris", "Desc", "Restaurants", "")
      ).to.be.revertedWithCustomError(spotly, "EmptyField").withArgs("name");

      await expect(
        spotly.connect(alice).submitPlace("Cafe", "", "Desc", "Restaurants", "")
      ).to.be.revertedWithCustomError(spotly, "EmptyField").withArgs("location");

      await expect(
        spotly.connect(alice).submitPlace("Cafe", "Paris", "", "Restaurants", "")
      ).to.be.revertedWithCustomError(spotly, "EmptyField").withArgs("description");

      await expect(
        spotly.connect(alice).submitPlace("Cafe", "Paris", "Desc", "", "")
      ).to.be.revertedWithCustomError(spotly, "EmptyField").withArgs("category");
    });
  });

  describe("Favouriting and Unfavouriting Places", function () {
    beforeEach(async function () {
      await spotly.connect(alice).submitPlace(
        "Grand Canyon",
        "Arizona, USA",
        "Massive natural gorge carved by the Colorado River.",
        "Nature",
        "https://images.unsplash.com/photo-1527334919515-b8dee906a34b"
      );
    });

    it("should allow a user to favourite a place and increment counters", async function () {
      const tx = await spotly.connect(bob).saveFavourite(1);

      await expect(tx)
        .to.emit(spotly, "PlaceFavourited")
        .withArgs(1, bob.address, (val: any) => typeof val === "bigint" || typeof val === "number");

      expect(await spotly.totalFavourites()).to.equal(1);
      expect(await spotly.isFavourite(bob.address, 1)).to.be.true;

      const place = await spotly.getPlace(1);
      expect(place.favouriteCount).to.equal(1);

      const bobFavs = await spotly.getUserFavourites(bob.address);
      expect(bobFavs.length).to.equal(1);
      expect(bobFavs[0].id).to.equal(1);
    });

    it("should prevent users from saving the same place multiple times", async function () {
      await spotly.connect(bob).saveFavourite(1);

      await expect(
        spotly.connect(bob).saveFavourite(1)
      ).to.be.revertedWithCustomError(spotly, "AlreadyFavourited").withArgs(1, bob.address);
    });

    it("should allow a user to unsave a favourite and update counters", async function () {
      await spotly.connect(bob).saveFavourite(1);
      expect(await spotly.totalFavourites()).to.equal(1);

      const tx = await spotly.connect(bob).unsaveFavourite(1);
      await expect(tx)
        .to.emit(spotly, "PlaceUnfavourited")
        .withArgs(1, bob.address, (val: any) => typeof val === "bigint" || typeof val === "number");

      expect(await spotly.totalFavourites()).to.equal(0);
      expect(await spotly.isFavourite(bob.address, 1)).to.be.false;

      const place = await spotly.getPlace(1);
      expect(place.favouriteCount).to.equal(0);

      const bobFavs = await spotly.getUserFavourites(bob.address);
      expect(bobFavs.length).to.equal(0);
    });

    it("should revert if unsaving a place not favourited", async function () {
      await expect(
        spotly.connect(bob).unsaveFavourite(1)
      ).to.be.revertedWithCustomError(spotly, "NotFavourited").withArgs(1, bob.address);
    });

    it("should revert when saving favourite on non-existent place", async function () {
      await expect(
        spotly.connect(bob).saveFavourite(999)
      ).to.be.revertedWithCustomError(spotly, "PlaceNotFound").withArgs(999);
    });
  });

  describe("Removing Places", function () {
    beforeEach(async function () {
      await spotly.connect(alice).submitPlace(
        "Old Hotel",
        "Venice, Italy",
        "Historic boutique lodging with canal vistas.",
        "Hotels",
        ""
      );
      await spotly.connect(bob).saveFavourite(1);
    });

    it("should allow author to remove their submission", async function () {
      expect(await spotly.totalPlaces()).to.equal(1);
      expect(await spotly.totalFavourites()).to.equal(1);

      const tx = await spotly.connect(alice).removePlace(1);

      await expect(tx)
        .to.emit(spotly, "PlaceRemoved")
        .withArgs(1, alice.address, (val: any) => typeof val === "bigint" || typeof val === "number");

      expect(await spotly.totalPlaces()).to.equal(0);
      expect(await spotly.totalFavourites()).to.equal(0);

      const allPlaces = await spotly.getAllPlaces();
      expect(allPlaces.length).to.equal(0);

      const place = await spotly.getPlace(1);
      expect(place.isRemoved).to.be.true;
    });

    it("should prevent non-authors from removing a submission", async function () {
      await expect(
        spotly.connect(bob).removePlace(1)
      ).to.be.revertedWithCustomError(spotly, "NotPlaceAuthor").withArgs(1, bob.address);
    });

    it("should prevent removing an already removed submission", async function () {
      await spotly.connect(alice).removePlace(1);

      await expect(
        spotly.connect(alice).removePlace(1)
      ).to.be.revertedWithCustomError(spotly, "PlaceAlreadyRemoved").withArgs(1);
    });

    it("should prevent favouriting a removed place", async function () {
      await spotly.connect(alice).removePlace(1);

      await expect(
        spotly.connect(owner).saveFavourite(1)
      ).to.be.revertedWithCustomError(spotly, "PlaceNotFound").withArgs(1);
    });
  });

  describe("Multiple Places and Retrieval", function () {
    it("should correctly manage and retrieve multiple places across categories", async function () {
      await spotly.connect(alice).submitPlace("Place 1", "Loc 1", "Desc 1", "Restaurants", "");
      await spotly.connect(bob).submitPlace("Place 2", "Loc 2", "Desc 2", "Nature", "");
      await spotly.connect(owner).submitPlace("Place 3", "Loc 3", "Desc 3", "Entertainment", "");

      expect(await spotly.totalPlaces()).to.equal(3);
      const all = await spotly.getAllPlaces();
      expect(all.length).to.equal(3);
      expect(all[0].name).to.equal("Place 1");
      expect(all[1].name).to.equal("Place 2");
      expect(all[2].name).to.equal("Place 3");

      // Bob removes place 2
      await spotly.connect(bob).removePlace(2);
      expect(await spotly.totalPlaces()).to.equal(2);

      const active = await spotly.getAllPlaces();
      expect(active.length).to.equal(2);
      expect(active[0].id).to.equal(1);
      expect(active[1].id).to.equal(3);
    });
  });
});

