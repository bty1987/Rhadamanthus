/*
 * @File Name	: ImageUtil.java
 * @Package		：com.fanglin.utils 
 * @Version		: 1.0
 * @Date		: 2014-7-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email		: 
 * Describing	: 图片处理相关的工具类
 */

package com.fanglin.utils;

import java.awt.Dimension;
import java.awt.Rectangle;
import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;

import magick.*;

public class ImageUtil {

	static {
		// 不能漏掉这个，不然jmagick.jar的路径找不到
		System.setProperty("jmagick.systemclassloader", "no");
	}

	@SuppressWarnings("unused")
	private static final Object lockObj = new Object();

	/**
	 * 压缩图片
	 * 
	 * @param filePath
	 *            源文件路径
	 * @param toPath
	 *            缩略图路径
	 */
	public static void createThumbnail(String filePath, String toPath) throws MagickException {
		ImageInfo info = null;
		MagickImage image = null;
		Dimension imageDim = null;
		MagickImage scaled = null;
		try {
			info = new ImageInfo(filePath);
			image = new MagickImage(info);
			imageDim = image.getDimension();
			int wideth = imageDim.width;
			int height = imageDim.height;
			if(wideth > height){
				height = 660 * height / wideth;
				wideth = 660;
			}
			scaled = image.scaleImage(wideth, height);// 小图片文件的大小.
			scaled.setFileName(toPath);
			scaled.writeImage(info);
		} catch (Exception e){
			e.printStackTrace();
		} finally {
			if(scaled != null){
				scaled.destroyImages();
			}
			if(image != null){
				image.destroyImages();
			}
		}
	}

	/**
	 * 水印(图片logo)
	 * 
	 * @param filePath
	 *            源文件路径
	 * @param toImg
	 *            修改图路径
	 * @param logoPath
	 *            logo图路径
	 * @throws MagickException
	 */
	public static void initLogoImg(String filePath, String toImg, String logoPath) throws MagickException {
		ImageInfo info = new ImageInfo();
		MagickImage fImage = null;
		MagickImage sImage = null;
		MagickImage fLogo = null;
		MagickImage sLogo = null;
		Dimension imageDim = null;
		Dimension logoDim = null;
		try {
			fImage = new MagickImage(new ImageInfo(filePath));
			imageDim = fImage.getDimension();
			int width = imageDim.width;
			int height = imageDim.height;
			if(width > 660){
				height = 660 * height / width;
				width = 660;
			}
			sImage = fImage.scaleImage(width, height);

			fLogo = new MagickImage(new ImageInfo(logoPath));
			logoDim = fLogo.getDimension();
			int lw = width / 8;
			int lh = logoDim.height * lw / logoDim.width;
			sLogo = fLogo.scaleImage(lw, lh);

			sImage.compositeImage(CompositeOperator.AtopCompositeOp, sLogo,
					width - (lw + lh / 10), height - (lh + lh / 10));
			sImage.setFileName(toImg);
			sImage.writeImage(info);
		} catch (Exception e){
			e.printStackTrace();
		} finally {
			if(sImage != null){
				sImage.destroyImages();
			}

			if(fImage != null){
				fImage.destroyImages();
			}
			if(fLogo != null){
				fLogo.destroyImages();
			}
			if(sLogo != null){
				sLogo.destroyImages();
			}
		}
	}

	/**
	 * 切图
	 * 
	 * @param imgPath
	 *            源图路径
	 * @param toPath
	 *            修改图路径
	 * @param w
	 *            宽度
	 * @param h
	 *            高度
	 * @throws MagickException
	 */
	public static void cutImg(String imgPath, String toPath, Integer w, Integer h) throws MagickException {
		ImageInfo infoS = null;
		MagickImage image = null;
		MagickImage cropped = null;
		MagickImage scaled = null;
		Rectangle rect = null;
		File f = new File(imgPath);
		
		if(f.exists() && f.isFile()){
			try {

				infoS = new ImageInfo(imgPath);
				image = new MagickImage(infoS);
				Dimension oldDim = image.getDimension();
				int oldw = oldDim.width;
				int oldh = oldDim.height;
				if( (w==null || w==0 || h==null || h==0)){

					cropped = image;
					// 缩放
					scaled = cropped.scaleImage(oldw, oldh);
				} else {
					if((double) oldw / oldh > (double) (w) / h){

						// 切图
						int neww = (int) (((double) (w) / h) * oldh);
						int x = (oldw - neww) / 2;
						rect = new Rectangle(x, 0, neww, oldh);
						cropped = image.cropImage(rect);
					} else if((double) oldw / oldh < (double) (w) / h){
						// 切图
						int newh = (int) (((double) (h) / w) * oldw);
						int y = (oldh - newh) / 2;
						rect = new Rectangle(0, y, oldw, newh);
						cropped = image.cropImage(rect);
					} else {

						cropped = image;
					}

					// 缩放
					scaled = cropped.scaleImage(w, h);
				}
				
				scaled.setFileName(toPath);
				scaled.writeImage(infoS);

			} catch (Exception e){
				e.printStackTrace();
			} finally {
				if(image != null){
					image.destroyImages();
				}
				if(cropped != null){
					cropped.destroyImages();
				}
				if(scaled != null){
					scaled.destroyImages();
				}
			}
		}
	}

