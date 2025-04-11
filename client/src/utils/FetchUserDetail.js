import Axios from './Axios'
import SummaryApi from '../common/SummaryApi'

const FetchUserDetails = async () => {
    try {
        const resposnse = await Axios({
            ...SummaryApi.userDetails
        })
        return resposnse.data
    } catch (error) {
        console.log(error)
    }
}

export default FetchUserDetails;