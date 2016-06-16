/**
 * @File Name		: WaterwayCircuitCheckDrawingService.java
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

import com.fanglin.construction.vo.WaterwayCircuitCheckDrawingVO;

public interface WaterwayCircuitCheckDrawingService {
	
	public WaterwayCircuitCheckDrawingVO queryWaterwayCircuitCheckDrawingById(int wcpdId);
	
	public List<WaterwayCircuitCheckDrawingVO> queryWaterwayCircuitCheckDrawingByCsId(WaterwayCircuitCheckDrawingVO waterwayCircuitCheckDrawingVO);
	
	public List<WaterwayCircuitCheckDrawingVO> queryWaterwayCircuitCheckDrawingByWcccsId(WaterwayCircuitCheckDrawingVO waterwayCircuitCheckDrawingVO);
	
	public int saveOrUpdateWaterwayCircuitCheckDrawing(WaterwayCircuitCheckDrawingVO waterwayCircuitCheckDrawingVO);
	
	public List<WaterwayCircuitCheckDrawingVO> addwaterWaterwayCircuitCheckDrawings(WaterwayCircuitCheckDrawingVO waterwayCircuitCheckDrawingVO, List<String> drawingUrls);
	
	public void deleteWaterwayCircuitCheckDrawingByWccdId(WaterwayCircuitCheckDrawingVO waterwayCircuitCheckDrawing);
	
}