	/**
	 * 切图
	 * 
	 * @param imgPath
	 *            源图路径
	 * @param toPath
	 *            修改图路径
	 * @param w
	 *            宽度
	 * @param h
	 *            高度
	 * @param x
	 * 			  x坐标
	 * @param y
	 * 			  y坐标
	 * @throws MagickException
	 */
	public static void cutImg(String imgPath, String toPath, int w, int h, int x, int y) throws MagickException {
		ImageInfo infoS = null;
		MagickImage image = null;
		MagickImage cropped = null;
		Rectangle rect = null;
		File f = new File(imgPath);
		
		if(f.exists()){
			try {
				infoS = new ImageInfo(imgPath);
				image = new MagickImage(infoS);
				rect = new Rectangle(x, y, w, h);
				cropped = image.cropImage(rect);
				cropped.setFileName(toPath);
				cropped.writeImage(infoS);

			} catch (Exception e){
				e.printStackTrace();
			} finally {
				if(cropped != null){
					cropped.destroyImages();
				}
				if(image != null){
					image.destroyImages();
				}
			}
		}
	}

	/**
	 * 图片缩放
	 * 
	 * @param imgPath
	 *            原图片路径
	 * @param toPath
	 *            缩放后的图片路径
	 * @param w
	 *            缩放后图片宽度
	 * @param h
	 *            缩放后图片高度
	 */

	public static void zoomImg(String imgPath, String toPath, int w, int h) throws Exception {
		File f = new File(imgPath);
		if(f.exists()){
			ImageInfo info = new ImageInfo(imgPath);
			MagickImage image = new MagickImage(info);
			MagickImage scaleImg = image.scaleImage(w, h);
			try {

				scaleImg.setFileName(toPath);
				scaleImg.writeImage(info);
			} catch (Exception e){
				e.printStackTrace();
			} finally {
				if(image != null){
					image.destroyImages();
				}
				if(scaleImg != null){
					scaleImg.destroyImages();
				}
			}
		}
	}

	/**
	 * 水印(文字)
	 * 
	 * @param filePath
	 *            源文件路径
	 * @param toImg
	 *            修改图路径
	 * @param text
	 *            名字(文字内容自己随意)
	 * @throws MagickException
	 */
	public static void initTextToImg(String filePath, String toImg, String text) throws MagickException {
		ImageInfo info = new ImageInfo(filePath);
		if(filePath.toUpperCase().endsWith("JPG") || filePath.toUpperCase().endsWith("JPEG")){
			info.setCompression(CompressionType.JPEGCompression); // 压缩类别为JPEG格式
			info.setPreviewType(PreviewType.JPEGPreview); // 预览格式为JPEG格式
			info.setQuality(95);
		}
		MagickImage scaled = null;
		MagickImage aImage = null;
		try {
			aImage = new MagickImage(info);
			Dimension imageDim = aImage.getDimension();
			int wideth = imageDim.width;
			int height = imageDim.height;
			if(wideth > 660){
				height = 660 * height / wideth;
				wideth = 660;
			}
			int a = 0;
			int b = 0;
			String[] as = text.split("");
			for(String string : as){
				if(string.matches("[\u4E00-\u9FA5]")){
					a++;
				}
				if(string.matches("[a-zA-Z0-9]")){
					b++;
				}
			}
			int tl = a * 12 + b * 6 + 300;
			scaled = aImage.scaleImage(wideth, height);
			if(wideth > tl && height > 5){
				DrawInfo aInfo = new DrawInfo(info);
				aInfo.setFill(PixelPacket.queryColorDatabase("white"));
				aInfo.setUnderColor(new PixelPacket(0, 0, 0, 100));
				aInfo.setPointsize(12);
				// 解决中文乱码问题,自己可以去随意定义个自己喜欢字体，我在这用的微软雅黑
				String fontPath = "C:/WINDOWS/Fonts/MSYH.TTF";
				// String fontPath = "/usr/maindata/MSYH.TTF";
				aInfo.setFont(fontPath);
				aInfo.setTextAntialias(true);
				aInfo.setOpacity(0);
				aInfo.setText("　" + text + "于　"
						+ new SimpleDateFormat("yyyy-MM-dd").format(new Date())
						+ "上传于XXXX网，版权归作者所有！");
				aInfo.setGeometry("+" + (wideth - tl) + "+" + (height - 5));
				scaled.annotateImage(aInfo);
			}
			scaled.setFileName(toImg);
			scaled.writeImage(info);
		} catch (Exception e){
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			if(scaled != null){
				scaled.destroyImages();
			}

			if(aImage != null){
				aImage.destroyImages();
			}
		}

	}

	public static void main(String[] args) throws Exception {
		String imgPath = "D:\\uploads\\321f0cf5-6637-47dc-b2d7-88b0f40c67c8.jpg";
		String toPath = "d:\\uploads\\zoo\\321f0cf5-6637-47dc-b2d7-88b0f40c67c8218170.jpg";
		
		System.out.println(System.getProperty("java.library.path"));
		
		imgPath = "D:\\Apache Software Foundation\\Tomcat 7.0\\webapps\\ROOT\\upload\\Imag\\userImg\\2014\\09\\932f0a9ed371427db4a085fa0a674d2e.jpg";
		toPath = "D:\\932f0a9ed371427db4a085fa0a674d2e150150.jpg";
		
		// 剪切
		System.out.println("================");
		ImageUtil.cutImg(imgPath, toPath, 150, 150);
		System.out.println("================");
		// toPath = "C:\\images\\psbe2.jpg";
		// // 图片缩放
		// ImageUtil.zoomImg(imgPath, toPath, 400, 300);
		//
		// toPath = "C:\\images\\psbe3.jpg";
		// String text = "我是单新强";
		// //
		// ImageUtil.initTextToImg(imgPath, toPath, text);

	}

}
