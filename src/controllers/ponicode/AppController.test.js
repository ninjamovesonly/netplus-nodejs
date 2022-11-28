const AppController = require("../AppController")
// @ponicode
describe("AppController.requeryUrl", () => {
    test("0", async () => {
        await AppController.requeryUrl({ params: { ref: "Pierre Edouard" } }, { send: () => 404 })
    })

    test("1", async () => {
        await AppController.requeryUrl({ params: { ref: "Jean-Philippe" } }, { send: () => 200 })
    })

    test("2", async () => {
        await AppController.requeryUrl({ params: { ref: "Edmond" } }, { send: () => 400 })
    })

    test("3", async () => {
        await AppController.requeryUrl({ params: { ref: "Jean-Philippe" } }, { send: () => 400 })
    })

    test("4", async () => {
        await AppController.requeryUrl({ params: { ref: "Michael" } }, { send: () => 429 })
    })

    test("5", async () => {
        await AppController.requeryUrl({ params: { ref: "" } }, { send: () => NaN })
    })
})
