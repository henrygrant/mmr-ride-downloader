require("dotenv").config();
const fs = require("fs");
const sanitize = require("sanitize-filename");
const util = require("util");
const writeFilePromise = util.promisify(fs.writeFile);

const API_URL = "https://mapmyride.api.ua.com";

const get_rides = async (token, user_id) => {
  const get = async (limit, offset) => {
    const response = await fetch(
      `${API_URL}/v7.2/route/?` +
        new URLSearchParams({
          limit,
          offset,
          user: user_id,
          order_by: "date_created",
        }),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      }
    );
    const result = await response.json();
    return result._embedded.routes;
  };

  const rides = [];

  while (rides.length % 10 == 0) {
    const new_rides = await get(10, rides.length);
    rides.push(...new_rides);
  }

  rides.forEach(async (ride) => {
    const res = await fetch(API_URL + ride._links.alternate[0].href, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    });
    const result = await res.arrayBuffer();
    await writeFilePromise(
      `downloads/${sanitize(ride.name)}.kml`,
      Buffer.from(result)
    );
  });
};

(async () => {
  await get_rides(process.env.MMR_AUTH_TOKEN, process.env.MMR_USER_ID);
})();
