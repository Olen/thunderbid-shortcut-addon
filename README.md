# Thunderbird Shortcut Addon

As shortcuts are not really configureable in Thunderbird, and the best solution
available is another addon: https://github.com/wshanks/tbkeys - which is a great
addon, but complex to set up and the syntax for commands are powerful but complicated,
I wanted something simpler.

I also wanted and easy way to keep the (very few) shortcuts I really want to have,
synced and easily set up in all my Thunderbird installations.  I run Thunderbird
on multiple devices, and a single extension with no settings, was my goal for this
project.

## Setup

On my mailserver I run a lot of junk-detectors, which will sort my mails into
different folders:

- Inbox - Almost no spam (99% probability of ham)
- Butbucket - Almost only spam (99% probablility of spam)
- Bitbucket-maybe - Most likely spam, but with a number of false positives

I also run automatic reclassification of emails that my filters have mislabeled.

This is done using two additional folders:

- badmail - All mails moved to this folder will be reclassified as Spam and moved
to the Bitbicket
- okmail - All mails moved to this folder will have the Spam tags removed, and
will be reclassified as Ham, and moved to the Inbox

So I want an easy way to tag lots of messages, espeically in the folder "Bitbucket-maybe" and move them to either "okmail" or "badmail".

And that is all this extenion do.

The keyboard shortcut `Alt-o` moves the selected messages to the folder `okmail`

The keyboard shortcut `Alt-j` marks the message as spam and moves it to the folder `badmail`
