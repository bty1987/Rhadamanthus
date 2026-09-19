package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.vo.RuotationItemVO;
import com.fanglin.quotation.vo.RuotationVO;

public interface RuotationItemService {

	public List<RuotationItemVO> queryRuotationItem(RuotationItemVO ruotationItemVO) throws FLException;

	public List<RuotationItemVO> queryRuotationItemForCandidateByOrderId(RuotationItemVO ruotationItemVO) throws FLException;

	public RuotationItemVO updateRuotationItem(RuotationItemVO ruotationItemVO, RuotationVO ruotationVO) throws FLException;

	public int updateRuotationItemForIndex(List<RuotationItemVO> ruotationItemVOs) throws FLException;

	public int deleteRuotationItem(RuotationItemVO ruotationItemVO, RuotationVO ruotationVO) throws FLException;

}
