package com.fanglin.decoration.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.decoration.vo.DecorationMeasureVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.utils.Paging;

public interface DecorationMeasureService {
	
	public void pageDecorationMeasure(Paging paging,List<Filter> filters,DecorationMeasureVO decorationMeasure, int company) throws FLException;
	
	public void pageDecorationMeasureForApplay(Paging paging,List<Filter> filters,DecorationMeasureVO decorationMeasure, int company) throws FLException;

	public void sendDecorationMeasure(DecorationMeasureVO decorationMeasureVO) throws FLException;
	
	public void confirmDecorationMeasure(DecorationVO decorationVO, DecorationMeasureVO decorationMeasureVO) throws FLException;

	public int successDecorationMeasure(DecorationMeasureVO decorationMeasureVO, List<ConstructionNodeVO> constructionNodes, String userId) throws FLException;
	
	public int failureDecorationMeasure(DecorationMeasureVO decorationMeasureVO, String userId) throws FLException;

	public int updateDecorationMeasure(DecorationMeasureVO decorationMeasureVO) throws FLException;
	
	public int applayDecorationMeasure(DecorationMeasureVO decorationMeasureVO) throws FLException;
}
