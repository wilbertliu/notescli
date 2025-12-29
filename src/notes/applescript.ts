export const CREATE_NOTE_APPLESCRIPT = String.raw`
on run argv
  if (count of argv) is not 4 then
    error "Expected 4 arguments: title, folder, accountOrEmpty, bodyPath"
  end if

  set noteTitle to item 1 of argv
  set folderName to item 2 of argv
  set accountName to item 3 of argv
  set bodyPath to item 4 of argv

  set bodyHtml to do shell script "/bin/cat " & quoted form of bodyPath

  tell application "Notes"
    if not running then launch

    if (count of accounts) is 0 then
      error "No Notes accounts found."
    end if

    set theAccount to missing value
    if accountName is not "" then
      set matchingAccounts to accounts whose name is accountName
      if (count of matchingAccounts) is 0 then
        error "Account not found: " & accountName
      end if
      set theAccount to item 1 of matchingAccounts
    else
      set theAccount to item 1 of accounts
    end if

    set matchingFolders to folders of theAccount whose name is folderName
    if (count of matchingFolders) is 0 then
      error "Folder not found: " & folderName
    end if
    set theFolder to item 1 of matchingFolders

    set theNote to make new note at theFolder with properties {name:noteTitle, body:bodyHtml}
    return (id of theNote) & linefeed & (name of theNote)
  end tell
end run
`.trim()
