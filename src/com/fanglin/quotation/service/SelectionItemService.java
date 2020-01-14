package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.vo.SelectionItemVO;
import com.fanglin.quotation.vo.SelectionVO;
import com.fanglin.utils.Paging;

public interface SelectionItemService {
	
	public void pageSelectionItem(Paging paging, List<Filter> filters, SelectionItemVO selectionItemVO) throws FLException;
	
	public void pageSelectionItemForSupplier(Paging paging, List<Filter> filters, String userId) throws FLException;

	public List<SelectionItemVO> querySelectionItem(SelectionVO selectionVO) throws FLException;
	
	public List<SelectionItemVO> querySelectionItemByOrderId(SelectionItemVO selectionItemVO) throws FLException;
	
	public int addSelectionItem(SelectionVO selectionVO, SelectionItemVO selectionItemVO) throws FLException;
	
	public int updateSelectionItem(SelectionItemVO selectionItemVO) throws FLException;
	
	public int deleteSelectionItem(SelectionVO selectionVO, SelectionItemVO selectionItemVO) throws FLException;
	
	public int tranSelectionItem(SelectionItemVO selectionItemVO, String userId) throws FLException;
	
	public int checkSelectionItem(SelectionItemVO selectionItemVO, String userId) throws FLException;
	
	public int confirmSelectionItem(SelectionItemVO selectionItemVO, String userId) throws FLException;
	
	public int finishSelectionItem(SelectionItemVO selectionItemVO, String userId) throws FLException;
	
	public int balanceSelectionItem(SelectionItemVO selectionItemVO, String userId) throws FLException;
}
