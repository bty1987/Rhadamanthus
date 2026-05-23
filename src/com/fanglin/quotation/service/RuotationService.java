package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.vo.RuotationVO;
import com.fanglin.utils.Paging;

public interface RuotationService {

	public void pageRuotation(Paging paging, List<Filter> filters, Integer company) throws FLException;

	public RuotationVO queryRuotationById(RuotationVO ruotationVO) throws FLException;

	public int addRuotation(RuotationVO ruotationVO, String userId) throws FLException;

	public int updateRuotation(RuotationVO ruotationVO) throws FLException;

	public int deleteRuotation(RuotationVO ruotationVO) throws FLException;
}
