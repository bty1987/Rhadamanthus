/**
 * @File Name		: ChanDrawingService.java
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

import com.fanglin.construction.vo.ChanDrawingVO;

public interface ChanDrawingService {
	
	public ChanDrawingVO queryChanDrawingById(int cdId);
	
	public List<ChanDrawingVO> queryChanDrawingByCsId(ChanDrawingVO chanDrawingVO);
	
	public List<ChanDrawingVO> queryChanDrawingByCcsId(ChanDrawingVO chanDrawingVO);
	
	public int saveOrUpdateChanDrawing(ChanDrawingVO chanDrawingVO);
	
	public List<ChanDrawingVO> addChanDrawings(ChanDrawingVO chanDrawingVO, List<String> drawingUrls);
	
	public void deleteChanDrawingByCdId(ChanDrawingVO chanDrawingVO);
	
	public void deleteChanDrawingByCssId(int ccsId);
	
}
