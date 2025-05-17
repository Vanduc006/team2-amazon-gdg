import supabase from "./ConnectSupabase"

const JsonFileList = async():Promise<any> => {
    const { data, error } = await supabase
    .from('object')
    .select('*')
    .order('id', { ascending : false})

    if (error) {
        console.log('failed get object')
        return []
    }
    return data || []
}
export default JsonFileList