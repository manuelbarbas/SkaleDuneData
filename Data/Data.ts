import {schains_data_fields, schains_30day_data_fields, schains_total_data_fields} from "./index";
import axios from 'axios';
import dotenv from 'dotenv'; 
dotenv.config();

const skale_stats_endpoint = process.env.SKALE_ENDPOINT;

//const queries_ids = [3235318,3237360,3238173,3237389,3237392,3237393,3237477,3238185,3237548,3237551,3237535,3278560,3280420,3280409,3280258,3280186,3407028,3407521,3407181,3407532,3278525];

async function skaleData() {
    try {
        const response = await axios.get(skale_stats_endpoint!);
        return response.data.payload.schains;
      } catch (error) {
        console.error(error);
      }
}

function sChainFormatMonthlyData(schain_data:any):[string[], string[]] {
    const namesArray: string[] = [];
    const formattedStringsArray: string[] = [];

    for(const key in schain_data) {
        namesArray.push(key);
        
        const groupByMonth = schain_data[key].group_by_month;
        var formattedStrings = schains_data_fields ;

        for (const month in groupByMonth) {
            if (groupByMonth.hasOwnProperty(month)  && month != "1970-01") {
                const monthData = groupByMonth[month];
                var amount_users = monthData.users_count_total == undefined ? 0 : monthData.users_count_total;

                const formattedString = `${month}, ${monthData.tx_count_total}, ${monthData.block_count_total}, ${monthData.gas_total_used}, ${monthData.gas_fees_total_gwei}, ${monthData.gas_fees_total_eth}, ${monthData.gas_fees_total_usd}, ${amount_users}`;
                formattedStrings += '\n' + formattedString;
            }
        }
        formattedStringsArray.push(formattedStrings);
    }

    return [namesArray,formattedStringsArray];
}

function sChainFormat30DayData(schain_data:any):[string[], string[]] {
    const namesArray: string[] = [];
    const formattedStringsArray: string[] = [];
    var formattedStrings: string = schains_30day_data_fields;

    for(const key in schain_data) {
        namesArray.push(key);
        
        const total_30d = schain_data[key].total_30d;

        const formattedString = `${key},${total_30d.tx_count_total},${total_30d.block_count_total},${total_30d.gas_total_used},${total_30d.gas_fees_total_gwei},${total_30d.gas_fees_total_eth},${total_30d.gas_fees_total_usd},${total_30d.users_count_total}`;
        formattedStrings += '\n' + formattedString;
    }
    formattedStringsArray.push(formattedStrings);
    return [namesArray,formattedStringsArray];
}

function sChainFormatTotalData(schain_data:any):[string[], string[]] {
    const namesArray: string[] = [];
    const formattedStringsArray: string[] = [];
    var formattedStrings: string = schains_total_data_fields;

    for(const key in schain_data) {
        namesArray.push(key);
        
        const total = schain_data[key].total;

        const formattedString = `${key},${total.tx_count_total},${total.block_count_total},${total.gas_total_used},${total.gas_fees_total_gwei},${total.gas_fees_total_eth},${total.gas_fees_total_usd},${total.users_count_total}`;
        formattedStrings += '\n' + formattedString;
    }
    formattedStringsArray.push(formattedStrings);
    return [namesArray,formattedStringsArray];
}


export {skaleData, sChainFormatMonthlyData, sChainFormat30DayData, sChainFormatTotalData}