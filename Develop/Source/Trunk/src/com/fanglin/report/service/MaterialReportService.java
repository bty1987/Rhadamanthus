/**
 * @File Name		: MaterialReportService.java
 * @Package   	: com.fanglin.service.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-11-15
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.report.vo.MaterialDepartmentCountVO;
import com.fanglin.report.vo.MaterialDesignerCountVO;
import com.fanglin.report.vo.MaterialDesignerDepartmentCountVO;
import com.fanglin.report.vo.MaterialDesignerRegionCountVO;

public interface MaterialReportService {
	
	public int updateMaterialDepartmentCount(String departmentId, float count, String currentTime);
	
	public int updateMaterialDesignerCount(String designerId, String designerName, String departmentId, String departmentName, String regionId, String regionName, float count, String currentTime);
	
	public int updateMaterialDesignerDepartmentCount(String departmentId, String departmentName, String regionId, String regionName, float count, String currentTime);
	
	public int updateMaterialDesignerRegionCount(String regionId, String regionName, float count, String currentTime);
	
	public List<MaterialDesignerCountVO> reportMaterialDesignerCount(List<Filter> filters);

	public List<MaterialDepartmentCountVO> reportMaterialDepartmentCount(List<Filter> filters);

	public List<MaterialDesignerDepartmentCountVO> reportMaterialDesignerDepartmentCount(List<Filter> filters);
	
	public List<MaterialDesignerRegionCountVO> reportMaterialDesignerRegionCount(List<Filter> filters);
	
	
	public List<MaterialDesignerCountVO> countMaterialDesignerCount(List<Filter> filters);
	
	public List<MaterialDesignerDepartmentCountVO> countMaterialDesignerDepartmentCount(List<Filter> filters);
	
	public List<MaterialDesignerRegionCountVO> countMaterialDesignerRegionCount(List<Filter> filters);
	
	
}
