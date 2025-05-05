console.log("Shortcut script loading");

// Mailfolders for good and bad mails
const BADMAIL="badmail"
const OKMAIL="okmail"

let gettingAllCommands = browser.commands.getAll();
gettingAllCommands.then((commands) => {
  for (let command of commands) {
    // Note that this logs to the Add-on Debugger's console: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Debugging
    // not the regular Web console.
    console.log(command);
  }
});

browser.commands.onCommand.addListener((command) => {
  handleCommand(command).catch(console.error);
});

async function handleCommand(command) {
// browser.commands.onCommand.addListener((command) => {
  console.log("Command triggered:", command);

  // const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  const tab = tabs.find(t => t.type === "mail"); // Not "messageDisplay"
  if (!tab) {
    console.warn("No active mail tab.");
    return;
  }

  const selectedMessages = await browser.mailTabs.getSelectedMessages(tab.id);
  if (!selectedMessages || selectedMessages.messages.length === 0) {
    console.warn("No messages selected.");
    return;
  }

  const messageIds = selectedMessages.messages.map(msg => msg.id);
  const accountId = selectedMessages.messages[0].folder.accountId;

  if (command === "move-to-okmail") {
    console.log("Pressed ALT+O - would mark as not junk and move to ${OKMAIL}");
    // Mark as not junk
    for (const id of messageIds) {
      await browser.messages.update(id, { junk: false });
    }
    const okmailFolder = await findFolder(accountId, OKMAIL);
    if (okmailFolder) {
      await browser.messages.move(messageIds, okmailFolder);
      console.log("Messages moved to ${OKMAIL}");
    } else {
      console.error("Folder '${OKMAIL}' not found.");
    }
  }

  if (command === "move-to-badmail") {
    console.log("Pressed ALT+B - would mark as junk and move to ${BADMAIL}");
    // Mark as junk
    for (const id of messageIds) {
      await browser.messages.update(id, { junk: true });
    }

    const badmailFolder = await findFolder(accountId, BADMAIL);
    if (badmailFolder) {
      await browser.messages.move(messageIds, badmailFolder);
      console.log("Messages marked as junk and moved to ${BADMAIL}");
    } else {
      console.error("Folder '${BADMAIL}' not found.");
    }
  }
}

async function findFolder(accountId, folderName) {
  const accounts = await browser.accounts.list();
  const account = accounts.find(acc => acc.id === accountId);
  if (!account) return null;

  const walk = (folders) => {
    for (const folder of folders) {
      if (folder.name.toLowerCase() === folderName.toLowerCase()) {
        return folder;
      }
      if (folder.subFolders) {
        const found = walk(folder.subFolders);
        if (found) return found;
      }
    }
    return null;
  };

  return walk(account.folders);
}
console.log("Shortcut script loaded");