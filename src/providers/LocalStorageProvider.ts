import ConfigPOTO from "@/domains/config/ConfigPOTO";

export default class LocalStorageProvider {

    static CONFIG_KEY: string = "config";

    public static retrieve(): ConfigPOTO {
        const objectAsString: string = localStorage.getItem(this.CONFIG_KEY) ?? '{}';
        return JSON.parse(objectAsString);
    }

    public static store(config: ConfigPOTO) {
        localStorage.setItem(this.CONFIG_KEY, JSON.stringify(config));
    }

}