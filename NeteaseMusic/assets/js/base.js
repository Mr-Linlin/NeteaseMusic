$(function() {
    // 设置请求拦截器
    axios.interceptors.request.use(function(config) {
            // 设置全局URL
            config.url = 'http://localhost:3000' + config.url;
            // console.log(config.url);
            return config;
        })
        // 添加响应拦截器
    axios.interceptors.response.use(function(response) {

        return response;
    })
})