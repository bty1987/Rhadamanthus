package com.fanglin.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.util.Assert;

import com.fanglin.common.vo.ExcelWorkSheet;
import com.fanglin.salary.vo.UserSalaryVO;

public class PoiExcelUtil {

	public static final int DONOT_EXPORT = 0;
	
	public static final int CHANGE_DEAFAULT = 1;
	
	public static final int CHANGE_INT_TO_STRING = 1;
	
	public static final int CHANGE_TIMESTAMP_TO_STRTING = 2;
	
	public static final int CHANGE_DATE_TO_STRING = 3;
	
	public static final int CHANGE_FLOAT_TO_STRING = 4;
	
	public static final int CHANGE_DOUBLE_TO_STRING = 5;

	private ExcelWorkSheet<?> sheet;

	// private static String changeIntToString(Integer in){
	// return in.toString();
	// }
	//
	// private static String changeDateToString(Date in){
	// return DateUtil.getDateToDateString(in, "yyyy-MM-dd");
	// }
	//
	// private static String changeFloatToString(Float in){
	// DecimalFormat df = new DecimalFormat("0.00");
	// return df.format(in);
	// }
	//
	// private static String changeDoubleToString(Double in){
	// DecimalFormat df = new DecimalFormat("0.00");
	// return df.format(in);
	// }

	public static void exportExcel(ExcelWorkSheet<?> sheetObj, OutputStream out){
		
		HSSFWorkbook workbook = new HSSFWorkbook(); // 声明一个工作薄

		String sheetName = "sheet1"; // 生成一个表格
		
		if(sheetObj.getSheetName()!= null){
			sheetName = sheetObj.getSheetName();
		}
		HSSFSheet sheet = workbook.createSheet(sheetName);
		
		sheet.setDefaultColumnWidth(15); // 设置表格默认列宽度为15个字节
		
		HSSFCellStyle style = workbook.createCellStyle(); // 生成一个样式
		
		style.setFillForegroundColor(HSSFColor.SKY_BLUE.index); // 设置这些样式
		style.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
		style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
		style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
		style.setBorderRight(HSSFCellStyle.BORDER_THIN);
		style.setBorderTop(HSSFCellStyle.BORDER_THIN);
		style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
		
		HSSFFont font = workbook.createFont(); // 生成一个字体
		font.setColor(HSSFColor.VIOLET.index);
		font.setFontHeightInPoints((short) 12);
		font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
		
		style.setFont(font); // 把字体应用到当前的样式
		

		HSSFCellStyle style2 = workbook.createCellStyle(); // 生成并设置另一个样式
		style2.setFillForegroundColor(HSSFColor.LIGHT_YELLOW.index);
		style2.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
		style2.setBorderBottom(HSSFCellStyle.BORDER_THIN);
		style2.setBorderLeft(HSSFCellStyle.BORDER_THIN);
		style2.setBorderRight(HSSFCellStyle.BORDER_THIN);
		style2.setBorderTop(HSSFCellStyle.BORDER_THIN);
		style2.setAlignment(HSSFCellStyle.ALIGN_CENTER);
		style2.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
		
		HSSFFont font2 = workbook.createFont(); // 生成另一个字体
		font2.setBoldweight(HSSFFont.BOLDWEIGHT_NORMAL);
		
		style2.setFont(font2); // 把字体应用到当前的样式

		
		HSSFRow row = sheet.createRow(0); // 产生表格标题行
		for(int i = 0; i < sheetObj.getColumns().size(); ++i){
			HSSFCell cell = row.createCell(i);
			cell.setCellStyle(style);
			HSSFRichTextString text = new HSSFRichTextString(sheetObj.getColumns().get(i));
			cell.setCellValue(text);
		}

		// 遍历集合数据，产生数据行
		int index = 0;
		for(int i = 0; i < sheetObj.getData().size(); ++i){
			index++;
			row = sheet.createRow(index);

			Object obj = sheetObj.getData().get(i);
			int colIndex = 0;
			for(int j = 0; j < sheetObj.getPropertyNames().size(); ++j){
				String valueString = null;
				
				HSSFCell cell = row.createCell(colIndex);
				cell.setCellStyle(style2);
				
				valueString = sheetObj.getIndexPropertyValue(obj, j);
				HSSFRichTextString richString = new HSSFRichTextString(valueString);
				cell.setCellValue(richString);
				
				++colIndex ;
			}
		}

		try {
			workbook.write(out);
		} catch (IOException e){
			e.printStackTrace();
		}
	}

	/**
	 * 对外提供读取excel 的方法
	 * */
	public static List<List<String>> readExcel(String filePath) throws IOException {
		File file = new File(filePath);

		String extension = filePath.lastIndexOf(".") == -1 ? "" : filePath.substring(filePath.lastIndexOf(".") + 1);
		
		if("xls".equals(extension)){
			return readExcel(file);
		}else if("xlsx".equals(extension)){
			return readExcel(file);
		}else{
			throw new IOException("不支持的文件类型");
		}
	}

