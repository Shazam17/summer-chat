const axios = require('axios');
setInterval(async() => {
    const response = await axios.post('http://localhost:3000/updates',{
        id: "1"
    }).catch(console.log)

    if(response){
        console.log(response.data)
    }
}, 2000)
