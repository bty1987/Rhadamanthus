/**
 * @File Name		: HttpUtil.java
 * @Package   	: com.fanglin.utils
 * @Version		: 1.0
 * @Date			: 2015-9-15
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.utils;

import com.fanglin.core.interceptor.FLException;

public class HttpUtil {
	
//	public static JSONObject post(String strURL, String params) throws FLException {
//        
//        try {
//            URL url = new URL(strURL);// 创建连接
//            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
//            connection.setDoOutput(true);
//            connection.setDoInput(true);
//            connection.setUseCaches(false);
//            connection.setInstanceFollowRedirects(true);
//            connection.setRequestMethod("POST"); // 设置请求方式
//            connection.setRequestProperty("Accept", "application/json"); // 设置接收数据的格式
//            connection.setRequestProperty("Content-Type", "application/json"); // 设置发送数据的格式
//            connection.connect();
//            
//            OutputStreamWriter out = new OutputStreamWriter(connection.getOutputStream(), "UTF-8"); // utf-8编码
//            
//            out.append(params);
//            out.flush();
//            out.close();
//            
//            int length = (int) connection.getContentLength();// 获取长度, 读取响应
//            InputStream is = connection.getInputStream();
//            if (length != -1) {
//                byte[] data = new byte[length];
//                byte[] temp = new byte[512];
//                int readLen = 0;
//                int destPos = 0;
//                while ((readLen = is.read(temp)) > 0) {
//                    System.arraycopy(temp, 0, data, destPos, readLen);
//                    destPos += readLen;
//                }
//                String result = new String(data, "UTF-8"); // utf-8编码
//                System.out.println(result);
//                
//                return JSONObject.fromObject(result);
//            }
//        } catch (IOException e) {
//            throw new FLException(110007, "网络问题");
//        }
//        
//		return null;
//    }
	
	public static void main(String[] args) throws FLException {
//		HttpUtil.post("http://192.168.1.63/Pandora/pageVillage.do?paging.page=1&paging.rows=5", "{\"paging.page\":\"1\", \"paging.rows\":\"5\"}");
	}
	
}
