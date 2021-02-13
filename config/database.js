

module.exports = {
    url: process.env.DATABASE_URL,
    options: { useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true },
    successMessage: "mogoose is running ....."
}   