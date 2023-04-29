# MapMyRide Ride Downloader

This script downloads all of your rides as `.kml` files from MapMyRide.com

## Usage

After cloning this project, create a `.env` file in the root directory of this repository and set two variables:

```
MMR_AUTH_TOKEN="Bearer ABC123"
MMR_USER_ID=123456
```

To get the real values of these variables, log in to your MapMyRide account and check the request headers of any API call in the network tab of your browser's devtools.

Then run `npm start`
