/**
 * @File Name		: MaterialRankService.java
 * @Package   	: com.fanglin.service.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-11-16
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.service;

import java.util.List;

import com.fanglin.common.vo.TopVO;
import com.fanglin.report.vo.MaterialDesignerDepartmentRankVO;
import com.fanglin.report.vo.MaterialDesignerRankVO;
import com.fanglin.report.vo.MaterialDesignerRegionRankVO;
import com.fanglin.report.vo.ZaterialDesignerDepartmentRankVO;
import com.fanglin.report.vo.ZaterialDesignerRankVO;
import com.fanglin.report.vo.ZaterialDesignerRegionRankVO;

public interface MaterialRankService {
	
	public List<MaterialDesignerRankVO> queryMaterialDesignerRank();
	
	public List<MaterialDesignerRankVO> queryMaterialDesignerRankForTop(int top);
	
	public List<TopVO> queryMaterialDesignerRank(int top);
	
	public List<MaterialDesignerDepartmentRankVO> queryMaterialDesignerDepartmentRankForTop(String userId, int top);
	
	public List<TopVO> queryMaterialDesignerDepartmentRank(int top);
	
	public List<MaterialDesignerRegionRankVO> queryMaterialDesignerRegionRankForTop(String userId, int top);
	
	public List<TopVO> queryMaterialDesignerRegionRank(int top);
	
	public List<String> queryMaterialDesignerRankForPlaceByUserId(String userId);
	
	public List<ZaterialDesignerRankVO> queryZaterialDesignerRankForTop(int top);
	
	public List<TopVO> queryZaterialDesignerRank(int top);
	
	public List<String> queryZaterialDesignerRankForPlaceByUserId(String userId);
	
	public List<ZaterialDesignerDepartmentRankVO> queryZaterialDesignerDepartmentRankForTop(String userId, int top);
	
	public List<TopVO> queryZaterialDesignerDepartmentRank(int top);
	
	public List<ZaterialDesignerRegionRankVO> queryZaterialDesignerRegionRankForTop(String userId, int top);
	
	public List<TopVO> queryZaterialDesignerRegionRank(int top);
	
	public int updateMaterialDesignerRank(String designerId, String designerName, float count, String currentTime);
	
	public int updateMaterialDesignerDepartmentRank(String departmentId, String departmentName, float count, String currentTime);
	
	public int updateMaterialDesignerRegionRank(String regionId, String regionName, float count, String currentTime);
	
	public int updateZaterialDesignerRank(String designerId, String designerName, float count, String currentTime);
	
	public int updateZaterialDesignerDepartmentRank(String departmentId, String departmentName, float count, String currentTime);
	
	public int updateZaterialDesignerRegionRank(String regionId, String regionName, float count, String currentTime);

}
