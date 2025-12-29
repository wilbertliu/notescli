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

export const READ_NOTE_APPLESCRIPT = String.raw`
on run argv
  if (count of argv) is not 4 then
    error "Expected 4 arguments: selectorType, selectorValue, folder, accountOrEmpty"
  end if

  set selectorType to item 1 of argv
  set selectorValue to item 2 of argv
  set folderName to item 3 of argv
  set accountName to item 4 of argv

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

    set matchingNotes to {}
    if selectorType is "id" then
      set matchingNotes to notes of theFolder whose id is selectorValue
    else if selectorType is "title" then
      set matchingNotes to notes of theFolder whose name is selectorValue
    else
      error "Invalid selectorType: " & selectorType
    end if

    if (count of matchingNotes) is 0 then
      error "Note not found: " & selectorValue
    end if

    if (count of matchingNotes) is greater than 1 then
      error "Multiple notes found: " & selectorValue
    end if

    set theNote to item 1 of matchingNotes
    set noteId to id of theNote
    set noteName to name of theNote
    set noteBody to body of theNote

    return my toJson(noteId, noteName, noteBody)
  end tell
end run

on toJson(noteId, noteName, noteHtml)
  return "{\"id\":\"" & my jsonEscape(noteId) & "\",\"name\":\"" & my jsonEscape(noteName) & "\",\"html\":\"" & my jsonEscape(noteHtml) & "\"}"
end toJson

on jsonEscape(inputText)
  set t to inputText as string
  set t to my replaceText("\\", "\\\\", t)
  set t to my replaceText("\"", "\\\"", t)
  set t to my replaceText(tab, "\\t", t)
  set t to my replaceText(return, "\\n", t)
  set t to my replaceText(linefeed, "\\n", t)
  return t
end jsonEscape

on replaceText(findText, replaceText, inputText)
  set AppleScript's text item delimiters to findText
  set parts to every text item of inputText
  set AppleScript's text item delimiters to replaceText
  set outText to parts as string
  set AppleScript's text item delimiters to ""
  return outText
end replaceText
`.trim()
