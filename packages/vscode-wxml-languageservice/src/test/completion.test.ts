import { testCompletionFor, testTagCompletion } from "./completionUtil";

suite('wxml completion', () => {
  test("complete", function () {

    testCompletionFor('<cover-ima|', {
      items: [
        { label: 'cover-image', resultText: '<cover-image' },
      ]
    });

    // testCompletionFor('<view class=|', {
		// 	items: [
		// 		{ label: 'text', resultText: '<view class="text"' },
		// 	]
		// });

  })


  test('doTagComplete', function (): any {
    testTagCompletion('<view>|', '$0</view>')
  })

})