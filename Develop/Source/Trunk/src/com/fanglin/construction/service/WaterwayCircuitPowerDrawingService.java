/**
 * @File Name		: WaterwayCircuitPowerDrawingService.java
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

import com.fanglin.construction.vo.WaterwayCircuitPowerDrawingVO;

public interface WaterwayCircuitPowerDrawingService {
	
	public WaterwayCircuitPowerDrawingVO queryWaterwayCircuitPowerDrawingById(int wcpdId);
	
	public List<WaterwayCircuitPowerDrawingVO> queryWaterwayCircuitPowerDrawingByCsId(WaterwayCircuitPowerDrawingVO waterwayCircuitPowerDrawingVO);
	
	public List<WaterwayCircuitPowerDrawingVO> queryWaterwayCircuitPowerDrawingByWcpcsId(WaterwayCircuitPowerDrawingVO waterwayCircuitPowerDrawingVO);
	
	public int saveOrUpdateWaterwayCircuitPowerDrawing(WaterwayCircuitPowerDrawingVO waterwayCircuitPowerDrawingVO);
	
	public List<WaterwayCircuitPowerDrawingVO> addWaterwayCircuitPowerDrawings(WaterwayCircuitPowerDrawingVO waterwayCircuitPowerDrawingVO, List<String> drawingUrls);
	
	public void deleteWaterwayCircuitPowerDrawingByWcpdId(WaterwayCircuitPowerDrawingVO waterwayCircuitPowerDrawing);
	
}
