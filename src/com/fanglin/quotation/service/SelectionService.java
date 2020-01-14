package com.fanglin.quotation.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.vo.SelectionVO;

public interface SelectionService {
	
	public SelectionVO querySelectionByQid(SelectionVO selectionVO);
	
	public SelectionVO querySelectionByOrderId(SelectionVO selectionVO);
	
	public int updateSelectionForAdvance(SelectionVO selectionVO) throws FLException;
}
