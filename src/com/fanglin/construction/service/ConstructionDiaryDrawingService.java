package com.fanglin.construction.service;

import java.util.List;
import com.fanglin.construction.vo.ConstructionDiaryDrawingVO;
import com.fanglin.construction.vo.ConstructionVO;
import com.fanglin.core.interceptor.FLException;

public interface ConstructionDiaryDrawingService {

	public List<ConstructionDiaryDrawingVO> queryConstructionDiaryDrawingByOrderId(ConstructionVO construction, ConstructionDiaryDrawingVO constructionDiaryDrawing) throws FLException;

	public List<ConstructionDiaryDrawingVO> queryConstructionDiaryDrawingByCdid(ConstructionDiaryDrawingVO constructionDiaryDrawing);

	public long addConstructionDiaryDrawing(ConstructionDiaryDrawingVO constructionDiaryDrawing, String userId, int company) throws FLException;

	public void deleteConstructionDiaryDrawingByCddid(ConstructionDiaryDrawingVO constructionDiaryDrawing);

}
