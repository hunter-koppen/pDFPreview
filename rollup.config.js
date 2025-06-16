export default args => {
    const { configDefaultConfig } = args;

    const configureConfig = config => {
        // Handle dynamic imports for configs that use output.file
        if (config.output && !Array.isArray(config.output)) {
            if (config.output.file && !config.output.dir) {
                config.output.inlineDynamicImports = true;
            }
        } else if (Array.isArray(config.output)) {
            config.output.forEach(output => {
                if (output.file && !output.dir) {
                    output.inlineDynamicImports = true;
                }
            });
        }
    };

    configDefaultConfig.forEach(config => {
        configureConfig(config);
    });

    return configDefaultConfig;
};
