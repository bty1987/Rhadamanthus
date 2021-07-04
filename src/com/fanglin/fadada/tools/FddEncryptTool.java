package com.fanglin.fadada.tools;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import sun.misc.BASE64Encoder;

public class FddEncryptTool {

	public static String ImageToBase64ByOnline(String imgURL) throws Exception {

		ByteArrayOutputStream data = new ByteArrayOutputStream();

		URL url = new URL(imgURL);
		byte by[] = new byte[1024];

		HttpURLConnection conn = (HttpURLConnection) url.openConnection();

		conn.setRequestMethod("GET");
		conn.setConnectTimeout(5000);

		InputStream is = conn.getInputStream();

		for (int len = -1; (len = is.read(by)) != -1;) {
			data.write(by, 0, len);
		}

		is.close();

		BASE64Encoder encoder = new BASE64Encoder();
		String endimgbase64 = encoder.encode(data.toByteArray()).replaceAll("\r|\n", "");

		return endimgbase64;
	}

	public static String ImageToBase64(String imgurl) throws Exception {

		try {
			return FddEncryptTool.ImageToBase64ByOnline(imgurl);
		} catch (Exception e) {

			System.out.println(imgurl);
			System.out.println(e.getMessage());

			Thread.sleep(2000);

			return FddEncryptTool.ImageToBase64ByOnline(imgurl);
		}

	}
}
