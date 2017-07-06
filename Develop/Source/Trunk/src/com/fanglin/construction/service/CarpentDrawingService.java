/**
 * @File Name		: CarpentDrawingService.java
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

import com.fanglin.construction.vo.CarpentDrawingVO;

public interface CarpentDrawingService {
	
	public CarpentDrawingVO queryCarpentDrawingById(int cdId);
	
	public List<CarpentDrawingVO> queryCarpentDrawingByCsId(CarpentDrawingVO carpentDrawingVO);
	
	public List<CarpentDrawingVO> queryCarpentDrawingByCcsId(CarpentDrawingVO carpentDrawingVO);
	
	public int saveOrUpdateCarpentDrawing(CarpentDrawingVO carpentDrawingVO, String userId);
	
	public List<CarpentDrawingVO> addCarpentDrawings(CarpentDrawingVO carpentDrawingVO, List<String> drawingUrls, String userId);
	
	public void deleteCarpentDrawingByCdId(CarpentDrawingVO carpentDrawingVO);

}
