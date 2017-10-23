package com.fanglin.report.service;

import java.util.List;

import com.fanglin.common.vo.TopVO;
import com.fanglin.report.vo.DecorationDesignerDepartmentRankVO;
import com.fanglin.report.vo.DecorationDesignerRankVO;
import com.fanglin.report.vo.DecorationDesignerRegionRankVO;

public interface DecorationRankService {
	
	public List<String> queryDecorationDesignerForPlaceByUserId(String userId,int company);
	
	public List<DecorationDesignerRankVO> queryDecorationDesignerRankForTop(int top,int company);
	
	public List<DecorationDesignerDepartmentRankVO> queryDecorationDesignerDepartmentRankForTop(String userId, int top,int company);

	public List<DecorationDesignerRegionRankVO> queryDecorationDesignerRegionRankForTop(String userId, int top,int company);

	public List<TopVO> queryDecorationDesignerRank(int top,int company);
	
	public List<TopVO> queryDecorationDesignerDepartmentRank(int top,int company);
	
	public List<TopVO> queryDecorationDesignerRegionRank(int top,int company);
			
	public int updateDecorationDesignerRank(String designerId, String designerName, float count, String currentTime,int company);
	
	public int updateDecorationDesignerDepartmentRank(String departmentId, String departmentName, float count, String currentTime,int company);
	
	public int updateDecorationDesignerRegionRank(String regionId, String regionName, float count, String currentTime,int company);
	
}
