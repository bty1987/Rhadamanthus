package com.fanglin.quotation.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.vo.SelectionVO;

public interface SelectionService {

	public SelectionVO querySelectionByQid(SelectionVO selectionVO) throws FLException;

	public SelectionVO querySelectionByOrderId(SelectionVO selectionVO) throws FLException;

	public SelectionVO addSelection(SelectionVO selectionVO) throws FLException;

	public int addSelection(Long qid) throws FLException;

	public int updateSelectionForAdvance(SelectionVO selectionVO) throws FLException;

}
