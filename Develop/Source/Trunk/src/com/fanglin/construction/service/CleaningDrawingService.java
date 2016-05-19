/**
 * @File Name		: CleaningDrawingService.java
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

import com.fanglin.construction.vo.CleaningDrawingVO;

public interface CleaningDrawingService {
	
	public CleaningDrawingVO queryCleaningDrawingById(int cdId);
	
	public List<CleaningDrawingVO> queryCleaningDrawingByCsId(CleaningDrawingVO cleaningDrawingVO);
	
	public List<CleaningDrawingVO> queryCleaningDrawingByCcsId(CleaningDrawingVO cleaningDrawingVO);
	
	public int saveOrUpdateCleaningDrawing(CleaningDrawingVO cleaningDrawingVO);
	
	public List<CleaningDrawingVO> addCleaningDrawings(CleaningDrawingVO cleaningDrawingVO, List<String> drawingUrls);
	
	public void deleteCleaningDrawingByCdId(CleaningDrawingVO cleaningDrawingVO);

}
