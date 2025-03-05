import { skaleData, sChainFormatMonthlyData, sChainFormat30DayData,sChainFormatTotalData, DuneTables, queries_ids } from "./Data/index";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const dune_api_key = process.env.API_KEY!;
const dune_endpoint = process.env.DUNE_UPLOAD_ENDPOINT!;
const dune_base_url = process.env.DUNE_QUERY_ENDPOINT;
const headers = { "X-Dune-Api-Key": dune_api_key };

/**
 * Helper function for making API requests with retry on rate limits.
 */
async function makeApiRequest(url: string, data: any, retryFunction: () => Promise<void>) {
    try {
        const response = await axios.post(url, data, { headers });
        console.log(`Request successful: ${url}, Status: ${response.status}`);
    } catch (error: any) {
        if (error.response?.status === 429) {
            console.error("Rate limit exceeded. Retrying after delay...");
            await new Promise(resolve => setTimeout(resolve, 5000));
            await retryFunction();
        } else {
            console.error(`Error in request: ${url}, Message: ${error.message}`);
        }
    }
    await new Promise(resolve => setTimeout(resolve, 5000)); // Throttle requests
}

/**
 * Uploads SKALE chains monthly data to Dune.
 */
async function DuneUpload_Months_Data(skale_data: any, start_index: number = 0) {
    const [namesArray, formattedData] = sChainFormatMonthlyData(skale_data);
    
    for (let i = start_index; i < namesArray.length; i++) {
        const data: DuneTables = {
            table_name: namesArray[i],
            description: `Data of the SKALE Chain named ${namesArray[i]}`,
            is_private: false,
            data: formattedData[i]
        };

        await makeApiRequest(dune_endpoint, data, () => DuneUpload_Months_Data(skale_data, i));
    }
}

/**
 * Uploads SKALE chains 30-day summary data to Dune.
 */
async function DuneUpload_30d_Data(skale_data: any) {
    const [, formattedData] = sChainFormat30DayData(skale_data);

    const data: DuneTables = {
        table_name: "thirty_days_data",
        description: "Thirty days table",
        is_private: false,
        data: formattedData[0]
    };

    await makeApiRequest(dune_endpoint, data, () => DuneUpload_30d_Data(skale_data));
}

/**
 * Uploads SKALE chains total summary data to Dune.
 */
async function DuneUpload_Total_Data(skale_data: any) {
    const skale_data_formatted = sChainFormatTotalData(skale_data);

    const data: DuneTables = {
        table_name: "total_summary_data",
        description: "Total Summary table",
        is_private: false,
        data: skale_data_formatted[1][0]
    };

    await makeApiRequest(dune_endpoint, data, () => DuneUpload_Total_Data(skale_data));
}


/**
 * Runs Dune queries to update data.
 */
/*async function Update_Dune_Queries(start_index: number = 0) {
    for (let i = start_index; i < queries_ids.length; i++) {
        const target_endpoint = `${dune_base_url}${queries_ids[i]}/execute`;
        await makeApiRequest(target_endpoint, {}, () => Update_Dune_Queries(i));
    }
}*/

/**
 * Main function to call all Dune upload operations.
 */
async function Calls() {
    const skale_data = await skaleData();
    await DuneUpload_Months_Data(skale_data);
    await DuneUpload_30d_Data(skale_data);
    await DuneUpload_Total_Data(skale_data);
   // await Update_Dune_Queries();

}

Calls();
