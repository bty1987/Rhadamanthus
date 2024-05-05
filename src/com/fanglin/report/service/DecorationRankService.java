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
import com.fanglin.report.vo.DecorationDepartmentRankVO;
import com.fanglin.report.vo.DecorationRankVO;
import com.fanglin.report.vo.DecorationRegionRankVO;

public interface DecorationRankService {

	public List<String> queryDecorationForPlaceByUserId(String userId, int company);

	public List<DecorationRankVO> queryDecorationRankForTop(DecorationRankVO rankVO, int top, int company);

	public List<DecorationDepartmentRankVO> queryDecorationDepartmentRankForTop(DecorationDepartmentRankVO rankVO, int top, int company);

	public List<DecorationRegionRankVO> queryDecorationRegionRankForTop(DecorationRegionRankVO rankVO, int top, int company);

	public List<TopVO> queryDecorationRank(int top, int company);

	public List<TopVO> queryDecorationDepartmentRank(int top, int company);

	public List<TopVO> queryDecorationRegionRank(int top, int company);

	public int updateDecorationRank(String designerId, String designerName, long count, String currentTime, int company);

	public int updateDecorationDepartmentRank(String departmentId, String departmentName, long count, String currentTime, int company);

	public int updateDecorationRegionRank(String regionId, String regionName, long count, String currentTime, int company);

}
