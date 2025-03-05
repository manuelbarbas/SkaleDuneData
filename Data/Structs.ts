
const schains_data_fields: string = 'month,tx_count_total,block_count_total,gas_total_used,gas_fees_total_gwei,gas_fees_total_eth,gas_fees_total_usd,users_count_total'; 
const schains_30day_data_fields: string = 'schain,tx_count_total,block_count_total,gas_total_used,gas_fees_total_gwei,gas_fees_total_eth,gas_fees_total_usd,users_count_total';
const schains_total_data_fields: string = 'schain,tx_count_total,block_count_total,gas_total_used,gas_fees_total_gwei,gas_fees_total_eth,gas_fees_total_usd,users_count_total';

type DuneTables = {
    table_name: string,
    description: string,
    is_private: boolean,
    data: string
}

export {schains_data_fields, schains_30day_data_fields, schains_total_data_fields , DuneTables};
