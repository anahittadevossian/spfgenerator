Domain Validation

1. Valid Domain + Include
   Steps: Enter valid domain, add include:_spf.google.com, select SoftFail, click Generate.
   Expected Result: v=spf1 include:_spf.google.com ~all

2. Invalid Domain Format
   Steps: Enter invalid domain,e.g. 'simply', leave include empty, click Generate.
   Expected Result: Validation error: “Please provide a valid domain” (This gave error in console from 'simply@@test..com', and no validation in front)

3. Long Domain Name (Boundary)
   Steps: Enter 253-character domain.
   Expected Result: Record generated successfully if valid. (It gave "Please provide a valid domain" even for 100 chars, worked for 50)

4. Unicode Domain (IDN)
   Steps: Enter xn--d1acufc.xn--p1ai.
   Expected Result: Accepted as valid domain.

5. Unicode / Punycode Edge
   Steps: Enter müller.de.
   Expected Result: Converted to xn--mller-kva.de. (Is not converted)

6. No Inputs
   Steps: Leave all fields empty and click Generate.
   Expected Result: The button should be disabled

7. Empty Domain Field
   Steps: Leave domain blank, add include, click Generate.
   Expected Result: The button should be disabled

Include Mechanism

8. Add Multiple Includes (within limit)
   Steps: Enter domain, add _spf.google.com and spf.protection.outlook.com.
   Expected Result: v=spf1 include:_spf.google.com include:spf.protection.outlook.com -all

9. Add More Than 10 Includes
   Steps: Try to add 11 include records.
   Expected Result: Error: “Maximum 10 includes allowed.”

10. Invalid Characters in Include
    Steps: Enter include:_spf#google.com.
    Expected Result: Error: “The value in include element should be a valid domain name.”

11. Duplicate Includes
    Steps: Add _spf.google.com twice.
    Expected Result: Duplicate removed or warning shown.

12. Nested Include Resolution Warning
    Steps: Add include _spf.google.com.
    Expected Result: Nested includes should be present.

13. Overlapping Sources Warning
    Steps: Add include _spf.google.com and a:google.com.
    Expected Result: Warning: “Overlapping mechanisms detected.” (Nothing happens in this case, should be implemented)

14. Duplicate Mechanisms
    Steps: Add same IP or include twice.
    Expected Result: Deduplicated or warning.

IP Address Mechanisms

15. IPv4 Entry
    Steps: Enter domain, add IPv4 192.168.1.1, select Fail.
    Expected Result: v=spf1 ip4:192.168.1.1 -all

16. Invalid IPv4
    Steps: Enter 999.999.999.999.
    Expected Result: Error: “Invalid IPv4 address.”

17. IPv6 Entry
    Steps: Enter valid IPv6, select SoftFail.
    Expected Result: v=spf1 ip6:<value> ~all

18. Invalid IPv6
    Steps: Enter 12345::abcd.
    Expected Result: Error: “Invalid IPv6 address.”

19. IPv6 + IPv4 Combination
    Steps: Add IPv4 192.168.1.1, IPv6 2001:db8::1.
    Expected Result: v=spf1 ip4:192.168.1.1 ip6:2001:db8::1 -all

20. Multiple IPv4
    Steps: Add 192.168.1.1 and 203.0.113.7.
    Expected Result: v=spf1 ip4:192.168.1.1 ip4:203.0.113.7 -all

21. None Policy with IPs
    Steps: Add IPv4 and set Failure Policy = None.
    Expected Result: v=spf1 ip4:192.168.1.1

22. Policy Neutral With IPv4
    Steps: Add IPv4 and select Neutral.
    Expected Result: v=spf1 ip4:192.168.1.1 ?all

A and MX Records

23. Valid A Record
    Steps: Add a:easydmarc.com.
    Expected Result: v=spf1 a:easydmarc.com -all

