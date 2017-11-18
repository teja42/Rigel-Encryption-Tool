# Rigel.pro
Cross Platform Disk Encryption Solution. <br/><br/>
<strong>Caution : This is still in development, don't encrypt any important data.</strong>

# What's the purpose of this?

We all encrypt out stuff and most operating systems come by default with an encryption software. It's ok to use that software
for encrypting files on a drive that you don't carry around . But if you encrypt your portable drive with the default software
say BitLocker in Windows , it's fine as long as you use that drive in a windows environment. But if you try to use it in Linux
it just won't even recognise the disk. Sure there are projects for Linux that enable you to read and write to BitLocker 
encrypted drives but it's too complex and it's not worth the time when all you want is to watch your cat videos on your drive.
And it goes on Windows cant recognise Mac,Linux encrypted drives and Mac can't recongise Window,Linux encrypted drives.....
and you get the idea.

  Rigel.pro solves this issue by first converting the drive into an exfat partitioned disk. exfat is the most flexible disk
partition format.It then encrypts the files and folders ( even file and folder names ). And then when ever you wan't to watch 
your cat videos just plug you drive and just launch an application for that operating system . Windows,Mac and Linux executables
are placed at the root of the drive and they serve as a file explorer after successful authentication . You can edit documents
and watch videos on the go without and issue. Rigel.pro does a lot behind the scenes for a fluid user experience.

# Getting Started
Download the source code to a folder and navigate to the folder from your termial and issue this command 
`npm init && npm start`
 Requires node.js and npm to be installed.

# Contribute

This is an open source project and building it takes a really long time.
You can help contribute to this project by visiting the patreon page at https://patreon.com/teja42
