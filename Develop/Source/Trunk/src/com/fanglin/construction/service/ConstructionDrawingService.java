package com.fanglin.construction.service;

import java.util.List;

import com.fanglin.construction.vo.ConstructionDrawingVO;

public interface ConstructionDrawingService {

	public List<ConstructionDrawingVO> queryConstructionDrawing(ConstructionDrawingVO constructionDrawing);
	
	public int addConstructionDrawing(ConstructionDrawingVO constructionDrawing, String userId);

	public List<ConstructionDrawingVO> addConstructionDrawings(ConstructionDrawingVO constructionDrawing, List<String> drawingUrls, String userId);

	public void deleteConstructionDrawingByCdId(ConstructionDrawingVO constructionDrawing);

}