24. Invalid A Record
    Steps: Add a:random.com.
    Expected Result: Error: “Invalid A record. Allowed: easydmarc.com, google.com.”

25. Valid MX Record
    Steps: Add mx:google.com.
    Expected Result: v=spf1 mx:google.com -all

26. Exists Mechanism
    Steps: Add %{i}._spf.mta.salesforce.com.
    Expected Result: v=spf1 exists:%{i}._spf.mta.salesforce.com -all

Redirect Mechanism

27. Redirect Mechanism Valid
    Steps: Enable Redirect, enter _spf.google.com.
    Expected Result: v=spf1 redirect=_spf.google.com

28. Multiple Redirects
    Steps: Try to add two redirect values.
    Expected Result: Error: “Unknown element is detected.”

29. Redirect + Other Mechanisms
    Steps: Enable redirect _spf.google.com and also add include.
    Expected Result: Validation error: “Redirect cannot be combined with other mechanisms.”

30. Redirect Field Empty
    Steps: Enable Redirect toggle, leave field blank, click Generate.
    Expected Result: Error: “Redirect value required.”

31. Redirect with Invalid Domain
    Steps: Enable Redirect, enter 'random'.
    Expected Result: Validation error for invalid domain format.

32. Redirect Toggle Persistence
    Steps: Enable redirect, enter domain, refresh or navigate away/back.
    Expected Result: Redirect resets cleanly.

33. Redirect Toggle UX (On → Off)
    Steps: Toggle redirect on, then off.
    Expected Result: Redirect field disappears and does not affect SPF record.

34. Redirect vs. Include Priority
    Steps: Enable redirect _spf.google.com, add include spf.protection.outlook.com, switch back the toggle to redirect.
    Expected Result: Only redirect applied, include ignored.

35. Invalid Redirect + Local Mechanisms
    Steps: Enable redirect and add IP4 mechanism, switch back the toggle to redirect.
    Expected Result: Only redirect applied, IP4 ignored.

36. Redirect Overrides Fail Policy
    Steps: Select Fail policy, enable redirect _spf.google.com.
    Expected Result: Fail policy ignored; redirect takes precedence.

37. Policy Dropdown Disabled When Redirect On
    Steps: Enable Redirect toggle.
    Expected Result: Fail Policy dropdown becomes disabled.

38. Policy Dropdown Re-Enabled After Redirect Off
    Steps: Disable Redirect.
    Expected Result: Dropdown reactivates.

39. Policy Dropdown Disabled State Persistence
    Steps: Enable redirect, refresh page.
    Expected Result: Redirect and dropdown disable state persist.

40. Redirect Error Priority
    Steps: Add invalid redirect domain + empty main domain.
    Expected Result: Redirect error shown first.

Failure Policy / SPF Qualifiers

41. Failure Policy = None
    Steps: Select None.
    Expected Result: v=spf1 include:_spf.google.com

42. Failure Policy = SoftFail
    Steps: Select SoftFail.
    Expected Result: v=spf1 include:_spf.google.com ~all

43. Failure Policy = Fail
    Steps: Select Fail.
    Expected Result: v=spf1 include:_spf.google.com -all

44. Failure Policy = Neutral
    Steps: Select Neutral.
    Expected Result: v=spf1 include:_spf.google.com ?all

45. Switch Between Policies
    Steps: Generate with SoftFail, then switch to Fail, click Generate.
    Expected Result: Record updates (~all → -all).

Record Generation & Validation

46. Record Length > 255 Characters
    Steps: Add long includes to exceed 255 chars.
    Expected Result: Error: “SPF record exceeds 255 characters.”

47. Mixed Mechanisms Order
    Steps: Add IP, include, A, MX, exists.
    Expected Result: SPF order matches user input.

48. Mixed Mechanisms Combination Test
    Steps: Add IPv4, IPv6, include, A, MX, exists.
    Expected Result: Combined correctly: v=spf1 ip4 ... ip6 ... include ... a ... mx ... exists ... -all

