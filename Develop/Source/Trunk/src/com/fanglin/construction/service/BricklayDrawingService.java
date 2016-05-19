/**
 * @File Name		: BricklayDrawingService.java
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

import com.fanglin.construction.vo.BricklayDrawingVO;

public interface BricklayDrawingService {
	
	public BricklayDrawingVO queryBricklayDrawingById(int bdId);
	
	public List<BricklayDrawingVO> queryBricklayDrawingByCsId(BricklayDrawingVO bricklayDrawingVO);
	
	public List<BricklayDrawingVO> queryBricklayDrawingByBcsdId(BricklayDrawingVO bricklayDrawingVO);
	
	public int saveOrUpdateBricklayDrawing(BricklayDrawingVO bricklayDrawingVO);
	
	public List<BricklayDrawingVO> addbrBricklayDrawings(BricklayDrawingVO bricklayDrawingVO, List<String> drawingUrls);
	
	public void deleteBrickLayDrawingByBdId(BricklayDrawingVO bricklayDrawingVO);

}
