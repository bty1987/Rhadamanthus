package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.vo.SelectionItemVO;
import com.fanglin.quotation.vo.SelectionVO;
import com.fanglin.utils.Paging;

public interface SelectionItemService {

	public void pageSelectionItem(Paging paging, List<Filter> filters, Integer company, SelectionItemVO selectionItemVO) throws FLException;

	public void pageSelectionItemForSupplier(Paging paging, List<Filter> filters, String userId, Integer company) throws FLException;

	public void pageSelectionItemForEscorter(Paging paging, List<Filter> filters, String userId) throws FLException;

	public void pageSelectionItemForAccount(Paging paging, List<Filter> filters, Integer company) throws FLException;

	public List<SelectionItemVO> querySelectionItem(SelectionVO selectionVO) throws FLException;

	public List<SelectionItemVO> querySelectionItemByOrderId(SelectionItemVO selectionItemVO) throws FLException;

	public int collateSelectionItem(SelectionVO selectionVO) throws FLException;

	public int addSelectionItem(SelectionVO selectionVO, SelectionItemVO selectionItemVO, String userId, Integer company) throws FLException;

	public int updateSelectionItem(SelectionItemVO selectionItemVO) throws FLException;

	public int refundSelectionItem(SelectionItemVO selectionItemVO) throws FLException;

	public int deleteSelectionItem(SelectionVO selectionVO, SelectionItemVO selectionItemVO) throws FLException;

	public int cutoffSelectionItem(SelectionItemVO selectionItemVO) throws FLException;

	public int rejectSelectionItem(SelectionItemVO selectionItemVO) throws FLException;

	public int tranSelectionItem(List<SelectionItemVO> selectionItemVOs, String userId) throws FLException;

	public int checkSelectionItem(List<SelectionItemVO> selectionItemVOs, String userId) throws FLException;

	public int confirmSelectionItem(List<SelectionItemVO> selectionItemVOs, String userId) throws FLException;

	public int finishSelectionItem(List<SelectionItemVO> selectionItemVOs, String userId) throws FLException;

	public int reviewSelectionItem(List<SelectionItemVO> selectionItemVOs, String userId) throws FLException;

	public int balanceSelectionItem(List<SelectionItemVO> selectionItemVOs, String userId) throws FLException;

}
