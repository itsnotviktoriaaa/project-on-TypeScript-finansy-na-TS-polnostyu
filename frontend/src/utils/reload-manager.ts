import {Balance} from "../components/balance";

export class ReloadManager {

    public static checkReloadPage(): void {
        //check for Navigation Timing API support
        // if (window.performance) {
        //     console.info("window.performance works fine on this browser");
        // }
        // console.info(performance.navigation.type);

        if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
            new Balance();
        }
    }

}