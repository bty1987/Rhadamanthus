/**
 * @File Name	: SecurityImageHelper.java
 * @Package		：com.fanglin.commons.security 
 * @Version		: 1.0
 * @Date		: 2014-7-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email		: 
 * @Describing	: 工具类，生成验证码图片
 */

package com.fanglin.core.security;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Random;

import javax.imageio.ImageIO;

public class SecurityImageHelper {
    
    /**
     * 生成验证码图片
     * @param securityCode   验证码字符
     * @return  BufferedImage  图片
     */
    public static BufferedImage createImage(String securityCode){
        
        int codeLength=securityCode.length(); // 验证码长度
        int fSize = 15; // 字体大小
        int fWidth = fSize + 1;
        int width = codeLength * fWidth + 6; // 图片宽度
        int height = fSize * 2 + 1; // 图片高度
        
        BufferedImage image=new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB); // 图片
        Graphics g=image.createGraphics();
        
        g.setColor(Color.WHITE); // 设置背景色
        g.fillRect(0, 0, width, height); // 填充背景
        
        g.setColor(Color.LIGHT_GRAY); // 设置边框颜色
        g.setFont(new Font("Arial", Font.BOLD, height - 2)); // 边框字体样式
        g.drawRect(0, 0, width - 1, height -1); // 绘制边框
        
        Random rand = new Random(); // 绘制噪点
        g.setColor(Color.LIGHT_GRAY); // 设置噪点颜色
        for(int i=0;i<codeLength*6;i++){
            int x = rand.nextInt(width);
            int y = rand.nextInt(height);
            g.drawRect(x, y, 1, 1); // 绘制1*1大小的矩形
        }
        
        int codeY = height - 10; // 绘制验证码
       
        g.setColor(new Color(19,148,246)); // 设置字体颜色和样式
        g.setFont(new Font("Georgia", Font.BOLD, fSize));
        for(int i = 0; i < codeLength;i++){
            g.drawString(String.valueOf(securityCode.charAt(i)), i * 16 + 5, codeY);
        }
        
        g.dispose(); // 关闭资源
        
        return image;
    }
    
    /**
     * 返回验证码图片的流格式
     * @param securityCode  验证码
     * @return ByteArrayInputStream 图片流
     */
    public static ByteArrayInputStream getImageAsInputStream(String securityCode){
        BufferedImage image = createImage(securityCode);
        return convertImageToStream(image);
    }
    
    /**
     * 将BufferedImage转换成ByteArrayInputStream
     * @param image  图片
     * @return ByteArrayInputStream 流
     */
    private static ByteArrayInputStream convertImageToStream(BufferedImage image){
        
        ByteArrayInputStream inputStream = null;
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        
        try {
			ImageIO.write(image,"jpeg",bos);
			byte[] bts = bos.toByteArray();
	        inputStream = new ByteArrayInputStream(bts);
		} catch (IOException e){
			e.printStackTrace();
		}
        
        return inputStream;
    }
}