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

import com.fanglin.construction.vo.OilDrawingVO;

public interface OilDrawingService {
	
	public OilDrawingVO queryOilDrawingById(int odId);
	
	public List<OilDrawingVO> queryOilDrawingByCsId(OilDrawingVO oilDrawingVO);
	
	public List<OilDrawingVO> queryOilDrawingByOcsId(OilDrawingVO oilDrawingVO);
	
	public int saveOrUpdateOilDrawing(OilDrawingVO oilDrawingVO);
	
	public List<OilDrawingVO> addOilDrawings(OilDrawingVO oilDrawingVO, List<String> drawingUrls);
	
	public void deleteOilDrawingByOdId(OilDrawingVO oilDrawingVO);

}