49. Fallback When Too Long
    Steps: Add mechanisms to exceed 255 chars.
    Expected Result: Suggest splitting record. (Nothing happened, just invalid domain is sent)

50. Handling Non-Sending Domains
    Steps: Domain used only for web, Fail policy.
    Expected Result: v=spf1 -all

51. Multiple Domains Bulk Mode
    Steps: Enter multiple domains.
    Expected Result: Separate SPF records generated.

Security & Input Sanitization

52. XSS Injection Attempt
    Steps: Enter <script>alert(1)</script>.
    Expected Result: Input sanitized; script not executed.

53. SQL Injection Attempt
    Steps: Enter ; DROP TABLE users;.
    Expected Result: Sanitized input; no injection.

54. Hidden Characters in Copy
    Steps: Generate and copy SPF, paste into terminal.
    Expected Result: No hidden or zero-width spaces.

55. Input Length Limit
    Steps: Enter more than 255 characters into a field.
    Expected Result: Error: “Character limit exceeded.”

56. Validation on Paste
    Steps: Paste invalid string like v=spf1 include:_spf@google.com
    Expected Result: Validation error.

UI / UX & Accessibility

57. Show More / Show Less Toggle
    Steps: Expand advanced options, add MX record, collapse.
    Expected Result: Mechanism remains saved.

58. Drag & Reorder Mechanisms
    Steps: Add multiple entries, drag to reorder.
    Expected Result: SPF order updates accordingly.

59. Delete Mechanism
    Steps: Add include, delete it using trash icon.
    Expected Result: Mechanism removed successfully.

60. Undo/Redo Mechanism Change
    Steps: Add include, delete it, press Undo.
    Expected Result: Include restored.

61. Undo After Clear
    Steps: Add three includes, click Clear, press Undo.
    Expected Result: Values restored if supported.

62. Tab Index Consistency
    Steps: Use Tab key across fields.
    Expected Result: Logical navigation order.

63. Accessibility: Keyboard Navigation
    Steps: Tab through and trigger buttons with Enter/Space.
    Expected Result: All UI elements accessible.

64. Tooltip Help Text for Each Mechanism
    Steps: Hover over each mechanism type.
    Expected Result: Tooltip with description shown. (No tooltip)

65. Predefined Include Suggestions / Autocomplete
    Steps: Type _spf.goo.
    Expected Result: Autocomplete list appears. (yes but from the browser)

66. Mobile Responsiveness
    Steps: Open on mobile viewport.
    Expected Result: Layout adjusts correctly.

67. Slow Network Handling
    Steps: Simulate slow network, click Generate.
    Expected Result: Loading indicator visible.

68. Network Error Recovery
    Steps: Disable internet, click Generate.
    Expected Result: “Failed to connect” error. (Endless loading is seen)

69. Rapid Add/Remove Stress Test
    Steps: Add/remove mechanisms repeatedly.
    Expected Result: No crash.

70. Very Large Input Stress Test
    Steps: Add all mechanism types.
    Expected Result: UI stays responsive.

Copy Functionality

71. Copy Functionality
    Steps: Generate record, click Copy, paste into Notepad.
    Expected Result: Exact SPF record copied.

72. Copy Button Tooltip
    Steps: Hover over Copy button.
    Expected Result: Tooltip: “Copy SPF record to clipboard.” (No tooltip)

73. Clipboard Encoding Test
    Steps: Copy record with %{i} placeholder.
    Expected Result: %{i} preserved correctly.

Integration / End-to-End

74. SoftFail vs Fail Email Routing (Integration)
    Steps: Test sends under ~all and -all.
    Expected Result: ~all → spam; -all → rejected.

75. Concurrent User Scenario
    Steps: Two users generate SPF simultaneously.
    Expected Result: Sessions isolated.

76. Mobile Offline Recovery
    Steps: Lose connection mid-generate.
    Expected Result: Graceful error. (Endless loading)
