/**
 * @File Name		: DecorationRankService.java
 * @Package   	: com.fanglin.report.service
 * @Version		: 1.0
 * @Date			: 2015-6-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.service;

import java.util.List;

import com.fanglin.common.vo.TopVO;
import com.fanglin.report.vo.DecorationDesignerDepartmentRankVO;
import com.fanglin.report.vo.DecorationDesignerRankVO;
import com.fanglin.report.vo.DecorationDesignerRegionRankVO;

public interface DecorationRankService {
	
	public List<DecorationDesignerRankVO> queryDecorationDesignerRankForTop(int top);
	
	public List<TopVO> queryDecorationDesignerRank(int top);
	
	public List<DecorationDesignerDepartmentRankVO> queryDecorationDesignerDepartmentRankForTop(String userId, int top);
	
	public List<TopVO> queryDecorationDesignerDepartmentRank(int top);
	
	public List<DecorationDesignerRegionRankVO> queryDecorationDesignerRegionRankForTop(String userId, int top);
	
	public List<TopVO> queryDecorationDesignerRegionRank(int top);
	
	public List<String> queryDecorationDesignerForPlaceByUserId(String userId);
	
	public int updateDecorationDesignerRank(String designerId, String designerName, float count, String currentTime);
	
	public int updateDecorationDesignerDepartmentRank(String departmentId, String departmentName, float count, String currentTime);
	
	public int updateDecorationDesignerRegionRank(String regionId, String regionName, float count, String currentTime);
	
}
