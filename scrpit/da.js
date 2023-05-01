module.exports = async (params) => {
    const { quickAddApi: { inputPrompt, suggester } } = params;
    console.log(params)
    const val = await inputPrompt("📖 Book Name");

}