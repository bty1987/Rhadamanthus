package com.fanglin.construction.service;

import java.util.List;

import com.fanglin.construction.vo.ConstructionDrawingVO;
import com.fanglin.construction.vo.ConstructionVO;
import com.fanglin.core.interceptor.FLException;

public interface ConstructionDrawingService {
	
	public List<ConstructionDrawingVO> queryConstructionDrawingByOrderId(ConstructionVO construction, ConstructionDrawingVO constructionDrawing) throws FLException;

	public List<ConstructionDrawingVO> queryConstructionDrawingByCid(ConstructionDrawingVO constructionDrawing);
	
	public int addConstructionDrawing(ConstructionDrawingVO constructionDrawing, String userId);

	public List<ConstructionDrawingVO> addConstructionDrawings(ConstructionDrawingVO constructionDrawing, List<String> drawingUrls, String userId);

	public void deleteConstructionDrawingByCdId(ConstructionDrawingVO constructionDrawing);

}
