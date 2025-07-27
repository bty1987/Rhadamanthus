package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.quotation.vo.SelectionVO;
import com.fanglin.utils.Paging;

public interface SelectionService {

	public void pageSelection(Paging paging, List<Filter> filters, Integer company) throws FLException;

	public SelectionVO querySelectionByQid(SelectionVO selectionVO) throws FLException;

	public SelectionVO querySelectionByOrderId(SelectionVO selectionVO) throws FLException;

	public SelectionVO addSelection(SelectionVO selectionVO, String userId) throws FLException;

	public int addSelection(Long qid, String userId) throws FLException;

	public int updateSelection(SelectionVO selectionVO) throws FLException;

	public int updateSelectionForAdvance(SelectionVO selectionVO) throws FLException;

	public int sendSelection(SelectionVO selectionVO) throws FLException;

	public int affirmSelection(DecorationVO decorationVO, SelectionVO selectionVO, String securityCode, String verifyCode) throws FLException;

}
