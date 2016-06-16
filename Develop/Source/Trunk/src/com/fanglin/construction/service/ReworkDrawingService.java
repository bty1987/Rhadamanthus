/**
 * @File Name		: ReworkDrawingService.java
 * @Package   	: com.fanglin.service.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service;

import java.util.List;

import com.fanglin.construction.vo.ReworkDrawingVO;

public interface ReworkDrawingService {
	
	public List<ReworkDrawingVO> queryDrawingByReworkId(ReworkDrawingVO reworkDrawingVO);
	
	public int saveOrUpdateReworkDrawing(ReworkDrawingVO reworkDrawingVO, String userId);
	
	public void deleteReworkDrawingById(ReworkDrawingVO reworkDrawingVO);
	
	public void deleteReworkDrawingByReworkId(List<String> rwIds);

}
