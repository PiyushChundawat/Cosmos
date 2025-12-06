app.get("stats", async (req, res) => {
    try {
        const stats = new Dashboard.find({})
    }
    catch(error) {
        res.status(500).json({message: "", error: error.message});
    }
});

app.get("upcoming-test", async (req, res) => {
    try {}
    catch(error) {
        res.status(500).json({message: "", error: error.message});
    }
});