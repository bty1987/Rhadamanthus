/**
 * @File Name		: PutlineDrawingService.java
 * @Package   	: com.fanglin.service.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-10-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service;

import java.util.List;

import com.fanglin.construction.vo.PutlineDrawingVO;

public interface PutlineDrawingService {
	
	public PutlineDrawingVO queryPutlineDrawingById(int pldId);
	
	public List<PutlineDrawingVO> queryPutlineDrawingByCsId(PutlineDrawingVO putlineDrawingVO);
	
	public List<PutlineDrawingVO> queryPutlineDrawingByPlcsId(PutlineDrawingVO putlineDrawingVO);
	
	public int saveOrUpdatePutlineDrawing(PutlineDrawingVO putlineDrawingVO, String userId);
	
	public List<PutlineDrawingVO> addPutlineDrawings(PutlineDrawingVO putlineDrawingVO, List<String> drawingUrls, String userId);
	
	public void deletePutlineDrawingByPldId(PutlineDrawingVO putlineDrawingVO);
	
	public void deletePutlineDrawingByPlcsId(int plcsId);

}
