/**
 * @File Name		: OilDrawingService.java
 * @Package   	: com.fanglin.service.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service;

import java.util.List;

import com.fanglin.construction.vo.GroundLevelingDrawingVO;

public interface GroundLevelingDrawingService {
	
	public GroundLevelingDrawingVO queryGroundLevelingDrawingById(int odId);
	
	public List<GroundLevelingDrawingVO> queryGroundLevelingDrawingByCsId(GroundLevelingDrawingVO groundLevelingDrawingVO);
	
	public List<GroundLevelingDrawingVO> queryGroundLevelingDrawingByGlcsId(GroundLevelingDrawingVO groundLevelingDrawingVO);
	
	public int saveOrUpdateGroundLevelingDrawing(GroundLevelingDrawingVO groundLevelingDrawingVO);
	
	public List<GroundLevelingDrawingVO> addGroundLevelingDrawings(GroundLevelingDrawingVO groundLevelingDrawingVO, List<String> drawingUrls);
	
	public void deleteGroundLevelingDrawingByGldId(GroundLevelingDrawingVO groundLevelingDrawingVO);

}
