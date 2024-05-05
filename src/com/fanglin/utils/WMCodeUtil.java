/**
 * @File Name		: WMCodeUtil.java
 * @Package   	: com.fanglin.utils
 * @Version		: 1.0
 * @Date			: 2016-6-21
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.utils;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

import javax.imageio.ImageIO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import sun.misc.BASE64Encoder;

public class WMCodeUtil {

	public static final Logger logger = LoggerFactory.getLogger(WMCodeUtil.class);

	public static String createImage(String name, String time) {

		if (name == null) {
			name = "fanglin";
		}

		name = String.format("%s(测试版)", name);
		time = String.format("%s(测试版)", time);

		int width = 500;
		int height = 500;

		BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
		Graphics2D g = image.createGraphics();

		g.setColor(Color.WHITE); // 设置背景色
		g.fillRect(0, 0, width, height); // 填充背景

		g.setColor(new Color(215, 215, 215)); // 设置字体颜色和样式
		g.setFont(new Font("宋体", Font.BOLD, 20));

		g.translate(50, 50);
		g.rotate(25 * Math.PI / 180);

		g.drawString(name, 0, 0);
		g.drawString(time, 250, 0);

		g.drawString(time = String.format("%s(测试版)", SystemConfig.getString("backname", "fanglin")), 220, 120);

		g.drawString(name, 100, 250);
		g.drawString(time, 350, 250);

		g.dispose();

		String watermark = null;
		ByteArrayOutputStream bos = new ByteArrayOutputStream();

		try {
			ImageIO.write(image, "png", bos);
			watermark = String.format("data:image/png;base64,%s", Base64Code(bos.toByteArray()));
		} catch (IOException e) {
			logger.error(String.format("%s - %s - %s", "HH", "E", e.getMessage()));
		}

		return watermark;
	}

	public static String Base64Code(byte[] b) {
		BASE64Encoder encoder = new BASE64Encoder();
		String codeBase64 = "";

		StringBuilder pictureBuffer = new StringBuilder();
		pictureBuffer.append(encoder.encode(b));
		codeBase64 = pictureBuffer.toString();

		return codeBase64;
	}

	public static void main(String[] args) throws IOException {

		String watermark = createImage("白添宇", DateUtil.current("yyyyMMdd"));

		System.out.println(watermark);

		// background-size: 300px;background-image: url("");bottom: 0px;

	}

}
