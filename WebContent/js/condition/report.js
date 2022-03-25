Condition.addupRule("report", {

    "year": {
        label: "年份",
        type: "text",
        submitConfig: {
            name: "year",
            op: "eq",
            validate: null
        }
    },
    "month": {
        label: "月份",
        type: "text",
        submitConfig: {
            name: "month",
            op: "eq",
            validate: null
        }
    },
});