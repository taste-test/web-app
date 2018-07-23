# Deployment

You can make as many of me as you want!

## Heroku

When you are ready to upload a production version:

1. Sign in Heroku website with CORE studio credentials. See KeePass > Cloud Services Logins > Heroku

2. Create new Personal App at the Heroku dashboard and click on the new app.

3. Go to 'Settings' first and set Config Variables.
    - Add environment variables of your app one by one!
    - You also need to two more aditional keys: NPM_TOKEN and NPM_CONFIG_PRODUCTION, set the later as false, set the first as the same as other apps.

4. Create .nmprc file to your web app and type `//registry.npmjs.org/:_authToken=${NPM_TOKEN}`, save into your app and commit to Github.

5. At Heroku app page, go to 'Deploy' tab and Select GitHub as Deployment Method. Connect to branch you like to deploy. Set also same branch in Automatic and Manual deploy Settings.

6. if it is the first time you can deploy by clikcing Deploy Branch button. It will take a few minutes once it is done deployment successfully, click the view button!



## AWS (Deprecated)

### Uploading to S3 with HTTPS support

When you are ready to upload a production version:

1. Create a new application and environment in the Amazon Elastic Beanstalk console.
  - Make sure you do this in the N. Virginia region (you should see CORE.SSO hosted here as well).
  - The URL you choose should be applicationname.us-east-1.elasticbeanstalk.com

2. Request an HTTPS certificate from Solutions Center.
  - Do this through Serena: IT only wants the requests coming from one person.
  - Include the Elastic Beanstalk URL from the previous step, and what you want the final TT subdomain to be (applicationname.thorntontomasetti.com).

3. Set up environment variables
  - You will need to set up all of your environment variables in .env-dev in your new environment.
  - Include ```PRODUCTION = true```
  - Include ```HTTPS = true```
  - Include ```NPM_TOKEN``` with the value in your .npmrc after you have logged in. The global .npmrc is located in C:\\Users\\**yourusername** on Windows machines by default.

4. Change ```.ebextensions/securelistener.config``` to reflect the correct certificate key from our approved HTTPS certificate.

5. Zip the following folders/files into a zip folder:
  - .ebextensions/
  - browser_src/
  - public/
  - server/
  - package.json

6. Upload this zip package to the environment for deployment.

### Blue/Green update deployments

We use blue/green deployments to minimize downtime when we need to push updates to our site.

1. Clone your running environment and wait for it to spin up.

2. Do the zip and upload steps above.

3. Test your new environment to make sure everything looks okay. Push past the https error when you do so: it is doing this because the URL does not match the https://applicationname.thorntontomasetti.com on the certificate.

4. Swap environment URLs with your other environment when you are ready. Once confident that the new one is working as intended, terminate your old environment.
