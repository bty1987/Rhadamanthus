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

import com.fanglin.core.vo.FilterVO;
import com.fanglin.report.vo.MaterialBrandCountVO;
import com.fanglin.report.vo.MaterialDepartmentCountVO;
import com.fanglin.report.vo.MaterialDesignerCountVO;
import com.fanglin.report.vo.MaterialDesignerDepartmentCountVO;
import com.fanglin.report.vo.MaterialDesignerRegionCountVO;
import com.fanglin.report.vo.MaterialTypeCountVO;
import com.fanglin.report.vo.ZaterialDesignerCountVO;
import com.fanglin.report.vo.ZaterialDesignerDepartmentCountVO;
import com.fanglin.report.vo.ZaterialDesignerRegionCountVO;

public interface MaterialReportService {
	
	public int updateMaterialTypeCount(String materialType, float count, String currentTime);
	
	public int updateMaterialBrandCount(String materialBrand, float count, String currentTime);
	
	public int updateMaterialDepartmentCount(String departmentId, float count, String currentTime);
	
	public int updateMaterialDesignerCount(String designerId, String designerName, String departmentId, String departmentName, String regionId, String regionName, float count, String currentTime);
	
	public int updateMaterialDesignerDepartmentCount(String departmentId, String departmentName, String regionId, String regionName, float count, String currentTime);
	
	public int updateMaterialDesignerRegionCount(String regionId, String regionName, float count, String currentTime);
	
	public int updateZaterialDesignerCount(String designerId, String designerName, String departmentId, String departmentName, String regionId, String regionName, String materialBrand, float count, String currentTime);
	
	public int updateZaterialDesignerDepartmentCount(String departmentId, String departmentName, String regionId, String regionName, String materialBrand, float count, String currentTime);
	
	public int updateZaterialDesignerRegionCount(String regionId, String regionName, String materialBrand, float count, String currentTime);
	
	public List<MaterialTypeCountVO> reportMaterialTypeCount(List<FilterVO> filters);
	
	public List<MaterialBrandCountVO> reportMaterialBrandCount(List<FilterVO> filters);
	
	public List<MaterialDesignerCountVO> reportMaterialDesignerCount(List<FilterVO> filters);

	public List<MaterialDepartmentCountVO> reportMaterialDepartmentCount(List<FilterVO> filters);

	public List<MaterialDesignerDepartmentCountVO> reportMaterialDesignerDepartmentCount(List<FilterVO> filters);
	
	public List<MaterialDesignerRegionCountVO> reportMaterialDesignerRegionCount(List<FilterVO> filters);
	
	public List<ZaterialDesignerCountVO> reportZaterialDesignerCount(List<FilterVO> filters) ;

	public List<ZaterialDesignerDepartmentCountVO> reportZaterialDesignerDepartmentCount(List<FilterVO> filters);

	public List<ZaterialDesignerRegionCountVO> reportZaterialDesignerRegionCount(List<FilterVO> filters);
	
	public List<MaterialTypeCountVO> countMaterialTypeCount(List<FilterVO> filters);
	
	public List<MaterialBrandCountVO> countMaterialBrandCount(List<FilterVO> filters);
	
	public List<MaterialDesignerCountVO> countMaterialDesignerCount(List<FilterVO> filters);
	
	public List<MaterialDesignerDepartmentCountVO> countMaterialDesignerDepartmentCount(List<FilterVO> filters);
	
	public List<MaterialDesignerRegionCountVO> countMaterialDesignerRegionCount(List<FilterVO> filters);
	
	public List<ZaterialDesignerCountVO> countZaterialDesignerCount(List<FilterVO> filters);
	
	public List<ZaterialDesignerDepartmentCountVO> countZaterialDesignerDepartmentCount(List<FilterVO> filters);
	
	public List<ZaterialDesignerRegionCountVO> countZaterialDesignerRegionCount(List<FilterVO> filters);

}
