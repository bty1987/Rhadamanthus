package com.fanglin.construction.service;

import java.util.List;

import com.fanglin.construction.vo.ConstructionDrawingVO;
import com.fanglin.construction.vo.ConstructionScheduleVO;
import com.fanglin.construction.vo.ConstructionVO;
import com.fanglin.core.interceptor.FLException;

public interface ConstructionDrawingService {

	public List<ConstructionDrawingVO> queryConstructionDrawingByOrderId(ConstructionVO construction, ConstructionDrawingVO constructionDrawing) throws FLException;

	public List<ConstructionDrawingVO> queryConstructionDrawingByCid(ConstructionDrawingVO constructionDrawing);

	public int addConstructionDrawing(ConstructionDrawingVO constructionDrawing, String userId, int company) throws FLException;

	public List<ConstructionDrawingVO> addConstructionDrawings(ConstructionScheduleVO constructionScheduleVO, List<ConstructionDrawingVO> constructionDrawings, String userId);

	public void deleteConstructionDrawingByCdId(ConstructionDrawingVO constructionDrawing);

}
