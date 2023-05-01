const TEXT_FIELD = "Text field";
module.exports = {
    entry: async (QuickAdd, settings) => {

        const {
            quickAddApi: { inputPrompt },
        } = QuickAdd;

        console.log(QuickAdd)

        const filename = await inputPrompt("新建草稿", "草稿名称")
    },
    settings: {
        name: "Demo",
        author: "Christian B. B. Houmann",
        options: {
            [TEXT_FIELD]: {
                type: "text",
                defaultValue: "",
                placeholder: "Placeholder",
            },
            "Checkbox": {
                type: "checkbox",
                defaultValue: false,
            },
            "Dropdown": {
                type: "dropdown",
                defaultValue: "Option 1",
                options: [
                    "Option 1",
                    "Option 2",
                    "Option 3",
                ],
            },
            "Format": {
                type: "format",
                defaultValue: "{{DATE:YYYY-MM-DD}}",
                placeholder: "Placeholder",
            },
        }
    },
}