	/**
	 * 对外提供读取excel 的方法
	 * */
	public static List<List<String>> readExcel(File file) throws IOException {

		Workbook wb = null;
		String filePath = file.getName();
		String extension = filePath.lastIndexOf(".") == -1 ? "" : filePath.substring(filePath.lastIndexOf(".") + 1);
		
		if("xls".equals(extension)){
			// 构造 XSSFWorkbook 对象，strPath 传入文件路径
			wb = new HSSFWorkbook(new FileInputStream(file));
		} else if("xlsx".equals(extension)){
			wb = new XSSFWorkbook(new FileInputStream(file));
		} else {
			throw new IOException("不支持的文件类型");
		}

		return readExcel(wb);
	}

	private static List<List<String>> readExcel(Workbook wb) throws IOException {
		List<List<String>> list = new LinkedList<List<String>>();
		
		Sheet sheet = wb.getSheetAt(0); // 读取第一章表格内容

		String value = "";
		Row row = null;
		Cell cell = null;
		int counter = 0;

		for(int i = sheet.getFirstRowNum(); counter <= sheet.getLastRowNum(); i++){
			row = sheet.getRow(i);
			if(row == null){
				continue;
			} else {
				counter++;
			}

			List<String> linked = new LinkedList<String>();
			for(int j = row.getFirstCellNum(); j <= row.getLastCellNum(); j++){
				cell = row.getCell(j);
				
				if(cell == null){
					linked.add("");
					continue;
				}
				
				DecimalFormat df = new DecimalFormat("0");// 格式化 number String
				SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); // 格式化日期字符串
				DecimalFormat nf = new DecimalFormat("0.00");// 格式化数字

				switch (cell.getCellType()){
					case Cell.CELL_TYPE_STRING:
						value = cell.getStringCellValue();
						break;
					case Cell.CELL_TYPE_NUMERIC: // + " 列 is Number type ; DateFormt:" + cell.getCellStyle().getDataFormatString());
						if("@".equals(cell.getCellStyle().getDataFormatString())){
							value = df.format(cell.getNumericCellValue());
						} else if("General".equals(cell.getCellStyle()
								.getDataFormatString())){
							value = nf.format(cell.getNumericCellValue());
						} else {
							value = sdf.format(HSSFDateUtil.getJavaDate(cell
									.getNumericCellValue()));
						}
						break;
					case Cell.CELL_TYPE_BOOLEAN:
						value = String.valueOf(cell.getBooleanCellValue());
						break;
					case Cell.CELL_TYPE_BLANK:
						value = "";
						break;
					case HSSFCell.CELL_TYPE_FORMULA:
						// cell.getCellFormula();
						try {
							value = String.valueOf(cell.getNumericCellValue());
						} catch (IllegalStateException e){
							value = String.valueOf(cell.getRichStringCellValue());
						}
						break;
					default:
						value = cell.toString();
				}
				if(value == null || "".equals(value)){
					linked.add("");
					continue;
				}
				linked.add(value);
			}
			list.add(linked);
		}
		return list;
	}

	public void setSheet(ExcelWorkSheet<?> sheet){
		this.sheet = sheet;
	}

	public ExcelWorkSheet<?> getSheet(){
		return sheet;
	}

	public static void main(String[] args) throws IOException {
		try {
			List<List<String>> e = readExcel("D:\\Decoration报价.xls");
			for(List<String> list : e){
				for(String object : list){
					System.out.print(object + "\t");
				}
				System.out.println();
			}

		} catch (IOException e){
			e.printStackTrace();
		}

		List<List<String>> content = readExcel("D:\\员工工资信息模板.xlsx");

		Assert.isTrue(content.size() > 1);
		ExcelWorkSheet<UserSalaryVO> sheet = new ExcelWorkSheet<UserSalaryVO>();
		List<UserSalaryVO> l = new ArrayList<UserSalaryVO>();
		for(int i = 1; i < content.size(); ++i){// 第一行是表头
			UserSalaryVO tem = new UserSalaryVO();

			tem.setComments(content.get(i).get(4));
			tem.setUserId(content.get(i).get(0));
			tem.setUserName(content.get(i).get(1));
			tem.setMoney(Float.valueOf(content.get(i).get(3)));
			tem.setCreateUserId("tesllslsl");
			tem.setType(content.get(i).get(2));

			l.add(tem);
		}

		sheet.setData(l);
		sheet.setSheetName("ceshi");
		sheet.setColumns(Arrays.asList("员工编号", "员工姓名", "类型", "金额 ", "备注"));
		sheet.setPropertyNames(Arrays.asList("userId", "userName", "type", "money", "comments"));
		
		OutputStream out = null;
		try {
			out = new FileOutputStream("D:\\员工工资信息模板1.xls");  
			exportExcel(sheet, out);
			
		} catch (Exception e){
			e.printStackTrace();
		}finally{
			if(out!=null)
				out.close();
		}
	}
}
