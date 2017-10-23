package com.fanglin.report.service;

import java.util.List;

import com.fanglin.common.vo.TopVO;
import com.fanglin.report.vo.MaterialDesignerDepartmentRankVO;
import com.fanglin.report.vo.MaterialDesignerRankVO;
import com.fanglin.report.vo.MaterialDesignerRegionRankVO;


public interface MaterialRankService {
	
	public List<MaterialDesignerRankVO> queryMaterialDesignerRank();
	
	public List<String> queryMaterialDesignerRankForPlaceByUserId(String userId,int company);
	
	public List<String> queryZaterialDesignerRankForPlaceByUserId(String userId,int company);
	
	public List<MaterialDesignerRankVO> queryMaterialDesignerRankForTop(int top,int company);
	
	public List<TopVO> queryMaterialDesignerRank(int top,int company);
	
	public List<MaterialDesignerDepartmentRankVO> queryMaterialDesignerDepartmentRankForTop(String userId, int top,int company);
	
	public List<TopVO> queryMaterialDesignerDepartmentRank(int top,int company);
		
	public List<MaterialDesignerRegionRankVO> queryMaterialDesignerRegionRankForTop(String userId, int top,int company);
	
	public List<TopVO> queryMaterialDesignerRegionRank(int top,int company);
		
	public List<TopVO> queryZaterialDesignerRank(int top,int company);
			
	public List<TopVO> queryZaterialDesignerDepartmentRank(int top,int company);
	
	public List<TopVO> queryZaterialDesignerRegionRank(int top,int company);
	
	public int updateMaterialDesignerRank(String designerId, String designerName, float count, String currentTime,int company);
	
	public int updateMaterialDesignerDepartmentRank(String departmentId, String departmentName, float count, String currentTime,int company);
	
	public int updateMaterialDesignerRegionRank(String regionId, String regionName, float count, String currentTime,int company);
	
	public int updateZaterialDesignerRank(String designerId, String designerName, float count, String currentTime,int company);
	
	public int updateZaterialDesignerDepartmentRank(String departmentId, String departmentName, float count, String currentTime,int company);
	
	public int updateZaterialDesignerRegionRank(String regionId, String regionName, float count, String currentTime,int company);

}
